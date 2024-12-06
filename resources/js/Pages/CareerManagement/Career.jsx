import React, { useState } from "react";
import { CircleUser, Clock, Award, ChevronRight, FileText, Calendar, Briefcase, Settings } from "lucide-react";
import CareerProgressionManager from "./Progression";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const CareerDashboard = ({ agent, progression, careerPaths, auth }) => {
    const agentCategory = agent.categorie?.nom || "Categorie III";
    const [selectedCategory, setSelectedCategory] = useState(agentCategory);
    
    const gradeLabels = {
        "2eme_classe": "2ème Classe",
        "1ere_classe": "1ère Classe",
        principal: "Principal",
        exceptionnel: "Exceptionnel",
    };

    const tabs = [
        { value: "career-path", label: "Parcours", icon: Briefcase },
        { value: "contracts", label: "Contrats", icon: FileText },
        { value: "advancement", label: "Avancements", icon: ChevronRight },
        { value: "documents", label: "Arrêtés", icon: Settings },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].value);

    return (
        <Authenticated user={auth.user}>
            <div className="min-h-screen bg-gray-50">
                <div className="px-6 py-8 mx-auto max-w-7xl">
                    <header className="mb-8">
                        <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 text-white bg-blue-500 rounded-full">
                                    <CircleUser className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                        {agent.nom} {agent.prenom}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                        <span>Matricule: {agent.matricule}</span>
                                        <span>•</span>
                                        <span>Catégorie: {selectedCategory}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2 text-sm text-blue-600 rounded-full bg-blue-50">
                                Statut: {progression.type}
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
                        <StatusCard progression={progression} />
                        <IntegrationCard progression={progression} />
                        <CurrentGradeCard progression={progression} gradeLabels={gradeLabels} />
                        <NextProgressionCard progression={progression} />
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="border-b border-gray-200">
                            <nav className="flex p-2 space-x-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                                ${activeTab === tab.value 
                                                    ? "bg-blue-50 text-blue-600" 
                                                    : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === "career-path" && (
                                <CareerPathTab 
                                    careerPath={careerPaths[selectedCategory]}
                                    progression={progression}
                                    gradeLabels={gradeLabels}
                                />
                            )}
                            {activeTab === "contracts" && <ContractsTab agent={agent} />}
                            {activeTab === "advancement" && <AdvancementTab agent={agent} />}
                            {activeTab === "documents" && <DocumentsTab agent={agent} />}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

const CardWrapper = ({ title, description, children, icon: Icon }) => (
    <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        </div>
        <div>
            {children}
            {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
    </div>
);

const StatusCard = ({ progression }) => (
    <CardWrapper title="Statut Actuel" icon={CircleUser}>
        <div className="text-2xl font-bold text-gray-900">{progression.type}</div>
        <div className="mt-1 text-sm text-gray-500">Phase: {progression.phase || "N/A"}</div>
    </CardWrapper>
);

const IntegrationCard = ({ progression }) => (
    <CardWrapper title="Intégration" icon={Clock}>
        <div className="text-2xl font-bold text-gray-900">
            {progression.type === "INTEGRATION" ? `Phase ${progression.phase}/3` : "Complétée"}
        </div>
        <div className="mt-1 text-sm text-gray-500">
            {progression.remaining_days 
                ? `${progression.remaining_days} jours restants`
                : "Processus terminé"}
        </div>
    </CardWrapper>
);

const CurrentGradeCard = ({ progression, gradeLabels }) => (
    <CardWrapper title="Grade & Échelon" icon={Award}>
        <div className="text-2xl font-bold text-gray-900">{gradeLabels[progression.grade]}</div>
        <div className="mt-1 text-sm text-gray-500">Échelon {progression.echelon}</div>
    </CardWrapper>
);

const NextProgressionCard = ({ progression }) => (
    <CardWrapper title="Prochaine Étape" icon={Calendar}>
        <div className="text-2xl font-bold text-gray-900">
            {new Date(progression.end_date).toLocaleDateString()}
        </div>
        <div className="mt-1 text-sm text-gray-500">Durée: {progression.duration} mois</div>
    </CardWrapper>
);

const CareerPathTab = ({ careerPath, progression, gradeLabels }) => {
    const phases = careerPath ? Object.entries(careerPath).map(([key, value]) => ({
        type: key,
        ...value,
    })) : [];

    return (
        <div className="space-y-8">
            {phases.map((phase, index) => (
                <div key={index} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full">
                            {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{phase.type}</h3>
                    </div>
                    
                    <div className="pl-12 space-y-4">
                        {phase.phases ? (
                            phase.phases.map((subPhase, idx) => (
                                <div key={idx} className="p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Phase {idx + 1}</div>
                                            <div className="text-sm text-gray-500">Durée: {subPhase.duration} mois</div>
                                        </div>
                                        {subPhase.grade && (
                                            <div className="px-3 py-1 text-sm text-blue-700 rounded-full bg-blue-50">
                                                {gradeLabels[subPhase.grade]} - Échelon {subPhase.echelon}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : phase.progression ? (
                            phase.progression.map((step, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-4 bg-white rounded-lg shadow transition-shadow hover:shadow-md
                                        ${progression.grade === step.grade && progression.echelon === step.echelon 
                                            ? "border-2 border-blue-500 bg-blue-50" 
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {gradeLabels[step.grade]} - Échelon {step.echelon}
                                            </div>
                                            <div className="text-sm text-gray-500">Durée: {step.duration} mois</div>
                                        </div>
                                        {progression.grade === step.grade && progression.echelon === step.echelon && (
                                            <div className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                                                Position actuelle
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ContractsTab = ({ agent }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Historique des Contrats</h2>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Nouveau Contrat
                </button>
            </div>
            
            <div className="overflow-hidden bg-white rounded-lg shadow ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Type</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Début</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Fin</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                            <th className="relative py-3.5 pl-3 pr-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="py-4 pl-4 pr-3 text-sm text-gray-900">CDD</td>
                            <td className="px-3 py-4 text-sm text-gray-500">01/01/2024</td>
                            <td className="px-3 py-4 text-sm text-gray-500">31/12/2024</td>
                            <td className="px-3 py-4">
                                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                    Actif
                                </span>
                            </td>
                            <td className="py-4 pl-3 pr-4 text-sm font-medium text-right">
                                <button className="text-blue-600 hover:text-blue-900">Voir</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdvancementTab = ({ agent }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Historique des Avancements</h2>
            </div>
            
            <div className="space-y-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Avancement en Grade</h3>
                            <p className="mt-1 text-sm text-gray-500">Principal → Exceptionnel</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                            En cours
                        </span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Date prévue: <span className="font-medium text-gray-900">01/06/2024</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocumentsTab = ({ agent }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Arrêtés et Documents</h2>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Nouveau Document
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((doc) => (
                    <div key={doc} className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Arrêté N°2024-{doc}</h3>
                                <p className="mt-1 text-sm text-gray-500">Nomination</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                PDF
                            </span>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            Date: 01/0{doc}/2024
                        </div>
                        <div className="mt-4">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                Télécharger
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default CareerDashboard;