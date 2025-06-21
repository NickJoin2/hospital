import React from 'react';
import {Link} from "react-router-dom";

import {useGetWorkersQuery} from "../app/redux/worker/workersApi.js";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import useSortableData from "../features/useSortableData.js";
import Spiner from "../widgets/other/Spiner.jsx";

const Workers = () => {

    const {data: workersData = [], isLoading} = useGetWorkersQuery()

    const { items: sortedWorkers, requestSort, sortConfig } = useSortableData(workersData || [], { key: 'id', direction: 'ascending' });

    if (isLoading) {
        return <Spiner />
    }

    return (
        <div className="mx-auto max-w-7xl">
            <h1 className="text-center mt-3 text-4xl">Сотрудники</h1>

            {workersData && workersData?.length === 0 ? (
                <NoEntries text="Записей нет"/>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort('id')}>
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort('middle_name')}>
                                ФИО
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort('role.role_name')}>
                                Роль
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort('department.department_name')}>
                                Отделение
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort('credited_at')}>
                                Прием на работу
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort('phone')}>
                                Телефон
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedWorkers.map((worker) => (
                            <tr key={worker.id}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {worker.id}
                                </th>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    <Link to={`/worker/${worker.id}`}>
                                        {worker.middle_name} {worker.first_name[0] || ''}. {worker.last_name[0] || ''}.
                                    </Link>
                                </th>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                        {worker.role.role_name}
                                </th>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {worker.department.department_name}
                                </th>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {worker.credited_at}
                                </th>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {worker.phone}
                                </th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Workers;
