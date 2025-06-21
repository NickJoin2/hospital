import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "../widgets/Header.jsx";
import Footer from "../widgets/Footer.jsx";

const Layout = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header/>

                <main className="flex-1">
                    <Outlet/>
                </main>

                <Footer/>
            </div>
        </>
    );
};

export default Layout;