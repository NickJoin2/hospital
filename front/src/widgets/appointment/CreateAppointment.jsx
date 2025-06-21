import React, { useEffect, useState } from "react";
import { useGetWorkersQuery } from "../../app/redux/worker/workersApi.js";
import { useGetAppointmentStatusesQuery } from "../../app/redux/appointment/appointmentStatus.js";
import { useAddAppointmentMutation } from "../../app/redux/appointment/apointmentsApi.js";
import { useGetPatientsQuery } from "../../app/redux/patients/patientsApi.js";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify"; // ✅ Для уведомлений

const CreateAppointment = ({ handleClose, patientId, onAppointmentCreated }) => {
    const [formData, setFormData] = useState({
        patient_id: "",
        doctor_id: "",
        appointment_date_at: "",
        appointment_time_at: "",
    });

    const [errors, setErrors] = useState({});
    const [addAppointment, { isLoading, error: addAppointmentError }] = useAddAppointmentMutation();

    const { data: doctors } = useGetWorkersQuery();
    const { data: statuses } = useGetAppointmentStatusesQuery();
    const { data: patients = [] } = useGetPatientsQuery();

    useEffect(() => {
        if (patientId) {
            setFormData((prev) => ({
                ...prev,
                patient_id: patientId,
            }));
        }
    }, [patientId]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.patient_id) newErrors.patient_id = "Выберите пациента";
        if (!formData.doctor_id) newErrors.doctor_id = "Выберите врача";
        if (!formData.appointment_date_at) newErrors.appointment_date_at = "Введите дату";
        if (!formData.appointment_time_at) newErrors.appointment_time_at = "Введите время";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTimeValidation = () => {
        const appointmentTime = formData.appointment_time_at;
        if (!appointmentTime) {
            setErrors((prev) => ({
                ...prev,
                appointment_time_at: "Введите время",
            }));
            return false;
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm format
        if (!timeRegex.test(appointmentTime)) {
            setErrors((prev) => ({
                ...prev,
                appointment_time_at: "Неверный формат времени. Используйте HH:mm",
            }));
            return false;
        }

        const [hours] = appointmentTime.split(":").map(Number);
        if (hours < 8 || hours > 18) {
            setErrors((prev) => ({
                ...prev,
                appointment_time_at: "Время приема должно быть между 08:00 и 19:00",
            }));
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Очищаем ошибку при вводе
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleTimeValidation()) return;
        if (!validateForm()) return;

        try {
            const response = await addAppointment(formData).unwrap();
            toast.success("Запись успешно создана");
            setFormData({
                patient_id: patientId,
                doctor_id: "",
                appointment_date_at: "",
                appointment_time_at: "",
            });
            handleClose();
            onAppointmentCreated?.(response.data);
        } catch (err) {
            console.error("Ошибка создания записи:", err);

            let fieldErrors = {};

            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors);

            toast.error(
                err?.data?.message || "Произошла ошибка при создании записи",
                { position: "top-right", autoClose: 5000 }
            );
        }
    };

    const selectedPatient = patients.find(p => p.id === Number(patientId));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6">
            <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down">
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Закрыть форму"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6">Создать запись</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Пациент */}
                    {!patientId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Пациент</label>
                            <select
                                name="patient_id"
                                value={formData.patient_id}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.patient_id ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option disabled value="">Выберите пациента</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.last_name} {patient.first_name} {patient.middle_name}
                                    </option>
                                ))}
                            </select>
                            {errors.patient_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.patient_id}</p>
                            )}
                        </div>
                    )}

                    {patientId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Пациент</label>
                            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                                {selectedPatient?.last_name || ""}{" "}
                                {selectedPatient?.first_name || ""}{" "}
                                {selectedPatient?.middle_name || ""}
                            </p>
                        </div>
                    )}

                    {/* Врач */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Врач</label>
                        <select
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.doctor_id ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите врача</option>
                            {doctors?.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.role.role_name} — {doctor.last_name} {doctor.first_name[0]}. {doctor.middle_name[0]}.
                                </option>
                            ))}
                        </select>
                        {errors.doctor_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.doctor_id}</p>
                        )}
                    </div>

                    {/* Дата + Время */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Дата</label>
                            <input
                                type="date"
                                name="appointment_date_at"
                                value={formData.appointment_date_at}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.appointment_date_at ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.appointment_date_at && (
                                <p className="text-red-500 text-sm mt-1">{errors.appointment_date_at}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Время</label>
                            <input
                                type="time"
                                name="appointment_time_at"
                                min="08:00"
                                max="19:00"
                                value={formData.appointment_time_at}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                    errors.appointment_time_at ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.appointment_time_at && (
                                <p className="text-red-500 text-sm mt-1">{errors.appointment_time_at}</p>
                            )}
                        </div>
                    </div>

                    {/* Кнопка отправки */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                        >
                            {isLoading ? "Сохраняем..." : "Сохранить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointment;