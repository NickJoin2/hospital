import React, {useEffect, useState} from 'react';
import BreadCrumb from "../widgets/BreadCrumb.jsx";
import {FiEdit2, FiTrash2} from "react-icons/fi";
import CreateWorkerEducation from "../widgets/workers/CreateWorkerEducation.jsx";
import CreateWorkerExperiences from "../widgets/workers/CreateWorkerExperiences.jsx";
import {
    useGetWorkerExperiencesQuery
} from "../app/redux/worker/workerExperiencesApi.js";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import Allert from "../widgets/Allert/Allert.jsx";

const WorkerExperiences = () => {
    const breadcrumbLinks = [
        {to: '/', label: 'Home'},
        {to: '/templates', label: 'Templates'},
        {to: '/templates/flowbite', label: 'Flowbite'},
    ];

    const {data: experienceData = []} = useGetWorkerExperiencesQuery()
    const [deleteExperiences] = useDeleteWorkerExperienceMutation()
    const [activeCreate, setActiveCreate] = useState(false);

    const [allert, setAllert] = useState('')


    const [sortConfig, setSortConfig] = useState({key: 'id', direction: 'ascending'});
    const [showResponsibilitiesAndAchievements, setShowResponsibilitiesAndAchievements] = useState(false);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const sortedExperienceData = [...experienceData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const toggleResponsibilitiesAndAchievements = () => {
        setShowResponsibilitiesAndAchievements(prevState => !prevState);
    };

    useEffect(() => {
        if (allert) {
            const timer = setTimeout(() => {
                setAllert(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [allert]);

    const handleButton = () => {
        setActiveCreate(!activeCreate);
    };

    const handleDelete = async (id) => {
        try {
            await deleteExperiences(id).unwrap();
            setAllert('delete')
        } catch (err) {
            setAllert('warning')
        }
    };

    return (
        <>
            {allert === 'create' ? (
                <Allert text="Роль успешно создана" theme="success"/>
            ) : null}

            {allert === 'delete' ? (
                <Allert text="Роль удалена" theme="danger"/>
            ) : null}

            {allert === 'warning' ? (
                <Allert text="Не удалось выполнить операцию" theme="warning"/>
            ) : null}

            {activeCreate &&
                <CreateWorkerExperiences setAllert={setAllert} handleButton={handleButton}/>}

            <div className="mx-auto max-w-7xl">
                <BreadCrumb links={breadcrumbLinks}/>

                <h1 className="text-center mt-3 text-4xl">Сотрудники - Опыт</h1>

                <div className="flex justify-between items-center flex-wrap pt-3">
                    <button
                        className="w-1/3 py-2 px-4 max-w-[150px] border border-transparent rounded-md shadow-sm font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                        onClick={() => handleButton()}>
                        Создать
                    </button>

                    <div className="mt-3">
                        <button
                            onClick={toggleResponsibilitiesAndAchievements}
                            className="bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-600 hover:border-transparent rounded"
                        >
                            {showResponsibilitiesAndAchievements ? 'Скрыть' : 'Показать'} дополнительную информацию
                        </button>
                    </div>
                </div>

                {experienceData && experienceData?.length === 0 ? (
                    <NoEntries text="Записей нет"/>
                ) : (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
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
                                    onClick={() => requestSort("name")}
                                >
                                    ФИО
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => requestSort("workTime")}
                                >
                                    Время работы
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => requestSort("position")}
                                >
                                    Должность
                                </th>
                                {showResponsibilitiesAndAchievements && (
                                    <>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 cursor-pointer text-center"
                                            onClick={() => requestSort("company")}
                                        >
                                            Компания
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 cursor-pointer text-center"
                                            onClick={() => requestSort("responsibilities")}
                                        >
                                            Обязанности
                                        </th>
                                    </>
                                )}
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                            {sortedExperienceData.map((experience, index) => (
                                <tr
                                    key={experience._id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                        {experience._id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                        {experience.name}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                        {experience.workTime}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                        {experience.position}
                                    </td>
                                    {showResponsibilitiesAndAchievements && (
                                        <>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                                {experience.company}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                                {experience.responsibilities}
                                            </td>
                                        </>
                                    )}
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                className="text-gray-500 hover:text-red-600 transition-colors"
                                                aria-label="Delete experience"
                                                onClick={() => handleDelete(experience._id)}
                                            >
                                                <FiTrash2 className="w-5 h-5"/>
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

export default WorkerExperiences;
