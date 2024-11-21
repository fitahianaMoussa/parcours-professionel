import { useForm, Link } from "@inertiajs/react";
import React, { useState } from 'react';
import { ArrowUp, Check, X, PlusCircle, List } from 'lucide-react';
import Authenticated from "@/Layouts/AuthenticatedLayout";

const AdvancementManagement = ({ eligibleAgents, auth }) => {
    console.log(eligibleAgents);

    // Ensure eligibleAgents is an array
    const agentsArray = Array.isArray(eligibleAgents) 
        ? eligibleAgents 
        : Object.values(eligibleAgents);

    const { data, setData, post, processing, errors } = useForm({
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
            onSuccess: () => {
                // Optional: Add toast or notification
            }
        });
    };

    return (
        <Authenticated user={auth.user}>
            <div className="container px-4 py-8 mx-auto">
                <div className="flex justify-end mb-4 space-x-4">
                    <Link 
                        href={route('advancements.create')} 
                        className="flex items-center px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Créer un Avancement
                    </Link>
                    <Link 
                        href={route('advancements.indexListe')} 
                        className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        <List className="w-5 h-5 mr-2" />
                        Liste des Avancements
                    </Link>
                </div>

                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="flex items-center text-2xl font-semibold text-gray-800">
                            <ArrowUp className="mr-3 text-blue-600" />
                            Agents éligible pour avancement
                        </h2>
                    </div>
                    
                    <form onSubmit={submitAdvancements}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        {['Nom', 'Prénom', 'Catégorie', 'Date Entrée', 'Éligible', 'Actions'].map((header) => (
                                            <th key={header} className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {agentsArray.map(agent => {
                                        const isApproved = data.agents.find(a => a.id === agent.id)?.approved;
                                        
                                        return (
                                            <tr key={agent.id} className="transition-colors hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">{agent.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{agent.prenom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{agent.categorie?.nom || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{agent.date_entree}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                                        Éligible
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleApproval(agent.id, true)}
                                                            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                                                                isApproved 
                                                                ? 'bg-green-600 text-white' 
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                        >
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Approuver
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleApproval(agent.id, false)}
                                                            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                                                                !isApproved 
                                                                ? 'bg-red-600 text-white' 
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            }`}
                                                        >
                                                            <X className="w-4 h-4 mr-1" />
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

                        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className={`
                                    flex items-center px-6 py-2 rounded-md text-white font-semibold transition-colors
                                    ${processing 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }
                                `}
                            >
                                {processing ? 'Traitement...' : 'Valider les Avancements'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Authenticated>
    );
};

export default AdvancementManagement;