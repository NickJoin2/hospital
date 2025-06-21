import { useGetWorkerSpecializationsQuery } from "../../app/redux/worker/workerSpecializationApi.js";
import { useGetWorkerEducationLevelsQuery } from "../../app/redux/worker/workerEducationLevelApi.js";
import { useState } from "react";
import { useAddEducationMutation, useMyWorkerProfileQuery } from "../../app/redux/worker/workersApi.js";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify"; // ✅ Добавлен импорт для уведомлений

const EducationCreate = ({ onClose }) => {
    const [formData, setFormData] = useState({
        year_start: "",
        year_end: "",
        specialization_id: "",
        educational_institution: "",
        education_level_id: "",
    });
    const [errors, setErrors] = useState({});
    const { data: specializations, error: specializationError, isLoading: specializationLoading } = useGetWorkerSpecializationsQuery();
    const { data: educationLevels, error: educationLevelError, isLoading: educationLevelLoading } = useGetWorkerEducationLevelsQuery();
    const [addEducation, { isLoading: isSaving, error: addEducationError }] = useAddEducationMutation();
    const { refetch } = useMyWorkerProfileQuery();

    if (specializationError || educationLevelError) {
        return <div>Ошибка загрузки данных</div>;
    }

    // Функция для валидации формы
    const validateForm = () => {
        const newErrors = {};
        if (!formData.year_start) newErrors.year_start = "Введите год начала обучения";
        if (!formData.year_end) newErrors.year_end = "Введите год окончания обучения";
        if (!formData.educational_institution) newErrors.educational_institution = "Введите название учебного заведения";
        if (!formData.specialization_id) newErrors.specialization_id = "Выберите специализацию";
        if (!formData.education_level_id) newErrors.education_level_id = "Выберите уровень образования";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик изменения поля формы
    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        // Очищаем ошибку при вводе
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const result = await addEducation(formData).unwrap();
            await refetch();
            toast.success("Образование успешно добавлено"); // ✅ Успех
            onClose();
        } catch (err) {
            console.error("Ошибка добавления образования:", err);

            let fieldErrors = {};
            if (err?.data?.errors) {
                for (const [key, value] of Object.entries(err.data.errors)) {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                }
            }

            setErrors(fieldErrors); // ✅ Показываем ошибки под полями


        }
    };

    // Проверка на загрузку данных
    if (specializationLoading || educationLevelLoading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6">
            <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors">
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Добавить образование</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Даты */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Год начала</label>
                                <input
                                    type="date"
                                    value={formData.year_start}
                                    onChange={handleChange("year_start")}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.year_start ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.year_start && <p className="text-red-500 text-sm">{errors.year_start}</p>}
                            </div>
                            {/* Год окончания */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Год окончания</label>
                                <input
                                    type="date"
                                    value={formData.year_end}
                                    onChange={handleChange("year_end")}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.year_end ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.year_end && <p className="text-red-500 text-sm">{errors.year_end}</p>}
                            </div>
                        </div>
                        {/* Учебное заведение */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Учебное заведение</label>
                            <input
                                type="text"
                                value={formData.educational_institution}
                                onChange={handleChange("educational_institution")}
                                placeholder="Название учебного заведения"
                                className={`w-full px-3 py-2 border rounded-md ${errors.educational_institution ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.educational_institution && <p className="text-red-500 text-sm">{errors.educational_institution}</p>}
                        </div>
                        {/* Специализация и уровень образования */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Специализация</label>
                                <select
                                    value={formData.specialization_id}
                                    onChange={handleChange("specialization_id")}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.specialization_id ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option disabled value="">Выберите специализацию</option>
                                    {specializations?.data?.map((spec) => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.specialization_code} {spec.specialization_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.specialization_id && <p className="text-red-500 text-sm">{errors.specialization_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Уровень образования</label>
                                <select
                                    value={formData.education_level_id}
                                    onChange={handleChange("education_level_id")}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.education_level_id ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option disabled value="">Выберите уровень</option>
                                    {educationLevels?.data?.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            {level.level_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.education_level_id && <p className="text-red-500 text-sm">{errors.education_level_id}</p>}
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isSaving ? "Сохраняем..." : "Сохранить"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EducationCreate;