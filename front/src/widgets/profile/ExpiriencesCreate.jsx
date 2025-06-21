import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddExperienceMutation, useMyWorkerProfileQuery } from "../../app/redux/worker/workersApi.js";
import { toast } from "react-toastify"; // ✅ Импорт для уведомлений

const ExpiriencesCreate = ({ onClose }) => {
    const [formData, setFormData] = useState({
        date_start: "",
        date_end: "",
        post: "",
        duties: "",
        company: "",
    });

    const [errors, setErrors] = useState({});
    const [addExperience, { isLoading, error: addExperienceError }] = useAddExperienceMutation();
    const { refetch } = useMyWorkerProfileQuery();

    // ✅ Валидация формы
    const validateForm = () => {
        const newErrors = {};
        if (!formData.date_start) newErrors.date_start = "Введите дату начала работы";
        if (!formData.date_end) newErrors.date_end = "Введите дату окончания работы";
        if (!formData.company) newErrors.company = "Введите название компании";
        if (!formData.post) newErrors.post = "Введите должность";
        if (!formData.duties) newErrors.duties = "Введите обязанности";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Обработчик изменения полей
    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    // ✅ Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await addExperience(formData).unwrap();
            await refetch();
            toast.success("Опыт работы успешно добавлен"); // ✅ Уведомление об успехе
            onClose();
        } catch (err) {
            console.error("Ошибка добавления опыта работы:", err);

            let fieldErrors = {};
            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors); // ✅ Показываем ошибки под полями

            // ✅ Показываем уведомление об ошибке
            toast.error(
                err?.data?.message || "Произошла ошибка при добавлении опыта работы",
                { position: "top-right", autoClose: 5000 }
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6">
            <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Закрыть форму"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить опыт работы</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Даты */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Дата начала</label>
                            <input
                                type="date"
                                value={formData.date_start}
                                onChange={handleChange("date_start")}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.date_start ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.date_start && <p className="text-red-500 text-sm">{errors.date_start}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Дата окончания</label>
                            <input
                                type="date"
                                value={formData.date_end}
                                onChange={handleChange("date_end")}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.date_end ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.date_end && <p className="text-red-500 text-sm">{errors.date_end}</p>}
                        </div>
                    </div>

                    {/* Компания и должность */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Компания</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={handleChange("company")}
                                placeholder="Название компании"
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.company ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Должность</label>
                            <input
                                type="text"
                                value={formData.post}
                                onChange={handleChange("post")}
                                placeholder="Введите должность"
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.post ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.post && <p className="text-red-500 text-sm">{errors.post}</p>}
                        </div>
                    </div>

                    {/* Обязанности */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Обязанности</label>
                        <textarea
                            value={formData.duties}
                            onChange={handleChange("duties")}
                            rows={4}
                            placeholder="Опишите обязанности"
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.duties ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.duties && <p className="text-red-500 text-sm">{errors.duties}</p>}
                    </div>

                    {/* Кнопка сохранения */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isLoading ? "Сохраняем..." : "Сохранить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpiriencesCreate;