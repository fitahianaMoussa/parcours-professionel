import React, { useEffect, useState } from "react";
import {
    Check,
    FileText,
    User,
    Calendar,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Search
} from "lucide-react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const MultiStepForm = ({ auth, agents }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAgents, setFilteredAgents] = useState(agents);
    
    const { data, setData, post, processing, errors } = useForm({
        // Contract
        agent_id: "",
        agent_name: "",
        type: "",
        date_debut: "",
        date_fin: "",
        numero_contrat: "",
        status: "",
        is_renouvele: false,
        date_renouvellement: "",
        // Arrêté
        numero_arrete: "",
        date_arrete: "",
        date_effet: "",
        type_arrete: "",
        objet: "",
        signataire: "",
        reference_anterieure: "",
        lieu_signature: "Fianarantsoa",
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === 'checkbox' ? checked : value);
    };

    const [selectedAgent, setSelectedAgent] = useState(null);
    const [availableContractTypes, setAvailableContractTypes] = useState([]);

   /**
 * Get available contract types based on agent category
 * @param {Object} agent - Agent information object
 * @param {Object} agent.categorie - Category information
 * @param {Object} agent.categorie.niveau - Category level (Category III or Category IV)
 * @returns {Array} Array of available contract types
 */
const getContractTypesByCategory = (agent) => {
    if (!agent?.categorie?.niveau) {
        return [];
    }
    
    const baseTypes = [];
    const category = agent.categorie.niveau.trim();
    const isCategory3 = category === "Categorie III";
    const isCategory4 = category === "Categorie IV";
    
    // Handle Category III contracts
    if (isCategory3) {
        baseTypes.push({
            value: "contrat_initial_cat3",
            label: "Premier contrat d'intégration (24 mois)",
            description: "Contrat initial de 24 mois sans grade spécifique",
            duration: 24,
            phase: "INTEGRATION",
            sequence: 1
        });
        
        baseTypes.push({
            value: "premier_renouvellement_cat3",
            label: "Premier renouvellement (24 mois)",
            description: "Premier renouvellement de 24 mois sans changement de grade",
            duration: 24,
            phase: "INTEGRATION",
            sequence: 2
        });
        
        baseTypes.push({
            value: "deuxieme_renouvellement_cat3",
            label: "Deuxième renouvellement (24 mois)",
            description: "Dernier renouvellement de 24 mois avant le stage",
            duration: 24,
            phase: "INTEGRATION",
            sequence: 3
        });
        
        // Stage Phase
        baseTypes.push({
            value: "stage_cat3",
            label: "Stage (12 mois)",
            description: "Période de stage avec grade 2ème classe, 1er échelon",
            duration: 12,
            phase: "STAGE",
            grade: "2eme_classe",
            echelon: 1
        });
        
        // Titularisation
        baseTypes.push({
            value: "titularisation_cat3",
            label: "Titularisation",
            description: "Titularisation au grade 2ème classe, 1er échelon",
            phase: "TITULARISATION",
            grade: "2eme_classe",
            echelon: 1
        });
    }
    
    //Handle Category IV contracts
    if (isCategory4) {
        // First 24-month period
        baseTypes.push({
            value: "contrat_initial_cat4",
            label: "Premier contrat d'intégration (24 mois)",
            description: "Première année: Statut stagiaire, Deuxième année: 2ème classe, 1er échelon",
            duration: 24,
            phase: "INTEGRATION",
            sequence: 1,
            steps: [
                {
                    duration: 12,
                    status: "stagiaire"
                },
                {
                    duration: 12,
                    grade: "2eme_classe",
                    echelon: 1
                }
            ]
        });
        
        // Second 24-month period
        baseTypes.push({
            value: "premier_renouvellement_cat4",
            label: "Premier renouvellement (24 mois)",
            description: "Maintien 2ème classe 1er échelon, puis passage 2ème classe 2ème échelon",
            duration: 24,
            phase: "INTEGRATION",
            sequence: 2,
            grade: "2eme_classe",
            echelon: 1
        });
        
        // Third 24-month period
        baseTypes.push({
            value: "deuxieme_renouvellement_cat4",
            label: "Deuxième renouvellement (24 mois)",
            description: "Maintien 2ème classe 2ème échelon",
            duration: 24,
            phase: "INTEGRATION",
            sequence: 3,
            grade: "2eme_classe",
            echelon: 2
        });
        
        // Avenants (Contract amendments)
        baseTypes.push({
            value: "avenant_premiere_annee_cat4",
            label: "Avenant première année",
            description: "Passage au grade 2ème classe, 1er échelon",
            phase: "INTEGRATION",
            type: "AVENANT",
            grade: "2eme_classe",
            echelon: 1
        });
        
        baseTypes.push({
            value: "avenant_deuxieme_periode_cat4",
            label: "Avenant deuxième période",
            description: "Passage au grade 2ème classe, 2ème échelon",
            phase: "INTEGRATION",
            type: "AVENANT",
            grade: "2eme_classe",
            echelon: 2
        });
        
        // Direct Integration
        baseTypes.push({
            value: "integration_directe_cat4",
            label: "Intégration directe",
            description: "Intégration au grade 2ème classe, 3ème échelon",
            phase: "TITULARISATION",
            grade: "2eme_classe",
            echelon: 3
        });
    }
    
    // Add reclassification option for all categories during integration phase
    baseTypes.push({
        value: "reclassement",
        label: "Reclassement",
        description: "Reclassement possible pendant la phase d'intégration (6 ans)",
        phase: "INTEGRATION",
        type: "RECLASSEMENT",
        conditions: ["poste_budgetaire_disponible", "diplome_correspondant"]
    });
    
    return baseTypes;
};
    
    const handleAgentSelect = (agent) => {
        setSelectedAgent(agent);
        setData(prev => ({
            ...prev,
            agent_id: agent.id,
            agent_name: `${agent.nom} ${agent.prenom}`,
            type: ""
        }));
        
        const contractTypes = getContractTypesByCategory(agent);
        setAvailableContractTypes(contractTypes);
        setSearchTerm("");
        setFilteredAgents(agents);
    };
    

        

    useEffect(() => {
        if (data.type && data.type.includes("contrat")) {
            // Set 24-month period for contracts
            if (data.date_debut) {
                const startDate = new Date(data.date_debut);
                const endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + 24);
                setData("date_fin", endDate.toISOString().split('T')[0]);
            }
        } else if (data.type === "integration_stage") {
            // Set 1-year period for stage
            if (data.date_debut) {
                const startDate = new Date(data.date_debut);
                const endDate = new Date(startDate);
                endDate.setFullYear(startDate.getFullYear() + 1);
                setData("date_fin", endDate.toISOString().split('T')[0]);
            }
        }
    }, [data.type, data.date_debut]);


    const handleSearch = debounce((term) => {
        setSearchTerm(term);
        const filtered = agents.filter(agent => 
            `${agent.nom} ${agent.prenom}`.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredAgents(filtered);
    }, 300);

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contrat.store'), {
            onSuccess: () => {
                toast.success("Contract successfully submitted!");
            },
            onError: () => {
                toast.error("There was an error submitting the contract.");
            },
        });
    };

    const StepIndicator = ({ number, title, isActive, isCompleted }) => (
        <div className="flex items-center">
            <div
                className={`flex items-center justify-center w-8 h-8 rounded-full
                ${isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-200"}
                text-white transition-colors duration-200`}
            >
                {isCompleted ? <Check size={16} /> : number}
            </div>
            <span
                className={`ml-2 text-sm ${
                    isActive ? "text-blue-500 font-medium" : "text-gray-500"
                }`}
            >
                {title}
            </span>
        </div>
    );

    // Added validation for current step
    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1:
                return data.agent_id && data.type && data.numero_contrat && data.status;
            case 2:
                return data.date_debut && data.date_fin;
            case 3:
                return data.numero_arrete && data.type_arrete && data.date_arrete && data.date_effet;
            default:
                return true;
        }
    };

    // Added function to check if form is complete
    const isFormComplete = () => {
        return (
            data.agent_id &&
            data.type &&
            data.numero_contrat &&
            data.status &&
            data.date_debut &&
            data.date_fin &&
            data.numero_arrete &&
            data.type_arrete &&
            data.date_arrete &&
            data.date_effet
        );
    };
    const availableContractType = [
        { value: "integration", label: "Intégration" },
        { value: "reclassement", label: "Reclassement" },
        { value: "titularisation", label: "Titularisation" },
        { value: "avenant signé", label: "Avenant signé" },
        { value: "stage", label: "Stage" },
        { value: "avancement", label: "Avancement" },
        { value: "contractuel EFA", label: "Contractuel EFA" },
    ];
    
    return (
        <Authenticated user={auth.user}>
            <Head title="Créer contrat" />
            <ToastContainer />
            <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <StepIndicator
                            number={1}
                            title="Informations Agent & Contrat"
                            isActive={currentStep === 1}
                            isCompleted={currentStep > 1}
                        />
                        <div className="flex-1 h-px mx-4 bg-gray-200" />
                        <StepIndicator
                            number={2}
                            title="Dates et Période"
                            isActive={currentStep === 2}
                            isCompleted={currentStep > 2}
                        />
                        <div className="flex-1 h-px mx-4 bg-gray-200" />
                        <StepIndicator
                            number={3}
                            title="Informations Arrêté"
                            isActive={currentStep === 3}
                            isCompleted={currentStep > 3}
                        />
                        <div className="flex-1 h-px mx-4 bg-gray-200" />
                        <StepIndicator
                            number={4}
                            title="Confirmation"
                            isActive={currentStep === 4}
                            isCompleted={currentStep > 4}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Agent & Contract Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Sélectionner un agent
                                </label>
                                <div className="relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Rechercher un agent..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                    
                                    {searchTerm && (
                                        <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
                                            {filteredAgents.length > 0 ? (
                                                filteredAgents.map((agent) => (
                                                    <div
                                                        key={agent.id}
                                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleAgentSelect(agent)}
                                                    >
                                                        {agent.nom} {agent.prenom}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-2 text-gray-500">
                                                    Aucun agent trouvé
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {data.agent_name && (
                                    <div className="flex items-center p-2 mt-2 rounded-md bg-blue-50">
                                        <User className="w-5 h-5 mr-2 text-blue-500" />
                                        <span className="text-blue-700">{data.agent_name}</span>
                                    </div>
                                )}
                                {errors.agent_id && (
                                    <div className="mt-1 text-sm text-red-500">{errors.agent_id}</div>
                                )}
                            </div>

                            {/* Contract Type */}
                            <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            Type de Contrat
        </label>
        <select
            name="type"
            value={data.type}
            onChange={handleInputChange} // Ensure this handles updating data.type correctly
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={!selectedAgent} // Disable the select if no agent is selected
        >
            <option value="" disabled>
                Choisir un type de contrat
            </option>
            {availableContractType.map((type) => (
                <option key={type.value} value={type.value}>
                    {type.label}
                </option>
            ))}
        </select>

        {!selectedAgent && (
            <p className="mt-1 text-sm text-gray-500">
                Veuillez d'abord sélectionner un agent
            </p>
        )}

        {selectedAgent && data.type && (
            <p className="p-2 mt-2 text-sm text-gray-600 rounded-md bg-gray-50">
                {availableContractTypes.find((t) => t.value === data.type)?.description}
            </p>
        )}

        {errors.type && (
            <div className="mt-1 text-sm text-red-500">{errors.type}</div>
        )}
    </div>


                            {/* Contract Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Numéro de Contrat
                                </label>
                                <input
                                    type="number"
                                    name="numero_contrat"
                                    value={data.numero_contrat}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.numero_contrat && (
                                    <div className="mt-1 text-sm text-red-500">{errors.numero_contrat}</div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={data.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Sélectionner un status</option>
                                    <option value="en cours">En cours</option>
                                    <option value="terminé">Terminé</option>
                                </select>
                                {errors.status && (
                                    <div className="mt-1 text-sm text-red-500">{errors.status}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Dates and Period */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    name="date_debut"
                                    value={data.date_debut}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.date_debut && (
                                    <div className="mt-1 text-sm text-red-500">{errors.date_debut}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    name="date_fin"
                                    value={data.date_fin}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.date_fin && (
                                    <div className="mt-1 text-sm text-red-500">{errors.date_fin}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_renouvele"
                                        checked={data.is_renouvele}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">
                                        Contrat renouvelé
                                    </label>
                                </div>
                            </div>

                            {data.is_renouvele && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date de renouvellement
                                    </label>
                                    <input
                                        type="date"
                                        name="date_renouvellement"
                                        value={data.date_renouvellement}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Arrêté Information */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Numéro d'arrêté
                                    </label>
                                    <input
                                        type="text"
                                        name="numero_arrete"
                                        value={data.numero_arrete}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.numero_arrete && (
                                        <div className="mt-1 text-sm text-red-500">{errors.numero_arrete}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Type d'arrêté
                                    </label>
                                    <select
                                        name="type_arrete"
                                        value={data.type_arrete}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Sélectionner un type</option>
                                        <option value="RECRUTEMENT">Recrutement</option>
                                        <option value="INTEGRATION">Intégration</option>
                                        <option value="TITULARISATION">Titularisation</option>
                                        <option value="AVANCEMENT">Avancement</option>
                                        <option value="RECLASSEMENT">Reclassement</option>
                                    </select>
                                    {errors.type_arrete && (
                                        <div className="mt-1 text-sm text-red-500">{errors.type_arrete}</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date d'arrêté
                                    </label>
                                    <input
                                        type="date"
                                        name="date_arrete"
                                        value={data.date_arrete}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.date_arrete && (
                                        <div className="mt-1 text-sm text-red-500">{errors.date_arrete}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date d'effet
                                    </label>
                                    <input
                                        type="date"
                                        name="date_effet"
                                        value={data.date_effet}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.date_effet && (
                                        <div className="mt-1 text-sm text-red-500">{errors.date_effet}</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Objet
                                </label>
                                <textarea
                                    name="objet"
                                    value={data.objet}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.objet && (
                                    <div className="mt-1 text-sm text-red-500">{errors.objet}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Signataire
                                    </label>
                                    <input
                                        type="text"
                                        name="signataire"
                                        value={data.signataire}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.signataire && (
                                        <div className="mt-1 text-sm text-red-500">{errors.signataire}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Lieu de signature
                                    </label>
                                    <input
                                        type="text"
                                        name="lieu_signature"
                                        value={data.lieu_signature}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.lieu_signature && (
                                        <div className="mt-1 text-sm text-red-500">{errors.lieu_signature}</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Référence antérieure
                                </label>
                                <input
                                    type="text"
                                    name="reference_anterieure"
                                    value={data.reference_anterieure}
                                    onChange={handleInputChange}
                                    placeholder="Optionnel"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.reference_anterieure && (
                                    <div className="mt-1 text-sm text-red-500">{errors.reference_anterieure}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-50">
                                <h3 className="mb-4 text-lg font-medium text-blue-900">
                                    Résumé des informations
                                </h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Informations Agent
                                            </h4>
                                            <p className="text-gray-600">
                                                Agent: {data.agent_name || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Informations Contrat
                                            </h4>
                                            <p className="text-gray-600">
                                                Type: {data.type || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Numéro: {data.numero_contrat || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Status: {data.status || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Dates Contrat
                                            </h4>
                                            <p className="text-gray-600">
                                                Début: {data.date_debut || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Fin: {data.date_fin || "-"}
                                            </p>
                                            {data.is_renouvele && (
                                                <p className="text-gray-600">
                                                    Renouvellement: {data.date_renouvellement || "-"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Informations Arrêté
                                            </h4>
                                            <p className="text-gray-600">
                                                Numéro: {data.numero_arrete || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Type: {data.type_arrete || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Date arrêté: {data.date_arrete || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Date d'effet: {data.date_effet || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Objet: {data.objet || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                Signature
                                            </h4>
                                            <p className="text-gray-600">
                                                Signataire: {data.signataire || "-"}
                                            </p>
                                            <p className="text-gray-600">
                                                Lieu: {data.lieu_signature || "-"}
                                            </p>
                                            {data.reference_anterieure && (
                                                <p className="text-gray-600">
                                                    Réf. antérieure: {data.reference_anterieure}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!isFormComplete() && (
                                    <div className="p-3 mt-4 border border-yellow-200 rounded-md bg-yellow-50">
                                        <div className="flex items-center text-yellow-800">
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            <span>Certains champs requis ne sont pas remplis</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4 mt-8 border-t">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Précédent
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!isCurrentStepValid()}
                                className={`flex items-center px-4 py-2 ml-auto text-sm font-medium text-white border border-transparent rounded-md
                                    ${isCurrentStepValid() 
                                        ? 'bg-blue-500 hover:bg-blue-600' 
                                        : 'bg-blue-300 cursor-not-allowed'}`}
                            >
                                Suivant
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!isFormComplete() || processing}
                                className={`flex items-center px-4 py-2 ml-auto text-sm font-medium text-white border border-transparent rounded-md
                                    ${isFormComplete() && !processing
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-green-300 cursor-not-allowed'}`}
                            >
                                {processing ? (
                                    <span>Traitement en cours...</span>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-1" />
                                        Confirmer
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Authenticated>
    );
};

export default MultiStepForm;