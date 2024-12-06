import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Eye, 
    Filter, 
    Clock, 
    CheckCircle,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Search,
    ChevronDown
} from 'lucide-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const IntegrationPhaseIndex = ({ agents, auth }) => {
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const itemsPerPage = 5;

    const filterAndSearchAgents = () => {
        return agents.filter(agent => {
            const matchesFilter = filter === 'all' || agent.phase_integration === parseInt(filter);
            const matchesSearch = searchTerm === '' || 
                agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.categorie.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    };

    const filteredAgents = filterAndSearchAgents();
    const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage);

    const getPhaseDetails = (phase) => {
        switch (phase) {
            case 1: return { 
                color: 'bg-blue-100 text-blue-800', 
                icon: <ExternalLink className="w-4 h-4 mr-1.5" /> 
            };
            case 2: return { 
                color: 'bg-yellow-100 text-yellow-800', 
                icon: <Clock className="w-4 h-4 mr-1.5" /> 
            };
            case 3: return { 
                color: 'bg-green-100 text-green-800', 
                icon: <CheckCircle className="w-4 h-4 mr-1.5" /> 
            };
            default: return { 
                color: 'bg-gray-100 text-gray-800', 
                icon: null 
            };
        }
    };

    return (
        <Authenticated user={auth.user}>
            <div className="container px-4 py-8 mx-auto">
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    <div className="border-b">
                        <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                            <h2 className="flex items-center text-xl font-semibold text-gray-900">
                                <Filter className="w-6 h-6 mr-3 text-gray-600" />
                                Suivi des Phases d'Intégration
                            </h2>
                            <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full py-2 pl-8 pr-4 transition-colors border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="w-full sm:w-[180px] px-4 py-2 text-left bg-white border border-gray-300 rounded-md inline-flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <span className="text-gray-700">
                                            {filter === 'all' ? 'Toutes les Phases' : `Phase ${filter}`}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {isFilterOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                            <div className="py-1">
                                                {['all', '1', '2', '3'].map((value) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => {
                                                            setFilter(value);
                                                            setIsFilterOpen(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
                                                    >
                                                        {value === 'all' ? 'Toutes les Phases' : `Phase ${value}`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    {['Nom', 'Prénom', 'Catégorie', 'Phase', 'Début', 'Fin', 'Actions'].map((header) => (
                                        <th key={header} className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedAgents.map(agent => {
                                    const phaseDetails = getPhaseDetails(agent.phase_integration);
                                    return (
                                        <tr key={agent.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{agent.nom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{agent.prenom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{agent.categorie}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${phaseDetails.color}`}>
                                                    {phaseDetails.icon}
                                                    Phase {agent.phase_integration}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(agent.date_debut).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(agent.date_fin).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link 
                                                    href={route('integration-phase.show', agent.id)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Détails
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <div className="text-sm text-gray-700">
                            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredAgents.length)} sur {filteredAgents.length} résultats
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default IntegrationPhaseIndex;