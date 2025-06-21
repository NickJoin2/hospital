import React, {useEffect, useState} from "react";

import AppointmentValueStep2 from "./AppointmentValueStep2.jsx";
import AppointmentValueStep1 from "./AppointmentValueStep1.jsx";
import {FaTimes} from "react-icons/fa";


const AppointmentValue = ({diagnoseId, handleClose}) => {
    const [currentStep, setCurrentStep] = useState(1);


    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    useEffect(() => {
        console.log(diagnoseId);
    }, [diagnoseId]);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <AppointmentValueStep1
                        onNext={nextStep}
                        diagnoseId={diagnoseId}
                    />
                );
            case 2:
                return (
                    <AppointmentValueStep2
                        onNext={nextStep}
                        handleClose={handleClose}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down">
                <button
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close form"
                    onClick={handleClose}
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {renderStep()}
            </div>
        </div>
    );
};

export default AppointmentValue;