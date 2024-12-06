import { useForm, Link } from "@inertiajs/react";
import React from 'react';
import { ArrowUp, Check, X, PlusCircle, List } from 'lucide-react';
import Authenticated from "@/Layouts/AuthenticatedLayout";

const AdvancementManagement = ({ eligibleAgents, auth }) => {
    const agentsArray = Array.isArray(eligibleAgents) 
        ? eligibleAgents 
        : Object.values(eligibleAgents);

    const { data, setData, post, processing } = useForm({
        agents: agentsArray.map(agent => ({
            id: agent.id,
            approved: false,
        }))
    });

    const handleApproval = (agentId, approved) => {
        setData(prevData => ({
            ...prevData,
            agents: prevData.agents.map(agent => 
                agent.id === agentId ? { ...agent, approved } : agent
            )
        }));
    };

    const submitAdvancements = (e) => {
        e.preventDefault();
        post(route('advancements.evaluate'), {
            preserveScroll: true,
        });
    };

    return (
        <Authenticated user={auth.user}>
            <div className="min-h-screen py-8 bg-gray-50">
                <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestion des Avancements
                        </h1>
                        <div className="flex flex-wrap gap-3">
                            <Link 
                                href={route('advancements.create')} 
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700 hover:shadow-md"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Créer un Avancement
                            </Link>
                            <Link 
                                href={route('advancements.indexListe')} 
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md"
                            >
                                <List className="w-5 h-5 mr-2" />
                                Liste des Avancements
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <div className="flex items-center">
                                <ArrowUp className="w-6 h-6 mr-3 text-indigo-600" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Agents éligibles pour avancement
                                </h2>
                            </div>
                        </div>
                        
                        <form onSubmit={submitAdvancements}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {['Nom', 'Prénom', 'Catégorie', 'Date Entrée', 'Éligibilité', 'Actions'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-sm font-semibold text-left text-gray-600">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {agentsArray.map(agent => {
                                            const isApproved = data.agents.find(a => a.id === agent.id)?.approved;
                                            
                                            return (
                                                <tr key={agent.id} className="transition-colors duration-150 group hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{agent.nom}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{agent.prenom}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{agent.categorie?.nom || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{agent.date_entree}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                            Éligible
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleApproval(agent.id, true)}
                                                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                                    isApproved 
                                                                    ? 'bg-emerald-600 text-white shadow-sm' 
                                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                }`}
                                                            >
                                                                <Check className="w-4 h-4 mr-1.5" />
                                                                Approuver
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleApproval(agent.id, false)}
                                                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                                    !isApproved 
                                                                    ? 'bg-red-600 text-white shadow-sm' 
                                                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                                }`}
                                                            >
                                                                <X className="w-4 h-4 mr-1.5" />
                                                                Refuser
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className={`
                                            inline-flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm
                                            transition-all duration-200
                                            ${processing 
                                                ? 'bg-indigo-400 cursor-not-allowed opacity-75' 
                                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                                            }
                                            text-white
                                        `}
                                    >
                                        {processing ? 'Traitement en cours...' : 'Valider les Avancements'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default AdvancementManagement;