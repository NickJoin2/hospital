import React, { useEffect, useRef, useState } from "react";
import {
    FaPhone,
    FaEnvelope,
    FaCamera,
    FaCalendar
} from "react-icons/fa";
import { BiError } from "react-icons/bi";
import {
    useAddPhotoProfileMutation,
    useDeleteEducationMutation,
    useDeleteExperienceMutation,
    useMyWorkerProfileQuery
} from "../app/redux/worker/workersApi.js";
import EducationCreate from "../widgets/profile/EducationCreate.jsx";
import ExpiriencesCreate from "../widgets/profile/ExpiriencesCreate.jsx";
import { FiTrash2 } from "react-icons/fi";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spiner from "../widgets/other/Spiner.jsx";
import moment from "moment/moment.js";

const Profile = () => {
    const [updateFlag, setUpdateFlag] = useState(0);
    const { data: dataProfile = [], isLoading, refetch } = useMyWorkerProfileQuery();

    useEffect(() => {
        refetch().catch((error) => {
            console.error("Ошибка при получении данных профиля:", error);
        });
    }, [updateFlag, refetch]);

    const [addPhoto] = useAddPhotoProfileMutation();
    const [expiriencesOpen, setExpiriencesOpen] = useState(false);
    const [educationOpen, setEducationOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [preview, setPreview] = useState('/user.svg');
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            setError("Пожалуйста, загрузите изображение формата JPG, PNG или WebP");
            return;
        }

        if (file.size > maxSize) {
            setError("Размер файла не должен превышать 5 МБ");
            return;
        }

        setError("");

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result); // Обновляем preview ЛОКАЛЬНО

            const formData = new FormData();
            formData.append("avatar", file);

            // Отправляем фото
            addPhoto(formData)
                .unwrap()
                .then(() => {
                    console.log("Фото успешно загружено");

                    // Принудительно обновляем данные профиля
                    refetch()
                        .unwrap()
                        .then(() => {
                            console.log("Данные профиля успешно обновлены");
                        })
                        .catch((err) => {
                            console.error("Ошибка повторного получения данных профиля:", err);
                        });
                })
                .catch((err) => {
                    console.error("Ошибка при загрузке фото:", err);
                    setError("Не удалось загрузить аватар. Попробуйте позже.");
                });
        };

        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleEducationClose = () => {
        setEducationOpen((prev) => !prev);
        setUpdateFlag((prev) => prev + 1);
    };

    const handleExperienceClose = () => {
        setExpiriencesOpen((prev) => !prev);
        setUpdateFlag((prev) => prev + 1);
    };

    const [deleteExperience] = useDeleteExperienceMutation();
    const handleDeleteExperience = async (id) => {
        try {
            await deleteExperience(id).unwrap();
            setUpdateFlag((prev) => prev + 1);
            toast.error('Опыт работы удален')
        } catch (err) {
            console.error('Ошибка при удалении опыта:', err);
        }
    };

    const [deleteEducation] = useDeleteEducationMutation();
    const handleDeleteEducation = async (id) => {
        try {
            await deleteEducation(id).unwrap();
            setUpdateFlag((prev) => prev + 1);
            toast.error('Запись об образовании удалена')
        } catch (err) {
            console.error('Ошибка при удалении образования:', err);

        }
    };


    if (isLoading) {
        return <Spiner />
    }


    return (
        <>
            {expiriencesOpen && <ExpiriencesCreate onClose={handleExperienceClose} />}
            {educationOpen && <EducationCreate onClose={handleEducationClose} />}

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

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative h-48 w-48">
                            <img
                                src={
                                    dataProfile?.avatar
                                        ? `http://127.0.0.1:8000${dataProfile.avatar}`
                                        : preview
                                }
                                alt="Профиль"
                                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button
                                onClick={handleButtonClick}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                className="absolute bottom-2 right-2 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Обновить фото профиля"
                            >
                                <FaCamera className="text-gray-700 text-xl" />
                                {showTooltip && (
                                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                                        Обновить фото профиля
                                    </div>
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.webp"
                                className="hidden"
                                aria-label="Загрузить фото профиля"
                            />
                            {error && (
                                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 text-red-600 rounded-md flex items-center justify-center text-sm">
                                    <BiError className="mr-1" />
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">
                                {dataProfile?.middle_name && dataProfile?.first_name && dataProfile?.last_name
                                    ? `${dataProfile.middle_name} ${dataProfile.first_name[0]}. ${dataProfile.last_name[0]}.`
                                    : null}
                            </h1>
                            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-1">{dataProfile?.role?.role_name}</h2>
                            <h3 className="text-lg text-gray-500 dark:text-gray-400">{dataProfile?.department?.department_name}</h3>
                        </div>
                    </div>

                    {/* Контакты */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Контактная информация</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-blue-500" />
                                <a href={`tel:${dataProfile.phone}`} className="hover:text-blue-500 transition-colors">
                                    +{dataProfile.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-500" />
                                <a href={`mailto:${dataProfile.email}`} className="hover:text-blue-500 transition-colors">
                                    {dataProfile.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCalendar className="text-blue-500" />
                                <span className="hover:text-blue-500 transition-colors">
                                    {dataProfile.credited_at}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Образование */}
                    <div className="flex items-center justify-between gap-5 mb-3 mt-8">
                        <h2 className="text-2xl font-semibold ms-1">Образование</h2>
                        <button
                            className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleEducationClose}
                        >
                            Добавить
                        </button>
                    </div>
                    {dataProfile?.worker_education?.length > 0 ? (
                        dataProfile.worker_education.map((item, index) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Образование #{index + 1}
                                    </h3>
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Удалить запись об образовании"
                                        onClick={() => handleDeleteEducation(item.id)}
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Период обучения</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.year_start} — {item.year_end}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Учебное заведение</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.educational_institution}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Специальность</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.specialization?.specialization_name}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Уровень образования</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.specialization?.specialization_code}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <NoEntries text="Нет записей об образовании." />
                    )}

                    {/* Опыт работы */}
                    <div className="flex items-center justify-between gap-5 mb-3 mt-8">
                        <h2 className="text-2xl font-semibold ms-1">Опыт работы</h2>
                        <button
                            className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleExperienceClose}
                        >
                            Добавить
                        </button>
                    </div>

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
                    {dataProfile?.worker_experiences?.length > 0 ? (
                        dataProfile.worker_experiences.map((item, index) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Место работы #{index + 1}
                                    </h3>
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Удалить запись об опыте"
                                        onClick={() => handleDeleteExperience(item.id)}
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Период работы</p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {item.date_start} — {item.date_end || "по настоящее время"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Должность</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.post}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Компания</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.company}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Обязанности</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.duties}</p>
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
