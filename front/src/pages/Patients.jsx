import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import CreatePatients from "../widgets/patients/CreatePatients.jsx";
import { useDeletePatientMutation, useGetPatientsQuery } from "../app/redux/patients/patientsApi.js";
import useSortableData from "../features/useSortableData.js";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spiner from "../widgets/other/Spiner.jsx";

const Patients = () => {
    const { data: patients = [], isLoading } = useGetPatientsQuery();
    const [deletePatient] = useDeletePatientMutation();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { items: sortedPatients, requestSort, sortConfig } = useSortableData(patients, {
        key: 'id',
        direction: 'ascending'
    });

    const handleDelete = async (id) => {
        try {
            await deletePatient(id).unwrap();
            toast.success('Пациент успешно удален');
        } catch (err) {
            toast.error('Не удалось удалить пациента');
        }
    };

    const renderTableHeader = useMemo(() => (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('id')}>
                #
            </th>
            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('middle_name')}>
                ФИО
            </th>
            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('birth_date')}>
                Дата рождения
            </th>
            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('is_gender')}>
                Пол
            </th>
            <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('phone')}>
                Телефон
            </th>
            <th scope="col" className="px-6 py-3 text-center">Действия</th>
        </tr>
        </thead>
    ), [requestSort]);

    const renderTableRow = useMemo(() => (
        sortedPatients.map((patient) => (
            <tr key={patient.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                    {patient.id}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                    <Link to={`/patient/${patient.id}`}>
                        {patient.middle_name} {patient.first_name[0]}. {patient.last_name[0]}.
                    </Link>
                </th>
                <td className="px-6 py-4 text-center">{patient.birth_date}</td>
                <td className="px-6 py-4 text-center">{patient.is_gender === 0 ? "Женский" : "Мужской"}</td>
                <td className="px-6 py-4 text-center">+{patient.phone}</td>
                <td className="py-4 px-6 text-center">
                    <button
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Delete patient"
                        onClick={() => handleDelete(patient.id)}
                    >
                        <FiTrash2 className="w-5 h-5"/>
                    </button>
                </td>
            </tr>
        ))
    ), [sortedPatients]);

    if (isLoading) {
        return <Spiner />;
    }

    return (
        <>
            {isCreateModalOpen && <CreatePatients active={isCreateModalOpen} setActive={setIsCreateModalOpen} />}

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="p-4 my-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-center mt-3 text-4xl">Пациенты</h1>

                <div className="flex justify-between items-center pt-3 mb-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-1/3 py-2 px-4 max-w-[150px] border border-transparent rounded-md shadow-sm font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Создать
                    </button>
                </div>

                {patients.length === 0 ? (
                    <NoEntries text="Нет записей о пациентах" />
                ) : (
                    <div className="relative shadow-md sm:rounded-lg mt-5">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            {renderTableHeader}
                            <tbody>{renderTableRow}</tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default Patients;