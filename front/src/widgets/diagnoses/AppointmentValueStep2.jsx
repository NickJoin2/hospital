import React, { useState } from "react";
import { toast } from "react-toastify"; // 🔥 Для показа ошибок

import {
    useGetFrequenciesQuery,
} from "../../app/redux/diagnoses/frequencyApi.js";
import { useAddDiagnoseMedicationMutation } from "../../app/redux/patients/patientsApi.js";
import { useGetMedicinesiesNameQuery } from "../../app/redux/drugs/medicineNameApi.js";

const AppointmentValueStep2 = ({ onNext, handleClose }) => {
    const [formData, setFormData] = useState({
        start_date_at: "",
        dosage: "",
        frequency_id: "",
        medicine_name_id: "",
        end_date_at: "",
    });
    const [errors, setErrors] = useState({});
    const [addDiagnoseMedication, { error: addMedicationError, isLoading }] = useAddDiagnoseMedicationMutation();

    const { data: frequencies } = useGetFrequenciesQuery();
    const { data: medicinesName } = useGetMedicinesiesNameQuery();

    const diagnoseId = JSON.parse(localStorage.getItem("diagnose")) || {};

    const validateForm = () => {
        const newErrors = {};
        if (!formData.medicine_name_id) newErrors.medicine_name_id = "Выберите имя препарата";
        if (!formData.start_date_at) newErrors.start_date_at = "Введите начало приема";
        if (!formData.dosage) newErrors.dosage = "Введите дозировку";
        if (!formData.frequency_id) newErrors.frequency_id = "Выберите способ приема";
        if (!formData.end_date_at) newErrors.end_date_at = "Введите окончание приема";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                id: diagnoseId?.id,
                body: formData,
            };
            await addDiagnoseMedication(payload).unwrap();
            toast.success("Лекарство успешно добавлено!");
            onNext();
            handleClose();
        } catch (err) {
            console.error("Ошибка при добавлении лекарства:", err);

            let fieldErrors = {};

            // Если есть структурированные ошибки от сервера
            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors);

            // Показываем общее уведомление об ошибке
            if (err?.data?.message) {
                toast.error(err.data.message);
            } else {
                toast.error("Не удалось сохранить лекарство");
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Очистка ошибки при изменении поля
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-4">
            <h2 className="text-2xl font-bold mb-4">Лекарство</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Лекарство */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Лекарство</label>
                    <select
                        name="medicine_name_id"
                        value={formData.medicine_name_id}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                            errors.medicine_name_id ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-invalid={!!errors.medicine_name_id}
                    >
                        <option disabled value="">Выберите лекарство</option>
                        {medicinesName?.data.map((medicine) => (
                            <option key={medicine.id} value={medicine.id}>
                                {medicine.medicine_name}
                            </option>
                        ))}
                    </select>
                    {errors.medicine_name_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.medicine_name_id}</p>
                    )}
                </div>

                {/* Способ приема */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Способ приема</label>
                    <select
                        name="frequency_id"
                        value={formData.frequency_id}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                            errors.frequency_id ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-invalid={!!errors.frequency_id}
                    >
                        <option disabled value="">Выберите способ приема</option>
                        {frequencies?.data.map((frequency) => (
                            <option key={frequency.id} value={frequency.id}>
                                {frequency.frequencies_name}
                            </option>
                        ))}
                    </select>
                    {errors.frequency_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.frequency_id}</p>
                    )}
                </div>

                {/* Дозировка */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дозировка</label>
                    <input
                        type="text"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                            errors.dosage ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите дозировку"
                        aria-invalid={!!errors.dosage}
                    />
                    {errors.dosage && (
                        <p className="text-red-500 text-sm mt-1">{errors.dosage}</p>
                    )}
                </div>

                {/* Даты начала и окончания */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Начало приема</label>
                        <input
                            type="date"
                            name="start_date_at"
                            value={formData.start_date_at}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                                errors.start_date_at ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.start_date_at && (
                            <p className="text-red-500 text-sm mt-1">{errors.start_date_at}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Окончание приема</label>
                        <input
                            type="date"
                            name="end_date_at"
                            value={formData.end_date_at}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                                errors.end_date_at ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.end_date_at && (
                            <p className="text-red-500 text-sm mt-1">{errors.end_date_at}</p>
                        )}
                    </div>
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
    );
};

export default AppointmentValueStep2;