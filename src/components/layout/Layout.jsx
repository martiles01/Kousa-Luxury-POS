import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, onLogout, reportFilter, setReportFilter }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-gray-100 font-montserrat relative">
            <Sidebar onLogout={onLogout} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 min-h-screen transition-all duration-300 w-full overflow-x-hidden">
                <Header reportFilter={reportFilter} setReportFilter={setReportFilter} onMenuClick={() => setIsMobileMenuOpen(true)} />
                {children}
            </main>
        </div>
    );
};

export default Layout;
