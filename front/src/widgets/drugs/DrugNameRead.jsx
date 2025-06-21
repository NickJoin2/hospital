import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import NoEntries from '../Allert/NoEntries.jsx';
import useSortableData from '../../features/useSortableData.js';
import Allert from '../Allert/Allert.jsx';
import {
    useDeleteMedicinesNameMutation,
    useGetMedicinesiesNameQuery
} from '../../app/redux/drugs/medicineNameApi.js';
import { toast } from 'react-toastify';
import Spiner from '../other/Spiner.jsx';

const DrugNameRead = () => {
    const {
        data: medicineData,
        isLoading: isMedicineLoading,
    } = useGetMedicinesiesNameQuery();

    const [
        deleteDrugsName,
        {
            isLoading: isDeleting,
        }
    ] = useDeleteMedicinesNameMutation();

    // Сортировка данных
    const { items: drugSorted, requestSort, sortConfig } = useSortableData(
        medicineData?.data || [],
        { key: 'id', direction: 'ascending' }
    );

    // Обработка удаления
    const handleDelete = async (id) => {
        try {
            await deleteDrugsName(id).unwrap();
            toast.error('Запись успешно удалена');
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    };

    // Загрузка
    if (isMedicineLoading) {
        return <Spiner />;
    }

    // Нет записей
    if (!medicineData?.data || drugSorted.length === 0) {
        return <NoEntries text="Записей нет" />;
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('id')}>
                        #
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('medicine_name')}>
                        Название лекарства
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody>
                {drugSorted.map((drugName) => (
                    <tr
                        key={drugName.id}
                        className={`border-b dark:border-gray-700 border-gray-200 ${
                            drugName.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } dark:bg-gray-800`}
                    >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {drugName.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {drugName.medicine_name}
                        </td>
                        <td className="py-4 px-6 text-center">
                            <div className="flex justify-center space-x-3">
                                <button
                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                    aria-label="Delete drug name"
                                    onClick={() => handleDelete(drugName.id)}
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
    );
};

export default DrugNameRead;