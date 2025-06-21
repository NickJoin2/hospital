import React, { useRef, useState } from "react";
import {
    FaCamera,
    FaCheck,
    FaEdit,
    FaTimes,
} from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import moment from "moment";

// API
import {
    useAddPatientPhotoMutation,
    useAppointmentStatusMutation,
    useDeleteAllergyMutation,
    useDeleteInsuranceMutation,
    useDeleteOperationMutation,
    useGetPatientQuery,
} from "../app/redux/patients/patientsApi.js";
import CreateOperation from "../widgets/patients/CreateOperation.jsx";
import CreateAllergy from "../widgets/allergies/CreateAllergy.jsx";
import AppointmentValue from "../widgets/diagnoses/AppointmentValue.jsx";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import CreateAppointment from "../widgets/appointment/CreateAppointment.jsx";
import Spiner from "../widgets/other/Spiner.jsx";
import NoData from "../widgets/other/NoData.jsx";
import PatientRefactor from "../widgets/patients/PatientRefactor.jsx";
// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientInsuranceCreate from "../widgets/patients/PatientInsuranceCreate.jsx";
import AppointmentStatusField from "../widgets/appointment/AppointmentStatusField.jsx";
import { useGetAppointmentStatusesQuery } from "../app/redux/appointment/appointmentStatus.js";
import FIORefactorModal from "../widgets/patients/FIORefactorModal.jsx";

