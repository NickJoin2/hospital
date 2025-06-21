import { isToday } from "date-fns";
import { FaCalendarAlt, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useGetSchedulesQuery } from "../app/redux/schedules/schedulesApi.js";
import React, { useState } from "react";
import Spiner from "../widgets/other/Spiner.jsx";

const SchedulesProfile = () => {
    // Получаем данные из API
    const { data: schedules, isLoading } = useGetSchedulesQuery();

    // Форматируем время
    const formatTime = (timeString) => {
        return timeString ? timeString.slice(0, 5) : "--:--"; // HH:MM
    };

    // Состояние для сортировки
    const [sortDirection, setSortDirection] = useState("asc"); // asc или desc

    const toggleSort = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    if (isLoading) {
        return <Spiner />;
    }

    // Группируем расписание по врачам
    const groupedByDoctor = schedules?.data?.reduce((acc, schedule) => {
        const key = schedule.doctor.id;
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
        <div className="p-4 my-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Расписание</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse" role="table">
                    <thead>
                    <tr className="bg-gray-50 text-left">
                        <th
                            className="p-4 font-semibold text-gray-600 border-b cursor-pointer select-none"
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
                        <th className="p-4 font-semibold text-gray-600 border-b">День недели</th>
                        <th className="p-4 font-semibold text-gray-600 border-b">Кабинет</th>
                        <th className="p-4 font-semibold text-gray-600 border-b">Часы приёма</th>
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
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                Расписание отсутствует
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchedulesProfile;