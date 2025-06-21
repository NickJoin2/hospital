import {combineReducers} from "@reduxjs/toolkit";
import {allergiesApi} from "./allergies/allergiesApi.js";
import {allergyAllergenApi} from "./allergies/allergyAllergenApi.js";
import {allergyReactionApi} from "./allergies/allergyReactionApi.js";
import {authApi} from "./auth/authApi.js";
import {diagnoseDrugApi} from "./diagnoses/diagnoseDrugApi.js";
import {diagnoseApi} from "./diagnoses/diagnoseApi.js";
import {drugFormatApi} from "./drugs/drugFormatApi.js";
import {drugFrequencyApi}from "./drugs/drugReceptionFrequencyApi.js";
import {severityApi} from "./drugs/drugReceptionApi.js";
import {drugStorageApi} from "./drugs/drugStorageApi.js";
import {anesthesiaTypeApi} from "./operations/anesthesiaTypeApi.js";
import {departmentsApi} from "./other/departmentsApi.js";
import {rolesApi} from "./other/rolesApi.js";
import {patientInsuranceApi} from "./patients/patientInsurancesApi.js";
import {patientApi} from "./patients/patientsApi.js";
import {schedulesApi} from "./schedules/schedulesApi.js";
import {weekdayApi} from "./schedules/weekdayApi.js";
import {workerDetailsApi} from "./worker/workerDetailsApi.js";
import {workerEducationsApi} from "./worker/workerEducationApi.js";
import {workerEducationLevelsApi} from "./worker/workerEducationLevelApi.js";
import {workerExperiencesApi} from "./worker/workerExperiencesApi.js";
import {workersApi} from "./worker/workersApi.js";
import {workerSpecializationApi} from "./worker/workerSpecializationApi.js";
import {allergenCategoryApi} from "./allergies/allergenCategory.js";
import {patientPasswordApi} from "./patients/patientPasswordApi.js";
import {medicineNameApi} from "./drugs/medicineNameApi.js";
import {operationTypeApi} from "./operations/operationTypeApi.js";
import {operationApi} from "./operations/operationsApi.js";
import {appointmentStatusApi} from "./appointment/appointmentStatus.js";
import {appointmentApi} from "./appointment/apointmentsApi.js";
import {diagnoseMedicationApi} from "./diagnoses/diagnoseMedicationApi.js";
import {frequencyApi} from "./diagnoses/frequencyApi.js";


export const rootReducer = combineReducers({
    [workersApi.reducerPath]: workersApi.reducer,
    // [allergiesApi.reducerPath]: allergiesApi.reducer,
    [allergyAllergenApi.reducerPath]: allergiesApi.reducer,
    // [allergyReactionApi.reducerPath]: allergiesApi.reducer,
    [allergenCategoryApi.reducerPath]: allergenCategoryApi.reducer,
    [authApi.reducerPath]: allergiesApi.reducer,
    // [diagnoseDrugApi.reducerPath]: allergiesApi.reducer,
    [diagnoseApi.reducerPath]: diagnoseApi.reducer,
    [medicineNameApi.reducerPath]: medicineNameApi.reducer,
    // [drugFormatApi.reducerPath]: drugFormatApi.reducer,
    // [drugFrequencyApi.reducerPath]: drugFormatApi.reducer,
    [severityApi.reducerPath]: severityApi.reducer,
    // [drugStorageApi.reducerPath]: drugStorageApi.reducer,
    [operationTypeApi.reducerPath]: operationTypeApi.reducer,
    [anesthesiaTypeApi.reducerPath]: anesthesiaTypeApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [patientPasswordApi.reducerPath]: patientPasswordApi.reducer,
    [patientInsuranceApi.reducerPath]: patientInsuranceApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [schedulesApi.reducerPath]: schedulesApi.reducer,
    [weekdayApi.reducerPath]: weekdayApi.reducer,
    // [workerDetailsApi.reducerPath]: workerDetailsApi.reducer,
    // [workerEducationsApi.reducerPath]: workerDetailsApi.reducer,
    [workerEducationLevelsApi.reducerPath]: workerEducationLevelsApi.reducer,
    // [workerExperiencesApi.reducerPath]: workerExperiencesApi.reducer,
    [workerSpecializationApi.reducerPath]: workerSpecializationApi.reducer,
    // [operationApi.reducerPath]: operationApi.reducer,
    [appointmentStatusApi.reducerPath]: appointmentStatusApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    // [diagnoseMedicationApi.reducerPath]: diagnoseMedicationApi.reducer,
    [frequencyApi.reducerPath]: frequencyApi.reducer,
})