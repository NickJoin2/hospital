import { useContext } from "react";
import { AuthContext } from "../app/hoc/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, rolesRequired }) => {
    const { auth, role } = useContext(AuthContext);

    if (!auth) {
        return <Navigate to="/authentication" replace />;
    }

    if (role !== "Главный врач") {
        return <Navigate to="/profile" replace />;
    }

    if (rolesRequired) {
        const allowedRoles = Array.isArray(rolesRequired) ? rolesRequired : [rolesRequired];
        if (!allowedRoles.includes(role)) {
            return <Navigate to="/profile" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
