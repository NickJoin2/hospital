<?php

use App\Http\Controllers\AllergenController;
use App\Http\Controllers\AllergensCategoryController;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\AnesthesiaTypeController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentStatusController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DayController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DiagnoseMedicationController;
use App\Http\Controllers\DiagnosesController;
use App\Http\Controllers\EducationLevelController;
use App\Http\Controllers\FrequencyController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\MedicinesNameController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationTypeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientsInsuranceController;
use App\Http\Controllers\PatientsPasswordController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\SeverityController;
use App\Http\Controllers\SpecializationController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\WorkerController;
use App\Http\Controllers\WorkerEducationController;
use App\Http\Controllers\WorkerExperiencesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//Route::get('/verify-email/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');

///.


Route::post('/new-user', [AuthController::class, 'newUser']);



Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::middleware('jwt.auth')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('new-password', [AuthController::class, 'resetPassword']);

    Route::get('/days', [DayController::class, 'daysAll']);
    Route::get('/education-level', [EducationLevelController::class, 'educationLevelsAll']);
    Route::get('/roles', [RolesController::class, 'rolesAll']);
    Route::get('/departments', [DepartmentController::class, 'departmentsAll']);
    Route::get('/specializations', [SpecializationController::class, 'specializationsAll']);
    Route::get('/operation-types', [OperationTypeController::class, 'operationTypesAll']);
    Route::get('/anesthesia-type', [AnesthesiaTypeController::class, 'anesthesiaTypesAll']);
    Route::get('/severity', [SeverityController::class, 'severitiesAll']);
    Route::get('/allergens-category', [AllergensCategoryController::class, 'allergensCategoriesAll']);
    Route::get('/appointment-status', [AppointmentStatusController::class, 'appointmentStatusesAll']);
    Route::get('/frequency', [FrequencyController::class, 'frequenciesAll']);
    Route::get('/schedules-profile', [SchedulesController::class, 'scheduleProfile']);
    Route::get('/schedules', [SchedulesController::class, 'schedulesAll']);
    Route::get('/medicines-name', [MedicinesNameController::class, 'medicinesNamesAll']);


    //Пациенты ----------------------------------------------------------------------------------
    Route::post('/patients', [PatientController::class, 'createPatient']);
    Route::get('/patients/{id}', [PatientController::class, 'patientFind']);
    Route::put('/patients/{id}', [PatientController::class, 'patientUpdate']);
    //Пациенты ----------------------------------------------------------------------------------


    // мед полис пациента -------------------------------------------------------------------
    Route::post('/patients-insurances', [PatientsInsuranceController::class, 'createPatientsInsurance']);
    Route::get('/patients-insurances', [PatientsInsuranceController::class, 'patientsInsurancesAll']);

    // мед полис пациента -------------------------------------------------------------------


    Route::get('/patients', [PatientController::class, 'patientsAll']);


    Route::middleware(['role:Главный врач'])->group(function () {


        Route::put('/patients-insurances/{id}', [PatientsInsuranceController::class, 'patientsInsuranceUpdate']);
        Route::delete('/patients-insurances/{id}', [PatientsInsuranceController::class, 'patientsInsuranceDelete']);


        //дни -------------------------------------------------------------------
        Route::post('/days', [DayController::class, 'createDay']);
        Route::put('/days/{day}', [DayController::class, 'dayUpdate']);
        Route::delete('/days/{day}', [DayController::class, 'dayDelete']);
        //дни -------------------------------------------------------------------


        //Уровень образования-------------------------------------------------------
        Route::put('/education-level/{educationLevel}', [EducationLevelController::class, 'educationLevelUpdate']);
        Route::post('/education-level', [EducationLevelController::class, 'createEducationLevel']);
        Route::delete('/education-level/{educationLevel}', [EducationLevelController::class, 'educationLevelDelete']);
        //Уровень образования-------------------------------------------------------


        //роли---------------------------------------------------------------
        Route::post('/roles', [RolesController::class, 'createRole']);
        Route::patch('/roles/{id}', [RolesController::class, 'roleUpdate']);
        Route::delete('/roles/{id}', [RolesController::class, 'roleDelete']);
        //роли---------------------------------------------------------------


        //отдел -------------------------------------------------------------------
        Route::post('/departments', [DepartmentController::class, 'createDepartment']);
        Route::put('/departments/{departmentId}', [DepartmentController::class, 'departmentUpdate']);
        Route::delete('/departments/{departmentId}', [DepartmentController::class, 'departmentDelete']);
        //отдел -------------------------------------------------------------------


        //Специализация -------------------------------------------------------
        Route::post('/specializations', [SpecializationController::class, 'createSpecialization']);
        Route::put('/specializations/{specializationId}', [SpecializationController::class, 'specializationUpdate']);
        Route::delete('/specializations/{specializationId}', [SpecializationController::class, 'specializationDelete']);
        //Специализация -------------------------------------------------------

        //тип операции -------------------------------------------------------------------
        Route::post('/operation-types', [OperationTypeController::class, 'createOperationType']);
        Route::put('/operation-types/{operationTypeId}', [OperationTypeController::class, 'operationTypeUpdate']);
        Route::delete('/operation-types/{operationTypeId}', [OperationTypeController::class, 'operationTypeDelete']);
        //тип операции -------------------------------------------------------------------


        //тип аннестезии -------------------------------------------------------------------
        Route::post('/anesthesia-type', [AnesthesiaTypeController::class, 'createAnesthesiaType']);
        Route::put('/anesthesia-type/{anesthesiaTypeId}', [AnesthesiaTypeController::class, 'anesthesiaTypeUpdate']);
        Route::delete('/anesthesia-type/{anesthesiaTypeId}', [AnesthesiaTypeController::class, 'anesthesiaTypeDelete']);
        //тип аннестезии -------------------------------------------------------------------


        //тяжесть аллергии -------------------------------------------------------------------
        Route::post('/severity', [SeverityController::class, 'createSeverity']);
        Route::put('/severity/{severityId}', [SeverityController::class, 'severityUpdate']);
        Route::delete('/severity/{severityId}', [SeverityController::class, 'severityDelete']);
        //тяжесть аллергии -------------------------------------------------------------------


        //Алерген категории ----------------------------------------------------------------------------------
        Route::post('/allergens-category', [AllergensCategoryController::class, 'createAllergensCategory']);
        Route::put('/allergens-category/{categoryId}', [AllergensCategoryController::class, 'allergensCategoryUpdate']);
        Route::delete('/allergens-category/{categoryId}', [AllergensCategoryController::class, 'allergensCategoryDelete']);
        //Алерген категории ----------------------------------------------------------------------------------


        //статус встречи -------------------------------------------------------------------
        Route::post('/appointment/{id}/status', [AppointmentStatusController::class, 'createAppointmentStatus']);
        Route::put('/appointments/{id}/status', [AppointmentStatusController::class, 'updateAppointmentStatus']);
        Route::delete('/appointment-status/{id}', [AppointmentStatusController::class, 'appointmentStatusDelete']);
        //статус встречи -------------------------------------------------------------------


        Route::delete('/patients/{id}', [PatientController::class, 'patientDelete']);


        //Частота приема ----------------------------------------------------------------------------------
        Route::post('/frequency', [FrequencyController::class, 'createFrequency']);
        Route::put('/frequency/{id}', [FrequencyController::class, 'frequencyUpdate']);
        Route::delete('/frequency/{id}', [FrequencyController::class, 'frequencyDelete']);
        //Частота приема ----------------------------------------------------------------------------------


        //Препараты названия ----------------------------------------------------------------------------------
        Route::post('/medicines-name', [MedicinesNameController::class, 'createMedicinesName']);
        Route::put('/medicines-name/{id}', [MedicinesNameController::class, 'medicinesNameUpdate']);
        Route::delete('/medicines-name/{id}', [MedicinesNameController::class, 'medicinesNameDelete']);
        //Препараты названия ----------------------------------------------------------------------------------


        //Рассписание ----------------------------------------------------------------------------------
        Route::post('/schedules', [SchedulesController::class, 'createSchedule']);
        Route::put('/schedules/{id}', [SchedulesController::class, 'scheduleUpdate']);
        Route::delete('/schedules/{id}', [SchedulesController::class, 'scheduleDelete']);
        //Рассписание ----------------------------------------------------------------------------------

    });


