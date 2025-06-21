import React, {useState} from 'react';
import {useAddWorkerExperienceMutation} from "../../app/redux/worker/workerExperiencesApi.js";

const CreateWorkerExperiences = ({ setAllert, handleButton, workerId }) => {
    const [formData, setFormData] = useState({
        workerId: workerId,
        workTime: "",
        company: "",
        position: "",
        responsibilities: "",
    });

    const [errors, setErrors] = useState({});


    const handleSubmit = async(e) => {
        e.preventDefault();
        const newErrors = {};
        const [addExperiences] = useAddWorkerExperienceMutation()

        if (!formData.workTime) {
            newErrors.workTime = "Пожалуйста, введите период работы.";
        }
        if (!formData.company) {
            newErrors.company = "Пожалуйста, введите название компании.";
        }
        if (!formData.position) {
            newErrors.position = "Пожалуйста, введите должность.";
        }
        if (!formData.responsibilities) {
            newErrors.responsibilities = "Пожалуйста, введите обязанности.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addExperiences(formData).unwrap();
            setAllert('create')
            setFormData({ workTime: "", company: "", position: "", responsibilities: "" });
            setErrors({});
            handleButton()
        } catch (err) {
            handleButton()
            setAllert('warning')
        }
    };


    return (
        <div className="fixed inset-0 bg-secondary-900 bg-opacity-75 flex justify-center items-center p-4 z-10">
            <form
                className="bg-white rounded-lg shadow-xl w-full max-w-lg space-y-3 p-8 relative"
                onSubmit={handleSubmit}
            >
                <button type="button" onClick={() => handleButton()} className="absolute top-5 right-5"
                        aria-label="Close">
                    <img className="h-6" src="/xmark.svg" alt="close"/>
                </button>

                <h1 className="font-medium text-center text-xl mb-4">Опыт сотрудника</h1>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="workTime">
                        Период работы
                    </label>
                    <input
                        name="workTime"
                        id="workTime"
                        placeholder="Введите период работы"
                        required
                        value={formData.workTime}
                        onChange={e => setFormData({...formData, workTime: e.target.value})}
                        className="text-sm font-medium w-full border border-gray-300 rounded p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.workTime && <p className="mt-1 text-sm text-red-500">{errors.workTime}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="company">
                        Компания
                    </label>
                    <input
                        id="company"
                        name="company"
                        placeholder="Введите название компании"
                        required
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        className="text-sm font-medium w-full border border-gray-300 rounded p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="position">
                        Должность
                    </label>
                    <input
                        id="position"
                        name="position"
                        placeholder="Введите должность"
                        required
                        value={formData.position}
                        onChange={e => setFormData({...formData, position: e.target.value})}
                        className="text-sm font-medium w-full border border-gray-300 rounded p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="responsibilities">
                        Обязанности
                    </label>
                    <input
                        id="responsibilities"
                        name="responsibilities"
                        placeholder="Введите обязанности"
                        required
                        value={formData.responsibilities}
                        onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                        className="text-sm font-medium w-full border border-gray-300 rounded p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.responsibilities && <p className="mt-1 text-sm text-red-500">{errors.responsibilities}</p>}
                </div>


                <div className="flex justify-between items-center flex-wrap gap-2 md:flex-nowrap w-full">
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        Создать
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateWorkerExperiences;
