import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddAnesthesiaTypeMutation } from "../../app/redux/operations/anesthesiaTypeApi.js";
import { toast } from "react-toastify";

const CreateAnesthesiaType = ({ onClose }) => {
    const [formData, setFormData] = useState({
        anesthesia_name: "",
        anesthesia_description: "",
    });

    const [errors, setErrors] = useState({});
    const [addOperationType, { isLoading }] = useAddAnesthesiaTypeMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.anesthesia_name.trim()) {
            newErrors.anesthesia_name = "Введите название анастезии";
        }

        if (!formData.anesthesia_description.trim()) {
            newErrors.anesthesia_description = "Введите описание анастезии";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addOperationType(formData).unwrap();
            toast.success("Тип анестезии успешно создан");
            setFormData({ anesthesia_name: "", anesthesia_description: "" });
            setErrors({});
            onClose();
        } catch (err) {
            console.error("Ошибка при создании типа анестезии:", err);

            // Если сервер вернул ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { anesthesia_name: 'Уже существует' }
            } else {
                toast.error("Не удалось создать тип анестезии");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Закрыть форму"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить анестезию</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Название анестезии */}
                        <div>
                            <label
                                htmlFor="anesthesia_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Название
                            </label>
                            <input
                                type="text"
                                id="anesthesia_name"
                                name="anesthesia_name"
                                value={formData.anesthesia_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        anesthesia_name: e.target.value,
                                    })
                                }
                                placeholder="Введите название анестезии"
                                className={`w-full px-3 py-2 border ${
                                    errors.anesthesia_name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.anesthesia_name}
                            />
                            {errors.anesthesia_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.anesthesia_name}</p>
                            )}
                        </div>

                        {/* Описание анестезии */}
                        <div>
                            <label
                                htmlFor="anesthesia_description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Описание
                            </label>
                            <textarea
                                id="anesthesia_description"
                                name="anesthesia_description"
                                rows="4"
                                value={formData.anesthesia_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        anesthesia_description: e.target.value,
                                    })
                                }
                                placeholder="Введите описание анестезии"
                                className={`w-full px-3 py-2 border ${
                                    errors.anesthesia_description ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.anesthesia_description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.anesthesia_description}
                                </p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                            >
                                {isLoading ? "Сохраняем..." : "Создать"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAnesthesiaType;