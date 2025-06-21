import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddAllergyCategoryMutation } from "../../app/redux/allergies/allergenCategory.js";
import { toast } from "react-toastify";

const CreateSeverity = ({ setAlert, handleButton }) => {
    const [formData, setFormData] = useState({
        allergen_category_name: "",
        allergen_category_description: "",
    });

    const [errors, setErrors] = useState({});
    const [addSeverity, { isLoading }] = useAddAllergyCategoryMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.allergen_category_name) {
            newErrors.allergen_category_name = "Введите название аллергена";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addSeverity(formData).unwrap();
            toast.success("Категория аллергенов создана");
            setFormData({ allergen_category_name: "", allergen_category_description: "" });
            setErrors({});
            handleButton();
        } catch (err) {
            // Если сервер вернул конкретные ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { allergen_category_name: 'Уже существует' }
            } else {
                // Общая ошибка
                setAlert({ type: "warning", text: "Не удалось выполнить операцию" });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                <button
                    onClick={() => handleButton()}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close department creation form"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Категория аллергенов</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="allergen_category_name">
                                Категория
                            </label>
                            <input
                                type="text"
                                id="allergen_category_name"
                                name="allergen_category_name"
                                value={formData.allergen_category_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        allergen_category_name: e.target.value,
                                    })
                                }
                                className={`w-full pl-3 pr-3 py-2 border ${
                                    errors.allergen_category_name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Введите название категории"
                                aria-invalid={!!errors.allergen_category_name}
                            />
                            {errors.allergen_category_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.allergen_category_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="allergen_category_description">
                                Описание
                            </label>
                            <textarea
                                id="allergen_category_description"
                                name="allergen_category_description"
                                value={formData.allergen_category_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        allergen_category_description: e.target.value,
                                    })
                                }
                                className={`w-full pl-3 pr-3 py-2 border ${
                                    errors.allergen_category_description ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-48`}
                                placeholder="Введите описание"
                            ></textarea>
                            {errors.allergen_category_description && (
                                <p className="mt-1 text-sm text-red-500">{errors.allergen_category_description}</p>
                            )}
                        </div>

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

export default CreateSeverity;