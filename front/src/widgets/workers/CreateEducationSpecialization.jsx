import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddWorkerSpecializationMutation } from "../../app/redux/worker/workerSpecializationApi.js";
import { toast } from "react-toastify";

const CreateEducationSpecialization = ({ onClose }) => {
    const [formData, setFormData] = useState({
        specialization_code: "",
        specialization_name: "",
    });

    const [errors, setErrors] = useState({});
    const [addSpecialization, { isLoading }] = useAddWorkerSpecializationMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.specialization_code.trim()) {
            newErrors.specialization_code = "Введите код специализации";
        }

        if (!formData.specialization_name.trim()) {
            newErrors.specialization_name = "Введите название специализации";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addSpecialization(formData).unwrap();
            toast.success("Специализация успешно создана");
            setFormData({ specialization_code: "", specialization_name: "" });
            setErrors({});
            onClose();
        } catch (err) {
            console.error("Ошибка при создании специализации:", err);

            // Если сервер вернул ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { specialization_code: 'Такой код уже существует' }
            } else {
                toast.error("Не удалось создать специализацию");
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить специализацию</h2>

                    {/* Форма создания специализации */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Поле: Код специализации */}
                        <div>
                            <label
                                htmlFor="specialization_code"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Код специализации
                            </label>
                            <input
                                type="text"
                                id="specialization_code"
                                name="specialization_code"
                                value={formData.specialization_code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        specialization_code: e.target.value,
                                    })
                                }
                                placeholder="Введите код специализации"
                                className={`w-full px-3 py-2 border ${
                                    errors.specialization_code ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.specialization_code}
                            />
                            {errors.specialization_code && (
                                <p className="mt-1 text-sm text-red-500">{errors.specialization_code}</p>
                            )}
                        </div>

                        {/* Поле: Название специализации */}
                        <div>
                            <label
                                htmlFor="specialization_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Название специализации
                            </label>
                            <input
                                type="text"
                                id="specialization_name"
                                name="specialization_name"
                                value={formData.specialization_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        specialization_name: e.target.value,
                                    })
                                }
                                placeholder="Введите название специализации"
                                className={`w-full px-3 py-2 border ${
                                    errors.specialization_name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.specialization_name}
                            />
                            {errors.specialization_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.specialization_name}</p>
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

export default CreateEducationSpecialization;