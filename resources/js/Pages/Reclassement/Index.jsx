import React, { useState } from 'react';
import { Users, ArrowUpRight, History, Search } from 'lucide-react';

// Page principale des reclassements
const ReclassementIndex = ({ categories, initialAgents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredAgents = initialAgents.filter(agent => {
    const matchesSearch = 
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      !selectedCategory || agent.categorie.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Users className="w-8 h-8 text-blue-600" />
          Gestion des Reclassements
        </h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Rechercher un agent..."
            className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-[200px]"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-semibold">Agents Éligibles au Reclassement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Prénom</th>
                <th className="px-4 py-2 text-left">Catégorie Actuelle</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date d'entrée</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent.id}>
                  <td className="px-4 py-2 font-medium">{agent.nom}</td>
                  <td className="px-4 py-2">{agent.prenom}</td>
                  <td className="px-4 py-2">{agent.categorie.nom}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      agent.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(agent.date_entree).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = `/reclassement/reclasser/${agent.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => window.location.href = `/reclassement/historique/${agent.id}`}
                        className="p-2 text-gray-600 hover:text-gray-800"
                      >
                        <History className="w-5 h-5" />
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
  );
};

export { ReclassementIndex };
