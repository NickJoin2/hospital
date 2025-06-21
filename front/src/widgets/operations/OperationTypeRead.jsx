import React, { useEffect, useState } from 'react';

import useSortableData from "../../features/useSortableData.js";
import Allert from "../Allert/Allert.jsx";
import NoEntries from "../Allert/NoEntries.jsx";
import {FiChevronDown, FiChevronUp, FiTrash2} from "react-icons/fi";
import {
    useDeleteOperationTypeMutation,
    useGetOperationTypesQuery
} from "../../app/redux/operations/operationTypeApi.js";
import Spiner from "../other/Spiner.jsx";
import {toast} from "react-toastify";


const OperationTypeRead = () => {
    const { data: operationData, isLoading: isOperationLoading, isError: isOperationError, error: OperationError } = useGetOperationTypesQuery()
    const [operationDelete, { isLoading: isDeleting, isError: isDeleteError, error: deleteError, isSuccess }] = useDeleteOperationTypeMutation();

    const { items: operationSorted, requestSort, sortConfig } = useSortableData(operationData?.data || [], { key: 'id', direction: 'ascending' });

    const [expandedRows, setExpandedRows] = useState([]);


    const handleDelete = async (id) => {
        try {
            await operationDelete(id).unwrap();
            toast.error("Тип операции создан")
        } catch (err) {
           console.log(err)
        }
    };


    if (isOperationLoading) return <Spiner/>


    if (operationData.length === 0) {
        return <NoEntries text="Записей нет" />;
    }

    return (
        <>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('id')}>
                            #
                        </th>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('operation_type_name')}>
                            Название операции
                        </th>
                        <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('operation_type_description')}>
                            Описание операции
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {operationSorted.map((operation) => (
                        <tr
                            key={operation.id}
                            className={`border-b dark:border-gray-700 border-gray-200 ${operation.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'} dark:bg-gray-800`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {operation.id}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {operation.operation_type_name}
                            </td>
                            <td className="px-6 py-4">
                                <div className="relative">
                                    <p
                                        className={`${
                                            expandedRows.includes(operation.id) ? "" : "line-clamp-2"
                                        }`}
                                    >
                                        {operation.operation_type_description || "Нет описания"}
                                    </p>

                                </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="flex justify-center space-x-3">
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Delete frequency"
                                        onClick={() => handleDelete(operation.id)}
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
        </>
    );
};

export default OperationTypeRead;
