import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAddMedicinesMutation } from '../../app/redux/drugs/medicineNameApi.js';
import { toast } from 'react-toastify';

const CreateDrugName = ({ onClose }) => {
    const [formData, setFormData] = useState({
        medicine_name: '',
    });

    const [errors, setErrors] = useState({});
    const [addMedicineName, { isLoading: isAdding }] = useAddMedicinesMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        // Локальная валидация
        if (!formData.medicine_name.trim()) {
            validationErrors.medicine_name = 'Название лекарства не может быть пустым';
        } else if (formData.medicine_name.trim().length < 3) {
            validationErrors.medicine_name = 'Название должно содержать минимум 3 символа';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await addMedicineName(formData).unwrap();
            toast.success('Лекарство успешно создано');
            setFormData({ medicine_name: '' });
            setErrors({});
            onClose();
        } catch (err) {
            // Если сервер вернул ошибки валидации
            if (err?.data?.errors) {
                setErrors(err.data.errors); // Например: { medicine_name: ["Такое название уже существует"] }
            } else {
                toast.error('Ошибка при создании лекарства');
            }
        }
    };

    return (
        <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Закрыть форму"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Создать лекарство</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Поле: Название лекарства */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="medicine_name">
                                Название лекарства
                            </label>
                            <input
                                type="text"
                                id="medicine_name"
                                name="medicine_name"
                                value={formData.medicine_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, medicine_name: e.target.value })
                                }
                                className={`w-full pl-3 pr-3 py-2 border ${
                                    errors.medicine_name ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Введите название лекарства"
                                aria-invalid={!!errors.medicine_name}
                            />
                            {errors.medicine_name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {Array.isArray(errors.medicine_name)
                                        ? errors.medicine_name.join(', ')
                                        : errors.medicine_name}
                                </p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isAdding}
                        >
                            {isAdding ? 'Сохранение...' : 'Создать'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDrugName;