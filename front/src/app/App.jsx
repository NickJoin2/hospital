import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {lazy, Suspense} from 'react';
import Layout from '../pages/Layout.jsx';
import {AuthProvider} from './hoc/AuthContext.jsx';
import PrivateRoute from '../widgets/PrivateRoute.jsx';
import Spiner from '../widgets/other/Spiner.jsx';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './style/app.css';
import NewPassword from "../pages/NewPassword.jsx";

// Ленивая загрузка
const Patients = lazy(() => import('../pages/Patients.jsx'));
const Authentication = lazy(() => import('../pages/Authentication.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const PatientProfile = lazy(() => import('../pages/PatientProfile.jsx'));
const Workers = lazy(() => import('../pages/Workers.jsx'));
const WorkerProfile = lazy(() => import('../pages/WorkerProfile.jsx'));
const PageAdmin = lazy(() => import('../pages/AdminPage.jsx'));
const ProfileSchedule = lazy(() => import('../pages/SchedulesProfile.jsx'));
const Appointments = lazy(() => import('../pages/Appointments.jsx'));
const ScheduleAdmin = lazy(() => import('../pages/SchedulesAdmin.jsx'));
const AllergenCategoryRead = lazy(() => import('../widgets/allergies/AllergenCategoryRead.jsx'));
const Roles = lazy(() => import('../pages/Roles.jsx'));
const Weekday = lazy(() => import('../pages/Weekdays.jsx'));
const SeverityRead = lazy(() => import('../widgets/allergies/SeverityRead.jsx'));
const Departments = lazy(() => import('../pages/Departments.jsx'));
const OperationsDetails = lazy(() => import('../widgets/operations/OperationsDetails.jsx'));
const WorkerEducationDetails = lazy(() => import('../pages/WorkerEducationDetails.jsx'));
const Drugs = lazy(() => import('../pages/Drugs.jsx'));
const RegisterUser = lazy(() => import('../pages/Registration.jsx'));




const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={300}>
                <Routes location={location}>
                    <Route index element={<Navigate to="/authentication" replace />} />

                    <Route path="/" element={<Layout />}>
                        <Route path="/authentication" element={<Authentication />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/patient/:id" element={<PatientProfile />} />
                        <Route path="/new-password" element={<NewPassword />} />

                        <Route path="/profile" element={<Profile />} />
                        <Route path="/appointments" element={<Appointments />} />

                        <Route path="/workers" element={<Workers />} />
                        <Route path="/worker/:id" element={<WorkerProfile />} />
                        <Route path="/profile-schedule" element={<ProfileSchedule />} />

                        <Route path="/page-admin" element={<PrivateRoute rolesRequired="Главный врач"><PageAdmin /></PrivateRoute>}/>
                        <Route
                            path="/allergen-category"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <AllergenCategoryRead />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/operations-details"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <OperationsDetails />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/worker-education-details"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <WorkerEducationDetails />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/severity"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <SeverityRead />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/roles"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <Roles />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/departments"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <Departments />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/weekdays"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <Weekday />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/drugs"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <Drugs />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/registration-worker"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <RegisterUser />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/schedules-admin"
                            element={
                                <PrivateRoute rolesRequired="Главный врач">
                                    <ScheduleAdmin />
                                </PrivateRoute>
                            }
                        />
                    </Route>
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<Spiner />}>
                    <AnimatedRoutes />
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;