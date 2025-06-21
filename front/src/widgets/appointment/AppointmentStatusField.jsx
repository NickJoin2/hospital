import {useEffect, useState} from "react";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";

const AppointmentStatusField = ({ appointment, availableStatuses, onUpdateStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(appointment.status?.id || "");

    const handleSave = () => {
        if (selectedStatus && selectedStatus !== appointment.status?.id) {
            onUpdateStatus(selectedStatus);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        console.log(availableStatuses?.data);
    }, [availableStatuses]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Статус встречи
            </label>

            {!isEditing ? (
                <div className="flex items-center mt-1">
                    <p className="text-gray-700 dark:text-gray-300 mr-2">
                        {appointment.status?.appointment_status_name || "Неизвестно"}
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-500 hover:text-blue-700 transition-colors"
                        aria-label="Изменить статус"
                    >
                        <FiRefreshCw />
                    </button>
                </div>
            ) : (
                <div className="mt-1 flex items-center space-x-2">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                        <option value="" disabled>
                            Выберите статус
                        </option>
                        {availableStatuses?.data.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.appointment_status_name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleSave}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        aria-label="Сохранить статус"
                    >
                        <FiCheckCircle className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentStatusField;