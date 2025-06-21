import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useResetPasswordMutation } from '../app/redux/auth/authApi';
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const NewPassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    // Изменение значения полей
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Валидация формы перед отправкой
    const validateForm = () => {
        const newErrors = {};

        if (!formData.oldPassword.trim()) {
            newErrors.oldPassword = 'Введите текущий пароль';
        }

        if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Пароль должен быть минимум 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await resetPassword(formData).unwrap();
            toast.success('Пароль успешно изменён');
            setTimeout(() => {
                window.location.reload(); // или перенаправление
            }, 1500);
        } catch (err) {
            setErrors({});

            if (err?.data?.errors) {
                setErrors(err.data.errors);
            } else if (err?.data?.message) {
                toast.error(err.data.message);
            } else {
                toast.error('Не удалось изменить пароль. Попробуйте позже.');
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-0">
                <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-6 animate-fade-in-down">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Сменить пароль</h2>

                    {/* Ошибка с API */}
                    {errors.api && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {errors.api}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Текущий пароль */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Текущий пароль</label>
                            <div className="relative mt-1">
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${
                                        errors.oldPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите текущий пароль"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showOldPassword ? "Скрыть пароль" : "Показать пароль"}
                                >
                                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
                            )}
                        </div>

                        {/* Новый пароль */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Новый пароль</label>
                            <div className="relative mt-1">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${
                                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите новый пароль"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showNewPassword ? "Скрыть пароль" : "Показать пароль"}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            {isLoading ? 'Загрузка...' : 'Сменить пароль'}
                        </button>
                    </form>
                </div>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default NewPassword;