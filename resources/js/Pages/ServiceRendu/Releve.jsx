import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; 
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";

const AgentInfo = ({ services, avancements: initialAvancements, agent, auth, contrats }) => {
    console.log(contrats)
  const handleExportPDF = async () => {
    if (!componentRef.current) return;

    try {
      const exportButton = document.getElementById('export-pdf-button');
      if (exportButton) exportButton.disabled = true;

      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        0, 
        imgWidth, 
        imgHeight
      );

      pdf.save(`Releve_Service_${agent.nom}_${agent.prenom}.pdf`);
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Une erreur est survenue lors de l'export du PDF.");
    } finally {
      const exportButton = document.getElementById('export-pdf-button');
      if (exportButton) exportButton.disabled = false;
    }
  };
  const [avancements, setAvancements] = useState(initialAvancements);
  const [editMode, setEditMode] = useState({});
  const componentRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return "Non défini";
    const parsedDate = new Date(date);
    return format(parsedDate, "d MMMM yyyy", { locale: fr });
  };

  const handleEdit = (avancementId, field, value) => {
    setAvancements(prev => prev.map(av => {
      if (av.id === avancementId) {
        return {
          ...av,
          arrete: {
            ...av.arrete,
            [field]: value
          }
        };
      }
      return av;
    }));
  };

  const toggleEdit = (avancementId, field) => {
    setEditMode(prev => ({
      ...prev,
      [`${avancementId}-${field}`]: !prev[`${avancementId}-${field}`]
    }));
  };

  const handleSave = async (avancementId) => {
    const avancement = avancements.find(av => av.id === avancementId);
    
    router.put(route('arretes.update', avancement.arrete.id), {
      numero_arrete: avancement.arrete.numero_arrete,
      date_arrete: avancement.arrete.date_arrete,
    }, {
      onSuccess: () => {
        // Reset edit mode after successful save
        setEditMode(prev => {
          const newState = { ...prev };
          delete newState[`${avancementId}-numero_arrete`];
          delete newState[`${avancementId}-date_arrete`];
          return newState;
        });
      },
    });
  };

  const groupedAvancements = avancements.reduce((acc, item) => {
    const type = item.arrete.type_arrete || "Non défini";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});



  return (
    <Authenticated user={auth.user}>
      <div className="flex justify-end mb-4">
        <button 
          id="export-pdf-button"
          onClick={handleExportPDF}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Exporter en PDF
        </button>
      </div>
      <div ref={componentRef} className="p-8 bg-white border rounded-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/madagascar.jpeg" alt="Logo" className="w-60 h-60 mb-4" />
          <h1 className="text-2xl font-bold text-center uppercase">
            Relevé de Service
          </h1>
        </div>
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center w-full max-w-3xl mx-auto gap-y-4">
            <div className="flex justify-between w-full px-4">
              <strong>NOM :</strong> <span>{agent.nom || "Non défini"}</span>
            </div>
            <div className="flex justify-between w-full px-4">
              <strong>PRENOM :</strong> <span>{agent.prenom || "Non défini"}</span>
            </div>
            <div className="flex justify-between w-full px-4">
              <strong>MATRICULE :</strong> <span>{agent.matricule || "Non défini"}</span>
            </div>
            <div className="flex justify-between w-full px-4">
              <strong>CORPS :</strong> <span>{agent.corps || "Non défini"}</span>
            </div>
            <div className="flex justify-between w-full px-4">
              <strong>DATE D'ENTRÉE :</strong> <span>{formatDate(agent.date_entree)}</span>
            </div>
            <div className="flex justify-between w-full px-4">
              <strong>CHAPITRE BUDGÉTAIRE :</strong> <span>{agent.chapitre_budgetaire || "Non défini"}</span>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <table className="w-full border border-collapse border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-400">AVANCEMENTS SUCCESSIFS</th>
                <th className="px-4 py-2 border border-gray-400">DATE D'EFFET</th>
                <th className="px-4 py-2 border border-gray-400">N° et DATE D'ARRÊTÉ</th>
              </tr>
            </thead>


  
            <tbody>
        {Object.keys(groupedAvancements).map((type) => {
          let titre = "Non défini";
          if (type === "INTEGRATION") titre = "CONTRACTUEL EFA";
          else if (type === "AVANCEMENT") titre = "INTEGREE DANS LE CORPS DES FONCTIONNAIRES";
          else if (type === "STAGE") titre = "INTEGREE";
          else if (type === "TITULARISATION") titre = "TITULARISÉE";

          return (
            <React.Fragment key={type}>
              <tr>
                <td colSpan="3" className="text-lg font-bold">{titre}</td>
              </tr>
              {groupedAvancements[type].map((item, index) => (
                <tr key={index} className="bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-400">
                    {item.agent?.corps || "Non défini"}{" "}
                    {item.grade?.grade === "STAGE" 
                  ? "stagiaire" 
             : item.grade?.grade === "INTEGRATION" 
             ? item.grade?.grade 
             : `${item.grade?.grade || "Non défini"}_${item.grade?.echelon || "Non défini"} echelon`}

                  </td>
                  <td className="px-4 py-2 border border-gray-400">
                    {formatDate(item.arrete?.date_effet)}
                  </td>
                  <td className="px-4 py-2 border border-gray-400">
                    <div className="flex flex-col space-y-2">
                      {editMode[`${item.id}-numero_arrete`] ? (
                        <input
                          type="text"
                          value={item.arrete?.numero_arrete || ''}
                          onChange={(e) => handleEdit(item.id, 'numero_arrete', e.target.value)}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        <div 
                          onClick={() => toggleEdit(item.id, 'numero_arrete')} 
                          className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          {item.arrete?.numero_arrete || "Non défini"}
                        </div>
                      )}
                      
                      {editMode[`${item.id}-date_arrete`] ? (
                        <input
                          type="date"
                          value={item.arrete?.date_arrete || ''}
                          onChange={(e) => handleEdit(item.id, 'date_arrete', e.target.value)}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        <div 
                          onClick={() => toggleEdit(item.id, 'date_arrete')} 
                          className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          du {formatDate(item.arrete?.date_arrete)}
                        </div>
                      )}
                      
                      {(editMode[`${item.id}-numero_arrete`] || editMode[`${item.id}-date_arrete`]) && (
                        <button
                          onClick={() => handleSave(item.id)}
                          className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Sauvegarder
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>

  

          </table>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-center">SERVICE EFFECTUÉS</h2>
          <table className="w-full border border-collapse border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-400">PÉRIODE</th>
                <th className="px-4 py-2 border border-gray-400">POSTE OCCUPÉ</th>
                <th className="px-4 py-2 border border-gray-400">ACTE DE NOMINATION</th>
                <th className="px-4 py-2 border border-gray-400">LIEU</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item, index) => (
                <tr key={index} className="bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-400">
                    {formatDate(item.date_debut)} au {formatDate(item.date_fin)}
                  </td>
                  <td className="px-4 py-2 border border-gray-400">{item.poste_occupe || "Non défini"}</td>
                  <td className="px-4 py-2 border border-gray-400">
                    <div className="flex flex-col">
                      <div>{item.reference?.type || "Non défini"}</div>
                      <div>{item.reference?.numero || "Non défini"}</div>
                      <div>du {formatDate(item.reference?.date_reference)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-400">{item.lieu || "Non défini"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 text-left">
          <p>Fianarantsoa, le __________________</p>
          <p className="mt-4">Signature:</p>
        </div>
      </div>
    </Authenticated>
  );
};

export default AgentInfo;
