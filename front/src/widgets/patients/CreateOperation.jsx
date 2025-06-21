import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify"; // ✅ Для уведомлений
import { useAddOperationMutation } from "../../app/redux/patients/patientsApi.js";
import { useGetAnesthesiaTypesQuery } from "../../app/redux/operations/anesthesiaTypeApi.js";
import { useGetOperationTypesQuery } from "../../app/redux/operations/operationTypeApi.js";

const CreateOperation = ({ patientId, handleClose }) => {
    const [formData, setFormData] = useState({
        operation_date_at: "",
        patient_id: "",
        operation_type_id: "",
        anesthesia_type_id: "",
        complication: "",
        post_op_care: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [addOperation, { isLoading, error: addOperationError }] = useAddOperationMutation();

    const { data: anesthesia_types } = useGetAnesthesiaTypesQuery();
    const { data: operation_types } = useGetOperationTypesQuery();

    useEffect(() => {
        if (patientId) {
            setFormData((prev) => ({ ...prev, patient_id: patientId }));
        }
    }, [patientId]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.anesthesia_type_id)
            newErrors.anesthesia_type_id = "Выберите тип анестезии";
        if (!formData.operation_type_id)
            newErrors.operation_type_id = "Выберите тип операции";
        if (!formData.operation_date_at)
            newErrors.operation_date_at = "Заполните дату операции";
        if (!formData.complication)
            newErrors.complication = "Введите осложнения";
        if (!formData.post_op_care)
            newErrors.post_op_care = "Введите послеоперационный уход";
        if (!formData.notes)
            newErrors.notes = "Заполните примечания";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await addOperation(formData).unwrap();
            toast.success("Операция успешно добавлена");
            handleClose();

            // Очистка формы
            setFormData({
                operation_date_at: "",
                patient_id: "",
                operation_type_id: "",
                anesthesia_type_id: "",
                complication: "",
                post_op_care: "",
                notes: "",
            });
            setErrors({});

        } catch (err) {
            console.error("Ошибка создания операции:", err);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-6">
            <div
                className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Кнопка закрытия */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Закрыть форму"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6">Операции пациента</h2>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Анестезия + Тип операции */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Анестезия */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Анестезия</label>
                            <select
                                name="anesthesia_type_id"
                                value={formData.anesthesia_type_id}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.anesthesia_type_id ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option disabled value="">Выберите тип анестезии</option>
                                {anesthesia_types?.data.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.anesthesia_name}
                                    </option>
                                ))}
                            </select>
                            {errors.anesthesia_type_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.anesthesia_type_id}</p>
                            )}
                        </div>

                        {/* Тип операции */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Операция</label>
                            <select
                                name="operation_type_id"
                                value={formData.operation_type_id}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.operation_type_id ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option disabled value="">Выберите тип операции</option>
                                {operation_types?.data.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.operation_type_name}
                                    </option>
                                ))}
                            </select>
                            {errors.operation_type_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.operation_type_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Дата операции + Осложнения */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Дата проведения</label>
                            <input
                                type="date"
                                name="operation_date_at"
                                value={formData.operation_date_at}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.operation_date_at ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.operation_date_at && (
                                <p className="text-red-500 text-sm mt-1">{errors.operation_date_at}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Осложнения</label>
                            <input
                                type="text"
                                name="complication"
                                value={formData.complication}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.complication ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Введите осложнения"
                            />
                            {errors.complication && (
                                <p className="text-red-500 text-sm mt-1">{errors.complication}</p>
                            )}
                        </div>
                    </div>

                    {/* Послеоперационный уход */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Послеоперационный уход</label>
                        <textarea
                            name="post_op_care"
                            value={formData.post_op_care}
                            onChange={handleChange}
                            rows={3}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.post_op_care ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите послеоперационный уход"
                        />
                        {errors.post_op_care && (
                            <p className="text-red-500 text-sm mt-1">{errors.post_op_care}</p>
                        )}
                    </div>

                    {/* Примечания */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Примечания</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.notes ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите примечания"
                        />
                        {errors.notes && (
                            <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                        )}
                    </div>

                    {/* Кнопка отправки */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                        >
                            {isLoading ? "Сохраняем..." : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOperation;