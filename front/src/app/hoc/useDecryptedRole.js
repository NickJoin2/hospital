import { useContext } from "react";
import {AuthContext} from "./AuthContext.jsx";
import { AES } from 'crypto-js';

export const useDecryptedRole = () => {
    const { role: encryptedRole } = useContext(AuthContext);
    const SECRET_KEY = 'my-secret-key';

    try {
        const bytes = AES.decrypt(encryptedRole, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("Ошибка расшифровки роли", e);
        return null;
    }
};