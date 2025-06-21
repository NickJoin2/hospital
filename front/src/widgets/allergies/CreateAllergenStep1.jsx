import React, { useState } from "react";
import { toast } from "react-toastify"; // ✅ Для показа ошибок и успеха
import {
    useGetAllergenCategoriesQuery,
} from "../../app/redux/allergies/allergenCategory.js";
import { useAddAllergyAllergenMutation } from "../../app/redux/allergies/allergyAllergenApi.js";

const CreateAllergenStep1 = ({ onNext }) => {
    const [formData, setFormData] = useState({
        allergen_name: "",
        allergen_category_name_id: "",
    });

    const [errors, setErrors] = useState({});
    const [addAllergenCategory, { isLoading }] = useAddAllergyAllergenMutation();

    const { data: allergenCategory } = useGetAllergenCategoriesQuery();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.allergen_name) {
            newErrors.allergen_name = "Введите имя аллергена";
        }

        if (!formData.allergen_category_name_id) {
            newErrors.allergen_category_name_id = "Выберите категорию";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await addAllergenCategory(formData).unwrap();
            toast.success("Аллерген успешно создан"); // ✅ Показываем успех
            onNext(response.data); // передаем данные о созданном аллергене
        } catch (err) {
            console.error("Ошибка создания аллергена:", err);

            let fieldErrors = {};

            // Парсим структурированные ошибки по полям
            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors);

            // Показываем глобальную ошибку через toast
            toast.error(
                err?.data?.message || "Произошла ошибка при создании аллергена.",
                { position: "top-right", autoClose: 5000 }
            );
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Очистка ошибки при вводе
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-4">
            <h2 className="text-2xl font-bold mb-4">Создать аллерген</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Имя аллергена + Категория */}
                <div className="flex items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Аллерген</label>
                        <input
                            type="text"
                            name="allergen_name"
                            value={formData.allergen_name}
                            onChange={handleChange}
                            className={`w-[280px] px-3 py-2 border rounded-md ${
                                errors.allergen_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите название аллергена"
                            aria-invalid={!!errors.allergen_name}
                        />
                        {errors.allergen_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.allergen_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Тип</label>
                        <select
                            name="allergen_category_name_id"
                            value={formData.allergen_category_name_id}
                            onChange={handleChange}
                            className={`w-[280px] px-3 py-2 border rounded-md ${
                                errors.allergen_category_name_id ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите категорию аллергенов</option>
                            {allergenCategory?.data?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.allergen_category_name}
                                </option>
                            ))}
                        </select>
                        {errors.allergen_category_name_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.allergen_category_name_id}</p>
                        )}
                    </div>
                </div>

                {/* Кнопка отправки */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                    {isLoading ? "Сохраняем..." : "Продолжить"}
                </button>
            </form>
        </div>
    );
};

export default CreateAllergenStep1;