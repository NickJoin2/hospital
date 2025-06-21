import React from "react";
import {
    FaPhone,
    FaEnvelope,
    FaCalendar,
    FaSpinner
} from "react-icons/fa";
import { useGetWorkerQuery } from "../app/redux/worker/workersApi.js";
import { useParams } from "react-router-dom";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import Spiner from "../widgets/other/Spiner.jsx";
import moment from "moment";

const Profile = () => {
    const { id } = useParams();
    const { data: dataProfile, isLoading } = useGetWorkerQuery(id);

    // Форматирование ФИО
    const getFullName = () => {
        if (!dataProfile?.middle_name || !dataProfile?.first_name || !dataProfile?.last_name) return null;
        return `${dataProfile.middle_name} ${dataProfile.first_name[0]}. ${dataProfile.last_name[0]}.`;
    };

    // Если загрузка
    if (isLoading) {
        return <Spiner />
    }

    // Если профиль не найден
    if (!dataProfile) {
        return (
            <div style={{ height: "50vh" }} className="flex items-center justify-center">
                <div className="w-full p-4">
                    <NoEntries text="Профиль не найден" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative h-48 w-48">
                            <img
                                src={dataProfile.avatar
                                    ? `http://127.0.0.1:8000${dataProfile.avatar}`
                                    : '/user.svg'
                                }
                                alt="Профиль"
                                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">{getFullName()}</h1>
                            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-1">
                                {dataProfile.role?.role_name || 'Без должности'}
                            </h2>
                            <h3 className="text-lg text-gray-500 dark:text-gray-400">
                                {dataProfile.department?.department_name || 'Без отдела'}
                            </h3>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Контактная информация</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-blue-500"/>
                                <a href={`tel:${dataProfile.phone}`}
                                   className="hover:text-blue-500 transition-colors">
                                    {dataProfile.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-500"/>
                                <a href={`mailto:${dataProfile.email}`}
                                   className="hover:text-blue-500 transition-colors">
                                    {dataProfile.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCalendar className="text-blue-500"/>
                                <span className="hover:text-blue-500 transition-colors">
                                    {dataProfile.credited_at || 'Дата не указана'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <h2 className="text-2xl font-semibold ms-1 mb-4">Образование</h2>
                    {dataProfile.worker_education && dataProfile.worker_education.length > 0 ? (
                        dataProfile.worker_education.map((item, index) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Информация об образовании #{index + 1}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Время обучения</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.year_start} - {item.year_end}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Учебное заведение</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.educational_institution}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Специализация</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.specialization?.specialization_code}{' '}
                                            {item.specialization?.specialization_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Уровень образования</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.education_level?.level_name || 'Не указано'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <NoEntries text="Нет записей об образовании." />
                    )}

                    {/* Experience */}
                    <h2 className="text-2xl font-semibold ms-1 mb-4">Опыт</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Работает сейчас
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Время работы</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {dataProfile.credited_at
                                        ? moment(dataProfile.credited_at).format('DD.MM.YYYY')
                                        : 'Дата не указана'
                                    } - н.в.
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Должность</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {dataProfile.role?.role_name}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Компания</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Hospital
                                </p>
                            </div>
                        </div>
                    </div>
                    {dataProfile.worker_experiences && dataProfile.worker_experiences.length > 0 ? (
                        dataProfile.worker_experiences.map((item, index) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Информация о работе #{index + 1}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Время работы</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.date_start} - {item.date_end}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Должность</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.post}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Компания</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.company}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Обязанности</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.duties}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <NoEntries text="Нет записей об опыте работы." />
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;