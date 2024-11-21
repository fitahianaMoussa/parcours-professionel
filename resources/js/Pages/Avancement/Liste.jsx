import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowUp, 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle, 
    AlertCircle, 
    Calendar, 
    User 
} from 'lucide-react';
import Authenticated from "@/Layouts/AuthenticatedLayout";

const AdvancementsList = ({ avancements, auth }) => {
    console.log(avancements)
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Status color mapping
    const getStatusColor = (status) => {
        switch(status) {
            case 'integrated':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filtering logic
    const filteredAvancements = avancements.filter(advancement => 
        advancement.agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advancement.agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advancement.grade.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAvancements.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredAvancements.length / itemsPerPage);

    return (
        <Authenticated user={auth.user}>
            <Head title="Liste des Avancements" />
            
            <div className="container px-4 py-8 mx-auto">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="flex items-center text-2xl font-semibold text-gray-800">
                            <ArrowUp className="mr-3 text-blue-600" />
                            Liste des Avancements
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="py-2 pl-10 pr-4 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute text-gray-400 left-3 top-3" size={20} />
                            </div>
                            <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                <Filter size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    {[
                                        'Agent', , 'Grade', 'Periode', 
                                        'Date Effet', 'Durée (Mois)', 'Statut', 'Actions'
                                    ].map((header) => (
                                        <th 
                                            key={header} 
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map(advancement => (
                                    <tr 
                                        key={advancement.id} 
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="flex items-center px-6 py-4 whitespace-nowrap">
                                            <User className="mr-2 text-blue-500" size={20} />
                                            {advancement.agent.nom} {advancement.agent.prenom}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {advancement.grade.grade}_{advancement.grade.echelon} Echelon
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Calendar className="inline mr-2 text-gray-500" size={16} />
                                            {advancement.date_debut} - {advancement.date_fin}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Calendar className="inline mr-2 text-blue-500" size={16} />
                                            {advancement.date_effet}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {advancement.duree_mois}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span 
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    getStatusColor(advancement.status)
                                                }`}
                                            >
                                                {advancement.status === 'integrated' && <CheckCircle className="mr-1" size={14} />}
                                                {advancement.status === 'pending' && <AlertCircle className="mr-1" size={14} />}
                                                {advancement.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link 
                                                href={route('advancements.show', { id: advancement.id })}
                                                className="text-blue-600 hover:text-blue-900 hover:underline"
                                            >
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Page {currentPage} sur {totalPages} 
                            {` (${filteredAvancements.length} résultats)`}
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`
                                    flex items-center px-3 py-1.5 rounded-md text-sm transition-colors
                                    ${currentPage === 1 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }
                                `}
                            >
                                <ChevronLeft className="mr-1" size={16} />
                                Précédent
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`
                                    flex items-center px-3 py-1.5 rounded-md text-sm transition-colors
                                    ${currentPage === totalPages 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }
                                `}
                            >
                                Suivant
                                <ChevronRight className="ml-1" size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default AdvancementsList;