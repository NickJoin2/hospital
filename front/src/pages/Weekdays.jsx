import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import CreateWeekday from "../widgets/other/CreateWeekday.jsx";
import {
    useGetWeekdaysQuery,
    useDeleteWeekdayMutation,
} from "../app/redux/schedules/weekdayApi.js";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import useSortableData from "../features/useSortableData.js";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spiner from "../widgets/other/Spiner.jsx";

const Weekdays = () => {
    const {
        data: weekdays,
        isLoading,
        isError: isWeekdaysError,
        error: weekdaysError,
    } = useGetWeekdaysQuery();

    const [deleteWeekday, { isLoading: isDeleting }] = useDeleteWeekdayMutation();
    const [activeCreate, setActiveCreate] = useState(false);

    const { items: sortedWeekdays, requestSort, sortConfig } = useSortableData(
        weekdays?.data || [],
        { key: "id", direction: "ascending" }
    );

    const handleButton = () => {
        setActiveCreate((prev) => !prev);
    };

    const handleDelete = async (id) => {
        try {
            await deleteWeekday(id).unwrap();
            toast.error("День недели удален");
        } catch (err) {
            console.error("Ошибка удаления дня недели:", err);
        }
    };

    // Загрузка
    if (isLoading) {
        return <Spiner />;
    }


    return (
        <>
            {/* Форма создания дня недели */}
            {activeCreate && (
                <CreateWeekday setAlert={setAlert} handleButton={handleButton} />
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


            {/* Основной контент */}
            <div className="p-4 my-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-center mt-3 text-4xl">Дни недели</h1>

                {/* Кнопка создания */}
                <div className="flex justify-between items-center pt-3">
                    <button
                        type="button"
                        onClick={handleButton}
                        className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Создать
                    </button>
                </div>

                {/* Сообщение, если записей нет */}
                {!isLoading && sortedWeekdays.length === 0 && (
                    <NoEntries text="Нет записей" />
                )}

                {/* Таблица дней недели */}
                {sortedWeekdays.length > 0 && (
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
                                    onClick={() => requestSort("day_name")}
                                >
                                    День недели
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                            {sortedWeekdays.map((weekday) => (
                                <tr
                                    key={weekday.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                        weekday.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {weekday.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                        {weekday.day_name}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                type="button"
                                                className="text-gray-500 hover:text-red-600 transition-colors"
                                                aria-label="Delete weekday"
                                                onClick={() => handleDelete(weekday.id)}
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

export default Weekdays;