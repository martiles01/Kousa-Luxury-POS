import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, onLogout, reportFilter, setReportFilter }) => {
    return (
        <div className="flex min-h-screen w-full bg-gray-100 font-montserrat">
            <Sidebar onLogout={onLogout} />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <Header reportFilter={reportFilter} setReportFilter={setReportFilter} />
                {children}
            </main>
        </div>
    );
};

export default Layout;
