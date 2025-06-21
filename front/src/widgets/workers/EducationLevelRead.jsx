import React from 'react';
import useSortableData from '../../features/useSortableData.js';
import Allert from '../Allert/Allert.jsx';
import NoEntries from '../Allert/NoEntries.jsx';
import { FiTrash2 } from 'react-icons/fi';
import {
    useDeleteWorkerEducationLevelMutation,
    useGetWorkerEducationLevelsQuery
} from '../../app/redux/worker/workerEducationLevelApi.js';
import { toast } from 'react-toastify';
import Spiner from '../other/Spiner.jsx';

const EducationLevelRead = () => {
    const {
        data: levelData,
        isLoading: isLevelLoading,

    } = useGetWorkerEducationLevelsQuery();

    const [
        deleteLevel,
        {
            isLoading: isDeleting,
        }
    ] = useDeleteWorkerEducationLevelMutation();

    // Сортировка данных
    const { items: levelSorted, requestSort, sortConfig } = useSortableData(
        levelData?.data || [],
        { key: 'id', direction: 'ascending' }
    );

    // Обработка удаления
    const handleDelete = async (id) => {
        try {
            await deleteLevel(id).unwrap();
            toast.error('Уровень образования удален');
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    };

    // Загрузка
    if (isLevelLoading) {
        return <Spiner />;
    }


    // Нет записей
    if (!levelData?.data || levelData.data.length === 0) {
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
                        <th scope="col" className="px-6 py-3 cursor-pointer text-center" onClick={() => requestSort('level_name')}>
                            Уровень образования
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {levelSorted.map((level) => (
                        <tr
                            key={level.id}
                            className={`border-b dark:border-gray-700 border-gray-200 ${
                                level.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } dark:bg-gray-800`}
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {level.id}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {level.level_name}
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="flex justify-center space-x-3">
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Delete education level"
                                        onClick={() => handleDelete(level.id)}
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

export default EducationLevelRead;