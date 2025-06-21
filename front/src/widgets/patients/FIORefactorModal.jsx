import React, { useState, useEffect } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import {toast} from "react-toastify";
import {useUpdatePatientFioMutation} from "../../app/redux/patients/patientsApi.js";

const FIORefactorModal = ({ onClose, patient }) => {
    const [updateFioPatient, { isLoading }] = useUpdatePatientFioMutation();

    // Инициализация данных
    const initialData = {
        first_name: patient?.first_name || "",
        last_name: patient?.last_name || "",
        middle_name: patient?.middle_name || "",
    };

    const [localFormData, setLocalFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    // При обновлении пациента — обновляем форму
    useEffect(() => {
        if (patient) {
            setLocalFormData({
                first_name: patient.first_name || "",
                last_name: patient.last_name || "",
                middle_name: patient.middle_name || "",
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!localFormData.first_name.trim()) newErrors.first_name = "Имя обязательно";
        if (!localFormData.last_name.trim()) newErrors.last_name = "Фамилия обязательна";
        if (!localFormData.middle_name.trim()) newErrors.middle_name = "Отчество обязательно";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await updateFioPatient({
                id: patient.id,
                body: {
                    first_name: localFormData.first_name.trim(),
                    last_name: localFormData.last_name.trim(),
                    middle_name: localFormData.middle_name.trim(),
                },
            }).unwrap();
            onClose();
            toast.success("Данные успешно обновлены");

        } catch (err) {
            console.error("Ошибка при обновлении ФИО:", err);

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl animate-fade-in-down">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Закрыть"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-6">Редактировать ФИО</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Имя */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            name="first_name"
                            value={localFormData.first_name}
                            onChange={handleChange}
                            placeholder="Введите имя"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.first_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                        )}
                    </div>
                    {/* Отчество */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                        <input
                            type="text"
                            name="middle_name"
                            value={localFormData.middle_name}
                            onChange={handleChange}
                            placeholder="Введите отчество"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.middle_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.middle_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.middle_name}</p>
                        )}
                    </div>
                    {/* Фамилия */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Отчество</label>
                        <input
                            type="text"
                            name="last_name"
                            value={localFormData.last_name}
                            onChange={handleChange}
                            placeholder="Введите фамилию"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.last_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                        )}
                    </div>




                    {/* Кнопка отправки */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                        >
                            {isLoading ? "Сохраняем..." : "Сохранить изменения"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FIORefactorModal;