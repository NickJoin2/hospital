import React from 'react';
import {FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaTwitter} from "react-icons/fa";
import {Link} from "react-router-dom";

const Footer = () => {

    const hideFooterOn = ["/authentication"];

    const shouldShowFooter = !hideFooterOn.includes(location.pathname);

    if(!shouldShowFooter) {
        return null
    }

    return (
        <footer className="bg-gray-800 text-white py-8 mt-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">О нас</h3>
                        <p className="text-gray-300">
                            Hospital предоставляет исключительные медицинские услуги, уделяя особое внимание заботе о пациентах и инновациям.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Ссылки</h3>
                        <ul className="space-y-2">
                            <li><Link to="/profile" className="text-gray-300 hover:text-white">Профиль</Link></li>
                            <li><Link to="/profile-schedule" className="text-gray-300 hover:text-white">Расписание</Link></li>
                            <li><Link to="/workers" className="text-gray-300 hover:text-white">Сотрудники</Link></li>
                            <li><Link to="/patients" className="text-gray-300 hover:text-white">Пациенты</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Контакты</h3>
                        <div className="space-y-2">
                            <p className="flex items-center">
                                <FaPhone className="mr-2"/> +7 (345) 236-3689
                            </p>
                            <p className="flex items-center">
                                <FaEnvelope className="mr-2"/> contact@hospital.ru
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

)
    ;
};

export default Footer;