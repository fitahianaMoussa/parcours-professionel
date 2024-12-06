import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
  Save,
  X,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

const UpdateIntegrationForm = ({ agent, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    status: '',
    commentaires: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    post(route('integration-phase.update', agent.id), {
      onSuccess: () => {
        reset();
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        Mettre à jour le statut d'intégration
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            value={data.status}
            onChange={e => setData('status', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un statut</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="prolonge">Prolongé</option>
            <option value="suspendu">Suspendu</option>
          </select>
          {errors.status && (
            <p className="flex items-center mt-1 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {errors.status}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Commentaires
          </label>
          <textarea
            value={data.commentaires}
            onChange={e => setData('commentaires', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ajoutez des commentaires ou observations..."
          />
          {errors.commentaires && (
            <p className="flex items-center mt-1 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {errors.commentaires}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={processing}
          >
            <X className="w-4 h-4 mr-2" />
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={processing}
          >
            <Save className="w-4 h-4 mr-2" />
            {processing ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {isSubmitting && (
          <div className="flex items-center justify-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
            Mise à jour en cours...
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateIntegrationForm;