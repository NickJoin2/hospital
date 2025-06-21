import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAddWeekdayMutation } from "../../app/redux/schedules/weekdayApi.js";
import { toast } from "react-toastify";

const CreateWeekday = ({ handleButton }) => {
    const [formData, setFormData] = useState({
        day_name: "",
    });

    const [errors, setErrors] = useState({});
    const [addWeekday, { isLoading }] = useAddWeekdayMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.day_name) {
            newErrors.day_name = "Введите день недели";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addWeekday(formData).unwrap();
            toast.success("День недели успешно создан");
            setFormData({ day_name: "" });
            setErrors({});
            handleButton();
        } catch (err) {
            console.error("Ошибка создания дня недели:", err);

            // Если сервер вернул конкретные ошибки по полям
            if (err?.data?.errors) {
                setErrors(err.data.errors); // например: { day_name: 'Такой день уже существует' }
            } else {
                toast.error("Не удалось создать день недели");
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
                <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 animate-fade-in-down">
                    <button
                        onClick={() => handleButton()}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close form"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                    <div className="p-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Создать день недели</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="day_name"
                                    className="block text-gray-700 text-sm font-medium mb-2"
                                >
                                    День недели
                                </label>
                                <input
                                    type="text"
                                    id="day_name"
                                    name="day_name"
                                    value={formData.day_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, day_name: e.target.value })
                                    }
                                    placeholder="Введите название дня недели"
                                    className={`w-full pl-3 pr-3 py-2 border ${
                                        errors.day_name ? "border-red-500" : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    aria-invalid={!!errors.day_name}
                                />
                                {errors.day_name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.day_name}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                            >
                                {isLoading ? "Сохраняем..." : "Сохранить"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateWeekday;