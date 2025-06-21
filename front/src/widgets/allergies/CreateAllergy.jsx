import React, { useEffect, useState } from "react";
import CreateAllergenStep1 from "./CreateAllergenStep1.jsx";
import CreateAllergyStep2 from "./CreateAllergyStep2.jsx";
import { FaTimes } from "react-icons/fa";

const CreateAllergy = ({ patientId, handleCloseAllergy }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        reaction: "",
        date_diagnose_at: "",
        patient_id: "",
        allergen_id: "",
        severity_id: "",
    });

    // Устанавливаем patient_id при получении patientId
    useEffect(() => {
        if (patientId) {
            setFormData((prev) => ({
                ...prev,
                patient_id: patientId,
            }));
        }
    }, [patientId]);

    const nextStep = () => setCurrentStep((prev) => prev + 1);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <CreateAllergenStep1
                        onNext={(allergenData) => {
                            setFormData((prev) => ({
                                ...prev,
                                allergen_id: allergenData.id,
                            }));
                            nextStep();
                        }}
                    />
                );
            case 2:
                return (
                    <CreateAllergyStep2
                        formData={formData}
                        setFormData={setFormData}
                        handleCloseAllergy={handleCloseAllergy}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6">
            <div className="relative w-full max-w-2xl p-2 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down">
                <div className="max-w-2xl">
                    <div className="bg-white rounded-lg w-full relative p-4">
                        <button
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Close form"
                            onClick={handleCloseAllergy}
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAllergy;