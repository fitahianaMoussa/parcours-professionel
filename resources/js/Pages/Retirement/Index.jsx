import React from 'react';
import { usePage } from '@inertiajs/react';
import { CalendarDays, User2, BadgeCheck, AlertCircle, ClipboardList, Users, Eye } from "lucide-react";
import * as XLSX from 'xlsx';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const RetirementList = ({auth}) => {
    const { agents } = usePage().props;

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(agents); // Convert agents to worksheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "Agents Retraités"); // Append the sheet to the workbook

        // Export the workbook to Excel
        XLSX.writeFile(wb, "agents_retraites.xlsx");
    };

    return (
        <Authenticated user={auth.user}>
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="flex items-center gap-2">
                            <Users className="w-8 h-8 text-blue-600" />
                            Liste des agents retraités
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500">
                        Gérez les agents proches de la retraite ou déjà retraités
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <ClipboardList className="w-4 h-4" />
                    Exporter la liste
                </button>
            </div>

            {/* Table Card */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Matricule</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Nom</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Prénom</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Date de naissance</th>
                                <th className="px-6 py-3 text-sm font-semibold text-left text-gray-900">Statut</th>
                                <th className="px-6 py-3 text-sm font-semibold text-center text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {agents.length > 0 ? (
                                agents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <User2 className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium text-gray-900">{agent.matricule}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{agent.nom}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{agent.prenom}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                                {agent.date_de_naissance}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {agent.status === 'retraite' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-green-700 rounded-full bg-green-50">
                                                        <BadgeCheck className="w-4 h-4" />
                                                        Retraité
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-yellow-700 rounded-full bg-yellow-50">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Approche Retraite
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                <Eye className="w-4 h-4" />
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-sm text-center text-gray-500">
                                        Aucun agent trouvé dans la liste
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </Authenticated>
    );
};

export default RetirementList;
