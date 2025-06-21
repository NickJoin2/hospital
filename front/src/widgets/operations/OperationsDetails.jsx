import React, { useState } from "react";

import OperationTypeRead from "./OperationTypeRead.jsx";
import AnesthesiaTypeRead from "./AnesthesiaTypeRead.jsx";
import CreateTypeOperation from "./CreateTypeOperation.jsx";
import CreateAnesthesiaType from "./CreateAnesthesiaType.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OperationsDetails = () => {
    const [activeFilter, setActiveFilter] = useState("Тип операции");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-4">
                    <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl transform transition-all animate-fade-in-down">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Закрыть форму"
                        >
                            <span className="text-xl">&times;</span>
                        </button>

                        <div className="p-6">
                            {/* Рендер нужной формы в зависимости от фильтра */}
                            {activeFilter === "Тип операции" && (
                                <CreateTypeOperation onClose={closeModal} />
                            )}
                            {activeFilter === "Тип анестезии" && (
                                <CreateAnesthesiaType onClose={closeModal} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Тосты */}
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
                <h1 className="text-center mt-3 text-4xl font-bold text-gray-800">Операции</h1>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={openModal}
                        className="w-full sm:w-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Создать
                    </button>

                    {/* Фильтр */}
                    <div
                        className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-600"
                        role="group"
                    >
                        {["Тип операции", "Тип анестезии"].map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                    activeFilter === filter
                                        ? "bg-blue-700 text-white dark:bg-gray-300 dark:text-gray-900"
                                        : "text-blue-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
                                }`}
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Отображение данных */}
                <div className="mt-6">
                    {activeFilter === "Тип операции" && <OperationTypeRead />}
                    {activeFilter === "Тип анестезии" && <AnesthesiaTypeRead />}
                </div>
            </div>
        </>
    );
};

export default OperationsDetails;