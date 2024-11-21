    import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
    import { Head, Link } from "@inertiajs/react";
    import React, { useState } from "react";
    import {
        Search,
        ChevronDown,
        ChevronUp,
        ChevronLeft,
        ChevronRight,
        UserCheck,
        GraduationCap,
        Calendar,
        Building2,
        FileText,
        CheckCircle2,
        XCircle,
        PlusCircle,
    } from "lucide-react";

    export default function AgentIndex({ auth, agents }) {
        const [searchTerm, setSearchTerm] = useState("");
        const [currentPage, setCurrentPage] = useState(1);
        const [sortConfig, setSortConfig] = useState({
            key: "nom",
            direction: "asc",
        });
        const [typeFilter, setTypeFilter] = useState("tous");
        const [statusFilter, setStatusFilter] = useState("tous");

        const itemsPerPage = 4;

        // Filtrage
        const filteredAgents = agents.filter((agent) => {
            const matchesSearch =
                agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.corps.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType =
                typeFilter === "tous" || agent.type_recrutement === typeFilter;
            const matchesStatus =
                statusFilter === "tous" ||
                (statusFilter === "actif" && agent.is_active) ||
                (statusFilter === "inactif" && !agent.is_active);

            return matchesSearch && matchesType && matchesStatus;
        });

        // Tri
        const sortedAgents = [...filteredAgents].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        // Pagination
        const totalPages = Math.ceil(sortedAgents.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedAgents = sortedAgents.slice(
            startIndex,
            startIndex + itemsPerPage
        );

        const handleSort = (key) => {
            setSortConfig({
                key,
                direction:
                    sortConfig.key === key && sortConfig.direction === "asc"
                        ? "desc"
                        : "asc",
            });
        };
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Dashboard" />

                <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                    <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-800">
                            <UserCheck className="text-blue-600" />
                            Liste des Agents
                        </h2>
                        {/* Create Agent Button */}
                    <Link href={route('agent.create')}>
                    <button
                            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            <PlusCircle size={20} />
                            Créer un agent
                        </button>
                    </Link>
                    </div>

                        {/* Filtres et Recherche */}
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search
                                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Rechercher un agent..."
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="tous">Tous les types</option>
                                <option value="diplome">Diplômé</option>
                                <option value="budgetaire">Budgétaire</option>
                            </select>

                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="tous">Tous les statuts</option>
                                <option value="actif">Actif</option>
                                <option value="inactif">Inactif</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort("nom")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>Nom</span>
                                                {sortConfig.key === "nom" &&
                                                    (sortConfig.direction ===
                                                    "asc" ? (
                                                        <ChevronUp size={16} />
                                                    ) : (
                                                        <ChevronDown size={16} />
                                                    ))}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                                <span>Diplôme</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                                <span>Date d'entrée</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <Building2
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                                <span>Corps</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <FileText
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                                <span>Type</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Categorie
                                        </th>
                                        <th className="px-6 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedAgents.map((agent) => (
                                        <tr
                                            key={agent.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {agent.nom}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {agent.prenom}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {agent.diplome}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(
                                                    agent.date_entree
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {agent.corps}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${
                                                        agent.type_recrutement ===
                                                        "diplome"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {agent.type_recrutement ===
                                                    "diplome"
                                                        ? "Diplômé"
                                                        : "Budgétaire"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {agent.categorie?.nom}
                                            </td>
                                            <td className="px-6 py-4 space-y-2">
                                        <Link
                                            href={route('career.dashboard', { agent: agent.id })}
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                                        >
                                            <ChevronRight size={16} />
                                            Voir Parcours
                                        </Link>
                                        <Link
                                            href={route('service.releve', { agent: agent.id })}
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                                        >
                                            <FileText size={16} />
                                            Relevé de Service
                                        </Link>
                                    </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-500">
                                Affichage de {startIndex + 1} à{" "}
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    sortedAgents.length
                                )}{" "}
                                sur {sortedAgents.length} agents
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="px-4 py-2 font-medium text-blue-600 rounded-lg bg-blue-50">
                                    {currentPage}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
