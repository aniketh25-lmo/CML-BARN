import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
return (
    <>
        <Header />
        <div className="w-[85vw] mx-auto" style={{ minHeight: '85vh' }}>
            <Outlet />
        </div>
        <Footer />
    </>
);
};

export default RootLayout;
