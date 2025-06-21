import React, { useState } from "react";
import {useAddPatientInsuranceMutation} from "../../app/redux/patients/patientInsurancesApi.js";



const CreatePatient3 = ({ patientId, onComplete }) => {
    const [errors, setErrors] = useState({});
    const [addPatientInsurance] = useAddPatientInsuranceMutation();

    const [formData, setFormData] = useState({
        insurance_number: "",
        company: "",
        date_end_at: "",
    });

    const handleChange = (field) => (e) => {
        let value = e.target.value;

        if (field === "insurance_number") {
            value = value.replace(/\D/g, "").slice(0, 16);
        }

        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        const insuranceNumber = formData.insurance_number;

        if (!insuranceNumber) {
            newErrors.insurance_number = "Заполните номер страховки";
        } else if (insuranceNumber.length < 16) {
            newErrors.insurance_number = "Номер страховки должен содержать 16 цифр";
        }

        if (!formData.company) {
            newErrors.company = "Заполните компанию страховщика";
        }

        if (!formData.date_end_at) {
            newErrors.date_end_at = "Укажите дату окончания страховки";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const dataToSend = {
            ...formData,
            patient_id: patientId,
        };

        try {
            await addPatientInsurance(dataToSend).unwrap();
            onComplete(); // Переход к следующему шагу или завершение
        } catch (err) {
            console.error("Ошибка регистрации страховки:", err);
            setErrors(err?.data?.errors || { general: "Ошибка сервера" });
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Страхование</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Номер страховки</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.insurance_number}
                            onChange={handleChange("insurance_number")}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.insurance_number ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите 16 цифр"
                            aria-invalid={!!errors.insurance_number}
                        />
                        {errors.insurance_number && (
                            <p className="text-red-500 text-sm mt-1">{errors.insurance_number}</p>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Компания</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={handleChange("company")}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.company ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите компанию"
                            aria-invalid={!!errors.company}
                        />
                        {errors.company && (
                            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата окончания страховки</label>
                    <input
                        type="date"
                        value={formData.date_end_at}
                        onChange={handleChange("date_end_at")}
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.date_end_at ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-invalid={!!errors.date_end_at}
                    />
                    {errors.date_end_at && (
                        <p className="text-red-500 text-sm mt-1">{errors.date_end_at}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Завершить
                </button>
            </form>
        </>
    );
};

export default CreatePatient3;