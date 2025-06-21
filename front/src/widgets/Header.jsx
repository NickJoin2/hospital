import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import {MdMedicalServices, MdDashboard, MdLock} from "react-icons/md";
import { AuthContext } from "../app/hoc/AuthContext.jsx";
import { Link } from "react-router-dom";
import { useMyWorkerProfileQuery } from "../app/redux/worker/workersApi.js";

const BASE_URL = "http://127.0.0.1:8000";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { logout, token, role } = useContext(AuthContext);
    const [updateFlag, setUpdateFlag] = useState(0);
    const { data: dataProfile = {}, refetch } = useMyWorkerProfileQuery();

    const [preview, setPreview] = useState('/user.svg');
    const [currentAvatar, setCurrentAvatar] = useState('');

    // Обновление аватара при изменении данных профиля
    useEffect(() => {
        if (dataProfile?.avatar) {
            const avatarUrl = `${BASE_URL}${dataProfile.avatar}`;
            setCurrentAvatar(avatarUrl);
            setPreview(avatarUrl);
        } else {
            setCurrentAvatar('/user.svg');
            setPreview('/user.svg');
        }
    }, [dataProfile]);

    // Запрос данных профиля при изменении флага
    useEffect(() => {
        refetch().catch((error) => {
            console.error("Ошибка загрузки профиля:", error);
        });
    }, [updateFlag, refetch]);

    // Закрытие дропдауна при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Получение краткого имени пользователя
    const getFullNameShort = () => {
        const { middle_name, first_name, last_name } = dataProfile;
        if (middle_name && first_name && last_name) {
            return `${middle_name} ${first_name[0]}. ${last_name[0]}.`;
        }
        return "Пользователь";
    };

    // Меню для всех пользователей
    const menuItems = [
        { label: "Профиль", to: "/profile", icon: <FaUser className="mr-3" /> },
        { label: "Расписание", to: "/profile-schedule", icon: <MdDashboard className="mr-3" /> },
        { label: "Сотрудники", to: "/workers", icon: <MdDashboard className="mr-3" /> },
        { label: "Пациенты", to: "/patients", icon: <MdDashboard className="mr-3" /> },
        { label: "Прием", to: "/appointments", icon: <MdDashboard className="mr-3" /> },
        { label: "Сменить пароль", to: "new-password", icon: <MdLock className="mr-3" /> },
    ];

    return (
        <header className="bg-white shadow-md relative z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <Link to="/profile" className="flex items-center space-x-2">
                        <MdMedicalServices className="text-blue-600 text-3xl" />
                        <span className="text-2xl font-bold text-gray-800">Hospital</span>
                    </Link>

                    {token && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 focus:outline-none"
                                aria-label="Открыть меню пользователя"
                            >
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Профиль"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </div>
                                <span className="hidden md:block text-gray-700 font-medium">
                                    {getFullNameShort()}
                                </span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-2 z-50">

                                    {/* Основные пункты меню */}
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    ))}

                                    {/* Админ панель */}
                                    {role === "Главный врач" && (
                                        <Link
                                            to="/page-admin"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <MdDashboard className="mr-3" />
                                            Админ панель
                                        </Link>
                                    )}

                                    <hr className="my-1" />

                                    <button
                                        onClick={logout}
                                        className="flex items-center px-4 py-2 w-full text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <FaSignOutAlt className="mr-3" />
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;