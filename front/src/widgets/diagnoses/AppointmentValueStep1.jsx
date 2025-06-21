import React, { useEffect, useState } from "react";
import { useAddDiagnoseMutation } from "../../app/redux/diagnoses/diagnoseApi.js";
import { toast } from "react-toastify"; // 🔥 Для показа ошибок

const AppointmentValueStep1 = ({ onNext, diagnoseId }) => {
    const [formData, setFormData] = useState({
        diagnose_name: "",
        diagnose_description: "",
        appointment_id: diagnoseId,
    });

    const [errors, setErrors] = useState({});
    const [addDiagnose, { isLoading, error: addDiagnoseError }] = useAddDiagnoseMutation();

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            appointment_id: diagnoseId,
        }));
    }, [diagnoseId]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.diagnose_name)
            newErrors.diagnose_name = "Введите диагноз";

        if (!formData.diagnose_description)
            newErrors.diagnose_description = "Заполните описание";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                ...formData,
                appointment_id: diagnoseId,
            };

            const response = await addDiagnose(payload).unwrap();
            localStorage.setItem("diagnose", JSON.stringify(response.data));
            onNext();
        } catch (err) {
            console.error("Ошибка добавления диагноза:", err);

            let fieldErrors = {};

            // Парсим структурированные ошибки
            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors);

            // Показываем общее уведомление
            toast.error(
                err?.data?.message || "Произошла ошибка при добавлении диагноза",
                { position: "top-right", autoClose: 5000 }
            );
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-4">
            <h2 className="text-2xl font-bold mb-4">Поставить диагноз</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Диагноз */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Диагноз</label>
                    <textarea
                        name="diagnose_name"
                        value={formData.diagnose_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.diagnose_name ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите диагноз"
                        aria-invalid={!!errors.diagnose_name}
                    />
                    {errors.diagnose_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.diagnose_name}</p>
                    )}
                </div>

                {/* Описание */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Описание</label>
                    <textarea
                        name="diagnose_description"
                        value={formData.diagnose_description}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.diagnose_description ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите описание"
                        aria-invalid={!!errors.diagnose_description}
                    />
                    {errors.diagnose_description && (
                        <p className="text-red-500 text-sm mt-1">{errors.diagnose_description}</p>
                    )}
                </div>

                {/* Кнопка продолжить */}
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

export default AppointmentValueStep1;