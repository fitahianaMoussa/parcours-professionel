import React from "react";
import {
    User,
    Calendar,
    GraduationCap,
    Briefcase,
    BookOpen,
    Hash,
    Save,
    X,
} from "lucide-react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

const AgentForm = ({ auth, errors, categories }) => {
    const { data, setData, post, processing } = useForm({
        matricule: "",
        nom: "",
        prenom: "",
        date_de_naissance: "",
        date_entree: "",
        categorie_id: "",
        type_recrutement: "",
        diplome: "",
        corps: "",
        chapitre_budgetaire: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('agent.store'), {
            preserveScroll: true,
            onError: (errors) => {
                // Optional: Add any specific error handling
                console.log(errors);
            }
        });
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="Créer agent" />
            <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                        <User className="w-6 h-6" />
                        Informations de l'Agent
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="matricule"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Matricule
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="matricule"
                                    name="matricule"
                                    value={data.matricule}
                                    onChange={(e) => setData('matricule', e.target.value)}
                                    className={`pl-10 w-full rounded-lg border ${
                                        errors.matricule ? 'border-red-500' : 'border-gray-300'
                                    } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Matricule de l'agent"
                                />
                                <Hash className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.matricule && (
                                <p className="mt-1 text-xs text-red-500">{errors.matricule}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="nom"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nom
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nom de l'agent"
                                />
                                <User className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.nom && (
                                <p className="mt-1 text-xs text-red-500">{errors.nom}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="prenom"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Prénom
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={data.prenom}
                                    onChange={(e) => setData('prenom', e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Prénom de l'agent"
                                />
                                <User className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.prenom && (
                                <p className="mt-1 text-xs text-red-500">{errors.prenom}</p>
                            )}
                        </div>
                    </div>

                    {/* Date d'entrée et Catégorie */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="date_entree"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date d'entrée
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date_entree"
                                    name="date_entree"
                                    value={data.date_entree}
                                    onChange={(e) => setData('date_entree', e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.date_entree && (
                                <p className="mt-1 text-xs text-red-500">{errors.date_entree}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="categorie_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Catégorie
                            </label>
                            <div className="relative">
                                <select
                                    id="categorie_id"
                                    name="categorie_id"
                                    value={data.categorie_id}
                                    onChange={(e) => setData('categorie_id', e.target.value)}
                                    className={`w-full px-4 py-2 pl-10 border ${
                                        errors.categorie_id ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nom}
                                        </option>
                                    ))}
                                </select>
                                <GraduationCap className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.categorie_id && (
                                <p className="mt-1 text-xs text-red-500">{errors.categorie_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Date de Naissance */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="date_de_naissance"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date de Naissance
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date_de_naissance"
                                    name="date_de_naissance"
                                    value={data.date_de_naissance}
                                    onChange={(e) => setData('date_de_naissance', e.target.value)}
                                    className={`pl-10 w-full rounded-lg border ${
                                        errors.date_de_naissance ? 'border-red-500' : 'border-gray-300'
                                    } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                />
                                <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.date_de_naissance && (
                                <p className="mt-1 text-xs text-red-500">{errors.date_de_naissance}</p>
                            )}
                        </div>
                    </div>

                    {/* Type de recrutement et Diplôme */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="type_recrutement"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Type de recrutement
                            </label>
                            <select
                                id="type_recrutement"
                                name="type_recrutement"
                                value={data.type_recrutement}
                                onChange={(e) => setData('type_recrutement', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Sélectionner le type</option>
                                <option value="Diplôme">Diplôme</option>
                                <option value="Poste budgétaire libre">Poste budgétaire libre</option>
                            </select>
                            {errors.type_recrutement && (
                                <p className="mt-1 text-xs text-red-500">{errors.type_recrutement}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="diplome"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Diplôme maximum
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="diplome"
                                    name="diplome"
                                    value={data.diplome}
                                    onChange={(e) => setData('diplome', e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Diplôme obtenu"
                                />
                                <GraduationCap className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.diplome && (
                                <p className="mt-1 text-xs text-red-500">{errors.diplome}</p>
                            )}
                        </div>
                    </div>

                    {/* Corps et Chapitre budgétaire */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="corps"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Corps
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="corps"
                                    name="corps"
                                    value={data.corps}
                                    onChange={(e) => setData('corps', e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Corps de l'agent"
                                />
                                <Briefcase className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.corps && (
                                <p className="mt-1 text-xs text-red-500">{errors.corps}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="chapitre_budgetaire"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Chapitre budgétaire
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="chapitre_budgetaire"
                                    name="chapitre_budgetaire"
                                    value={data.chapitre_budgetaire}
                                    onChange={(e) => setData('chapitre_budgetaire', e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Chapitre budgétaire"
                                />
                                <BookOpen className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                            </div>
                            {errors.chapitre_budgetaire && (
                                <p className="mt-1 text-xs text-red-500">{errors.chapitre_budgetaire}</p>
                            )}
                        </div>
                    </div>

                   {/* Indice et Statut */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Statut actif
                        </label>
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="is_active"
                                className="block ml-2 text-sm text-gray-700"
                            >
                                Agent actif
                            </label>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end pt-4 space-x-4">
                    <Link href={route("agent.index")}>
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center px-4 py-2 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    </Authenticated>
    );
};

export default AgentForm;
                        