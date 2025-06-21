import React from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaAllergies,
    FaUserMd,
    FaBookMedical,
    FaExclamationCircle,
    FaUserShield,
    FaBuilding,
    FaRegCalendarCheck,
    FaPills,
    FaUserPlus,
} from "react-icons/fa";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                    Админ панель
                </h1>

                {/* Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Расписание */}
                    <Link
                        to="/schedules-admin"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-blue-500"
                    >
                        <FaCalendarAlt className="text-blue-500 text-3xl" />
                        <span className="font-medium text-gray-700">Расписание</span>
                    </Link>

                    {/* Аллерген категория */}
                    <Link
                        to="/allergen-category"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-yellow-500"
                    >
                        <FaAllergies className="text-yellow-500 text-3xl" />
                        <span className="font-medium text-gray-700">Аллерген категория</span>
                    </Link>

                    {/* Операции детали */}
                    <Link
                        to="/operations-details"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-green-500"
                    >
                        <FaUserMd className="text-green-500 text-3xl" />
                        <span className="font-medium text-gray-700">Операции детали</span>
                    </Link>

                    {/* Образование детали */}
                    <Link
                        to="/worker-education-details"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-purple-500"
                    >
                        <FaBookMedical className="text-purple-500 text-3xl" />
                        <span className="font-medium text-gray-700">Образование сотрудников</span>
                    </Link>

                    {/* Тяжесть аллергии */}
                    <Link
                        to="/severity"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-red-500"
                    >
                        <FaExclamationCircle className="text-red-500 text-3xl" />
                        <span className="font-medium text-gray-700">Тяжесть аллергии</span>
                    </Link>

                    {/* Роли */}
                    <Link
                        to="/roles"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-indigo-500"
                    >
                        <FaUserShield className="text-indigo-500 text-3xl" />
                        <span className="font-medium text-gray-700">Роли</span>
                    </Link>

                    {/* Отделы */}
                    <Link
                        to="/departments"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-teal-500"
                    >
                        <FaBuilding className="text-teal-500 text-3xl" />
                        <span className="font-medium text-gray-700">Отделы</span>
                    </Link>

                    {/* Дни недели */}
                    <Link
                        to="/weekdays"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-orange-500"
                    >
                        <FaRegCalendarCheck className="text-orange-500 text-3xl" />
                        <span className="font-medium text-gray-700">Дни недели</span>
                    </Link>

                    {/* Лекарства */}
                    <Link
                        to="/drugs"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-pink-500"
                    >
                        <FaPills className="text-pink-500 text-3xl" />
                        <span className="font-medium text-gray-700">Лекарства</span>
                    </Link>

                    {/* Новые сотрудники */}
                    <Link
                        to="/registration-worker"
                        className="bg-white shadow-md hover:shadow-xl rounded-lg p-6 flex items-center space-x-4 transition transform hover:-translate-y-1 duration-300 border-l-4 border-gray-500"
                    >
                        <FaUserPlus className="text-gray-500 text-3xl" />
                        <span className="font-medium text-gray-700">Новые сотрудники</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;