import { isToday } from "date-fns";
import { FaCalendarAlt, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useGetSchedulesQuery } from "../app/redux/schedules/schedulesApi.js";
import React, { useState } from "react";
import SchedulesCreate from "../widgets/SchedulesCreate.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spiner from "../widgets/other/Spiner.jsx";
import NoEntries from "../widgets/Allert/NoEntries.jsx";

const ScheduleAdmin = () => {
    const { data: schedules, isLoading } = useGetSchedulesQuery();
    const [scheduleOpen, setScheduleOpen] = useState(false);

    const formatTime = (time) => {
        return new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(`1970-01-01T${time}`));
    };

    // Состояние сортировки
    const [sortDirection, setSortDirection] = useState("asc"); // asc или desc

    const toggleSort = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const closeScheduleModal = () => {
        setScheduleOpen(!scheduleOpen);
    };

    if (isLoading) {
        return <Spiner />;
    }

    const groupedByDoctor = schedules?.data?.reduce((acc, schedule) => {
        const key = schedule.doctor_id;
        if (!acc[key]) {
            acc[key] = {
                doctor: schedule.doctor,
                entries: [],
            };
        }
        acc[key].entries.push(schedule);
        return acc;
    }, {});

    // Сортируем врачей по ФИО
    const sortedDoctors = groupedByDoctor
        ? Object.values(groupedByDoctor).sort((a, b) => {
            const nameA = `${a.doctor.last_name} ${a.doctor.first_name} ${a.doctor.middle_name}`;
            const nameB = `${b.doctor.last_name} ${b.doctor.first_name} ${b.doctor.middle_name}`;
            return sortDirection === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        })
        : [];

    return (
        <>
            {scheduleOpen && <SchedulesCreate onClose={closeScheduleModal} />}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="p-4 my-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Расписание сотрудников</h1>
                    <button
                        className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={closeScheduleModal}
                    >
                        Создать
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse" role="table">
                        <thead>
                        <tr className="bg-gray-50">
                            <th
                                className="p-4 text-left font-semibold text-gray-600 border-b cursor-pointer select-none"
                                onClick={toggleSort}
                            >
                                <div className="flex items-center gap-1">
                                    Сотрудник
                                    {sortDirection === "asc" ? (
                                        <FaSortUp />
                                    ) : sortDirection === "desc" ? (
                                        <FaSortDown />
                                    ) : (
                                        <FaSort />
                                    )}
                                </div>
                            </th>
                            <th className="p-4 text-left font-semibold text-gray-600 border-b">Дни</th>
                            <th className="p-4 text-left font-semibold text-gray-600 border-b">Кабинет</th>
                            <th className="p-4 text-left font-semibold text-gray-600 border-b">Часы приема</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedDoctors.length > 0 ? (
                            sortedDoctors.map((docGroup) =>
                                docGroup.entries.map((schedule, idx) => (
                                    <tr
                                        key={schedule.id}
                                        className={`hover:bg-gray-50 ${
                                            isToday(new Date(schedule.day.day_name)) ? "bg-blue-50" : ""
                                        }`}
                                    >
                                        {/* Показываем имя врача только один раз */}
                                        {idx === 0 && (
                                            <td
                                                rowSpan={docGroup.entries.length}
                                                className="p-4 border-b align-top font-medium"
                                            >
                                                {`${docGroup.doctor.last_name} ${docGroup.doctor.first_name} ${docGroup.doctor.middle_name}`}
                                            </td>
                                        )}
                                        <td className="p-4 border-b">{schedule.day.day_name}</td>
                                        <td className="p-4 border-b">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400" />
                                                {schedule.room}
                                            </div>
                                        </td>
                                        <td className="p-4 border-b">
                                            {formatTime(schedule.start_time_at)} -{" "}
                                            {formatTime(schedule.end_time_at)}
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            <NoEntries text="Нет записей" />
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ScheduleAdmin;