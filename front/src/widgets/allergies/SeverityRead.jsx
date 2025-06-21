import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import {useDeleteSeverityMutation, useGetSeveritiesQuery} from "../../app/redux/drugs/drugReceptionApi.js";
import NoEntries from "../Allert/NoEntries.jsx";
import CreateSeverity from "./CreateSeverity.jsx";
import useSortableData from "../../features/useSortableData.js";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SeverityRead = () => {

    const { data: severity, isLoading, isError, error } = useGetSeveritiesQuery()
    const [deleteSeverity, { isLoading: isDeleting, isError: isDeleteError, error: deleteError, isSuccess }] = useDeleteSeverityMutation()

    const [activeCreate, setActiveCreate] = useState(false);

    const { items: sortedSeverity, requestSort, sortConfig } = useSortableData(severity?.data || [], { key: "id", direction: "ascending" });

    const [expandedRows, setExpandedRows] = useState([]);


    const handleButton = () => {
        setActiveCreate(!activeCreate);
    };


    const handleDelete = async (id) => {
        try {
            await deleteSeverity(id).unwrap();
            toast.error("Тяжесть успешно удалена")
        } catch (err) {
            console.log(err)
        }
    };


    return (
        <>

            {activeCreate && (
                <CreateSeverity handleButton={handleButton} />
            )}

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
                <h1 className="text-center mt-3 text-4xl">Тяжесть</h1>
                <div className="flex justify-between items-center pt-3">
                    <button
                        className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleButton}
                    >
                        Создать
                    </button>
                </div>
                {sortedSeverity.length === 0 && !isLoading && !isError && <NoEntries text="Записей нет" />}

                {sortedSeverity.length > 0 && (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer text-start"
                                    onClick={() => requestSort("id")}
                                >
                                    #
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => requestSort("severity_name")}
                                >
                                    Отдел
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => requestSort("severity_description")}
                                >
                                    Описание
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                            {sortedSeverity.map((severity) => (
                                <tr
                                    key={severity.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                        severity.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{severity.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {severity.severity_name || "Нет названия"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <p
                                                className={`${
                                                    expandedRows.includes(severity.id) ? "" : "line-clamp-2"
                                                }`}
                                            >
                                                {severity.severity_description || "Нет описания"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                className="text-gray-500 hover:text-red-600 transition-colors"
                                                aria-label="Delete department"
                                                onClick={() => handleDelete(severity.id)}
                                                disabled={isDeleting}
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default SeverityRead;