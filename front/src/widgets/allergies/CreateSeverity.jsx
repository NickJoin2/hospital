import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddSeverityMutation } from "../../app/redux/drugs/drugReceptionApi.js";
import { toast } from "react-toastify";

const CreateSeverity = ({ handleButton }) => {
    const [formData, setFormData] = useState({
        severity_name: "",
        severity_description: "",
    });

    const [errors, setErrors] = useState({});
    const [addSeverity, { isLoading }] = useAddSeverityMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.severity_name || formData.severity_name.trim() === "") {
            newErrors.severity_name = "Поле не может быть пустым";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addSeverity(formData).unwrap();
            toast.success("Тяжесть аллергии успешно создана");
            setFormData({ severity_name: "", severity_description: "" });
            setErrors({});
            handleButton();
        } catch (err) {
            console.error("Ошибка при создании тяжести:", err);

            // Если сервер вернул ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { severity_name: 'Уже существует' }
            } else {
                toast.error("Не удалось создать тяжесть аллергии");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                <button
                    onClick={() => handleButton()}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close form"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Создать тяжесть аллергии</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Поле: Тяжесть */}
                        <div>
                            <label
                                htmlFor="severity_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Тяжесть
                            </label>
                            <input
                                type="text"
                                id="severity_name"
                                name="severity_name"
                                value={formData.severity_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        severity_name: e.target.value,
                                    })
                                }
                                placeholder="Введите тяжесть аллергии"
                                className={`w-full px-3 py-2 border ${
                                    errors.severity_name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.severity_name}
                            />
                            {errors.severity_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.severity_name}</p>
                            )}
                        </div>

                        {/* Поле: Описание */}
                        <div>
                            <label
                                htmlFor="severity_description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Описание
                            </label>
                            <textarea
                                id="severity_description"
                                name="severity_description"
                                value={formData.severity_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        severity_description: e.target.value,
                                    })
                                }
                                rows="4"
                                placeholder="Введите описание"
                                className={`w-full px-3 py-2 border ${
                                    errors.severity_description ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.severity_description && (
                                <p className="mt-1 text-sm text-red-500">{errors.severity_description}</p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
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

export default CreateSeverity;