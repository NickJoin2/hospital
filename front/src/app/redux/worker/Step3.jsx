import React, {useEffect, useState} from "react";
import {useAddWorkerExperienceMutation} from "./workerExperiencesApi.js";
import {Navigate} from "react-router-dom";

const Step3 = ({onComplete}) => {
    const [formData, setFormData] = useState({
        date_start: "",
        date_end: "",
        post: "",
        duties: "",
        company: "",
        worker_id: "",
    });
    const [errors, setErrors] = useState({});
    const [redirect, setRedirect] = useState(false);

    const [userExperience, {isLoading}] = useAddWorkerExperienceMutation();

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            if (user && user.id) {
                setFormData({...formData, worker_id: user.id});
            }
        }
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.date_start) {
            newErrors.date_start = "Введите год начала работы";
        }
        if (!formData.date_end) {
            newErrors.date_end = "Введите год окончания работы";
        }
        if (!formData.post) {
            newErrors.post = "Введите должность";
        }
        if (!formData.company) {
            newErrors.company = "Введите название компании";
        }
        if (!formData.duties) {
            newErrors.duties = "Введите обязанности";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await userExperience(formData).unwrap();
                if (response.status === 201) {
                    setRedirect(true);
                }
                onComplete(); // Завершение регистрации
            } catch (err) {
                console.error("Ошибка добавления опыта работы:", err);
            }
        }
    };

    return (
        <>
            {redirect && <Navigate to="/success"/>}
            <h2 className="text-2xl font-bold mb-4">Опыт работы</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Год начала */}

                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Год начала</label>
                        <input
                            type="date"
                            value={formData.date_start}
                            onChange={(e) =>
                                setFormData({...formData, date_start: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.date_start ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Год начала работы"
                            aria-invalid={!!errors.date_start}
                        />
                        {errors.date_start && (
                            <p className="text-red-500 text-sm">{errors.date_start}</p>
                        )}
                    </div>

                    {/* Год окончания */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Год окончания</label>
                        <input
                            type="date"
                            value={formData.date_end}
                            onChange={(e) =>
                                setFormData({...formData, date_end: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.date_end ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Год окончания работы"
                            aria-invalid={!!errors.date_end}
                        />
                        {errors.date_end && (
                            <p className="text-red-500 text-sm">{errors.date_end}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Компания */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Компания</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) =>
                                setFormData({...formData, company: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.company ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите название компании"
                            aria-invalid={!!errors.company}
                        />
                        {errors.company && (
                            <p className="text-red-500 text-sm">{errors.company}</p>
                        )}
                    </div>

                    {/* Должность */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Должность</label>
                        <input
                            type="text"
                            value={formData.post}
                            onChange={(e) =>
                                setFormData({...formData, post: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.post ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите должность"
                            aria-invalid={!!errors.post}
                        />
                        {errors.post && (
                            <p className="text-red-500 text-sm">{errors.post}</p>
                        )}
                    </div>
                </div>

                {/* Обязанности */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Обязанности</label>
                    <textarea
                        value={formData.duties}
                        onChange={(e) =>
                            setFormData({...formData, duties: e.target.value})
                        }
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.duties ? "border-red-500" : "border-gray-300"
                        } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите обязанности"
                        aria-invalid={!!errors.duties}
                    />
                    {errors.duties && (
                        <p className="text-red-500 text-sm">{errors.duties}</p>
                    )}
                </div>

                {/* Кнопки навигации */}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Завершить
                    </button>
                </div>
            </form>
        </>
    );
};

export default Step3;