const PatientProfile = () => {
    const { id } = useParams();
    const [patientId, setPatientId] = useState(id);
    const [operationOpen, setOperationOpen] = useState(false);
    const [allergyOpen, setAllergyOpen] = useState(false);
    const [diagnoseOpen, setDiagnoseOpen] = useState(false);
    const [appointmentOpen, setAppointmentOpen] = useState(false);
    const [patientRefactorOpen, setPatientRefactorOpen] = useState(false);
    const [diagnoseId, setDiagnoseId] = useState(null);
    const [preview, setPreview] = useState("/user.svg");
    const [showTooltip, setShowTooltip] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [patientRefactorSuccess, setPatientRefactorSuccess] = useState(false);
    const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
    const handleCloseInsuranceModal = () => setInsuranceModalOpen(!insuranceModalOpen);
    const fileInputRef = useRef(null);

    // Получение данных о пациенте
    const { data: patientData, isLoading, isError, refetch } = useGetPatientQuery(id);
    const [updateAppointmentStatus] = useAppointmentStatusMutation();
    const { data: statuses } = useGetAppointmentStatusesQuery();
    const [addPhotoProfile] = useAddPatientPhotoMutation();
    const [deleteInsurance] = useDeleteInsuranceMutation();

    const formatTime = (time) => {
        if (!time) return 'Не указано';
        return moment(time, 'HH:mm:ss').format('HH:mm');
    };

    const deleteInsuranceConfirm = async (id) => {
        try {
            await deleteInsurance(id).unwrap();
            toast.error("Медицинский полис удален");
        } catch (err) {
            console.error("Error deleting operation:", err);
            toast.warn("Не удалось выполнить операцию");
        }
    };

    // Загрузка фото профиля
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        const maxSize = 5 * 1024 * 1024;
        if (!validTypes.includes(file.type)) {
            setUploadError("Поддерживаются только изображения формата JPG, PNG или WebP");
            return;
        }
        if (file.size > maxSize) {
            setUploadError("Максимальный размер файла - 5 МБ");
            return;
        }
        setUploadError(null);
        setIsUploading(true);
        try {
            const preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
            setPreview(preview);
            const formData = new FormData();
            formData.append("avatar", file);
            await addPhotoProfile({ body: formData, id: patientId }).unwrap();
            await refetch().unwrap();
            toast.success("Фото профиля успешно обновлено");
        } catch (error) {
            console.error("Ошибка при обновлении фото:", error);
            setUploadError(
                error.data?.message ||
                "Не удалось обновить фото. Пожалуйста, попробуйте позже."
            );
        } finally {
            setIsUploading(false);
        }
    };

    const toastSuccess = () => {
        setPatientRefactorSuccess(!patientRefactorSuccess);
        toast.success("Данные успешно обновлены");
    };

    const formatPhone = (phone) => {
        if (!phone) return "+7";
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 0 || digits === "7") return "+7";
        let formattedValue = "+7";
        const rest = digits.slice(1);
        if (rest.length >= 1) formattedValue += ` (${rest.slice(0, 3)}`;
        if (rest.length >= 4) formattedValue += `) ${rest.slice(3, 6)}`;
        if (rest.length >= 7) formattedValue += `-${rest.slice(6, 8)}`;
        if (rest.length >= 9) formattedValue += `-${rest.slice(8, 10)}`;
        return formattedValue;
    };

    // Удаление операции
    const [handleOperationDelete] = useDeleteOperationMutation();
    const handleDeleteOperation = async (operationId) => {
        try {
            await handleOperationDelete(operationId).unwrap();
            toast.error("Запись успешно удалена");
        } catch (err) {
            console.error("Error deleting operation:", err);
            toast.warn("Не удалось выполнить операцию");
        }
    };

    // Удаление аллергии
    const [handleAllergiesDelete] = useDeleteAllergyMutation();
    const handleDeleteAllergy = async (allergyId) => {
        try {
            await handleAllergiesDelete(allergyId).unwrap();
            toast.error("Аллергия успешно удалена");
        } catch (err) {
            console.error("Error deleting allergy:", err);
            toast.warn("Не удалось удалить аллергию");
        }
    };

    // Открытие/закрытие модальных окон
    const handleCloseOperation = () => setOperationOpen(!operationOpen);
    const handleCloseAllergy = () => setAllergyOpen((prev) => !prev);
    const handleAppointmentClose = () => setAppointmentOpen(!appointmentOpen);
    const handleClosePatientRefactor = () =>
        setPatientRefactorOpen(!patientRefactorOpen);
    const handleCloseDiagnose = (id) => {
        setDiagnoseOpen(!diagnoseOpen);
        setDiagnoseId(id);
    };

    // Клик по кнопке загрузки фото
    const handleButtonClick = () => fileInputRef.current.click();



    const handleChangeAppointmentStatus = async (appointmentId, statusId) => {
        try {
            await updateAppointmentStatus({ id: appointmentId, status_id: statusId }).unwrap();
            toast.success("Статус успешно изменён");
            refetch(); // Обновляем данные пациента или только список приёмов
        } catch (err) {
            console.error("Ошибка изменения статуса:", err);
            toast.error("Не удалось изменить статус");
        }
    };

    const [isFIOModalOpen, setIsFIOModalOpen] = useState(false);

    const handleFioModalOpen = () => {
        setIsFIOModalOpen(!isFIOModalOpen);
    }

    if (isLoading) return <Spiner />;
    if (isError) return <NoData />;
    if (!patientData?.data) return <NoData />;

    const { middle_name = "", first_name = "", last_name = "" } = patientData?.data;

    return (
        <>
            {/* Модальные окна */}
            {operationOpen && (
                <CreateOperation
                    patientId={patientId}
                    handleClose={handleCloseOperation}
                />
            )}
            {allergyOpen && (
                <CreateAllergy
                    patientId={patientId}
                    handleCloseAllergy={handleCloseAllergy}
                />
            )}
            {diagnoseOpen && (
                <AppointmentValue
                    diagnoseId={diagnoseId}
                    handleClose={handleCloseDiagnose}
                />
            )}
            {appointmentOpen && (
                <CreateAppointment
                    patientId={patientData?.data?.id}
                    handleClose={handleAppointmentClose}
                    onAppointmentCreated={refetch}
                />
            )}
            {insuranceModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6"
                    onClick={handleCloseInsuranceModal}
                >
                    <div
                        className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseInsuranceModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Закрыть форму"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                        <PatientInsuranceCreate
                            patientId={patientId}
                            onSuccess={handleCloseInsuranceModal}
                        />
                    </div>
                </div>
            )}

            {/* Основной контент */}
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Информация о пользователе */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative h-48 w-48">
                            <img
                                src={
                                    patientData?.data?.avatar
                                        ? `http://127.0.0.1:8000${patientData?.data?.avatar}`
                                        : preview
                                }
                                alt="Профиль"
                                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button
                                onClick={handleButtonClick}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                className="absolute bottom-2 right-2 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Обновить фото профиля"
                            >
                                <FaCamera className="text-gray-700 text-xl" />
                                {showTooltip && (
                                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                                        Обновить фото профиля
                                    </div>
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.webp"
                                className="hidden"
                                aria-label="Загрузить фото профиля"
                            />
                            {uploadError && (
                                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 text-red-600 rounded-md flex items-center justify-center text-sm">
                                    <BiError className="mr-1" />
                                    {uploadError}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2 flex items-center">
                                {middle_name} {first_name} {last_name}
                                <button
                                    onClick={handleFioModalOpen} // ← Правильно
                                    className="ml-3 text-gray-500 hover:text-blue-700 transition"
                                    aria-label="Редактировать ФИО"
                                >
                                    <FaEdit />
                                </button>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Пациент ID: #{patientData.data?.id}
                            </p>
                        </div>

                        {/* Модальное окно */}
                        {isFIOModalOpen && (
                            <FIORefactorModal
                                onClose={handleFioModalOpen}
                                patient={patientData?.data}
                                toast={toast}
                            />
                        )}
                    </div>

                    {/* Личная информация */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold ms-1 mb-3">Личная информация</h2>
                            <button
                                onClick={handleClosePatientRefactor}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                aria-label="Редактировать пациента"
                            >
                                <FaEdit />
                            </button>
                        </div>
                        {patientRefactorOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-6">
                                <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 opacity-100 animate-fade-in-down">
                                    <button
                                        onClick={handleClosePatientRefactor}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                        aria-label="Закрыть форму"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                    <PatientRefactor
                                        patient={patientData?.data}
                                        onClose={handleClosePatientRefactor}
                                        toast={toastSuccess}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Дата рождения
                                </label>
                                <p className="mt-1">
                                    {patientData.data?.birth_date
                                        ? new Date(patientData.data.birth_date).toLocaleDateString()
                                        : "Нет данных"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Номер телефона
                                </label>
                                <p className="mt-1">
                                    {patientData.data?.phone ? formatPhone(patientData.data.phone) : "Нет данных"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Пол
                                </label>
                                <p className="mt-1">
                                    {patientData.data?.is_gender ? "Мужчина" : "Женщина"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Действителен до
                                </label>
                                <p className="mt-1">{patientData.data?.passport?.issued ?? "Нет данных"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Серия паспорта
                                </label>
                                <p className="mt-1">
                                    {patientData.data?.passport?.series ?? "Нет данных"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Номер паспорта
                                </label>
                                <p className="mt-1">
                                    {patientData.data?.passport?.number ?? "Нет данных"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Медицинский полис */}
                    {patientData.data?.insurances?.length > 0 ? (
                        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold ms-1">Медицинский полис</h2>
                                {patientData.data.insurances[0]?.id && (
                                    <button
                                        onClick={() =>
                                            deleteInsuranceConfirm(patientData.data.insurances[0].id)
                                        }
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Удалить медицинский полис"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Компания
                                    </label>
                                    <p className="mt-1">
                                        {patientData.data.insurances[0]?.company || "Нет данных"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Номер полиса
                                    </label>
                                    <p className="mt-1">
                                        {patientData.data.insurances[0]?.insurance_number || "Нет данных"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Дата окончания
                                    </label>
                                    <p className="mt-1">
                                        {patientData.data.insurances[0]?.date_end_at || "Нет данных"}
                                    </p>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold ms-1">Медицинский полис</h2>
                                <button
                                    onClick={handleCloseInsuranceModal}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    aria-label="Добавить медицинский полис"
                                >
                                    Добавить полис
                                </button>
                            </div>
                            <NoEntries text="Нет медицинского полиса" />
                        </section>
                    )}

                    {/* Операции */}
                    <div className="flex items-center justify-between gap-5 mb-3 mt-8">
                        <h2 className="text-2xl font-semibold ms-1">Операции</h2>
                        <button
                            className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleCloseOperation}
                        >
                            Создать
                        </button>
                    </div>
                    {patientData?.data?.operations?.length > 0 ? (
                        patientData.data.operations.map((item, index) => (
                            <section
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Информация об операции #{index + 1}
                                    </h2>
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Удалить операцию"
                                        onClick={() => handleDeleteOperation(item.id)}
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Дата операции
                                        </label>
                                        <p className="mt-1">{item.operation_date_at || "Не указана"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Тип операции
                                        </label>
                                        <p className="mt-1">
                                            {item.operation_type?.operation_type_name || "Не указано"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Осложнения
                                        </label>
                                        <p className="mt-1">{item.complication || "Не выявлено"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Анестезия
                                        </label>
                                        <p className="mt-1">
                                            {item.anesthesia_type?.anesthesia_name || "Не указано"}
                                        </p>
                                    </div>
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Послеоперационный уход
                                        </label>
                                        <p className="mt-1 whitespace-pre-line break-words">
                                            {item.post_op_care || "Не требуется"}
                                        </p>
                                    </div>
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Примечание
                                        </label>
                                        <p className="mt-1 whitespace-pre-line break-words">
                                            {item.notes || "Нет примечаний"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        ))
                    ) : (
                        <NoEntries text="Нет добавленных записей об операциях." />
                    )}

                    {/* Аллергии */}
                    <div className="flex items-center justify-between gap-5 mb-3 mt-8">
                        <h2 className="text-2xl font-semibold ms-1">Аллергии</h2>
                        <button
                            className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleCloseAllergy}
                        >
                            Создать
                        </button>
                    </div>
                    {patientData?.data?.allergies?.length > 0 ? (
                        patientData.data.allergies.map((item, index) => (
                            <section
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 mt-8"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Информация об аллергии #{index + 1}
                                    </h2>
                                    <button
                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                        aria-label="Удалить аллергию"
                                        onClick={() => handleDeleteAllergy(item.id)}
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Аллерген
                                        </label>
                                        <p className="mt-1">
                                            {item.allergen?.allergen_name || "Не указано"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Тяжесть аллергии
                                        </label>
                                        <p className="mt-1">
                                            {item.severity?.severity_name || "Не указана"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Реакция
                                        </label>
                                        <p className="mt-1">{item.reaction || "Не указана"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Дата диагностирования
                                        </label>
                                        <p className="mt-1">{item.date_diagnose_at || "Не указана"}</p>
                                    </div>
                                </div>
                            </section>
                        ))
                    ) : (
                        <NoEntries text="Нет добавленных записей об аллергиях." />
                    )}

                    {/* Приемы у врача */}
                    <div className="flex items-center justify-between gap-5 mb-3 mt-8">
                        <h2 className="text-2xl font-semibold ms-1">Приемы у врача</h2>
                        <button
                            className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleAppointmentClose}
                        >
                            Записаться
                        </button>
                    </div>
                    {patientData?.data?.appointments?.length > 0 ? (
                        patientData.data.appointments.map((appointment, index) => {
                            const allowedStatuses = ["Подтверждено", "В ожидании", "На рассмотрении"];
                            const currentStatusName = appointment.status?.appointment_status_name;
                            const isDiagnoseAllowed =
                                currentStatusName && allowedStatuses.includes(currentStatusName);

                            return (
                                <section
                                    key={appointment.id}
                                    className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 mb-8 transition duration-300 hover:shadow-2xl mt-8"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                            Информация о приеме #{index + 1}
                                        </h2>
                                        {/* Условный рендеринг кнопки */}
                                        {isDiagnoseAllowed && !appointment.diagnoses?.[0]?.id ? (
                                            <button
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                                aria-label="Создать диагноз"
                                                onClick={() => handleCloseDiagnose(appointment.id)}
                                            >
                                                <FaEdit />
                                            </button>
                                        ) : appointment.diagnoses?.[0]?.id ? (
                                            <FaCheck className="text-green-500" />
                                        ) : null}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        {/* Дата и время */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Дата и время
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                {appointment.appointment_date_at}{" "}
                                                {formatTime(appointment.appointment_time_at)}
                                            </p>
                                        </div>
                                        {/* Статус встречи */}
                                        <AppointmentStatusField
                                            appointment={appointment}
                                            availableStatuses={statuses}
                                            onUpdateStatus={(newStatusId) =>
                                                handleChangeAppointmentStatus(appointment.id, newStatusId)
                                            }
                                        />
                                        {/* Диагноз */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Диагноз
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                                                {appointment.diagnoses?.[0]?.diagnose_name || "Не выявлено"}
                                            </p>
                                        </div>
                                        {/* Дата диагноза */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Дата диагноза
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                {appointment.diagnoses?.[0]?.date_diagnosed || "Не выявлено"}
                                            </p>
                                        </div>
                                        {/* Описание диагноза */}
                                        <div className="">
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Описание
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                                                {appointment.diagnoses?.[0]?.diagnose_description || "Отсутствует"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white ms-1 mb-3">
                                            Лекарства
                                        </h2>
                                        {appointment.diagnoses?.[0]?.medications?.length > 0 ? (
                                            appointment.diagnoses[0].medications.map((medicine) => (
                                                <div
                                                    key={medicine.id}
                                                    className="border-t border-gray-200 dark:border-gray-700 py-4 first:border-t-0"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Название лекарства
                                                            </label>
                                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                                {medicine.medicine_name?.medicine_name || "Отсутствует"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Частота приема
                                                            </label>
                                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                                {medicine.frequency?.frequencies_name || "Отсутствует"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Дозировка
                                                            </label>
                                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                                {medicine.dosage || "Отсутствует"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Начало приема
                                                            </label>
                                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                                {medicine.start_date_at || "Отсутствует"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                Окончание приема
                                                            </label>
                                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                                {medicine.end_date_at || "Отсутствует"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <NoEntries text="Лекарства не назначены" />
                                        )}
                                    </div>
                                </section>
                            );
                        })
                    ) : (
                        <NoEntries text="Нет добавленных записей о приёмах." />
                    )}
                </div>
            </div>
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
        </>
    );
};

export default PatientProfile;