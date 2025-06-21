import React, { useEffect, useState } from "react";
import {
    FiTrash2,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

import NoEntries from "../Allert/NoEntries.jsx";
import Allert from "../Allert/Allert.jsx";
import useSortableData from "../../features/useSortableData.js";
import {
    useGetAllergenCategoriesQuery,
    useDeleteAllergyCategoryMutation,
} from "../../app/redux/allergies/allergenCategory.js";
import CreateAllergenCategory from "./CreateAllergenCategory.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spiner from "../other/Spiner.jsx";

const AllergenCategoryRead = () => {
    const {
        data: allergenCategory,
        isLoading,
    } = useGetAllergenCategoriesQuery();

    const [deleteAllergenCategory, { isLoading: isDeleting }] =
        useDeleteAllergyCategoryMutation();

    const [activeCreate, setActiveCreate] = useState(false);

    const { items: sortedAllergenCategory, requestSort, sortConfig } = useSortableData(
        allergenCategory?.data || [],
        { key: "id", direction: "ascending" }
    );

    const [expandedRows, setExpandedRows] = useState([]);

    const handleButton = () => {
        setActiveCreate((prev) => !prev);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAllergenCategory(id).unwrap();
            toast.error("Категория аллергенов удалена");
        } catch (err) {
            console.error("Ошибка при удалении категории:", err);
        }
    };

    if (isLoading) {
        return <Spiner />;
    }

    return (
        <>
            {activeCreate && <CreateAllergenCategory handleButton={handleButton} />}

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
                <h1 className="text-center mt-3 text-4xl">Категории аллергенов</h1>

                <div className="flex justify-between items-center pt-3">
                    <button
                        className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        onClick={handleButton}
                    >
                        Создать
                    </button>
                </div>

                {/* Сообщение, если записей нет */}
                {!isLoading && sortedAllergenCategory?.length === 0 && (
                    <NoEntries text="Записей нет" />
                )}

                {/* Таблица с данными */}
                {sortedAllergenCategory?.length > 0 && (
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
                                    onClick={() => requestSort("allergen_category_name")}
                                >
                                    Название
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => requestSort("allergen_category_description")}
                                >
                                    Описание
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                            {sortedAllergenCategory.map((allergen) => (
                                <tr
                                    key={allergen.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                        allergen.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {allergen.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {allergen.allergen_category_name || "Нет названия"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <p
                                                className={`${
                                                    expandedRows.includes(allergen.id)
                                                        ? ""
                                                        : "line-clamp-2"
                                                }`}
                                            >
                                                {allergen.allergen_category_description ||
                                                    "Нет описания"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                className="text-gray-500 hover:text-red-600 transition-colors"
                                                aria-label="Delete category"
                                                onClick={() => handleDelete(allergen.id)}
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

export default AllergenCategoryRead;