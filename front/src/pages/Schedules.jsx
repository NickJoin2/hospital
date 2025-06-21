import { isToday } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { useGetSchedulesQuery } from "../app/redux/schedules/schedulesApi.js";

const EmployeeScheduleTable = () => {
    const { data: schedules = [] } = useGetSchedulesQuery();

    const formatTime = (time) => {
        return new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(`1970-01-01T${time}Z`));
    };

    const displayedDoctors = new Set();

    return (
        <div className="p-4 my-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Расписание сотрудников</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse" role="table">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="p-4 text-left font-semibold text-gray-600 border-b">Сотрудник</th>
                        <th className="p-4 text-left font-semibold text-gray-600 border-b">Дни</th>
                        <th className="p-4 text-left font-semibold text-gray-600 border-b">Кабинет</th>
                        <th className="p-4 text-left font-semibold text-gray-600 border-b">Часы приема</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedules.length > 0 ? (
                        schedules.map((schedule) => {
                            const isFirstEntryForDoctor = !displayedDoctors.has(schedule.doctor_id);
                            if (isFirstEntryForDoctor) {
                                displayedDoctors.add(schedule.doctor_id);
                            }

                            return (
                                <tr
                                    key={schedule.id}
                                    className={`hover:bg-gray-50 ${
                                        isToday(new Date(schedule.day.day_name)) ? "bg-blue-50" : ""
                                    }`}
                                >
                                    {/* Отображаем имя сотрудника только один раз для группы записей */}
                                    {isFirstEntryForDoctor && (
                                        <td
                                            className="p-4 border-b"
                                            rowSpan={schedules.filter(s => s.doctor_id === schedule.doctor_id).length}
                                        >
                                            {`${schedule.doctor.middle_name} ${schedule.doctor.first_name} ${schedule.doctor.last_name}`}
                                        </td>
                                    )}
                                    <td className="p-4 border-b">{schedule.day.day_name}</td>
                                    <td className="p-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" />
                                            {schedule.room}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b">{`${formatTime(schedule.start_time_at)} - ${formatTime(schedule.end_time_at)}`}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-4 text-center text-gray-500">
                                No schedules found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeScheduleTable;