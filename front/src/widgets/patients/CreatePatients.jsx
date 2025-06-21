import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import PatientStep1 from "../../features/createPatients/Step1.jsx";
import PatientStep2 from "../../features/createPatients/Step2.jsx";
import PatientStep3 from "../../features/createPatients/Step3.jsx";
import { FaTimes } from "react-icons/fa";

const CreatePatients = ({ active, setActive }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [redirect, setRedirect] = useState(false);
    const [patientId, setPatientId] = useState(null);

    const updateFormData = (newData) => {
        setFormData((prevData) => ({ ...prevData, ...newData }));
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);

    const handleComplete = () => {
        setActive(false);
        setRedirect(true);
    };

    const handleClose = () => {
        setActive(false);
        setRedirect(true);
    };

    const renderStep = () => {
        const baseProps = {
            formData,
            setFormData: updateFormData,
            errors,
            setErrors,
        };

        switch (currentStep) {
            case 1:
                return (
                    <PatientStep1
                        {...baseProps}
                        onNext={(createdPatientId) => {
                            setPatientId(createdPatientId);
                            nextStep();
                        }}
                    />
                );
            case 2:
                return (
                    <PatientStep2
                        {...baseProps}
                        patientId={patientId}
                        onNext={nextStep}
                    />
                );
            case 3:
                return (
                    <PatientStep3
                        {...baseProps}
                        patientId={patientId}
                        onComplete={handleComplete}
                    />
                );
            default:
                return null;
        }
    };

    if (redirect) return <Navigate to="/patients" />;

    return active ? (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6"
                onClick={handleClose}
            >
                <div
                    className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Кнопка закрытия */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Закрыть форму"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>

                    {renderStep()}
                </div>
            </div>
    ) : null;
};

export default CreatePatients;