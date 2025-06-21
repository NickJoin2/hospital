import React, {useState} from 'react';
import CreateEducationSpecialization from "../widgets/workers/CreateEducationSpecialization.jsx";
import CreateEducationLevel from "../widgets/workers/CreateEducationLevel.jsx";
import EducationSpecializationRead from "../widgets/workers/EducationSpecializationRead.jsx";
import EducationLevelRead from "../widgets/workers/EducationLevelRead.jsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkerEducationDetails = () => {
    const [activeFilter, setActiveFilter] = useState('Специализация');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilterClick = (filter) => setActiveFilter(filter);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => setIsModalOpen(false);


    return (
        <>
            {/* Модальное окно для специализации */}
            {isModalOpen && activeFilter === 'Специализация' && (
                <CreateEducationSpecialization
                    onClose={handleCloseModal}
                    filterType={activeFilter}
                />
            )}

            {/* Модальное окно для уровня образования */}
            {isModalOpen && activeFilter === 'Уровень образования' && (
                <CreateEducationLevel
                    onClose={handleCloseModal}
                    filterType={activeFilter}
                />
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
                <h1 className="text-center mt-3 text-4xl">Образование</h1>
                <div className="flex justify-between items-center gap-4 mt-3">
                    <button
                        className="w-1/3 py-2 px-4 max-w-[150px] border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleOpenModal}
                    >
                        Создать
                    </button>
                    <div
                        className="grid grid-cols-2 gap-1 p-1 my-2 bg-gray-100 rounded-lg dark:bg-gray-600"
                        role="group"
                    >
                        {['Специализация', 'Уровень образования'].map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${activeFilter === filter
                                    ? 'text-white bg-blue-700 dark:bg-gray-300 dark:text-gray-900'
                                    : 'text-blue-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'}`}
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Отображение данных */}
                {activeFilter === 'Специализация' && <EducationSpecializationRead />}
                {activeFilter === 'Уровень образования' && <EducationLevelRead />}
            </div>
        </>
    );
};

export default WorkerEducationDetails;