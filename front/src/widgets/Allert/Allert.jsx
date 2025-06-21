import React from 'react';

const Alert = ({ text, theme }) => {
    const getAlertClasses = (theme) => {
        switch (theme) {
            case 'success':
                return 'text-green-800 border-green-300 bg-green-100 shadow-md';
            case 'warning':
                return 'text-yellow-800 border-yellow-300 bg-yellow-100 shadow-md';
            case 'error':
                return 'text-red-800 border-red-300 bg-red-100 shadow-md';
            default:
                return 'text-blue-800 border-blue-300 bg-blue-100 shadow-md';
        }
    };

    const alertClasses = `p-4 mb-4 flex items-center border rounded-lg ${getAlertClasses(theme)}`;

    return (
        <div className="absolute top-10" style={{ position: "absolute", left: "50%", transform: "translate(-50%, 0)" }}>
            <div id="alert-additional-content"
                 className={alertClasses}
                 role="alert">
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                </div>
                <div className="text-sm">
                    {text}
                </div>
            </div>
        </div>
    );
};

export default Alert;