//    Route::middleware('doctor_or_creator')->group(function () {
//        //Работник опыт ----------------------------------------------------------------------------------
        Route::post('/worker-experiences', [WorkerExperiencesController::class, 'createWorkerExperience']);
        Route::get('/worker-experiences', [WorkerExperiencesController::class, 'workerExperiencesAll']);
        Route::put('/worker-experiences/{id}', [WorkerExperiencesController::class, 'workerExperienceUpdate']);
        Route::delete('/worker-experiences/{id}', [WorkerExperiencesController::class, 'workerExperienceDelete']);
//        //Работник опыт ----------------------------------------------------------------------------------


//        //Работники образование ----------------------------------------------------------------------------------
        Route::post('/worker-educations', [WorkerEducationController::class, 'createWorkerEducation']);
        Route::get('/worker-educations', [WorkerEducationController::class, 'workerEducationsAll']);
        Route::put('/worker-educations/{id}', [WorkerEducationController::class, 'workerEducationUpdate']);
        Route::delete('/worker-educations/{id}', [WorkerEducationController::class, 'workerEducationDelete']);
//        //Работники образование ----------------------------------------------------------------------------------




    Route::post('/patients/{patientId}/avatar', [PatientController::class, 'updatePatientAvatar']);
//
    Route::post('/worker/avatar', [WorkerController::class, 'updateWorkerAvatar']);
    Route::get('/worker/avatar', [WorkerController::class, 'getWorkerAvatar']);
