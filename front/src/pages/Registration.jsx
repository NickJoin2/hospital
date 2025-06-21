import React, { useState } from "react";
import Step1 from "../app/redux/worker/Step1.jsx";
import {Navigate} from "react-router-dom";


const RegistrationForm = () => {

    const [redirect, setRedirect] = useState(false);


    if (redirect) {
        return <Navigate to="/workers" />;
    }

    return (
        <>
            {redirect && <Navigate to="/workers" />}


        <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: "0"}}>
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                <Step1
                    setRedirect={setRedirect}
                />
            </div>
        </div>
        </>
    );
};

export default RegistrationForm;