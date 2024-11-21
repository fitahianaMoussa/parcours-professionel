import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Eye, 
    Filter, 
    Clock, 
    CheckCircle,
    ExternalLinkIcon, 
} from 'lucide-react';  
import Authenticated from '@/Layouts/AuthenticatedLayout';

const IntegrationPhaseIndex = ({ agents ,auth}) => {
    const [filter, setFilter] = useState('all');

    const filterAgents = () => {
        return agents.filter(agent => {
            if (filter === 'all') return true;
            return agent.phase_integration === parseInt(filter);
        });
    };

    const getPhaseDetails = (phase) => {
        switch (phase) {
            case 1: return { 
                color: 'bg-blue-100 text-blue-800 border-blue-200', 
                icon: <ExternalLinkIcon className="w-5 h-5 mr-2 text-blue-600" /> 
            };
            case 2: return { 
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
                icon: <Clock className="w-5 h-5 mr-2 text-yellow-600" /> 
            };
            case 3: return { 
                color: 'bg-green-100 text-green-800 border-green-200', 
                icon: <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> 
            };
            default: return { 
                color: 'bg-gray-100 text-gray-800 border-gray-200', 
                icon: null 
            };
        }
    };

    return (
        <Authenticated
        user={auth.user}
    >
        <div className="container px-4 py-6 mx-auto">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                    <h2 className="flex items-center text-xl font-semibold text-gray-800">
                        <Filter className="w-6 h-6 mr-3 text-gray-600" />
                        Suivi des Phases d'Intégration
                    </h2>
                    <div>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 text-sm transition-all border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="all">Toutes les Phases</option>
                            <option value="1">Phase 1</option>
                            <option value="2">Phase 2</option>
                            <option value="3">Phase 3</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                {['Nom', 'Prénom', 'Catégorie', 'Phase', 'Début', 'Fin', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filterAgents().map(agent => {
                                const phaseDetails = getPhaseDetails(agent.phase_integration);
                                return (
                                    <tr key={agent.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{agent.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{agent.prenom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{agent.categorie}</td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${phaseDetails.color}`}
                                            >
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
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-blue-700 transition-all bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            </div>
        </div>
        </Authenticated>
    );
};

export default IntegrationPhaseIndex;
