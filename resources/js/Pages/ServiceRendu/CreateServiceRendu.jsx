import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
const MultiStepForm = ({ agents ,auth}) => {
    const { data, setData, post, errors } = useForm({
        agent_id: 0,
        poste_occupe: "",
        lieu: "",
        date_debut: "",
        date_fin: null,
        reference: {
            numero: "",
            date_reference: "",
            objet: "",
            type: "",
        },
        status: "pending",
    });

    const [step, setStep] = useState(1);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('service.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
        <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-center">
                Service Rendu 
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Étape 1 */}
                {step === 1 && (
                    <div>
                        <h3 className="mb-4 text-lg font-medium">
                            Informations du Service Rendu
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">Agent</label>
                            <select
                                value={data.agent_id}
                                onChange={(e) =>
                                    setData("agent_id", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">
                                    Sélectionner un agent...
                                </option>
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.nom} {agent.prenom}
                                    </option>
                                ))}
                            </select>
                            {errors.agent_id && (
                                <p className="text-red-500">
                                    {errors.agent_id}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">
                                Poste Occupé
                            </label>
                            <input
                                value={data.poste_occupe}
                                onChange={(e) =>
                                    setData("poste_occupe", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Poste occupé"
                            />
                            {errors.poste_occupe && (
                                <p className="text-red-500">
                                    {errors.poste_occupe}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Lieu</label>
                            <input
                                value={data.lieu}
                                onChange={(e) =>
                                    setData("lieu", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Lieu"
                            />
                            {errors.lieu && (
                                <p className="text-red-500">{errors.lieu}</p>
                            )}
                        </div>
                        <div className="flex mb-4 space-x-4">
                            {/* Date de Début */}
                            <div className="w-1/2">
                                <label className="block text-gray-700">
                                    Date de Début
                                </label>
                                <input
                                    type="date"
                                    value={data.date_debut}
                                    onChange={(e) =>
                                        setData("date_debut", e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.date_debut && (
                                    <p className="text-red-500">
                                        {errors.date_debut}
                                    </p>
                                )}
                            </div>

                            {/* Date de Fin */}
                            <div className="w-1/2">
                                <label className="block text-gray-700">
                                    Date de Fin
                                </label>
                                <input
                                    type="date"
                                    value={data.date_fin || ""}
                                    onChange={(e) =>
                                        setData("date_fin", e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.date_fin && (
                                    <p className="text-red-500">
                                        {errors.date_fin}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">
                                Statut
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="active">Actif</option>
                                <option value="completed">Terminé</option>
                                <option value="pending">En attente</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500">{errors.status}</p>
                            )}
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}

                {/* Étape 2 */}
                {step === 2 && (
                    <div>
                        <h3 className="mb-4 text-lg font-medium">
                            Acte de nomination
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">
                                Numéro
                            </label>
                            <input
                                value={data.reference.numero}
                                onChange={(e) =>
                                    setData("reference", {
                                        ...data.reference,
                                        numero: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Numéro de la référence"
                            />
                            {errors.reference?.numero && (
                                <p className="text-red-500">
                                    {errors.reference.numero}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">
                                Date de Référence
                            </label>
                            <input
                                type="date"
                                value={data.reference.date_reference}
                                onChange={(e) =>
                                    setData("reference", {
                                        ...data.reference,
                                        date_reference: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.reference?.date_reference && (
                                <p className="text-red-500">
                                    {errors.reference.date_reference}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Type</label>
                            <select
                                value={data.reference.type}
                                onChange={(e) =>
                                    setData("reference", {
                                        ...data.reference,
                                        type: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">
                                    Sélectionner un type...
                                </option>
                                <option value="ACTE NOMINATION">
                                    ACTE NOMINATION
                                </option>
                                <option value="ARRETE">ARRETE</option>
                                <option value="DECISION">DECISION</option>
                                <option value="NOTE DE SERVICE">
                                    NOTE DE SERVICE
                                </option>
                                <option value="CONTRAT DE TRAVAIL">
                                    CONTRAT DE TRAVAIL
                                </option>
                            </select>
                            {errors.reference?.type && (
                                <p className="text-red-500">
                                    {errors.reference.type}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                            >
                                Soumettre
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
        </AuthenticatedLayout>
    );
};

export default MultiStepForm;
