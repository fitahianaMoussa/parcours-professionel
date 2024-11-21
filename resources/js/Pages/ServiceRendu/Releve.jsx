import React, { useRef } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; 
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const AgentInfo = ({ services, avancements, agent,auth }) => {
  // Add useRef for the component
  const componentRef = useRef(null);

  const formatDate = (date) => {
    // Vérifie si la date est valide, sinon renvoie "Non défini"
    if (!date) return "Non défini";
    const parsedDate = new Date(date);
    return format(parsedDate, "d MMMM yyyy", { locale: fr });
  };

  const handleExportPDF = async () => {
    if (!componentRef.current) return;

    try {
      // Désactiver les boutons pendant l'export
      const exportButton = document.getElementById('export-pdf-button');
      if (exportButton) exportButton.disabled = true;

      // Utiliser html2canvas pour convertir le composant en canvas
      const canvas = await html2canvas(componentRef.current, {
        scale: 2, // Augmenter la résolution
        useCORS: true, // Permet le chargement des images cross-origin
        logging: false // Désactiver les logs
      });

      // Créer un nouveau document PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Largeur A4 en mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      // Ajouter l'image au PDF
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        0, 
        imgWidth, 
        imgHeight
      );

      // Sauvegarder le PDF
      pdf.save(`Releve_Service_${agent.nom}_${agent.prenom}.pdf`);
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Une erreur est survenue lors de l'export du PDF.");
    } finally {
      // Réactiver le bouton
      const exportButton = document.getElementById('export-pdf-button');
      if (exportButton) exportButton.disabled = false;
    }
  };

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
      {/* Header avec logo centré */}
      <div className="flex flex-col items-center mb-6">
        <img src="/madagascar.jpeg" alt="Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-2xl font-bold text-center uppercase">
          Relevé de Service
        </h1>
      </div>

      {/* Informations de l'agent centrées */}
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

      {/* Tableau des Avancements Successifs */}
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
            {avancements.map((item, index) => (
              <tr key={index} className="bg-white even:bg-gray-50">
                <td className="px-4 py-2 border border-gray-400">
                  {item.agent?.corps || "Non défini"} {item.grade?.grade || "Non défini"} {item.grade?.echelon || "Non défini"} echelon
                </td>
                <td className="px-4 py-2 border border-gray-400">{formatDate(item.arrete?.date_effet)}</td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.arrete?.numero_arrete || "Non défini"} du {formatDate(item.arrete?.date_arrete)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tableau des Postes Occupés */}
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

      {/* Pied de page */}
      <div className="mt-12 text-left">
        <p>Fianarantsoa, le __________________</p>
        <p className="mt-4">Signature:</p>
      </div>
    </div>
    </Authenticated>
  );
};

export default AgentInfo;
