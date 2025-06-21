import React from 'react';

const NoEntries = ({ text = "Нет данных для отображения", icon: Icon }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg shadow-inner">
            {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
            <p className="text-gray-500 text-lg font-medium">{text}</p>
        </div>
    );
};

export default NoEntries;