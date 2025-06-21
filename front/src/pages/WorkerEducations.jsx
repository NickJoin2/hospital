import React, {useState} from 'react';
import BreadCrumb from "../widgets/BreadCrumb.jsx";
import {FiTrash2} from "react-icons/fi";
import CreateWorkerEducation from "../widgets/workers/CreateWorkerEducation.jsx";

const WorkerEducations = () => {
    const breadcrumbLinks = [
        {to: '/', label: 'Home'},
        {to: '/templates', label: 'Templates'},
        {to: '/templates/flowbite', label: 'Flowbite'},
    ];

    const educationData = [
        {
            id: 1,
            years: '2010-2015',
            institution: 'МГУ',
            educationLevel: 'Бакалавр',
            name: 'Свиридов Г.В.',
            specialization: 'Информатика',
            notFinished: true,
        },
        {
            id: 2,
            years: '2015-2020',
            institution: 'СПбГУ',
            educationLevel: 'Магистр',
            name: 'Петров П.П.',
            specialization: 'Программирование',
            notFinished: false,
        },
        {
            id: 3,
            years: '2018-2023',
            institution: 'ТГУ',
            educationLevel: 'Доктор наук',
            name: 'Смирнов С.С.',
            specialization: 'Математика',
            notFinished: true,
        },
    ];

    const [sortConfig, setSortConfig] = useState({key: 'id', direction: 'ascending'});
    const [showAchievementsAndSpecialization, setShowAchievementsAndSpecialization] = useState(false);

    const [active, setActive] = useState(false)

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const sortedEducationData = [...educationData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const toggleAchievementsAndSpecialization = () => {
        setShowAchievementsAndSpecialization(prevState => !prevState);
    };


    return (
        <>

            {active ? <CreateWorkerEducation setActiveCreate={setActive} active={active}/> : null}

            <div className="mx-auto max-w-7xl">
                <BreadCrumb links={breadcrumbLinks}/>

                <h1 className="text-center mt-3 text-4xl">Сотрудники - Образование</h1>

                <div className="flex justify-between items-center flex-wrap pt-3">
                    <button
                        className="w-1/3 py-2 px-4 max-w-[150px] border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => setActive(true)}>
                        Создать
                    </button>

                    <div className="mt-3">
                        <button
                            onClick={toggleAchievementsAndSpecialization}
                            className="bg-transparent hover:bg-blue-600 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-600 hover:border-transparent rounded"
                        >
                            {showAchievementsAndSpecialization ? 'Скрыть' : 'Показать'} дополнительную информацию
                        </button>
                    </div>
                </div>

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
                                onClick={() => requestSort("years")}
                            >
                                Годы
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort("institution")}
                            >
                                Заведение
                            </th>
                            {showAchievementsAndSpecialization && (
                                <>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 cursor-pointer text-center"
                                        onClick={() => requestSort("educationLevel")}
                                    >
                                        Уровень образования
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 cursor-pointer text-center"
                                        onClick={() => requestSort("specialization")}
                                    >
                                        Специализация
                                    </th>
                                </>
                            )}
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                        {sortedEducationData.map((education, index) => (
                            <tr
                                key={education.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {education.id}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {education.name}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {education.years}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {education.institution}
                                </td>
                                {showAchievementsAndSpecialization && (
                                    <>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                            {education.educationLevel}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                            {education.specialization}
                                        </td>
                                    </>
                                )}
                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            className="text-gray-500 hover:text-red-600 transition-colors"
                                            aria-label="Delete education"
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
            </div>
        </>
    );
};

export default WorkerEducations;
