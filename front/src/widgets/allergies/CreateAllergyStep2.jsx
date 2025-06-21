import React, { useState } from "react";
import { toast } from "react-toastify"; // ✅ Для уведомлений
import { useGetSeveritiesQuery } from "../../app/redux/drugs/drugReceptionApi.js";
import { useAddAllergyMutation } from "../../app/redux/patients/patientsApi.js";

const CreateAllergyStep2 = ({ formData, setFormData, handleCloseAllergy }) => {
    const [errors, setErrors] = useState({});
    const [addAllergy, { error: addAllergyError, isLoading }] = useAddAllergyMutation();
    const { data: severityData } = useGetSeveritiesQuery();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.reaction) {
            newErrors.reaction = "Введите реакцию";
        }

        if (!formData.date_diagnose_at) {
            newErrors.date_diagnose_at = "Введите дату диагноза";
        }

        if (!formData.severity_id) {
            newErrors.severity_id = "Выберите тяжесть аллергии";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await addAllergy(formData).unwrap();
            toast.success("Аллергия успешно добавлена");
            handleCloseAllergy();
        } catch (err) {
            console.error("Ошибка создания аллергии:", err);

            let fieldErrors = {};

            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Очищаем ошибку при вводе
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-4">
            <h2 className="text-2xl font-bold mb-4">Создать аллергию</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Дата диагноза + Тяжесть */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-full md:w-auto flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="date_diagnose_at">
                            Дата
                        </label>
                        <input
                            type="date"
                            id="date_diagnose_at"
                            name="date_diagnose_at"
                            value={formData.date_diagnose_at}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.date_diagnose_at ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.date_diagnose_at && (
                            <p className="text-red-500 text-sm mt-1">{errors.date_diagnose_at}</p>
                        )}
                    </div>

                    <div className="w-full md:w-auto flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Тяжесть</label>
                        <select
                            name="severity_id"
                            value={formData.severity_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.severity_id ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите тяжесть</option>
                            {severityData?.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.severity_name}
                                </option>
                            ))}
                        </select>
                        {errors.severity_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.severity_id}</p>
                        )}
                    </div>
                </div>

                {/* Реакция */}
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="reaction">
                        Реакция
                    </label>
                    <textarea
                        id="reaction"
                        name="reaction"
                        value={formData.reaction}
                        onChange={handleChange}
                        rows={3}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                            errors.reaction ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Описание реакции"
                    />
                    {errors.reaction && (
                        <p className="text-red-500 text-sm mt-1">{errors.reaction}</p>
                    )}
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

export default CreateAllergyStep2;