//
//
    Route::get('/workers', [WorkerController::class, 'workersAll']);
    Route::delete('/workers/{id}', [WorkerController::class, 'workerDelete']);
    Route::get("/worker-profile", [WorkerController::class, 'workerProfile']);
    Route::get('/workers/{id}', [WorkerController::class, 'workerShow']);


//// паспортные данные пациента -------------------------------------------------------------------
    Route::post('/patients-password', [PatientsPasswordController::class, 'createPatientsPassword']);
    Route::get('/patients-password', [PatientsPasswordController::class, 'patientsPasswordsAll']);
    Route::put('/patients-password/{id}', [PatientsPasswordController::class, 'patientsPasswordUpdate']);
    Route::delete('/patients-password/{id}', [PatientsPasswordController::class, 'patientsPasswordDelete']);
// паспортные данные пациента -------------------------------------------------------------------


//Операции ----------------------------------------------------------------------------------
    Route::post('/operations', [OperationController::class, 'createOperation']);
    Route::get('/operations', [OperationController::class, 'operationsAll']);
    Route::put('/operations/{id}', [OperationController::class, 'operationUpdate']);
    Route::delete('/operations/{id}', [OperationController::class, 'operationDelete']);
//Операции ----------------------------------------------------------------------------------

//Алерген категории ----------------------------------------------------------------------------------
    Route::post('/allergens', [AllergenController::class, 'createAllergen']);
    Route::get('/allergens', [AllergenController::class, 'allergensAll']);
    Route::put('/allergens/{id}', [AllergenController::class, 'allergenUpdate']);
    Route::delete('/allergens/{id}', [AllergenController::class, 'allergenDelete']);
//Алерген категории ----------------------------------------------------------------------------------


//Аллергии ----------------------------------------------------------------------------------
    Route::post('/allergy', [AllergyController::class, 'createAllergy']);
    Route::get('/allergy', [AllergyController::class, 'allergiesAll']);
    Route::put('/allergy/{id}', [AllergyController::class, 'allergyUpdate']);
    Route::delete('/allergy/{id}', [AllergyController::class, 'allergyDelete']);
//Аллергии ----------------------------------------------------------------------------------


//Даты встреч ----------------------------------------------------------------------------------
    Route::post('/appointments', [AppointmentController::class, 'createAppointment']);
    Route::get('/appointments', [AppointmentController::class, 'appointmentsAll']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'appointmentUpdate']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'appointmentDelete']);
//Даты встреч ----------------------------------------------------------------------------------

//Диагнозы ----------------------------------------------------------------------------------
    Route::post('/diagnoses', [DiagnosesController::class, 'createDiagnose']);
    Route::get('/diagnoses', [DiagnosesController::class, 'diagnosesAll']);
    Route::put('/diagnoses/{id}', [DiagnosesController::class, 'diagnoseUpdate']);
    Route::delete('/diagnoses/{id}', [DiagnosesController::class, 'diagnoseDelete']);
//Диагнозы ----------------------------------------------------------------------------------

//препараты ----------------------------------------------------------------------------------
    Route::post('/diagnoses/{id}/medications', [MedicationController::class, 'createMedication']);
    Route::get('/diagnoses/{id}/medications', [MedicationController::class, 'medicationsAll']);
    Route::put('/diagnoses/medications/{id}', [MedicationController::class, 'medicationUpdate']);
    Route::delete('/diagnoses/medications/{id}', [MedicationController::class, 'medicationDelete']);
//препараты ----------------------------------------------------------------------------------

//});

});

