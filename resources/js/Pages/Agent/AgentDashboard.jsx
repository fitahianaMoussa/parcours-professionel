import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  RefreshCw, 
  Briefcase, 
  Award, 
  AlertTriangle,
  CreditCard,
  Wallet 
} from 'lucide-react';

// Main Dashboard Component
const ContractDashboard = () => {
  const { agent, flash } = usePage().props;
  const [activeTab, setActiveTab] = useState('contracts');

  return (
    <div className="p-6 mx-auto space-y-6 max-w-7xl">
      {(!agent.contrats || agent.contrats.length === 0) && (
        <InitialContractForm agent={agent} />
      )}

      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Briefcase className="w-8 h-8" />
          Gestion de carrière - {agent.nom}
        </h1>
        <PhaseIndicator agent={agent} />
      </header>

      {flash.success && (
        <div className="p-4 text-green-700 rounded-lg bg-green-50">
          <div className="font-semibold">Succès</div>
          <div>{flash.success}</div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex border-b border-gray-200">
          {['contracts', 'advancements', 'career'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'contracts' && <ContractsPanel agent={agent} />}
        {activeTab === 'advancements' && <AdvancementsPanel agent={agent} />}
        {activeTab === 'career' && <CareerPanel agent={agent} />}
      </div>
    </div>
  );
};

// Initial Contract Form Component
const InitialContractForm = ({ agent }) => {
  const { data, setData, post, processing, errors } = useForm({
    date_entree: '',
    categorie_id: agent?.categorie_id,
  });

  const handleSubmit = (e) => {
    console.log(data)
    e.preventDefault();
    post(route('contracts.create-initial', agent.id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Création des contrats initiaux</h2>
        <p className="text-gray-600">
          Définissez la date d'entrée pour générer les trois contrats initiaux
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date d'entrée
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.date_entree}
            onChange={e => setData('date_entree', e.target.value)}
          />
          {errors.date_entree && (
            <p className="text-sm text-red-600">{errors.date_entree}</p>
          )}
        </div>

        <div className="p-4 rounded-md bg-yellow-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Important</span>
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            Cette action va créer les trois contrats initiaux de 24 mois chacun.
            Cette opération ne peut être effectuée qu'une seule fois.
          </p>
        </div>

        <button
          type="submit"
          disabled={processing || !data.date_entree}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-4 h-4" />
          Créer les contrats initiaux
        </button>
      </form>
    </div>
  );
};

// Phase Indicator Component
const PhaseIndicator = ({ agent }) => {
  const { remainingMonths, phase } = useIntegrationStatus(agent);
  
  return (
    <span className={`px-3 py-1 text-sm rounded-full ${
      remainingMonths > 0 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-green-100 text-green-800'
    }`}>
      {phase} - {remainingMonths > 0 ? `${remainingMonths} mois restants` : 'Complété'}
    </span>
  );
};
import { useMemo } from 'react';

export const useIntegrationStatus = (agent) => {
  return useMemo(() => {
    if (!agent?.contrats?.length) {
      return {
        phase: 'Non démarré',
        remainingMonths: 0,
        isComplete: false
      };
    }

    // Sort contracts by start date
    const sortedContracts = [...agent.contrats].sort(
      (a, b) => new Date(a.date_debut) - new Date(b.date_debut)
    );

    // Get the first and current contract
    const firstContract = sortedContracts[0];
    const currentContract = sortedContracts.find(c => c.is_active);

    if (!currentContract) {
      return {
        phase: 'Terminé',
        remainingMonths: 0,
        isComplete: true
      };
    }

    // Calculate total months since start
    const startDate = new Date(firstContract.date_debut);
    const now = new Date();
    const totalMonthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + 
      (now.getMonth() - startDate.getMonth());

    // Define phase thresholds (in months)
    const PHASE_1_DURATION = 24;
    const PHASE_2_DURATION = 48;
    const PHASE_3_DURATION = 72;

    let phase;
    let remainingMonths;

    if (totalMonthsElapsed < PHASE_1_DURATION) {
      phase = 'Phase 1';
      remainingMonths = PHASE_1_DURATION - totalMonthsElapsed;
    } else if (totalMonthsElapsed < PHASE_2_DURATION) {
      phase = 'Phase 2';
      remainingMonths = PHASE_2_DURATION - totalMonthsElapsed;
    } else if (totalMonthsElapsed < PHASE_3_DURATION) {
      phase = 'Phase 3';
      remainingMonths = PHASE_3_DURATION - totalMonthsElapsed;
    } else {
      phase = 'Intégré';
      remainingMonths = 0;
    }

    return {
      phase,
      remainingMonths: Math.max(0, Math.ceil(remainingMonths)),
      isComplete: remainingMonths <= 0
    };
  }, [agent?.contrats]);
};
// Contracts Panel Component
const ContractsPanel = ({ agent }) => {
  const activeContract = agent.contrats?.find(c => c.is_active);

  return (
    <div className="space-y-6">
      {activeContract && (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-semibold">
                Contrat actif - N°{activeContract.numero_contrat}
              </h3>
            </div>
            <p className="text-gray-600">
              Période du {new Date(activeContract.date_debut).toLocaleDateString()} 
              au {new Date(activeContract.date_fin).toLocaleDateString()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            <ContractStatusBadge status={activeContract.status} />
            <div>
              <p className="font-medium">Type</p>
              <p>{activeContract.type}</p>
            </div>
            <ContractActions contract={activeContract} />
          </div>
        </div>
      )}

      <ContractHistory contracts={agent.contrats} />
    </div>
  );
};

// Contract Status Badge Component
const ContractStatusBadge = ({ status }) => {
  const styles = {
    'en_cours': 'bg-blue-100 text-blue-800',
    'terminé': 'bg-gray-100 text-gray-800',
    'en_attente': 'bg-yellow-100 text-yellow-800',
  };

  const labels = {
    'en_cours': 'En cours',
    'terminé': 'Terminé',
    'en_attente': 'En attente',
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Contract History Component
const ContractHistory = ({ contracts = [] }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Historique des contrats</h3>
      
      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Période</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract.id} className="border-b border-gray-100">
                <td className="px-4 py-2">{contract.numero_contrat}</td>
                <td className="px-4 py-2">
                  {new Date(contract.date_debut).toLocaleDateString()} - 
                  {new Date(contract.date_fin).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{contract.type}</td>
                <td className="px-4 py-2">
                  <ContractStatusBadge status={contract.status} />
                </td>
                <td className="px-4 py-2">
                  <ContractActions contract={contract} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Contract Actions Component
const ContractActions = ({ contract }) => {
  const { post } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRenewal = () => {
    post(route('contracts.renew', contract.id));
    setIsModalOpen(false);
  };

  if (!contract.can_renew) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-50"
      >
        <RefreshCw className="w-4 h-4" />
        Actions
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold">Confirmation du renouvellement</h3>
            <p className="mt-2 text-gray-600">
              Voulez-vous renouveler le contrat N°{contract.numero_contrat} ?
            </p>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleRenewal}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Confirmer le renouvellement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Other components follow the same pattern, replacing shadcn/ui components with
// Tailwind CSS classes while maintaining the same functionality
// ... (Previous components remain the same)

// Advancements Panel Component
const AdvancementsPanel = ({ agent }) => {
    const currentGrade = agent?.avancements?.[0];
    
    return (
      <div className="space-y-6">
        {currentGrade && currentGrade.grade && (
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Grade actuel</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="font-medium">Classe</p>
                <p className="mt-1 text-gray-600">{currentGrade.grade?.classe || 'Non défini'}</p>
              </div>
              <div>
                <p className="font-medium">Échelon</p>
                <p className="mt-1 text-gray-600">{currentGrade.echelon || 'Non défini'}</p>
              </div>
              <div>
                <p className="font-medium">Indice</p>
                <p className="mt-1 text-gray-600">{currentGrade.index_value || 'Non défini'}</p>
              </div>
            </div>
          </div>
        )}
  
        <AdvancementHistory avancements={agent?.avancements} />
  
        {agent?.can_advance && (
          <AdvancementActions agent={agent} />
        )}
      </div>
    );
  };
  
  // Advancement History Component
  const AdvancementHistory = ({ avancements = [] }) => {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">Historique des avancements</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-4 py-2">Date effet</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Durée</th>
              </tr>
            </thead>
            <tbody>
              {avancements?.map(advancement => (
                <tr key={advancement.id} className="border-b border-gray-100">
                  <td className="px-4 py-2">
                    {advancement.date_effet ? new Date(advancement.date_effet).toLocaleDateString() : 'Non défini'}
                  </td>
                  <td className="px-4 py-2">{advancement.type || 'Non défini'}</td>
                  <td className="px-4 py-2">
                    {advancement.grade?.classe 
                      ? `${advancement.grade.classe} - Échelon ${advancement.echelon || 'Non défini'}`
                      : 'Grade non défini'}
                  </td>
                  <td className="px-4 py-2">{advancement.duree_mois ? `${advancement.duree_mois} mois` : 'Non défini'}</td>
                </tr>
              ))}
              {(!avancements || avancements.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    Aucun historique d'avancement disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Advancement Actions Component
  const AdvancementActions = ({ agent }) => {
    const { post, processing } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleAdvancement = () => {
      post(route('agents.advance', agent.id));
      setIsModalOpen(false);
    };
  
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Award className="w-4 h-4" />
          Procéder à l'avancement
        </button>
  
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold">Confirmation de l'avancement</h3>
              <p className="mt-2 text-gray-600">
                Voulez-vous procéder à l'avancement de {agent.nom_complet} ?
              </p>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAdvancement}
                  disabled={processing}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirmer l'avancement
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  // Career Panel Component
  const CareerPanel = ({ agent }) => {
    return (
      <div className="space-y-6">
        {agent.can_be_reclassed && (
          <ReclassementForm agent={agent} />
        )}
        
        <IntegrationStatus agent={agent} />
        <SalaryIndexCard agent={agent} />
      </div>
    );
  };
  
  // Reclassement Form Component
  const ReclassementForm = ({ agent }) => {
    const { data, setData, post, processing, errors } = useForm({
      nouvelle_categorie: '',
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      post(route('agents.reclassement', agent.id));
    };
  
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold">Reclassement</h3>
        <p className="mt-1 text-gray-600">Modification de la catégorie de l'agent</p>
  
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Nouvelle catégorie</label>
            <select
              value={data.nouvelle_categorie}
              onChange={(e) => setData('nouvelle_categorie', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="3">Catégorie III</option>
              <option value="4">Catégorie IV</option>
            </select>
            {errors.nouvelle_categorie && (
              <p className="text-sm text-red-600">{errors.nouvelle_categorie}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Effectuer le reclassement
          </button>
        </form>
      </div>
    );
  };
  
  const IntegrationStatus = ({ agent }) => {
    const { phase, remainingMonths } = useIntegrationStatus(agent);
  
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">Statut d'intégration</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 font-medium">Phase actuelle</h4>
            <p className="text-gray-600">{phase}</p>
          </div>
          <div>
            <h4 className="mb-1 font-medium">Temps restant</h4>
            <p className="text-gray-600">{remainingMonths} mois</p>
          </div>
          
          {agent.integration_warnings?.map((warning, index) => (
            <div key={index} className="p-4 rounded-md bg-yellow-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Attention</span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">{warning}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // SalaryIndexCard Component
  const SalaryIndexCard = ({ agent }) => {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Indice salarial</h3>
          </div>
          {agent.can_update_index && <SalaryIndexUpdateDialog agent={agent} />}
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="font-medium">Indice actuel</p>
            <p className="mt-1 text-gray-600">{agent.current_index}</p>
          </div>
          <div>
            <p className="font-medium">Dernière mise à jour</p>
            <p className="mt-1 text-gray-600">
              {new Date(agent.last_index_update).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // SalaryIndexUpdateDialog Component
  const SalaryIndexUpdateDialog = ({ agent }) => {
    const { post, processing } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleUpdate = () => {
      post(route('agents.update-index', agent.id));
      setIsModalOpen(false);
    };
  
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-50"
        >
          <CreditCard className="w-4 h-4" />
          Mettre à jour l'indice
        </button>
  
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold">
                Mise à jour de l'indice salarial
              </h3>
              <p className="mt-2 text-gray-600">
                L'indice salarial sera augmenté de 100 points.
                Cette action est irréversible.
              </p>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={processing}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirmer la mise à jour
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
 
export default ContractDashboard;