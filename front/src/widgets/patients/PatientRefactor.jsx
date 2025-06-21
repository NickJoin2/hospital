import React, {useState, useEffect} from "react";
import {useUpdatePatientMutation} from "../../app/redux/patients/patientsApi";


const PatientRefactor = ({patient, onClose, toast}) => {
    const [updatePatient, {isError, error}] = useUpdatePatientMutation();

    // Форматируем телефон
    const cleanPhone = (phone) => {
        if (!phone) return "";
        const digits = phone.replace(/\D/g, "");
        return "+7" + digits.slice(1);
    };



    const formatPhone = (phone) => {
        if (!phone) return "+7";
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 0 || digits === "7") return "+7";
        let formattedValue = "+7";
        const rest = digits.slice(1);
        if (rest.length >= 1) formattedValue += ` (${rest.slice(0, 3)}`;
        if (rest.length >= 4) formattedValue += `) ${rest.slice(3, 6)}`;
        if (rest.length >= 7) formattedValue += `-${rest.slice(6, 8)}`;
        if (rest.length >= 9) formattedValue += `-${rest.slice(8, 10)}`;
        return formattedValue;
    };

    const initialData = {
        phone: patient?.phone ? formatPhone(patient.phone) : "+7",
        birth_date: patient?.birth_date || "",
        is_gender: typeof patient?.is_gender === "boolean" ? patient.is_gender : true,
        series: patient?.passport?.series || "",
        number: patient?.passport?.number || "",
        issued: patient?.passport?.issued || "",
    };

    const [localFormData, setLocalFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (patient) {
            setLocalFormData({
                phone: formatPhone(patient.phone),
                birth_date: patient.birth_date || "",
                is_gender: typeof patient.is_gender === "boolean" ? patient.is_gender : true,
                series: patient.passport?.series || "",
                number: patient.passport?.number || "",
                issued: patient.passport?.issued || "",
            });
        }
    }, [patient]);

    const handleGenderChange = (gender) => {
        setLocalFormData((prev) => ({
            ...prev,
            is_gender: gender,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!localFormData.series) {
            newErrors.series = "Серия обязательна";
        } else if (String(localFormData.series).length !== 4) {
            newErrors.series = "Серия должна быть 4 символа";
        }

        if (!localFormData.number) {
            newErrors.number = "Номер обязателен";
        } else if (String(localFormData.number).length !== 6) {
            newErrors.number = "Номер должен быть 6 символов";
        }

        if (!localFormData.issued) newErrors.issued = "Дата выдачи обязательна";
        if (!localFormData.phone) newErrors.phone = "Телефон обязателен";
        if (!localFormData.birth_date) newErrors.birth_date = "Дата рождения обязательна";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const cleanedPhone = cleanPhone(localFormData.phone);

        const passportData = {
            series: parseInt(localFormData.series, 10),
            number: parseInt(localFormData.number, 10),
            issued: localFormData.issued,
        };

        updatePatient({
            id: patient.id,
            body: {
                phone: cleanedPhone,
                birth_date: localFormData.birth_date,
                is_gender: localFormData.is_gender,
                ...passportData,
            },
        })
            .unwrap()
            .then(() => {
                toast()
                setServerError("");
                onClose();
            })
            .catch((error) => {
                console.error("Ошибка при обновлении:", error);
                const message =
                    error?.data?.message ||
                    error?.data?.error ||
                    error?.statusText ||
                    "Произошла ошибка при сохранении данных.";
                setServerError(message);
            });

        setErrors({});
    };


    const handlePhoneChange = (e) => {
        let value = e.target.value;
        const digits = value.replace(/\D/g, "");
        if (!digits) {
            setLocalFormData((prev) => ({...prev, phone: "+7"}));
            return;
        }
        let formattedValue = "+7";
        const rest = digits.slice(1);
        if (rest.length >= 1) formattedValue += ` (${rest.slice(0, 3)}`;
        if (rest.length >= 4) formattedValue += `) ${rest.slice(3, 6)}`;
        if (rest.length >= 7) formattedValue += `-${rest.slice(6, 8)}`;
        if (rest.length >= 9) formattedValue += `-${rest.slice(8, 10)}`;
        setLocalFormData((prev) => ({...prev, phone: formattedValue}));
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Данные паспорта</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Серия и Номер */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Серия паспорта</label>
                        <input
                            type="text"
                            maxLength={4}
                            minLength={4}
                            value={localFormData.series}
                            onChange={(e) =>
                                setLocalFormData((prev) => ({
                                    ...prev,
                                    series: e.target.value.replace(/[^0-9]/g, "").slice(0, 4),
                                }))
                            }
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.series ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Например: 1234"
                        />
                        {errors.series && (
                            <p className="text-red-500 text-sm mt-1">{errors.series}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Номер паспорта</label>
                        <input
                            type="text"
                            maxLength={6}
                            minLength={6}
                            value={localFormData.number}
                            onChange={(e) =>
                                setLocalFormData((prev) => ({
                                    ...prev,
                                    number: e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                                }))
                            }
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.number ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Например: 567890"
                        />
                        {errors.number && (
                            <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                        )}
                    </div>
                </div>

                {/* Дата выдачи */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Дата выдачи</label>
                    <input
                        type="date"
                        value={localFormData.issued}
                        onChange={(e) =>
                            setLocalFormData((prev) => ({...prev, issued: e.target.value}))
                        }
                        className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                            errors.issued ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.issued && (
                        <p className="text-red-500 text-sm mt-1">{errors.issued}</p>
                    )}
                </div>

                {/* Телефон */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            maxLength="18"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>
                    {/* Дата рождения */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
                        <input
                            type="date"
                            value={localFormData.birth_date}
                            onChange={(e) =>
                                setLocalFormData((prev) => ({...prev, birth_date: e.target.value}))
                            }
                            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                                errors.birth_date ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.birth_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
                        )}
                    </div>
                </div>

                {/* Пол */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
                    <div className="flex items-center gap-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                checked={localFormData.is_gender === true}
                                onChange={() => handleGenderChange(true)}
                                className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Мужской</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                checked={localFormData.is_gender === false}
                                onChange={() => handleGenderChange(false)}
                                className="w-4 h-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Женский</span>
                        </label>
                    </div>
                </div>
                {/* Кнопка отправки */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Сохранить изменения
                    </button>
                </div>
            </form>

        </>
    );
};

export default PatientRefactor;