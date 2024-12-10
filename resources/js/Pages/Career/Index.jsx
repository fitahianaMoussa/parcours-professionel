import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AwardIcon, BriefcaseIcon, CalendarIcon, UserIcon } from 'lucide-react';


const CareerManagement = () => {
  const [activeTab, setActiveTab] = useState('advancements');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Utilisation des props Inertia
  const { agent, careerSummary, advancements, contracts } = usePage().props;

  const processCareer = async (agentId) => {
    setLoading(true);
    setError(null); // Reset the error state
    router.post(
      `/career/${agentId}/process`,
      {},
      {
        onSuccess: () => {
          console.log("Career processed successfully");
          router.reload(); // Refresh the page or fetch updated data
        },
        onError: () => {
          setError("Erreur lors du traitement de la carrière");
        },
        onFinish: () => {
          setLoading(false); // Ensure loading state is cleared
        },
      }
    );
  };
  

  const CareerSummaryCard = ({ summary }) => (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <UserIcon className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Résumé de Carrière</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Début de carrière</span>
          <span className="text-lg font-semibold">{summary?.debut_carriere}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Années de service</span>
          <span className="text-lg font-semibold">{summary?.annees_service} ans</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Grade actuel</span>
          <span className="text-lg font-semibold">{summary?.grade_actuel.grade}</span>
        </div>
      </div>
    </div>
  );

  const AdvancementsTable = ({ advancements }) => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 p-6 border-b">
        <AwardIcon className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Historique des Avancements</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Échelon</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date début</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date fin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {advancements.map((advancement, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{advancement.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{advancement.grade.grade}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{advancement.echelon}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{advancement.date_debut}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{advancement.date_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ContractsTable = ({ contracts }) => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 p-6 border-b">
        <BriefcaseIcon className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold">Contrats</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Numéro</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date début</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date fin</th>
              <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contracts.map((contract, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{contract.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contract.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contract.date_debut}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contract.date_fin}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contract.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CareerChart = ({ advancements }) => {
    const chartData = advancements.map(adv => ({
      date: adv.date_debut,
      echelon: adv.echelon,
    }));

    return (
      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-2 p-6 border-b">
          <CalendarIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Évolution de Carrière</h2>
        </div>
        <div className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="echelon" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion de Carrière</h1>
        <button
          onClick={() => processCareer(59)}
          disabled={loading}
          className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Traitement...' : 'Traiter la carrière'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {careerSummary && <CareerSummaryCard summary={careerSummary} />}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['advancements', 'contracts', 'chart'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize transition-colors`}
              >
                {tab}
              </button> 
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'advancements' && <AdvancementsTable advancements={advancements} />}
      {activeTab === 'contracts' && <ContractsTable contracts={contracts} />}
      {activeTab === 'chart' && <CareerChart advancements={advancements} />}
    </div>
  );
};

export default CareerManagement;