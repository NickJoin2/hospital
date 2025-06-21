import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAddFrequencyMutation } from '../../app/redux/diagnoses/frequencyApi.js';
import { toast } from 'react-toastify';

const DrugFrequency = ({ onClose }) => {
    const [formData, setFormData] = useState({
        frequencies_name: '',
        frequency_description: '',
    });

    const [errors, setErrors] = useState({});
    const [addFrequency, { isLoading: isAdding }] = useAddFrequencyMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!formData.frequencies_name.trim()) {
            validationErrors.frequencies_name = 'Поле "Частота приема" обязательно для заполнения';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await addFrequency(formData).unwrap();
            toast.success('Частота приема успешно создана');
            setFormData({ frequencies_name: '', frequency_description: '' });
            setErrors({});
            onClose();
        } catch (err) {
            // Если сервер вернул ошибки валидации
            if (err?.data?.errors) {
                setErrors(err.data.errors); // Например: { frequencies_name: ["Такая частота уже существует"] }
            } else {

                console.error('Ошибка:', err);
            }
        }
    };

    return (
        <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close form"
                    onClick={onClose}
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить способ приема</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Поле: Частота приема */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="frequencies_name">
                                Частота приема
                            </label>
                            <input
                                type="text"
                                id="frequencies_name"
                                name="frequencies_name"
                                value={formData.frequencies_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, frequencies_name: e.target.value })
                                }
                                className={`w-full pl-3 pr-3 py-2 border ${
                                    errors.frequencies_name ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Введите частоту"
                                aria-invalid={!!errors.frequencies_name}
                            />
                            {errors.frequencies_name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {Array.isArray(errors.frequencies_name)
                                        ? errors.frequencies_name.join(', ')
                                        : errors.frequencies_name}
                                </p>
                            )}
                        </div>

                        {/* Поле: Описание */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="frequency_description">
                                Описание
                            </label>
                            <textarea
                                id="frequency_description"
                                name="frequency_description"
                                value={formData.frequency_description}
                                onChange={(e) =>
                                    setFormData({ ...formData, frequency_description: e.target.value })
                                }
                                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Введите описание"
                            />
                        </div>

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isAdding}
                        >
                            {isAdding ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DrugFrequency;