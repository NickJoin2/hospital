import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CreateRole = () => {
    const [formData, setFormData] = useState({
        role: "",
    });

    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate role input
        if (name === "role") {
            setErrors(prev => ({
                ...prev,
                role: value.length < 2 ? "Роль должена содержать больше 2 символов" : ""
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (formData.role.length < 2) {
            newErrors.role = "Роль должен содержать больше 2 символов";
        }

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted:", formData);
        } else {
            setErrors(newErrors);
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close login form"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Создать роль</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                                Роль
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className={`w-full pl-3 pr-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите название роли"
                                    aria-invalid={errors.role ? "true" : "false"}
                                />
                            </div>

                            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={Object.keys(errors).length > 0}
                        >
                            Создать роль
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRole;
