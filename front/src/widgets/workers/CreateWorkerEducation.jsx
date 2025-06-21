import React, { useState } from 'react';

const CreateWorkerEducation = ({ active, setActiveCreate }) => {

    const [formData, setFormData] = useState({
        educationYearStart: "",
        graduationYear: "",
        institutionName: "",
        educationLevel: "",
        specialization: "",
        notCompleted: false,
    });

    const [errors, setErrors] = useState({});

    const educationLevels = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Cucumber'];
    const specializations = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Cucumber']

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.educationYearStart) {
            newErrors.educationYearStart = "Пожалуйста, введите год начала обучения.";
        }
        if (!formData.graduationYear) {
            newErrors.graduationYear = "Пожалуйста, введите год выпуска.";
        }
        if (!formData.institutionName) {
            newErrors.institutionName = "Пожалуйста, введите название учебного заведения.";
        }
        if (!formData.educationLevel) {
            newErrors.educationLevel = "Пожалуйста, выберите уровень образования.";
        }
        if (!formData.specialization) {
            newErrors.specialization = "Пожалуйста, выберите специализацию.";
        }

        if (Object.keys(newErrors).length === 0) {
            console.log("Форма успешно отправлена:", formData);
            setActiveCreate(false);
        } else {
            setErrors(newErrors);
        }
    };

    if (!active) return null;

    return (
        <div className="fixed inset-0 bg-secondary-900 bg-opacity-75 flex justify-center items-center p-4 z-10">
            <form
                className="bg-white rounded-lg shadow-xl w-full max-w-lg space-y-3 p-8 relative"
                onSubmit={handleSubmit}
            >
                <button type="button" onClick={() => setActiveCreate(false)} className="absolute top-5 right-5"
                        aria-label="Close">
                    <img className="h-6" src="/xmark.svg" alt="close"/>
                </button>
                <h1 className="font-medium text-center text-xl mb-4">Образование</h1>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="educationYearStart">
                            Год поступления
                        </label>
                        <input
                            id="educationYearStart"
                            name="educationYearStart"
                            placeholder="Введите год начала обучения"
                            type="number"
                            required
                            value={formData.educationYearStart}
                            className="w-full pl-3 pr-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {errors.educationYearStart &&
                            <p className="mt-1 text-sm text-red-500">{errors.educationYearStart}</p>}
                    </div>

                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="graduationYear">
                            Год выпуска
                        </label>
                        <input
                            id="graduationYear"
                            name="graduationYear"
                            placeholder="Введите год выпуска"
                            type="number"
                            required
                            value={formData.graduationYear}
                            className="w-full pl-3 pr-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {errors.graduationYear && <p className="mt-1 text-sm text-red-500">{errors.graduationYear}</p>}
                    </div>

                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="institutionName">
                        Учебное заведения
                    </label>
                    <input
                        id="institutionName"
                        name="institutionName"
                        placeholder="Введите название учебного заведения"
                        type="text"
                        required
                        value={formData.institutionName}
                        className={`w-full pl-3 pr-3 py-2 border ${errors.institutionName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.institutionName && <p className="mt-1 text-sm text-red-500">{errors.institutionName}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="educationLevel">
                        Уровень образования
                    </label>
                    <select
                        id="educationLevel"
                        name="educationLevel"
                        value={formData.educationLevel}
                        className="w-full py-2 border border-gray-300 ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Выберите уровень образования</option>
                        {educationLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                    {errors.educationLevel && <p className="mt-1 text-sm text-red-500">{errors.educationLevel}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="specialization">
                        Специализация
                    </label>
                    <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        className="w-full py-2 border border-gray-300 ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Выберите специализацию</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                    {errors.specialization && <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>}
                </div>


                <div className="flex items-center gap-2">
                    <input type="checkbox" name="notCompleted" id="completed" checked={formData.notCompleted}/>
                    <label className="text-sm font-medium" htmlFor="completed">Не закончили учебное заведение</label>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Создать
                </button>
            </form>
        </div>
    );
};

export default CreateWorkerEducation;
