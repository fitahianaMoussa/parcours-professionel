import React, { useState } from 'react';
import { Award, Calendar, ChevronRight, RefreshCcw } from 'lucide-react';

const CareerProgressionManager = ({ agent, currentProgression }) => {
  const [selectedCategory, setSelectedCategory] = useState(agent?.categorie?.nom || 'CATEGORY_III');
  const [selectedGrade, setSelectedGrade] = useState(currentProgression?.grade || '2eme_classe');
  const [selectedEchelon, setSelectedEchelon] = useState(currentProgression?.echelon || 1);
  const [progression, setProgression] = useState(null);

  const categories = ['CATEGORY_III', 'CATEGORY_IV_PLUS', 'POSTE_BUDGETAIRE'];
  const grades = ['2eme_classe', '1ere_classe', 'principal', 'exceptionnel'];
  const echelons = [1, 2, 3];

  const gradeLabels = {
    '2eme_classe': '2ème Classe',
    '1ere_classe': '1ère Classe',
    'principal': 'Principal',
    'exceptionnel': 'Exceptionnel'
  };

  const calculateAutomaticProgression = () => {
    const currentPhase = currentProgression?.phase || 1;
    let nextProgression = {};

    if (currentProgression?.type === 'INTEGRATION' && currentPhase < 3) {
      nextProgression = {
        type: 'INTEGRATION',
        phase: currentPhase + 1,
        duration: 24,
        grade: '2eme_classe',
        echelon: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 24))
      };
    } else if (currentProgression?.type === 'INTEGRATION' && currentPhase === 3) {
      nextProgression = {
        type: 'STAGE',
        phase: 1,
        duration: 12,
        grade: '2eme_classe',
        echelon: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 12))
      };
    } else {
      const currentGradeIndex = grades.indexOf(selectedGrade);
      const currentEchelonIndex = echelons.indexOf(selectedEchelon);

      if (currentEchelonIndex < echelons.length - 1) {
        nextProgression = {
          type: 'AVANCEMENT',
          phase: null,
          duration: 24,
          grade: selectedGrade,
          echelon: selectedEchelon + 1,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 24))
        };
      } else if (currentGradeIndex < grades.length - 1) {
        nextProgression = {
          type: 'AVANCEMENT',
          phase: null,
          duration: 24,
          grade: grades[currentGradeIndex + 1],
          echelon: 1,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 24))
        };
      }
    }

    setProgression(nextProgression);
  };

  const calculateManualProgression = () => {
    setProgression({
      type: 'AVANCEMENT',
      phase: null,
      duration: 24,
      grade: selectedGrade,
      echelon: selectedEchelon,
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 24))
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Gestion de la Progression</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Catégorie</label>
              <select 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Grade</label>
              <select 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>{gradeLabels[grade]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Échelon</label>
              <select 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedEchelon}
                onChange={(e) => setSelectedEchelon(Number(e.target.value))}
              >
                {echelons.map((echelon) => (
                  <option key={echelon} value={echelon}>{echelon}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateManualProgression}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Award className="w-4 h-4" />
              Progression Manuelle
            </button>
            <button
              onClick={calculateAutomaticProgression}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Progression Automatique
            </button>
          </div>
        </div>
      </div>

      {progression && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Prochaine Progression</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-sm font-medium">Type de Progression</h3>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>{progression.type}</span>
                  {progression.phase && <span>- Phase {progression.phase}</span>}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-sm font-medium">Durée</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>{progression.duration} mois</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-sm font-medium">Grade et Échelon</h3>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>{gradeLabels[progression.grade]} - Échelon {progression.echelon}</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-sm font-medium">Période</h3>
                <div className="flex flex-col gap-1">
                  <div className="text-sm">
                    Début: {progression.start_date.toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    Fin: {progression.end_date.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerProgressionManager;