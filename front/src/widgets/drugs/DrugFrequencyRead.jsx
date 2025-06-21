import React from 'react';
import useSortableData from '../../features/useSortableData.js';
import Allert from '../Allert/Allert.jsx';
import NoEntries from '../Allert/NoEntries.jsx';
import { FiTrash2 } from 'react-icons/fi';
import { useDeleteFrequencyMutation, useGetFrequenciesQuery } from '../../app/redux/diagnoses/frequencyApi.js';
import { toast } from 'react-toastify';
import Spiner from "../other/Spiner.jsx";

const DrugFrequencyRead = () => {
    const {
        data: frequencyData,
        isLoading: isFrequencyLoading,
    } = useGetFrequenciesQuery();

    const [
        deleteFrequency,
        {
            isLoading: isDeleting,
        }
    ] = useDeleteFrequencyMutation();

    // Сортировка данных
    const { items: drugSorted, requestSort, sortConfig } = useSortableData(
        frequencyData?.data || [],
        { key: 'id', direction: 'ascending' }
    );

    // Обработка удаления
    const handleDelete = async (id) => {
        try {
            await deleteFrequency(id).unwrap();
            toast.error('Запись успешно удалена');
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    };

    // Показываем спиннер во время загрузки
    if (isFrequencyLoading) return <Spiner/>


    // Если нет записей
    if (!frequencyData?.data || drugSorted.length === 0) {
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
                        <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('frequencies_name')}>
                            Частота приема
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Описание
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {drugSorted.map((frequency) => (
                        <tr
                            key={frequency.id}
                            className={`border-b dark:border-gray-700 border-gray-200 ${
                                frequency.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } dark:bg-gray-800`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {frequency.id}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {frequency.frequencies_name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {frequency.frequency_description || 'Нет описания'}
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="flex justify-center space-x-3">
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Delete frequency"
                                        onClick={() => handleDelete(frequency.id)}
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

export default DrugFrequencyRead;