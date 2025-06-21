import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

import { useLoginMutation } from "../app/redux/auth/authApi.js";
import { AuthContext } from "../app/hoc/AuthContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
    // 1. Состояния
    const [formData, setFormData] = useState({ verify: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // 2. Хуки
    const [login,] = useLoginMutation();
    const { setAuthTokens } = useContext(AuthContext);

    // 3. Вспомогательные функции
    const validateForm = () => {
        const newErrors = {};
        if (!formData.verify.trim()) newErrors.verify = "Введите email или телефон";
        if (!formData.password.trim()) newErrors.password = "Введите пароль";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 4. Логика обработки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await login(formData).unwrap();

            setAuthTokens(
                response.data.access_token,
                response.data.refresh_token,
                response.data.user.role
            );

        } catch (err) {
            if (err.status === 403) {
                toast.warn("Подтвердите email");
            } else if (err.status === 400 || err.status === 422) {
                if (err.data?.errors) {
                    setErrors(err.data.errors);
                    toast.error("Исправьте ошибки в форме");
                } else {
                    const message = err.data?.message || "Ошибка валидации";
                    toast.error(message);
                }
            } else if (err.status === 401) {
                if (err.data?.errors) {
                    setErrors(err.data.errors);
                    toast.error(err.data.message || "Неверный логин или пароль");
                } else {
                    toast.error("Неверный логин или пароль");
                }
            } else {
                const message = err.data?.message || "Ошибка сервера";
                toast.error(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. JSX
    return (
        <>
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

            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Вход</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="verify">
                                    Email или телефон
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="verify"
                                        name="verify"
                                        value={formData.verify}
                                        onChange={(e) => setFormData({ ...formData, verify: e.target.value })}
                                        className={`w-full pl-10 pr-3 py-2 border ${errors.verify ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Введите ваш email или телефон"
                                        aria-invalid={!!errors.verify}
                                    />
                                </div>
                                {errors.verify && (
                                    <p className="mt-1 text-sm text-red-500">{errors.verify}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={`w-full pr-10 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} ps-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Введите ваш пароль"
                                        aria-invalid={!!errors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Входим..." : "Войти"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;