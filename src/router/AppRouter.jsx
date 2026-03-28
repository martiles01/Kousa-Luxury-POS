import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../views/Dashboard';
import WashQueue from '../views/WashQueue';
import POS from '../views/POS';
import Inventory from '../views/Inventory';
import Fleet from '../views/Fleet';
import Employees from '../views/Employees';
import Reports from '../views/Reports';
import Config from '../views/Config';
import Users from '../views/Users';
import Login from '../views/Login';

const AppRouter = ({ 
    session, 
    authProps, 
    viewProps, 
    layoutProps 
}) => {
    if (!session) {
        return <Login {...authProps} />;
    }

    return (
        <Layout {...layoutProps}>
            <Routes>
                <Route path="/" element={<Dashboard {...viewProps.dashboard} />} />
                <Route path="/queue" element={<WashQueue {...viewProps.washQueue} />} />
                <Route path="/pos" element={<POS {...viewProps.pos} />} />
                <Route path="/inventory" element={<Inventory {...viewProps.inventory} />} />
                <Route path="/fleet" element={<Fleet {...viewProps.fleet} />} />
                <Route path="/employees" element={<Employees {...viewProps.employees} />} />
                <Route path="/reports" element={<Reports {...viewProps.reports} />} />
                <Route path="/users" element={<Users {...viewProps.users} />} />
                <Route path="/config" element={<Config {...viewProps.config} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

export default AppRouter;
