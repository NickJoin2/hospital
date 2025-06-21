import React, {useState} from 'react';
import {FiEdit2, FiTrash2} from "react-icons/fi";

const AmbulanceActive = () => {
    const ambulanceData = [
        { id: 1, car: 'Машина 1', driver: 'Гришин А.А.', doctor1: 'Лаптев Д.В.', doctor2: 'Кирова. А.Д.', date: '12.12.2012', time: '13:00 - 14:10' },
        { id: 2, car: 'Машина 2', driver: 'Гришин А.3.', doctor1: 'Лаптев Д.В.', doctor2: 'Кирова. А.Д.', date: '12.11.2012', time: '12:00 - 16:10' },
        { id: 3, car: 'Машина 3', driver: 'Гришин А.у.', doctor1: 'Лаптев Д.В.', doctor2: 'Кирова. А.Д.', date: '12.03.2012', time: '13:00 - 16:20' },
    ];

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAmbulances = [...ambulanceData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('car')}>Машина</th>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                        onClick={() => requestSort('driver')}>Водитель
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('doctor1')}>Врач 1
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('doctor2')}>Врач 2
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('date')}>Дата</th>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('time')}>Время</th>
                    <th scope="col" className="px-6 py-3 text-center">Действия</th>
                </tr>
                </thead>
                <tbody>
                {sortedAmbulances.map((ambulance) => (
                    <tr key={ambulance.id}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                        <th scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">{ambulance.car}</th>
                        <td className="px-6 py-4 text-center">{ambulance.driver}</td>
                        <td className="px-6 py-4 text-center">{ambulance.doctor1}</td>
                        <td className="px-6 py-4 text-center">{ambulance.doctor2}</td>
                        <td className="px-6 py-4 text-center">{ambulance.date}</td>
                        <td className="px-6 py-4 text-center">{ambulance.time}</td>
                        <td className="py-4 px-6 text-center">
                            <div className="flex justify-center space-x-3">
                                <button
                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                    aria-label="Edit department"
                                >
                                    <FiEdit2 className="w-5 h-5"/>
                                </button>
                                <button
                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                    aria-label="Delete department"
                                >
                                    <FiTrash2 className="w-5 h-5"/>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AmbulanceActive;