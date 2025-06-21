import React, {useState } from 'react';
import DrugNameRead from "../widgets/drugs/DrugNameRead.jsx";
import DrugFrequency from "../widgets/drugs/DrugFrequency.jsx";
import DrugFrequencyRead from "../widgets/drugs/DrugFrequencyRead.jsx";
import CreateDrugName from "../widgets/drugs/CreateDrugName.jsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Drugs = () => {
    const [activeFilter, setActiveFilter] = useState('Названия');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilterClick = (filter) => setActiveFilter(filter);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    return (
        <>
            {isModalOpen && activeFilter === 'Названия' && (
                <CreateDrugName
                    onClose={handleCloseModal}
                    filterType={activeFilter}
                />
            )}
            {isModalOpen && activeFilter === 'Способ приема' && (
                <DrugFrequency
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
                <h1 className="text-center mt-3 text-4xl">Лекарства</h1>
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
                        {['Названия', 'Способ приема'].map((filter) => (
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

                {activeFilter === 'Названия' && <DrugNameRead />}
                {activeFilter === 'Способ приема' && <DrugFrequencyRead />}
            </div>
        </>
    );
};

export default Drugs;