import React, { useState } from "react";
import { CircleUser, Clock, Award, ChevronRight, FileText } from "lucide-react";
import CareerProgressionManager from "./Progression";
import Authenticated from "@/Layouts/AuthenticatedLayout";
// const formatCategory = (category) => {
//     return category.replace(/\s+/g, "_").toUpperCase();
// };
const CareerDashboard = ({ agent, progression, careerPaths, auth }) => {
    console.log(careerPaths);
    // const [selectedCategory, setSelectedCategory] = useState(agent.categorie?.nom?.toUpperCase() || 'CATEGORY_III');
    const agentCategory = agent.categorie?.nom || "Categorie III";
    const [selectedCategory, setSelectedCategory] = useState(
        agentCategory
    );
    const gradeLabels = {
        "2eme_classe": "2ème Classe",
        "1ere_classe": "1ère Classe",
        principal: "Principal",
        exceptionnel: "Exceptionnel",
    };

    const tabs = [
        { value: "career-path", label: "Parcours" },
        { value: "contracts", label: "Contrats" },
        { value: "advancement", label: "Avancements" },
        { value: "documents", label: "Arrêtés" },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].value);

    return (
        <Authenticated user={auth.user}>
            <div className="min-h-screen p-6 bg-gray-50">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Parcours
                            </h1>
                            <p className="text-gray-500">
                                Agent: {agent.nom} {agent.prenom}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">
                                Matricule: {agent.matricule}
                            </div>
                            <div className="text-sm text-gray-500">
                                Catégorie: {selectedCategory}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
                    <StatusCard progression={progression} />
                    <IntegrationCard progression={progression} />
                    <CurrentGradeCard
                        progression={progression}
                        gradeLabels={gradeLabels}
                    />
                    <NextProgressionCard progression={progression} />
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                                        activeTab === tab.value
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
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
                        {activeTab === "contracts" && (
                            <ContractsTab agent={agent} />
                        )}
                        {activeTab === "advancement" && (
                            <AdvancementTab agent={agent} />
                        )}
                        {activeTab === "documents" && (
                            <DocumentsTab agent={agent} />
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

const CardWrapper = ({ title, description, children, icon: Icon }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div>
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                {description && (
                    <p className="text-xs text-gray-500">{description}</p>
                )}
            </div>
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const StatusCard = ({ progression }) => (
    <CardWrapper title="Statut Actuel" icon={CircleUser}>
        <div className="text-2xl font-bold">{progression.type}</div>
        <p className="text-sm text-gray-500">
            Phase: {progression.phase || "N/A"}
        </p>
    </CardWrapper>
);

const IntegrationCard = ({ progression }) => (
    <CardWrapper title="Intégration" icon={Clock}>
        <div className="text-2xl font-bold">
            {progression.type === "INTEGRATION"
                ? `Phase ${progression.phase}/3`
                : "Complétée"}
        </div>
        <p className="text-sm text-gray-500">
            {progression.remaining_days
                ? `${progression.remaining_days} jours restants`
                : "Processus terminé"}
        </p>
    </CardWrapper>
);

const CurrentGradeCard = ({ progression, gradeLabels }) => (
    <CardWrapper title="Grade & Échelon" icon={Award}>
        <div className="text-2xl font-bold">
            {gradeLabels[progression.grade]}
        </div>
        <p className="text-sm text-gray-500"> {progression.echelon} Échelon</p>
    </CardWrapper>
);

const NextProgressionCard = ({ progression }) => (
    <CardWrapper title="Prochaine Étape" icon={ChevronRight}>
        <div className="text-2xl font-bold">
            {new Date(progression.end_date).toLocaleDateString()}
        </div>
        <p className="text-sm text-gray-500">
            Durée: {progression.duration} mois
        </p>
    </CardWrapper>
);

const CareerPathTab = ({ careerPath, progression, gradeLabels }) => {
    const phases = careerPath ? Object.entries(careerPath).map(([key, value]) => ({
        type: key,
        ...value,
    })) : [];

    // Render your component here



    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold">Parcours de Carrière</h2>
                <p className="text-sm text-gray-500">
                    Progression détaillée par phase
                </p>
            </div>
            <div className="p-4 space-y-6">
                {phases.map((phase, index) => (
                    <div
                        key={index}
                        className="pl-4 border-l-2 border-blue-500"
                    >
                        <h3 className="mb-2 text-lg font-bold">{phase.type}</h3>
                        {phase.phases ? (
                            <div className="space-y-4">
                                {phase.phases.map((subPhase, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                Phase {idx + 1}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Durée: {subPhase.duration} mois
                                            </div>
                                        </div>
                                        {subPhase.grade && (
                                            <div className="text-sm">
                                                {gradeLabels[subPhase.grade]} -
                                                {subPhase.echelon} Échelon 
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : phase.progression ? (
                            <div className="space-y-4">
                                {phase.progression.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {gradeLabels[step.grade]} -
                                                 {step.echelon} Échelon
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Durée: {step.duration} mois
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {progression.grade === step.grade &&
                                                progression.echelon ===
                                                    step.echelon &&
                                                "(Position actuelle)"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContractsTab = ({ agent }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Contrats</h2>
            <p className="text-sm text-gray-500">Historique des contrats</p>
        </div>
        <div className="p-4 space-y-4">
            {agent.contrats?.map((contrat, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                >
                    <div>
                        <h4 className="font-medium">
                            Contrat N° {contrat.numero_contrat}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {new Date(contrat.date_debut).toLocaleDateString()}{" "}
                            → {new Date(contrat.date_fin).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            Type: {contrat.type}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${
                                contrat.status === "en cours"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {contrat.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AdvancementTab = ({ agent, progression }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
        <CareerProgressionManager
            agent={agent}
            currentProgression={progression}
        />
        <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Avancements</h2>
            <p className="text-sm text-gray-500">Historique des avancements</p>
        </div>
        <div className="p-4 space-y-4">
            {agent.avancements?.map((avancement, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                >
                    <div>
                        <h4 className="font-medium">
                            {avancement.is_integration
                                ? "Intégration"
                                : "Avancement"}{" "}
                            - Phase {avancement.contract_phase}
                        </h4>
                      
                        <p className="text-sm text-gray-500">
                            {new Date(
                                avancement.date_debut
                            ).toLocaleDateString()}{" "}
                            →{" "}
                            {new Date(avancement.date_fin).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {avancement.duree_mois} mois
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DocumentsTab = ({ agent }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Arrêtés</h2>
            <p className="text-sm text-gray-500">Documents administratifs</p>
        </div>
        <div className="p-4 space-y-4">
            {agent.avancements.arrete?.map((arrete, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                >
                    <div className="flex items-center space-x-4">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <div>
                            <h4 className="font-medium">
                                {arrete.numero_arrete}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {arrete.type_arrete} -{" "}
                                {new Date(
                                    arrete.date_arrete
                                ).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                {arrete.objet}
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Signé à {arrete.lieu_signature}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CareerDashboard;
