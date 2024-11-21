import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
  Calendar, 
  User, 
  FileText, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Save,
  Briefcase
} from 'lucide-react';
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const MultiStepForm = ({ auth, grades, agents }) => {
  const [step, setStep] = useState(1);
  
  const { data, setData, post, processing, errors } = useForm({
    // Avancement fields
    agent_id: '',
    grade_id: '',
    duree_mois: '',
    date_debut: '',
    date_effet: '',
    date_fin: '',
    is_integration: false,
    echelon: 1,
    contract_phase: 1,
    status: 'integrated',
    index_value: 0,
    contract_renewal_date: '',
    
    // Arrete fields
    numero_arrete: '',
    date_arrete: '',
    type_arrete: 'AVANCEMENT',
    objet: '',
    signataire: '',
    reference_anterieure: '',
    lieu_signature: 'Fianarantsoa',
    
    // Contrat fields
    type_contrat: 'integration',
    numero_contrat: '',
    contrat_status: 'en cours',
    is_renouvele: false,
    date_renouvellement: '',
    
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('avancements.store'));
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
          <User className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-medium">Informations de base</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Agent
          </label>
          <select
            value={data.agent_id}
            onChange={e => setData('agent_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionner un agent</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.nom} {agent.prenom}
              </option>
            ))}
          </select>
          {errors.agent_id && (
            <p className="mt-1 text-sm text-red-600">{errors.agent_id}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Grade
          </label>
          <select
            value={data.grade_id}
            onChange={e => setData('grade_id', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionner un grade</option>
            {grades.map(grade => (
              <option key={grade.id} value={grade.id}>
                {grade.grade} - Échelon {grade.echelon}
              </option>
            ))}
          </select>
          {errors.grade_id && (
            <p className="mt-1 text-sm text-red-600">{errors.grade_id}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Durée (mois)
            </label>
            <input
              type="number"
              value={data.duree_mois}
              onChange={e => setData('duree_mois', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Échelon
            </label>
            <input
              type="number"
              value={data.echelon}
              onChange={e => setData('echelon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date de début
            </label>
            <input
              type="date"
              value={data.date_debut}
              onChange={e => setData('date_debut', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date d'effet
            </label>
            <input
              type="date"
              value={data.date_effet}
              onChange={e => setData('date_effet', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <input
              type="date"
              value={data.date_fin}
              onChange={e => setData('date_fin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_integration}
              onChange={e => setData('is_integration', e.target.checked)}
              className="text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Intégration</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-medium">Informations de l'arrêté</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Numéro d'arrêté
          </label>
          <input
            type="text"
            value={data.numero_arrete}
            onChange={e => setData('numero_arrete', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date d'arrêté
            </label>
            <input
              type="date"
              value={data.date_arrete}
              onChange={e => setData('date_arrete', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Type d'arrêté
            </label>
            <select
              value={data.type_arrete}
              onChange={e => setData('type_arrete', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="AVANCEMENT">Avancement</option>
              <option value="INTEGRATION">Intégration</option>
              <option value="TITULARISATION">Titularisation</option>
              <option value="RECLASSEMENT">Reclassement</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Objet
          </label>
          <textarea
            value={data.objet}
            onChange={e => setData('objet', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Signataire
            </label>
            <input
              type="text"
              value={data.signataire}
              onChange={e => setData('signataire', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Lieu de signature
            </label>
            <input
              type="text"
              value={data.lieu_signature}
              onChange={e => setData('lieu_signature', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-medium">Informations du contrat</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Type de contrat
            </label>
            <select
              value={data.type_contrat}
              onChange={e => setData('type_contrat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="integration">Intégration</option>
              <option value="reclassement">Reclassement</option>
              <option value="titularisation">Titularisation</option>
              <option value="avenant signé">Avenant signé</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Numéro de contrat
            </label>
            <input
              type="number"
              value={data.numero_contrat}
              onChange={e => setData('numero_contrat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            value={data.contrat_status}
            onChange={e => setData('contrat_status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.is_renouvele}
              onChange={e => setData('is_renouvele', e.target.checked)}
              className="text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Contrat renouvelé</span>
          </label>
        </div>

        {data.is_renouvele && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date de renouvellement
            </label>
            <input
              type="date"
              value={data.date_renouvellement}
              onChange={e => setData('date_renouvellement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Authenticated user={auth.user}>
      <Head title="Créer Avancement" />
      
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Création d'un avancement
          </h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step >= 1 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    1
                  </div>
                  <div className="absolute text-sm font-medium text-gray-500 -translate-x-1/2 -bottom-6 left-1/2">
                    Base
                  </div>
                </div><div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step >= 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    2
                  </div>
                  <div className="absolute text-sm font-medium text-gray-500 -translate-x-1/2 -bottom-6 left-1/2">
                    Arrêté
                  </div>
                </div>
                <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step >= 3 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    3
                  </div>
                  <div className="absolute text-sm font-medium text-gray-500 -translate-x-1/2 -bottom-6 left-1/2">
                    Contrat
                  </div>
                </div>
              </div>
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 ml-auto text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 ml-auto text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
};

export default MultiStepForm;