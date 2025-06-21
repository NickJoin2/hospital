import React, {useEffect, useState} from "react";

import { toast } from "react-toastify";
import {useAddPatientInsuranceMutation} from "../../app/redux/patients/patientsApi.js";

const PatientInsuranceCreate = ({ patientId, onSuccess }) => {
    const [formData, setFormData] = useState({
        insurance_number: "",
        company: "",
        date_end_at: "",
    });

    const [errors, setErrors] = useState({});
    const [addInsurance, {error: addInsuranceError, isLoading}] = useAddPatientInsuranceMutation();


    const handleChange = (field) => (e) => {
        let value = e.target.value;

        if (field === "insurance_number") {
            value = value.replace(/\D/g, "").slice(0, 16);
        }

        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.insurance_number) {
            newErrors.insurance_number = "Заполните номер страховки";
        } else if (formData.insurance_number.length < 16) {
            newErrors.insurance_number = "Номер должен содержать 16 цифр";
        }

        if (!formData.company) {
            newErrors.company = "Введите компанию страховщика";
        }

        if (!formData.date_end_at) {
            newErrors.date_end_at = "Укажите дату окончания";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await addInsurance({
                ...formData,
                patient_id: patientId,
            }).unwrap();
            toast.success("Страховка успешно добавлена");
            onSuccess(); // Обновляем данные профиля
        } catch (err) {
            console.error("Ошибка добавления страховки:", err);
            setErrors(err?.data?.errors || { general: "Ошибка сервера" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Добавить страховку</h2>

            <div className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Номер страховки</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.insurance_number}
                        onChange={handleChange("insurance_number")}
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.insurance_number ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="16 цифр"
                    />
                    {errors.insurance_number && (
                        <p className="text-red-500 text-sm mt-1">{errors.insurance_number}</p>
                    )}

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Компания</label>
                    <input
                        type="text"
                        value={formData.company}
                        onChange={handleChange("company")}
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.company ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Введите название компании"
                    />
                    {errors.company && (
                        <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                    )}

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата окончания</label>
                    <input
                        type="date"
                        value={formData.date_end_at}
                        onChange={handleChange("date_end_at")}
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.date_end_at ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.date_end_at && (
                        <p className="text-red-500 text-sm mt-1">{errors.date_end_at}</p>
                    )}

                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Сохраняем...' : 'Сохранить'}
                </button>
            </div>
        </form>
    );
};

export default PatientInsuranceCreate;