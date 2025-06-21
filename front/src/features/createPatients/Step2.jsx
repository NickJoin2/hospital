import React, { useEffect, useState } from "react";
import {useAddPatientPasswordMutation} from "../../app/redux/patients/patientPasswordApi.js";



const CreatePatient2 = ({ patientId, onNext, errors: parentErrors, setErrors }) => {
    const [addPatientNumber] = useAddPatientPasswordMutation();
    const [formData, setFormData] = useState({
        series: "",
        number: "",
        issued: "",
    });

    // Записываем patient_id из localStorage (если есть)
    useEffect(() => {
        try {
            const userString = localStorage.getItem("patient");
            if (userString) {
                const patient = JSON.parse(userString);
                setFormData((prev) => ({ ...prev, patient_id: patient }));
            }
        } catch (e) {
            console.error("Ошибка при чтении данных пациента:", e);
        }
    }, []);

    // Функция валидации формы
    const validateForm = () => {
        const newErrors = {};

        const series = formData.series?.trim() || "";
        const number = formData.number?.trim() || "";

        if (series.length < 4) newErrors.series = "Серия должна содержать 4 символа";
        if (number.length < 6) newErrors.number = "Номер должен содержать 6 цифр";
        if (!formData.issued) newErrors.issued = "Введите дату выдачи";

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
            await addPatientNumber(dataToSend).unwrap();
            onNext();
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            setErrors(err?.data?.errors || { general: "Ошибка сервера" });
        }
    };

    const handleSeriesChange = (e) => {
        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4);
        setFormData((prev) => ({ ...prev, series: value }));
    };

    const handleNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setFormData((prev) => ({ ...prev, number: value }));
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Данные паспорта</h2>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Серия и Номер */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Серия</label>
                        <input
                            type="text"
                            value={formData.series}
                            onChange={handleSeriesChange}
                            maxLength={4}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                parentErrors?.series ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Серия (4 символа)"
                            aria-invalid={!!parentErrors?.series}
                        />
                        {parentErrors?.series && (
                            <p className="text-red-500 text-sm mt-1">{parentErrors.series}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Номер</label>
                        <input
                            type="text"
                            value={formData.number}
                            onChange={handleNumberChange}
                            maxLength={6}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                parentErrors?.number ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Номер (6 цифр)"
                            aria-invalid={!!parentErrors?.number}
                        />
                        {parentErrors?.number && (
                            <p className="text-red-500 text-sm mt-1">{parentErrors.number}</p>
                        )}
                    </div>
                </div>

                {/* Дата выдачи */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата выдачи</label>
                    <input
                        type="date"
                        value={formData.issued}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, issued: e.target.value }))
                        }
                        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                            parentErrors?.issued ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-invalid={!!parentErrors?.issued}
                    />
                    {parentErrors?.issued && (
                        <p className="text-red-500 text-sm mt-1">{parentErrors.issued}</p>
                    )}
                </div>

                {/* Кнопка отправки */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Продолжить
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreatePatient2;