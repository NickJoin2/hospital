// Импорты
import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch } from 'react-redux'; // ✅ Нужен для dispatch
import { authApi } from "../redux/auth/authApi.js"; // ✅ Импортируем API
import CryptoJS from 'crypto-js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("access_token"));
    const SECRET_KEY = 'my-secret-key';

    // Расшифровываем роль при инициализации
    const getDecryptedRole = () => {
        try {
            const encryptedRole = localStorage.getItem("role");
            if (!encryptedRole) return null;
            const bytes = CryptoJS.AES.decrypt(encryptedRole, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.error("Ошибка расшифровки роли", e);
            return null;
        }
    };

    const [role, setRoleState] = useState(getDecryptedRole());
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch(); // ✅ Получаем dispatch

    const setAuthTokens = (newToken, newRefreshToken, newRole) => {
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        const encodedRole = CryptoJS.AES.encrypt(newRole, SECRET_KEY).toString();
        localStorage.setItem("role", encodedRole);

        setToken(newToken);
        setRoleState(newRole);
    };

    const logout = useCallback(async () => {
        try {
            // ✅ Правильный вызов мутации
            await dispatch(authApi.endpoints.logout.initiate()).unwrap();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("role");

            setToken(null);
            setRoleState(null);
            navigate("/authentication", { replace: true });
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        if (!token && location.pathname !== "/authentication") {
            navigate("/authentication");
        } else if (token && location.pathname === "/authentication") {
            navigate("/profile", { replace: true });
        }

        setIsLoading(false);
    }, [token, navigate, location.pathname]);

    return (
        <AuthContext.Provider value={{
            token,
            role,
            auth: Boolean(token),
            isLoading,
            logout,
            setAuthTokens
        }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};