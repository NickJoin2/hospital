import React, { useState } from "react";

import { Navigate } from "react-router-dom";

const Operation = () => {

    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone: "",
        department_id: "",
        role_id: "",
    });
    const [errors, setErrors] = useState({});
    const [redirect, setRedirect] = useState(false);

    const { data: roles } = useGetRolesQuery();
    const { data: departments } = useGetDepartmentsQuery();
    const [userRegister, { isLoading }] = useRegisterMutation();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Неверный email";
        }
        if (!formData.first_name) {
            newErrors.first_name = "Заполните имя";
        }
        if (!formData.middle_name) {
            newErrors.middle_name = "Заполните отчество";
        }
        if (!formData.last_name) {
            newErrors.last_name = "Заполните фамилию";
        }
        if (!formData.phone) {
            newErrors.phone = "Заполните телефон";
        }
        if (!formData.department_id) {
            newErrors.department_id = "Выберите отдел";
        }
        if (!formData.role_id) {
            newErrors.role_id = "Выберите роль";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await userRegister(formData).unwrap();
                localStorage.setItem("user", JSON.stringify(response));
                setRedirect(true);
                onNext(); // Переход к следующему шагу
            } catch (err) {
                console.error("Ошибка регистрации:", err);
            }
        }
    };

    return (
        <>
            {redirect && <Navigate to="/success" />}
            <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Имя */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) =>
                                setFormData({ ...formData, first_name: e.target.value })
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.first_name ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите ваше имя"
                            aria-invalid={!!errors.first_name}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm">{errors.first_name}</p>
                        )}
                    </div>

                    {/* Фамилия */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                        <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) =>
                                setFormData({ ...formData, last_name: e.target.value })
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.last_name ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите вашу фамилию"
                            aria-invalid={!!errors.last_name}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Отчество */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Отчество</label>
                        <input
                            type="text"
                            value={formData.middle_name}
                            onChange={(e) =>
                                setFormData({ ...formData, middle_name: e.target.value })
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.middle_name ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите ваше отчество"
                            aria-invalid={!!errors.middle_name}
                        />
                        {errors.middle_name && (
                            <p className="text-red-500 text-sm">{errors.middle_name}</p>
                        )}
                    </div>

                    {/* Телефон */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Телефон</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.phone ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите ваш телефон"
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                    </div>

                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите ваш email"
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                {/* Роль */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Роль</label>
                        <select
                            value={formData.role_id}
                            onChange={(e) =>
                                setFormData({ ...formData, role_id: e.target.value })
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.role_id ? "border-red-500" : "border-gray-300"
                            } ps-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите роль</option>
                            {roles?.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="text-red-500 text-sm">{errors.role_id}</p>
                        )}
                    </div>

                    {/* Отдел */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Отдел</label>
                        <select
                            value={formData.department_id}
                            onChange={(e) =>
                                setFormData({ ...formData, department_id: e.target.value })
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.department_id ? "border-red-500" : "border-gray-300"
                            } ps-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите отдел</option>
                            {departments?.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <p className="text-red-500 text-sm">{errors.department_id}</p>
                        )}
                    </div>
                </div>

                {/* Кнопка продолжения */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Продолжить
                </button>
            </form>
        </>
    );
};

export default Operation;