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
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const getStatusConfig = (status) => {
        const configs = {
            integrated: {
                classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
                label: 'Intégré'
            },
            pending: {
                classes: 'bg-amber-50 text-amber-700 border border-amber-200',
                icon: <AlertCircle className="w-4 h-4 mr-1.5" />,
                label: 'En attente'
            },
            rejected: {
                classes: 'bg-red-50 text-red-700 border border-red-200',
                icon: <AlertCircle className="w-4 h-4 mr-1.5" />,
                label: 'Rejeté'
            },
            default: {
                classes: 'bg-gray-50 text-gray-700 border border-gray-200',
                icon: null,
                label: status
            }
        };
        return configs[status] || configs.default;
    };

    const filteredAvancements = avancements.filter(advancement => 
        advancement.agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advancement.agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advancement.grade.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAvancements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAvancements.length / itemsPerPage);

    return (
        <Authenticated user={auth.user}>
            <Head title="Liste des Avancements" />
            
            <div className="min-h-screen py-8 bg-gray-50">
                <div className="px-4 mx-auto max-w-10xl sm:px-6 lg:px-8">
                    {/* Main Content Container */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                        {/* Header Section */}
                        <div className="border-b border-gray-200">
                            <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
                                <h1 className="flex items-center text-2xl font-bold text-gray-900">
                                    <ArrowUp className="w-6 h-6 mr-3 text-indigo-600" />
                                    Liste des Avancements
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1 sm:flex-none">
                                        <input 
                                            type="text" 
                                            placeholder="Rechercher un agent..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full py-2 pl-10 pr-4 text-sm transition-shadow duration-200 border border-gray-300 rounded-lg sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                                    </div>
                                    <button className="p-2 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <Filter size={18} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        {[
                                            'Agent', 'Grade', 'Période', 
                                            'Date Effet', 'Durée', 'Actions'
                                        ].map((header) => (
                                            <th 
                                                key={header} 
                                                className="px-6 py-4 text-sm font-semibold text-left text-gray-600"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map(advancement => (
                                        <tr 
                                            key={advancement.id} 
                                            className="transition-colors duration-150 group hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-indigo-100 rounded-full">
                                                        <User className="text-indigo-600" size={16} />
                                                    </div>
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-900">
                                                            {advancement.agent.nom} {advancement.agent.prenom}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">
                                                    {advancement.grade.grade} - {advancement.grade.echelon} Echelon
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span>{advancement.date_debut} - {advancement.date_fin}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                                    <span>{advancement.date_effet}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {advancement.duree_mois} mois
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link 
                                                    href={route('advancements.show', { id: advancement.id })}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                                >
                                                    Détails
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">{filteredAvancements.length}</span> résultats • Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`
                                            inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                            ${currentPage === 1 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                                        Précédent
                                    </button>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`
                                            inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                            ${currentPage === totalPages 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        Suivant
                                        <ChevronRight className="w-4 h-4 ml-1.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default AdvancementsList;