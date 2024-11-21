import React from 'react';

const RetirementConfirmationModal = ({ employee, isEarlyRetirement, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="p-6 bg-white rounded shadow-lg">
                <h3 className="mb-4 text-lg font-semibold">
                    Confirmer la Retraite de {employee.first_name} {employee.last_name}
                </h3>
                <p>
                    Êtes-vous sûr de vouloir procéder à la {isEarlyRetirement ? 'retraite anticipée' : 'retraite ordinaire'} de cet employé ?
                </p>
                <div className="mt-4">
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
                    >
                        Confirmer
                    </button>
                    <button 
                        onClick={onCancel} 
                        className="px-4 py-2 text-white bg-red-500 rounded"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RetirementConfirmationModal;
