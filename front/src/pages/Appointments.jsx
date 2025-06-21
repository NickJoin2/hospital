import React, {useState} from 'react';
import {FiTrash2} from "react-icons/fi";
import useSortableData from "../features/useSortableData.js";
import {useDeleteAppointmentMutation, useGetAppointmentsQuery} from "../app/redux/appointment/apointmentsApi.js";
import {Link} from "react-router-dom";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import moment from 'moment';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spiner from "../widgets/other/Spiner.jsx";

const Appointments = () => {


    const [appointmentOpen, setAppointmentOpen] = useState(false);

    const {data: appointments, isLoading} = useGetAppointmentsQuery()
    const [appointmentDelete] = useDeleteAppointmentMutation()

    const { items: sortedAppointment, requestSort, sortConfig } = useSortableData(appointments?.data || [], { key: 'id', direction: 'ascending' });


    const handleDeleteAppointment = async (id) => {
        try {
            await appointmentDelete(id).unwrap();
            toast.error('Заявка удалена')
        } catch (err) {
            console.error('Error deleting operation:', err);
        }
    }


    if(isLoading) {
        return <Spiner/>
    }

    return (
        <>
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

                <h1 className="text-center mt-3 text-4xl">Заявки</h1>


                {appointments?.data.length == 0 ? <NoEntries text="Записей нет" /> : (

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th
                                scope="col"
                                className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort("id")}
                            >
                                #
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort("appointment_date_at")}
                            >
                                Дата - Время
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort("patient.middle_name")}
                            >
                                Пациент
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort("doctor.middle_name")}
                            >
                                Доктор
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 cursor-pointer text-center"
                                onClick={() => requestSort("status.appointment_status_name")}
                            >
                                Статус
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Действия
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                        {sortedAppointment.map((appointment, index) => (
                            <tr
                                key={appointment.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {appointment.id}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {moment(`${appointment.appointment_date_at} ${appointment.appointment_time_at}`).format('YYYY-MM-DD HH:mm')}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    <Link to={`/patient/${appointment.patient?.id}`}>
                                    {appointment.patient?.middle_name || ''}. {appointment.patient?.first_name[0] || ''}. {appointment.patient?.last_name[0] || ''}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    <Link to={`/worker/${appointment.doctor?.id}`}>
                                        {appointment.doctor?.middle_name || ''}. {appointment.doctor?.first_name[0] || ''}. {appointment.doctor?.last_name[0] || ''}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                    {appointment?.status?.appointment_status_name}
                                </td>

                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            className="text-gray-500 hover:text-red-600 transition-colors"
                                            aria-label="Delete education"
                                            onClick={() => handleDeleteAppointment(appointment.id)}
                                        >
                                            <FiTrash2 className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </>
    );
};

export default Appointments;