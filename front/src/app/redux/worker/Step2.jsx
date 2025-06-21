import React, {useEffect, useState} from "react";
import {useGetWorkerSpecializationsQuery} from "./workerSpecializationApi.js";
import {useGetWorkerEducationLevelsQuery} from "./workerEducationLevelApi.js";
import {useAddWorkerEducationMutation} from "./workerEducationApi.js";
import {Navigate} from "react-router-dom";

const Step2 = ({onNext}) => {
    const [formData, setFormData] = useState({
        year_start: "",
        year_end: "",
        specialization_id: "",
        educational_institution: "",
        education_level_id: "",
    });
    const [errors, setErrors] = useState({});
    const [redirect, setRedirect] = useState(false);

    const {data: specializations} = useGetWorkerSpecializationsQuery();
    const {data: educationLevels} = useGetWorkerEducationLevelsQuery();
    const [userEducation, {isLoading}] = useAddWorkerEducationMutation();



    const validateForm = () => {
        const newErrors = {};
        if (!formData.year_start) {
            newErrors.year_start = "Введите год начала обучения";
        }
        if (!formData.year_end) {
            newErrors.year_end = "Введите год окончания обучения";
        }
        if (!formData.specialization_id) {
            newErrors.specialization_id = "Выберите специализацию";
        }
        if (!formData.educational_institution) {
            newErrors.educational_institution =
                "Введите название учебного заведения";
        }
        if (!formData.education_level_id) {
            newErrors.education_level_id = "Выберите уровень образования";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await userEducation(formData).unwrap();
                if (response.status === 201) {
                    setRedirect(true);
                }
                onNext(); // Переход к следующему шагу
            } catch (err) {
                console.error("Ошибка добавления образования:", err);
            }
        }
    };

    return (
        <>
            {redirect && <Navigate to="/success"/>}
            <h2 className="text-2xl font-bold mb-4">Образование</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Год начала */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Год начала</label>
                        <input
                            type="date"
                            value={formData.year_start}
                            onChange={(e) =>
                                setFormData({...formData, year_start: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.year_start ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Год начала обучения"
                            aria-invalid={!!errors.year_start}
                        />
                        {errors.year_start && (
                            <p className="text-red-500 text-sm">{errors.year_start}</p>
                        )}
                    </div>

                    {/* Год окончания */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Год окончания</label>
                        <input
                            type="date"
                            value={formData.year_end}
                            onChange={(e) =>
                                setFormData({...formData, year_end: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.year_end ? "border-red-500" : "border-gray-300"
                            } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Год окончания обучения"
                            aria-invalid={!!errors.year_end}
                        />
                        {errors.year_end && (
                            <p className="text-red-500 text-sm">{errors.year_end}</p>
                        )}
                    </div>
                </div>

                {/* Учебное заведение */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Учебное заведение</label>
                    <input
                        type="text"
                        value={formData.educational_institution}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                educational_institution: e.target.value,
                            })
                        }
                        className={`w-full px-3 py-2 border rounded-md ${
                            errors.educational_institution ? "border-red-500" : "border-gray-300"
                        } ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Введите название учебного заведения"
                        aria-invalid={!!errors.educational_institution}
                    />
                    {errors.educational_institution && (
                        <p className="text-red-500 text-sm">{errors.educational_institution}</p>
                    )}
                </div>

                {/* Специализация */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Специализация</label>
                        <select
                            value={formData.specialization_id}
                            onChange={(e) =>
                                setFormData({...formData, specialization_id: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.specialization_id ? "border-red-500" : "border-gray-300"
                            } ps-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите специализацию</option>
                            {specializations?.map((specialization) => (
                                <option key={specialization.id} value={specialization.id}>
                                    {specialization.specialization_code}{" "}
                                    {specialization.specialization_name}
                                </option>
                            ))}
                        </select>
                        {errors.specialization_id && (
                            <p className="text-red-500 text-sm">{errors.specialization_id}</p>
                        )}
                    </div>

                    {/* Уровень образования */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Уровень образования</label>
                        <select
                            value={formData.education_level_id}
                            onChange={(e) =>
                                setFormData({...formData, education_level_id: e.target.value})
                            }
                            className={`w-max-[100%] w-[280px] px-3 py-2 border rounded-md ${
                                errors.education_level_id ? "border-red-500" : "border-gray-300"
                            } ps-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option disabled value="">Выберите уровень образования</option>
                            {educationLevels?.map((educationLevel) => (
                                <option key={educationLevel.id} value={educationLevel.id}>
                                    {educationLevel.level_name}
                                </option>
                            ))}
                        </select>
                        {errors.education_level_id && (
                            <p className="text-red-500 text-sm">{errors.education_level_id}</p>
                        )}
                    </div>
                </div>


                <div className="flex justify-between">
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

export default Step2;