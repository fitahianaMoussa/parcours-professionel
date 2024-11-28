import React from 'react';
import { 
  UserCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  History,
  GraduationCap,
  Award,
  ScrollText
} from 'lucide-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

// Since we're removing Inertia, we'll use props directly
const CareerManagementIndex = ({ agents, flash ,auth}) => {
  const getStatusColor = (status) => {
    const colors = {
      'integration': 'bg-blue-100 text-blue-800',
      'stage': 'bg-purple-100 text-purple-800',
      'titularised': 'bg-green-100 text-green-800',
      'advanced': 'bg-amber-100 text-amber-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.default;
  };

  const handleNavigate = (path) => {
    // Replace with your preferred navigation method
    window.location.href = path;
  };

  const handleProcessCareer = async (agentId) => {
    try {
      const response = await fetch(`/api/career-management/${agentId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Refresh the page or update the state as needed
        window.location.reload();
      }
    } catch (error) {
      console.error('Error processing career:', error);
    }
  };

  return (
    <Authenticated
    user={auth.user}
>
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm max-w-8xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-900">Gestion des Carrières</h1>
          </div>
        </div>

        {flash?.success && (
          <div className="flex items-center p-4 m-6 space-x-2 border border-green-200 rounded-lg bg-green-50">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{flash.success}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Agent</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Progression</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Délai</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents?.data?.map(agent => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <UserCircle className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{agent.nom}</p>
                        <p className="text-sm text-gray-500">{agent.prenom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${getStatusColor(agent.avancements[0]?.status)}`}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      {agent.avancements[0]?.status || 'Nouveau'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span>
                        {agent.next_progression.type}
                        {agent.next_progression.phase && 
                          <span className="ml-1 text-sm text-indigo-600">Phase {agent.next_progression.phase}</span>
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {agent.days_until_next_progression} jours
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleNavigate(`/career-management/${agent.id}`)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Détails
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                      <button
                        onClick={() => handleProcessCareer(agent.id)}
                        disabled={agent.days_until_next_progression > 0}
                        className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white
                          ${agent.days_until_next_progression > 0 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }`}
                      >
                        Traiter la progression
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </Authenticated>
  );
};

const CareerManagementShow = () => {
    const { agent, next_progression, career_timeline,auth } = usePage().props;
  
    return (
      <Authenticated
      user={auth.user}
  >
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto bg-white rounded-lg shadow-sm max-w-7xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserCircle className="w-8 h-8 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Carrière de {agent.nom} {agent.prenom}
                </h1>
              </div>
              <button
                onClick={() => Inertia.visit('/career-management')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Retour
              </button>
            </div>
          </div>
  
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4 space-x-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Informations Actuelles</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <p>Grade actuel: {agent.avancements?.grade?.nom || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Award className="w-4 h-4 text-gray-400" />
                  <p>Échelon: {agent.avancements?.echelon || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <ScrollText className="w-4 h-4 text-gray-400" />
                  <p>Indice: {agent.avancements?.index_value || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4 space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Prochaine Progression</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <p>Type: {next_progression.type}</p>
                </div>
                {next_progression.phase && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <History className="w-4 h-4 text-gray-400" />
                    <p>Phase: {next_progression.phase}</p>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p>Date d'effet: {new Date(next_progression.start_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p>Date de fin: {new Date(next_progression.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
  
          <div className="px-6 pb-6">
            <div className="flex items-center mb-6 space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Historique de Carrière</h3>
            </div>
            <div className="relative pl-8">
              {career_timeline.map((event, index) => (
                <div key={index} className="relative mb-8">
                  <div className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-8"></div>
                  <div className="relative pl-6 border-l-2 border-gray-200">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          <p>Grade: {event.details.grade}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <p>Échelon: {event.details.echelon}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ScrollText className="w-4 h-4 text-gray-400" />
                          <p>Indice: {event.details.index}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                          <p>N° Arrêté: {event.details.arrete}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
     </Authenticated>
    );
  };

export { CareerManagementIndex as default, CareerManagementShow };