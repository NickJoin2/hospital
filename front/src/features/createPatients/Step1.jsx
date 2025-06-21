import { useAddPatientMutation } from "../../app/redux/patients/patientsApi.js";
import {useState} from "react";

const CreatePatient1 = ({ onNext, errors, setErrors }) => {
    const [localFormData, setLocalFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        birth_date: "",
        phone: "+7",
        is_gender: null,
        patient_id: "",
    });

    const [addPatient] = useAddPatientMutation();

    const validateForm = () => {
        const newErrors = {};

        if (!localFormData.first_name) newErrors.first_name = "Заполните имя";
        if (!localFormData.middle_name) newErrors.middle_name = "Заполните фамилию";
        if (!localFormData.last_name) newErrors.last_name = "Заполните отчество";
        if (!localFormData.birth_date) newErrors.birth_date = "Укажите дату рождения";

        // Валидация телефона
        const phoneDigits = localFormData.phone.replace(/\D/g, "");
        if (phoneDigits.length !== 11) {
            newErrors.phone = "Телефон должен содержать 11 цифр";
        }

        if (localFormData.is_gender === null) newErrors.is_gender = "Выберите пол";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleGenderChange = (value) => {
        setLocalFormData((prev) => ({ ...prev, is_gender: value === "male" }));
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;

        // Всегда начинаем с +7
        if (!value.startsWith("+7")) {
            value = "+7";
        }

        // Удаляем всё, кроме цифр
        const digits = value.replace(/\D/g, "").slice(1); // убираем "7" из начала

        // Ограничиваем количество цифр (максимум 10 после +7)
        const maxDigits = digits.slice(0, 10);

        let formattedValue = "+7";

        if (maxDigits.length > 0) {
            formattedValue += ` (${maxDigits.slice(0, 3)}`;
        }
        if (maxDigits.length > 3) {
            formattedValue += `) ${maxDigits.slice(3, 6)}`;
        }
        if (maxDigits.length > 6) {
            formattedValue += `-${maxDigits.slice(6, 8)}`;
        }
        if (maxDigits.length > 8) {
            formattedValue += `-${maxDigits.slice(8, 10)}`;
        }

        setLocalFormData((prev) => ({ ...prev, phone: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const payload = {
                    first_name: localFormData.first_name,
                    middle_name: localFormData.middle_name,
                    last_name: localFormData.last_name,
                    birth_date: localFormData.birth_date,
                    phone: localFormData.phone.replace(/\D/g, ""),
                    is_gender: localFormData.is_gender ? 1 : 0,
                };

                const response = await addPatient(payload).unwrap();
                localStorage.setItem("patient", JSON.stringify(response.data.id));
                onNext(response.data.id);
            } catch (err) {
                console.error("Ошибка регистрации:", err);
                setErrors(err?.data?.errors || { general: "Ошибка при отправке данных" });
            }
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Регистрация пациента</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Имя и Фамилия */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Имя</label>
                        <input
                            type="text"
                            value={localFormData.first_name}
                            onChange={(e) =>
                                setLocalFormData((prev) => ({
                                    ...prev,
                                    first_name: e.target.value,
                                }))
                            }
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.first_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите имя"
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                        <input
                            type="text"
                            value={localFormData.middle_name}
                            onChange={(e) =>
                                setLocalFormData((prev) => ({
                                    ...prev,
                                    middle_name: e.target.value,
                                }))
                            }
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.middle_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите фамилию"
                        />
                        {errors.middle_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.middle_name}</p>
                        )}
                    </div>
                </div>

                {/* Отчество и Телефон */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Отчество</label>
                        <input
                            type="text"
                            value={localFormData.last_name}
                            onChange={(e) =>
                                setLocalFormData((prev) => ({
                                    ...prev,
                                    last_name: e.target.value,
                                }))
                            }
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.last_name ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Введите отчество"
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Телефон</label>
                        <input
                            type="tel"
                            value={localFormData.phone}
                            onChange={handlePhoneChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.phone ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="+7 (XXX) XXX-XX-XX"
                            maxLength="18" // Для формата "+7 (XXX) XXX-XX-XX"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Дата рождения */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
                    <input
                        type="date"
                        value={localFormData.birth_date}
                        onChange={(e) =>
                            setLocalFormData((prev) => ({ ...prev, birth_date: e.target.value }))
                        }
                        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                            errors.birth_date ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.birth_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
                    )}
                </div>

                {/* Пол */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
                    <div className="flex items-center gap-6">
                        <label className="inline-flex items-center">
                            <input
                                key="male"
                                type="radio"
                                name="gender"
                                checked={localFormData.is_gender === true}
                                onChange={() => handleGenderChange("male")}
                                className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Мужской</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                key="female"
                                type="radio"
                                name="gender"
                                checked={localFormData.is_gender === false}
                                onChange={() => handleGenderChange("female")}
                                className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Женский</span>
                        </label>
                    </div>
                    {errors.is_gender && (
                        <p className="text-red-500 text-sm mt-1">{errors.is_gender}</p>
                    )}
                </div>

                {/* Кнопка отправки */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Продолжить
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreatePatient1;