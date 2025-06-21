import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddWorkerEducationLevelMutation } from "../../app/redux/worker/workerEducationLevelApi.js";
import { toast } from "react-toastify";

const CreateEducationLevel = ({ onClose }) => {
    const [formData, setFormData] = useState({
        level_name: "",
    });

    const [errors, setErrors] = useState({});
    const [addLevel, { isLoading }] = useAddWorkerEducationLevelMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Валидация локально
        if (!formData.level_name.trim()) {
            newErrors.level_name = "Пожалуйста, введите уровень образования";
        } else if (formData.level_name.trim().length < 3) {
            newErrors.level_name = "Уровень образования должен содержать минимум 3 символа";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addLevel(formData).unwrap();
            toast.success("Уровень образования успешно создан");
            setFormData({ level_name: "" });
            setErrors({});
            onClose();
        } catch (err) {
            console.error("Ошибка при создании уровня образования:", err);

            // Если сервер вернул ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { level_name: 'Такой уровень уже существует' }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                {/* Кнопка закрытия модального окна */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Закрыть форму"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить уровень образования</h2>

                    {/* Форма создания уровня образования */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Поле: Уровень образования */}
                        <div>
                            <label
                                htmlFor="level_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Уровень образования
                            </label>
                            <input
                                type="text"
                                id="level_name"
                                name="level_name"
                                value={formData.level_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        level_name: e.target.value,
                                    })
                                }
                                placeholder="Введите уровень образования"
                                className={`w-full px-3 py-2 border ${
                                    errors.level_name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.level_name}
                            />
                            {errors.level_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.level_name}</p>
                            )}
                        </div>

                        {/* Кнопка отправки формы */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                            >
                                {isLoading ? "Сохраняем..." : "Сохранить"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEducationLevel;