import {useState} from "react";
import {FaTimes} from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import {CiCalendar} from "react-icons/ci";


const CreateAmbulances = ({active, setActive}) => {
    const [formData, setFormData] = useState({
        car: "",
        driver: "",
        firstDoctor: "",
        secondDoctor: "",
        date: "",
        startTime: "",
        endTime: ""
    });

    const [errors, setErrors] = useState({});

    const drivers = ["Володин Ф.Д.", "Киселев А.Д.", "Намазов Д.В.", "Керасов Г.А."];
    const doctors = ['Черняев. Ф.Г.', 'Сорокина А.В.', 'Самопалова Г.Д', 'Карамзин В.Г.', 'Денисенко Ж.К.', 'Киркоров З.Г']


    const cars = ['Mercedes-Benz Sprinter', 'Ford Transit', 'Volkswagen Crafter']


    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if(!formData.car) {
            newErrors.car = "Пожалуйста выберите машину";
        }

        if(!formData.driver) {
            newErrors.driver = "Пожалуйста выберите водителя"
        }

        if(!formData.firstDoctor) {
            newErrors.firstDoctor = "Пожалуйста выберите врача - 1";
        }

        if(!formData.secondDoctor) {
            newErrors.secondDoctor = "Пожалуйста выберите врача - 2";
        }

        if(!formData.date) {
            newErrors.date = "Пожалуйста выберите дату";
        }

        if(!formData.startTime) {
            newErrors.startTime = "Пожалуйста выберите начальное время";
        }

        if(!formData.endTime) {
            newErrors.endTime = "Пожалуйста выберите конечное время";
        }

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted:", formData);
        } else {
            setErrors(newErrors);
        }
    };

    if (!active) return null;

    return (
        <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                <button
                    onClick={() => setActive(false)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close login form"
                >
                    <FaTimes className="w-5 h-5"/>
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Скорая помощь</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="car">
                                Машина
                            </label>
                            <select
                                id="car"
                                name="car"
                                value={formData.car}
                                className={`w-full py-2 border ${errors.car ? 'border-red-500' : 'border-gray-300'} ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">
                                    Выберите машину
                                </option>
                                {cars.map(car => (
                                    <option key={car} value={car}>{car}</option>
                                ))}
                            </select>
                            {errors.car && <p className="mt-1 text-sm text-red-500">{errors.car}</p>}
                        </div>


                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="driver">
                                Водитель
                            </label>
                            <select
                                id="driver"
                                name="driver"
                                value={formData.driver}
                                className={`w-full py-2 border ${errors.driver ? 'border-red-500' : 'border-gray-300'} ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Выберите водителя</option>
                                {drivers.map(driver => (
                                    <option key={driver} value={driver}>{driver}</option>
                                ))}
                            </select>
                            {errors.driver && <p className="mt-1 text-sm text-red-500">{errors.driver}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstDoctor">
                                Врач - 1
                            </label>
                            <select
                                id="firstDoctor"
                                name="firstDoctor"
                                value={formData.firstDoctor}
                                className={`w-full py-2 border ${errors.firstDoctor ? 'border-red-500' : 'border-gray-300'} ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Выберите врача - 1</option>
                                {doctors.map(firstDoctor => (
                                    <option key={firstDoctor} value={firstDoctor}>{firstDoctor}</option>
                                ))}
                            </select>
                            {errors.firstDoctor && <p className="mt-1 text-sm text-red-500">{errors.firstDoctor}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="secondDoctor">
                                Врач - 2
                            </label>
                            <select
                                id="secondDoctor"
                                name="secondDoctor"
                                value={formData.secondDoctor}
                                className={`w-full py-2 border ${errors.secondDoctor ? 'border-red-500' : 'border-gray-300'} ps-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Выберите врача - 2</option>
                                {doctors.map(secondDoctor => (
                                    <option key={secondDoctor} value={secondDoctor}>{secondDoctor}</option>
                                ))}
                            </select>
                            {errors.secondDoctor && <p className="mt-1 text-sm text-red-500">{errors.secondDoctor}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                                Дата
                            </label>
                            <div className="relative">
                                <CiCalendar
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    className={`w-full pl-10 pr-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите дату"
                                    aria-invalid={errors.date ? "true" : "false"}
                                />
                            </div>
                            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                        </div>


                        <div className="flex justify-between gap-2 sm:flex-wrap">
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="startTime">Время начала</label>
                                <div className="relative">
                                    <IoTimeOutline
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                    <input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={formData.startTime}
                                        className={`w-full pl-10 pr-3 py-2 border ${errors.startTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Начало смены"
                                        aria-invalid={errors.startTime ? "true" : "false"}
                                    />
                                </div>
                                {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
                            </div>

                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="endTime">Время окончания</label>
                                <div className="relative">
                                    <IoTimeOutline
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                    <input
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={formData.endTime}
                                        className={`w-full pl-10 pr-3 py-2 border ${errors.endTime ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Конец смены"
                                        aria-invalid={errors.endTime ? "true" : "false"}
                                    />
                                </div>
                                {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            Создать
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAmbulances;