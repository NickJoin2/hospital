import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useGetWeekdaysQuery } from "../app/redux/schedules/weekdayApi";
import { useGetWorkersQuery } from "../app/redux/worker/workersApi";
import { useAddScheduleMutation } from "../app/redux/schedules/schedulesApi";
import { toast } from "react-toastify";

const SchedulesCreate = ({ onClose }) => {
    const [formData, setFormData] = useState({
        start_time_at: "",
        end_time_at: "",
        day_id: "",
        room: "",
        doctor_id: "",
    });

    const [errors, setErrors] = useState({});
    const { data: dayData } = useGetWeekdaysQuery();
    const { data: doctorData } = useGetWorkersQuery();
    const [addSchedule, {isLoading}] = useAddScheduleMutation();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.start_time_at) newErrors.start_time_at = "Введите время начала";
        if (!formData.end_time_at) newErrors.end_time_at = "Введите время окончания";
        if (!formData.day_id) newErrors.day_id = "Выберите день недели";
        if (!formData.room) newErrors.room = "Введите номер кабинета";
        if (!formData.doctor_id) newErrors.doctor_id = "Выберите врача";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await addSchedule(formData).unwrap();
                toast.success("Запись добавлена");
                onClose();
            } catch (err) {
                setErrors(err.data?.errors || {});
                console.error("Ошибка при добавлении расписания:", err);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Добавить запись</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Закрыть"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Время работы */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Начало смены</label>
                            <input
                                type="time"
                                value={formData.start_time_at}
                                onChange={(e) =>
                                    setFormData({ ...formData, start_time_at: e.target.value })
                                }
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.start_time_at ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.start_time_at && (
                                <p className="mt-1 text-sm text-red-500">{errors.start_time_at}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Окончание смены</label>
                            <input
                                type="time"
                                value={formData.end_time_at}
                                onChange={(e) =>
                                    setFormData({ ...formData, end_time_at: e.target.value })
                                }
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.end_time_at ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.end_time_at && (
                                <p className="mt-1 text-sm text-red-500">{errors.end_time_at}</p>
                            )}
                        </div>
                    </div>

                    {/* Кабинет */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Номер кабинета</label>
                        <input
                            type="number"
                            value={formData.room}
                            onChange={(e) =>
                                setFormData({ ...formData, room: e.target.value })
                            }
                            placeholder="Введите номер кабинета"
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.room ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.room && <p className="mt-1 text-sm text-red-500">{errors.room}</p>}
                    </div>

                    {/* День недели и врач */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">День недели</label>
                            <select
                                value={formData.day_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, day_id: e.target.value })
                                }
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.day_id ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Выберите день недели</option>
                                {dayData?.data?.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {day.day_name}
                                    </option>
                                ))}
                            </select>
                            {errors.day_id && <p className="mt-1 text-sm text-red-500">{errors.day_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Врач</label>
                            <select
                                value={formData.doctor_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, doctor_id: e.target.value })
                                }
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.doctor_id ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Выберите врача</option>
                                {doctorData?.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.middle_name} {doctor.first_name[0] || ""}. {doctor.last_name[0] || ""}
                                    </option>
                                ))}
                            </select>
                            {errors.doctor_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.doctor_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
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

export default SchedulesCreate;