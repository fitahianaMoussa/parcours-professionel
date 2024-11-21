import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import RetirementConfirmationModal from './RetirementConfirmationModal';
import Authenticated from '@/Layouts/AuthenticatedLayout';


const RetirementIndex = ({ employees,auth }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEarlyRetirement, setIsEarlyRetirement] = useState(false);

    const handleRetirementConfirmation = () => {
        // Using Inertia.post with route helper
        Inertia.post(route('employees.retire', { employee: selectedEmployee.id }), {
            is_early_retirement: isEarlyRetirement
        });
        setSelectedEmployee(null);
    };

    return (
        <Authenticated
            user={auth.user}
        >
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Employés Approchant de la Retraite</h1>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Nom</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Date d'Embauche</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.data.map(employee => (
                        <tr key={employee.id} className="hover:bg-gray-100">
                            <td className="p-2 border">{employee.first_name} {employee.last_name}</td>
                            <td className="p-2 border">{employee.email}</td>
                            <td className="p-2 border">{employee.hire_date}</td>
                            <td className="p-2 border">
                                <button 
                                    onClick={() => {
                                        setSelectedEmployee(employee);
                                        setIsEarlyRetirement(false);
                                    }}
                                    className="px-2 py-1 mr-2 text-white bg-blue-500 rounded"
                                >
                                    Retraite Ordinaire
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedEmployee(employee);
                                        setIsEarlyRetirement(true);
                                    }}
                                    className="px-2 py-1 text-white bg-green-500 rounded"
                                >
                                    Retraite Anticipée
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedEmployee && (
                <RetirementConfirmationModal
                    employee={selectedEmployee}
                    isEarlyRetirement={isEarlyRetirement}
                    onConfirm={handleRetirementConfirmation}
                    onCancel={() => setSelectedEmployee(null)}
                />
            )}
        </div>
        </Authenticated>
    );
};

export default RetirementIndex;
