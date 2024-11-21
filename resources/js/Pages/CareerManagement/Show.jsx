import { UserCircle, Award, Calendar, AlertCircle, History, GraduationCap, ScrollText, Clock } from 'lucide-react';

const CareerManagementShow = ({ agent, next_progression, career_timeline }) => {
 
console.log(agent, next_progression, career_timeline )
  return (
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
                <p>Grade actuel: {agent.avancements[0]?.grade?.grade - agent.avancements[0]?.grade?.echelon || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Award className="w-4 h-4 text-gray-400" />
                <p>Échelon: {agent.avancements[0]?.echelon || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <ScrollText className="w-4 h-4 text-gray-400" />
                <p>Indice: {agent.avancements[0]?.index_value || 'N/A'}</p>
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
  );
};

export default CareerManagementShow;
