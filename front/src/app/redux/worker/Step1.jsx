import React, { useState } from 'react';
import { useGetRolesQuery } from '../other/rolesApi.js';
import { useGetDepartmentsQuery } from '../other/departmentsApi.js';
import { useRegisterMutation } from '../auth/authApi.js';
import { toast } from 'react-toastify';
import Spiner from '../../../widgets/other/Spiner.jsx';

const Step1 = ({ setRedirect }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '+7', // начальное значение для форматирования
        department_id: '',
        role_id: '',
    });

    const [errors, setErrors] = useState({});
    const { data: roles, isLoading: isRolesLoading } = useGetRolesQuery();
    const { data: departments, isLoading: isDepartmentsLoading } = useGetDepartmentsQuery();
    const [userRegister, { isLoading: isRegistering }] = useRegisterMutation();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Заполните имя';
        }

        if (!formData.middle_name.trim()) {
            newErrors.middle_name = 'Заполните отчество';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Заполните фамилию';
        }


        if (!formData.department_id) {
            newErrors.department_id = 'Выберите отдел';
        }

        if (!formData.role_id) {
            newErrors.role_id = 'Выберите роль';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Убираем + и все нецифровые символы перед отправкой
            const formattedPhone = formData.phone.replace(/\D/g, '');

            try {
                await userRegister({
                    ...formData,
                    phone: formattedPhone
                }).unwrap();

                toast.success('Сотрудник успешно зарегистрирован');
                setRedirect(true);
            } catch (err) {
                if (err?.data?.errors) {
                    setErrors(err.data.errors);
                } else {
                    toast.error('Ошибка регистрации. Попробуйте позже.');
                }
            }
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        const digits = value.replace(/\D/g, '');
        if (!digits) {
            setFormData(prev => ({ ...prev, phone: '+7' }));
            return;
        }
        let formattedValue = '+7';
        const rest = digits.slice(1);
        if (rest.length >= 1) formattedValue += ` (${rest.slice(0, 3)}`;
        if (rest.length >= 4) formattedValue += `) ${rest.slice(3, 6)}`;
        if (rest.length >= 7) formattedValue += `-${rest.slice(6, 8)}`;
        if (rest.length >= 9) formattedValue += `-${rest.slice(8, 10)}`;
        setFormData(prev => ({ ...prev, phone: formattedValue }));
    };

    // Показываем спиннер при загрузке данных
    if (isRolesLoading || isDepartmentsLoading) {
        return <Spiner />;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Регистрация сотрудника</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Имя и Фамилия */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) =>
                                setFormData({ ...formData, first_name: e.target.value })
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.first_name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите ваше имя"
                            aria-invalid={!!errors.first_name}
                        />
                        {errors.first_name && (
                            <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                        )}
                    </div>

                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                        <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) =>
                                setFormData({ ...formData, last_name: e.target.value })
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.last_name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите вашу фамилию"
                            aria-invalid={!!errors.last_name}
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Отчество и Телефон */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Отчество</label>
                        <input
                            type="text"
                            value={formData.middle_name}
                            onChange={(e) =>
                                setFormData({ ...formData, middle_name: e.target.value })
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.middle_name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите ваше отчество"
                            aria-invalid={!!errors.middle_name}
                        />
                        {errors.middle_name && (
                            <p className="mt-1 text-sm text-red-500">{errors.middle_name}</p>
                        )}
                    </div>

                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Телефон</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите телефон"
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="flex-1 min-w-full">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите ваш email"
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                {/* Роль и Отдел */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Роль</label>
                        <select
                            value={formData.role_id}
                            onChange={(e) =>
                                setFormData({ ...formData, role_id: e.target.value })
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.role_id ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите роль</option>
                            {roles?.data?.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>
                        )}
                    </div>

                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-sm font-medium text-gray-700">Отдел</label>
                        <select
                            value={formData.department_id}
                            onChange={(e) =>
                                setFormData({ ...formData, department_id: e.target.value })
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.department_id ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите отдел</option>
                            {departments?.data?.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <p className="mt-1 text-sm text-red-500">{errors.department_id}</p>
                        )}
                    </div>
                </div>

                {/* Кнопка отправки */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isRegistering}
                >
                    {isRegistering ? 'Регистрация...' : 'Продолжить'}
                </button>
            </form>
        </div>
    );
};

export default Step1;