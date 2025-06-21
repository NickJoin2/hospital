import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddOperationTypeMutation } from "../../app/redux/operations/operationTypeApi.js";
import { toast } from "react-toastify";

const CreateTypeOperation = ({ onClose }) => {
    const [formData, setFormData] = useState({
        operation_type_name: "",
        operation_type_description: "",
    });

    const [errors, setErrors] = useState({});
    const [createTypeOperation, { isLoading }] = useAddOperationTypeMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.operation_type_name.trim()) {
            newErrors.operation_type_name = "Введите тип операции";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createTypeOperation(formData).unwrap();
            toast.success("Тип операции успешно создан");
            setFormData({ operation_type_name: "", operation_type_description: "" });
            setErrors({});
            onClose();
        } catch (err) {
            console.error("Ошибка при создании типа операции:", err);

            // Если сервер вернул ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { operation_type_name: 'Уже существует' }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close form"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить тип операции</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Поле: Тип операции */}
                        <div>
                            <label
                                htmlFor="operation_type_name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Тип операции
                            </label>
                            <input
                                type="text"
                                id="operation_type_name"
                                name="operation_type_name"
                                value={formData.operation_type_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        operation_type_name: e.target.value,
                                    })
                                }
                                placeholder="Введите тип операции"
                                className={`w-full px-3 py-2 border ${
                                    errors.operation_type_name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                aria-invalid={!!errors.operation_type_name}
                            />
                            {errors.operation_type_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.operation_type_name}</p>
                            )}
                        </div>

                        {/* Поле: Описание */}
                        <div>
                            <label
                                htmlFor="operation_type_description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Описание
                            </label>
                            <textarea
                                id="operation_type_description"
                                name="operation_type_description"
                                rows="4"
                                value={formData.operation_type_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        operation_type_description: e.target.value,
                                    })
                                }
                                placeholder="Введите описание"
                                className={`w-full px-3 py-2 border ${
                                    errors.operation_type_description ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.operation_type_description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.operation_type_description}
                                </p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                        >
                            {isLoading ? "Сохраняем..." : "Сохранить"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTypeOperation;