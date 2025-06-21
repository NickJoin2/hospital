import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./rootReducer.js";
import {allergiesApi} from "./allergies/allergiesApi.js";
import {allergyAllergenApi} from "./allergies/allergyAllergenApi.js";
import {allergyReactionApi} from "./allergies/allergyReactionApi.js";

import {allergyStatusApi} from "./allergies/allergyStatusApi.js";
import {authApi} from "./auth/authApi.js";
import {diagnoseDrugApi} from "./diagnoses/diagnoseDrugApi.js";
import {diagnoseApi} from "./diagnoses/diagnoseApi.js";
import {medicineNameApi} from "./drugs/medicineNameApi.js";
import {drugFormatApi} from "./drugs/drugFormatApi.js";
import {drugFrequencyApi} from "./drugs/drugReceptionFrequencyApi.js";
import {drugStorageApi} from "./drugs/drugStorageApi.js";
import {departmentsApi} from "./other/departmentsApi.js";
import {rolesApi} from "./other/rolesApi.js";
import {patientPasswordApi} from "./patients/patientPasswordApi.js";
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
import {anesthesiaTypeApi} from "./operations/anesthesiaTypeApi.js";
import {severityApi} from "./drugs/drugReceptionApi.js";
import {allergenCategoryApi} from "./allergies/allergenCategory.js";
import {operationTypeApi} from "./operations/operationTypeApi.js";
import {setupListeners} from "@reduxjs/toolkit/query";
import {operationApi} from "./operations/operationsApi.js";
import {appointmentStatusApi} from "./appointment/appointmentStatus.js";
import {appointmentApi} from "./appointment/apointmentsApi.js";
import {diagnoseMedicationApi} from "./diagnoses/diagnoseMedicationApi.js";
import {frequencyApi} from "./diagnoses/frequencyApi.js";


const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            departmentsApi.middleware,
            rolesApi.middleware,
            workerSpecializationApi.middleware,
            workerEducationLevelsApi.middleware,
            workerEducationsApi.middleware,
            workerExperiencesApi.middleware,
            patientApi.middleware,
            patientPasswordApi.middleware,
            patientInsuranceApi.middleware,
            weekdayApi.middleware,
            medicineNameApi.middleware,
            drugFrequencyApi.middleware,
            operationTypeApi.middleware,
            anesthesiaTypeApi.middleware,
            severityApi.middleware,
            allergenCategoryApi.middleware,
            workersApi.middleware,
            operationApi.middleware,
            appointmentStatusApi.middleware,
            appointmentApi.middleware,
            diagnoseMedicationApi.middleware,
            frequencyApi.middleware,



            allergiesApi.middleware,
            allergyAllergenApi.middleware,
            allergyReactionApi.middleware,
            allergyStatusApi.middleware,

            diagnoseDrugApi.middleware,
            diagnoseApi.middleware,
            drugFormatApi.middleware,

            drugStorageApi.middleware,

            schedulesApi.middleware,
            workerDetailsApi.middleware,


        ),
})

setupListeners(store.dispatch);

export default store;