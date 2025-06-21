import React, { useState } from "react";
import useSortableData from "../../features/useSortableData.js";
import Allert from "../Allert/Allert.jsx";
import NoEntries from "../Allert/NoEntries.jsx";
import {
    FiChevronDown,
    FiChevronUp,
    FiTrash2,
} from "react-icons/fi";
import {
    useGetAnesthesiaTypesQuery,
    useDeleteAnesthesiaTypeMutation,
} from "../../app/redux/operations/anesthesiaTypeApi.js";
import Spiner from "../other/Spiner.jsx";
import { toast } from "react-toastify";

const AnesthesiaTypeRead = () => {
    const {
        data: anesthesiaData,
        isLoading,
    } = useGetAnesthesiaTypesQuery();

    const [deleteAnesthesiaType, { isLoading: isDeleting }] =
        useDeleteAnesthesiaTypeMutation();

    const { items: sortedAnesthesia, requestSort, sortConfig } = useSortableData(
        anesthesiaData?.data || [],
        { key: "id", direction: "ascending" }
    );

    const [expandedRows, setExpandedRows] = useState([]);


    const handleDelete = async (id) => {
        try {
            await deleteAnesthesiaType(id).unwrap();
            toast.error("Тип анастезии удален");
        } catch (err) {
            console.error("Ошибка при удалении типа анастезии:", err);
            toast.error("Не удалось удалить тип анастезии");
        }
    };

    // Загрузка
    if (isLoading) {
        return <Spiner />;
    }

    // Пустой список
    if (sortedAnesthesia.length === 0) {
        return <NoEntries text="Нет записей" />;
    }

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 cursor-pointer text-center"
                            onClick={() => requestSort("id")}
                        >
                            #
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 cursor-pointer text-center"
                            onClick={() => requestSort("anesthesia_name")}
                        >
                            Название анастезии
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 cursor-pointer text-center"
                            onClick={() => requestSort("anesthesia_description")}
                        >
                            Описание анастезии
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedAnesthesia.map((anesthesia) => (
                        <tr
                            key={anesthesia.id}
                            className={`border-b dark:border-gray-700 border-gray-200 ${
                                anesthesia.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {anesthesia.id}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {anesthesia.anesthesia_name}
                            </td>
                            <td className="px-6 py-4">
                                <div className="relative">
                                    <p
                                        className={`${
                                            expandedRows.includes(anesthesia.id)
                                                ? ""
                                                : "line-clamp-2"
                                        }`}
                                    >
                                        {anesthesia.anesthesia_description || "Нет описания"}
                                    </p>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="flex justify-center space-x-3">
                                    <button
                                        type="button"
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Delete anesthesia type"
                                        onClick={() => handleDelete(anesthesia.id)}
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

export default AnesthesiaTypeRead;