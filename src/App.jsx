import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import AppRouter from './router/AppRouter';

// Commponents & Views
import WashModal from './components/modals/WashModal';
import InventoryModal from './components/modals/InventoryModal';
import EditInventoryModal from './components/modals/EditInventoryModal';
import CompanyModal from './components/modals/CompanyModal';
import FleetModal from './components/modals/FleetModal';
import UserModal from './components/modals/UserModal';
import EditUserModal from './components/modals/EditUserModal';
import EmployeeModal from './components/modals/EmployeeModal';

// Constants
import { ITBIS_RATE } from './utils/constants';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // Authentication State
    const [session, setSession] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState('Agente');
    const [authView, setAuthView] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Business Data State
    const [washQueue, setWashQueue] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [salesHistory, setSalesHistory] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [fleetVehicles, setFleetVehicles] = useState([]);
    const [ncfSequences, setNcfSequences] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);

    // UI/UX State
    const [reportFilter, setReportFilter] = useState('today');
    const [typeFilter, setTypeFilter] = useState('all');
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [fiscalData, setFiscalData] = useState({ rnc: '', name: '', type: 'final' });
    const [selectedWashPay, setSelectedWashPay] = useState(null);
    const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState(null);

    // Modal Control State
    const [isWashModalOpen, setIsWashModalOpen] = useState(false);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isDashboardCustomizing, setIsDashboardCustomizing] = useState(false);

    // Dashboard Customization State
    const [dashboardConfig, setDashboardConfig] = useState(() => {
        const saved = localStorage.getItem('kousa_dashboard_config');
        return saved ? JSON.parse(saved) : {
            quickAccess: true,
            statsCards: true,
            activityQueue: true,
            revenueBreakdown: true,
            popularServices: true,
            recentSales: true,
            newOrderCard: true
        };
    });

    // Save Dashboard Config
    useEffect(() => {
        localStorage.setItem('kousa_dashboard_config', JSON.stringify(dashboardConfig));
    }, [dashboardConfig]);

    // Editing State
    const [editingItem, setEditingItem] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedCompanyForFleet, setSelectedCompanyForFleet] = useState(null);
    const [newFleetPlate, setNewFleetPlate] = useState('');

    // Form States
    const [newWash, setNewWash] = useState({
        plate: '',
        model: '',
        type: 'car',
        gama: 'estandar',
        service_id: '',
        employee_id: '',
        client_phone: ''
    });
    const [itemsToCreate, setItemsToCreate] = useState({ name: '', price: '', stock: '', category: 'Agua', icon: '📦' });
    const [newCompany, setNewCompany] = useState({ name: '', rnc: '', phone: '', email: '' });
    const [newEmployee, setNewEmployee] = useState({ name: '', phone: '', role: 'Lavador', commission_rate: 10 });
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'Agente' });

    // Initial Auth & Data Fetch
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchUserProfile(session.user.id);
                fetchData();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchUserProfile(session.user.id);
                fetchData();
            } else {
                setCurrentUserRole('Agente');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Refresh Data when filters change
    useEffect(() => {
        if (session) fetchData();
    }, [reportFilter]);

    const fetchUserProfile = async (id) => {
        const { data } = await supabase.from('user_profiles').select('role').eq('id', id).single();
        if (data) setCurrentUserRole(data.role);
    };

    const fetchData = async () => {
        try {
            const [
                { data: queue },
                { data: inv },
                { data: serv },
                { data: emp },
                { data: comp },
                { data: fleet },
                { data: ncf },
                { data: profiles }
            ] = await Promise.all([
                supabase.from('wash_queue').select('*, services(name, price), employees(name)').order('created_at', { ascending: false }),
                supabase.from('inventory').select('*').order('name'),
                supabase.from('services').select('*').order('name'),
                supabase.from('employees').select('*').order('name'),
                supabase.from('companies').select('*').order('name'),
                supabase.from('fleet_vehicles').select('*'),
                supabase.from('ncf_sequences').select('*'),
                supabase.from('user_profiles').select('*')
            ]);

            setWashQueue(queue || []);
            setInventory(inv || []);
            setServices(serv || []);
            setEmployees(emp || []);
            setCompanies(comp || []);
            setFleetVehicles(fleet || []);
            setNcfSequences(ncf || []);
            setUserProfiles(profiles || []);

            // Handle Sales Filtering locally for speed or via API if too large
            let salesQuery = supabase.from('sales').select('*, services(name), sale_items(*)').order('created_at', { ascending: false });

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (reportFilter === 'today') {
                salesQuery = salesQuery.gte('created_at', today.toISOString());
            } else if (reportFilter === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                salesQuery = salesQuery.gte('created_at', weekAgo.toISOString());
            } else if (reportFilter === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                salesQuery = salesQuery.gte('created_at', monthAgo.toISOString());
            }

            const { data: sales } = await salesQuery;
            setSalesHistory(sales || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // --- Handlers ---

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAuthError('');
        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
        if (error) setAuthError(error.message);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, { redirectTo: window.location.origin });
        if (error) setAuthError(error.message);
        else setSuccessMessage('Revisa tu correo para el enlace de recuperación.');
        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: loginPassword });
        if (error) setAuthError(error.message);
        else navigate('/');
        setLoading(false);
    };

    const handleAddWash = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('wash_queue').insert([{
            vehicle_plate: newWash.plate,
            vehicle_model: newWash.model,
            service_id: newWash.service_id,
            employee_id: newWash.employee_id || null,
            client_phone: newWash.client_phone || null,
            status: 'pending',
            progress: 0
        }]);
        if (!error) {
            setIsWashModalOpen(false);
            setNewWash({ plate: '', model: '', type: 'car', gama: 'estandar', service_id: '', employee_id: '', client_phone: '' });
            fetchData();
        }
    };

    const updateProgress = async (id, current) => {
        const nextProgress = current === 0 ? 30 : current === 30 ? 60 : current === 60 ? 80 : 100;
        const nextStatus = nextProgress === 100 ? 'ready' : 'in_progress';
        await supabase.from('wash_queue').update({ progress: nextProgress, status: nextStatus }).eq('id', id);
        fetchData();
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleCheckout = async (method, washPay) => {
        try {
            let ncf = null;
            const subtotal = (cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)) + (washPay?.services?.price || 0);
            const tax = subtotal * ITBIS_RATE;
            const total = subtotal + tax;

            // Generate NCF
            const seq = ncfSequences.find(s => s.is_active && s.type === fiscalData.type);
            if (seq) {
                ncf = `${seq.prefix}${String(seq.current_number).padStart(8, '0')}`;
                await supabase.from('ncf_sequences').update({ current_number: seq.current_number + 1 }).eq('id', seq.id);
            }

            const { data: sale, error: saleError } = await supabase.from('sales').insert([{
                payment_method: method,
                total_amount: total,
                service_id: washPay?.service_id || null,
                vehicle_plate: washPay?.vehicle_plate || null,
                ncf: ncf,
                client_name: fiscalData.name || null,
                client_rnc: fiscalData.rnc || null,
                invoice_type: fiscalData.type
            }]).select().single();

            if (saleError) throw saleError;

            // Insert items
            if (cart.length > 0) {
                await supabase.from('sale_items').insert(cart.map(item => ({
                    sale_id: sale.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })));

                // Update stock
                await Promise.all(cart.map(item =>
                    supabase.from('inventory').update({ stock: item.stock - item.quantity }).eq('id', item.id)
                ));
            }

            // Mark wash as completed
            if (washPay) {
                await supabase.from('wash_queue').update({ status: 'completed' }).eq('id', washPay.id);
            }

            // Cleanup & Feedback
            setSelectedSaleForInvoice(sale);
            setCart([]);
            setSelectedWashPay(null);
            setSuccessMessage('Checkout completado correctamente.');
            fetchData();
            setTimeout(() => { if (window.confirm('¿Desea imprimir la factura?')) window.print(); }, 500);

        } catch (error) {
            console.error("Checkout error:", error);
            setAuthError('Error procesando el pago. Intenta de nuevo.');
        }
    };

    const handleDeleteWash = async (id) => {
        if (window.confirm('¿Eliminar servicio de la cola?')) {
            await supabase.from('wash_queue').delete().eq('id', id);
            fetchData();
        }
    };

    const handleAddInventoryItem = async (e) => {
        e.preventDefault();
        await supabase.from('inventory').insert([itemsToCreate]);
        setIsInventoryModalOpen(false);
        setItemsToCreate({ name: '', price: '', stock: '', category: 'Agua', icon: '📦' });
        fetchData();
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        await supabase.from('inventory').update(editingItem).eq('id', editingItem.id);
        setIsEditModalOpen(false);
        setEditingItem(null);
        fetchData();
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Eliminar producto?')) {
            await supabase.from('inventory').delete().eq('id', id);
            fetchData();
        }
    };

    const handleAddCompany = async (e) => {
        e.preventDefault();
        await supabase.from('companies').insert([newCompany]);
        setIsCompanyModalOpen(false);
        setNewCompany({ name: '', rnc: '', phone: '', email: '' });
        fetchData();
    };

    const handleDeleteCompany = async (id) => {
        if (window.confirm('¿Eliminar empresa?')) {
            await supabase.from('companies').delete().eq('id', id);
            fetchData();
        }
    };

    const handleAddFleetVehicle = async (e) => {
        e.preventDefault();
        await supabase.from('fleet_vehicles').insert([{ company_id: selectedCompanyForFleet.id, plate: newFleetPlate }]);
        setNewFleetPlate('');
        fetchData();
    };

    const handleDeleteFleetVehicle = async (plate) => {
        await supabase.from('fleet_vehicles').delete().eq('plate', plate);
        fetchData();
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        await supabase.from('employees').insert([newEmployee]);
        setIsEmployeeModalOpen(false);
        setNewEmployee({ name: '', phone: '', role: 'Lavador', commission_rate: 10 });
        fetchData();
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('¿Eliminar empleado?')) {
            await supabase.from('employees').delete().eq('id', id);
            fetchData();
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({ email: newUser.email, password: newUser.password });
        if (error) alert(error.message);
        else {
            await supabase.from('user_profiles').insert([{ id: data.user.id, email: newUser.email, role: newUser.role }]);
            setIsUserModalOpen(false);
            setNewUser({ email: '', password: '', role: 'Agente' });
            fetchData();
        }
    };

    const handleUpdateUserRole = async (id, role) => {
        await supabase.from('user_profiles').update({ role }).eq('id', id);
        setIsEditUserModalOpen(false);
        setEditingUser(null);
        fetchData();
    };

    const handleDeleteUserProfile = async (id) => {
        if (window.confirm('¿Eliminar acceso?')) {
            await supabase.from('user_profiles').delete().eq('id', id);
            fetchData();
        }
    };

    const handleUpdateNCF = async (id, value) => {
        await supabase.from('ncf_sequences').update({ current_number: parseInt(value) }).eq('id', id);
        fetchData();
    };

    const handlePrintInvoice = (sale) => {
        setSelectedSaleForInvoice(sale);
        setTimeout(() => window.print(), 100);
    };

    // --- Props Preparation ---

    const stats = {
        activeWashes: washQueue.filter(w => w.status !== 'completed').length,
        activeBays: washQueue.filter(w => w.status === 'in_progress').length,
    };

    const revenueBreakdown = {
        washes: salesHistory.filter(s => s.service_id).reduce((acc, s) => acc + Number(s.total_amount), 0),
        products: salesHistory.filter(s => !s.service_id).reduce((acc, s) => acc + Number(s.total_amount), 0)
    };

    const serviceMetrics = Object.values(salesHistory.filter(s => s.services).reduce((acc, sale) => {
        const name = sale.services.name;
        if (!acc[name]) acc[name] = { name, count: 0 };
        acc[name].count += 1;
        return acc;
    }, {})).sort((a, b) => b.count - a.count);

    const authProps = {
        authView, setAuthView, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
        authError, setAuthError, successMessage, setSuccessMessage, loading,
        handleLogin, handleResetPassword, handleUpdatePassword
    };

    const layoutProps = {
        onLogout: handleLogout,
        reportFilter, setReportFilter
    };

    const viewProps = {
        dashboard: { 
            stats, 
            revenueBreakdown, 
            ncfSequences, 
            washQueue, 
            serviceMetrics, 
            salesHistory, 
            setIsWashModalOpen, 
            setActiveTab: (tab) => navigate(`/${tab === 'dashboard' ? '' : tab}`),
            dashboardConfig,
            setDashboardConfig,
            isDashboardCustomizing,
            setIsDashboardCustomizing
        },
        washQueue: { washQueue, setIsWashModalOpen, handleDeleteWash, updateProgress, setSelectedWashPay, setActiveTab: (tab) => navigate(`/${tab}`) },
        pos: { inventory, addToCart, cart, setCart, selectedWashPay, setSelectedWashPay, fiscalData, setFiscalData, paymentMethod, setPaymentMethod, fleetVehicles, handleCheckout },
        inventory: { inventory, setIsInventoryModalOpen, setEditingItem, setIsEditModalOpen, handleDeleteProduct, fetchData },
        fleet: { companies, fleetVehicles, handleDeleteCompany, setIsCompanyModalOpen, setSelectedCompanyForFleet, setIsFleetModalOpen },
        employees: { employees, setIsEmployeeModalOpen, handleDeleteEmployee },
        reports: { reportFilter, setReportFilter, revenueBreakdown, typeFilter, setTypeFilter, salesHistory, serviceMetrics, handlePrintInvoice },
        users: { currentUserRole, setIsUserModalOpen, userProfiles, setEditingUser, setIsEditUserModalOpen, handleDeleteUserProfile, session },
        config: { currentUserRole, session, ncfSequences, handleUpdateNCF, handleLogout }
    };

    return (
        <>
            <AppRouter session={session} authProps={authProps} viewProps={viewProps} layoutProps={layoutProps} />

            {/* Modals */}
            <WashModal
                isOpen={isWashModalOpen}
                onClose={() => setIsWashModalOpen(false)}
                newWash={newWash}
                setNewWash={setNewWash}
                handleAddWash={handleAddWash}
                fleetVehicles={fleetVehicles}
                companies={companies}
                employees={employees}
                services={services}
            />

            <InventoryModal
                isOpen={isInventoryModalOpen}
                onClose={() => setIsInventoryModalOpen(false)}
                itemsToCreate={itemsToCreate}
                setItemsToCreate={setItemsToCreate}
                handleAddInventoryItem={handleAddInventoryItem}
            />

            <EditInventoryModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                handleUpdateProduct={handleUpdateProduct}
            />

            <CompanyModal
                isOpen={isCompanyModalOpen}
                onClose={() => setIsCompanyModalOpen(false)}
                newCompany={newCompany}
                setNewCompany={setNewCompany}
                handleAddCompany={handleAddCompany}
            />

            <FleetModal
                isOpen={isFleetModalOpen}
                onClose={() => { setIsFleetModalOpen(false); setSelectedCompanyForFleet(null); setNewFleetPlate(''); }}
                selectedCompanyForFleet={selectedCompanyForFleet}
                newFleetPlate={newFleetPlate}
                setNewFleetPlate={setNewFleetPlate}
                handleAddFleetVehicle={handleAddFleetVehicle}
                handleDeleteFleetVehicle={handleDeleteFleetVehicle}
                fleetVehicles={fleetVehicles}
            />

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                newUser={newUser}
                setNewUser={setNewUser}
                handleCreateUser={handleCreateUser}
            />

            <EditUserModal
                isOpen={isEditUserModalOpen}
                onClose={() => { setIsEditUserModalOpen(false); setEditingUser(null); }}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                handleUpdateUserRole={handleUpdateUserRole}
            />

            <EmployeeModal
                isOpen={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
                newEmployee={newEmployee}
                setNewEmployee={setNewEmployee}
                handleAddEmployee={handleAddEmployee}
            />

            {/* Printable Invoice (Hidden) */}
            <div id="invoice-print" className="hidden print:block p-10 bg-white font-serif text-slate-900">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                    <div className="flex gap-6 items-center">
                        <div className="bg-white p-2 rounded-xl border border-slate-100 w-32 h-32 flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="KOUSA Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest">Auto Import & Care</p>
                            <div className="mt-2 text-[10px] leading-tight opacity-60 font-mono">
                                <p>Av. Metropolitana #3, Los Jardines</p>
                                <p>Santiago, Rep. Dom.</p>
                                <p>Tel: (809) 583-8994</p>
                                <p>Instagram: @kousaluxury</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-black uppercase tracking-widest leading-none text-luxury-blue mb-1">
                            {selectedSaleForInvoice?.invoice_type === 'fiscal' ? 'Factura Crédito Fiscal' : 'Factura de Consumo'}
                        </h2>
                        <p className="text-lg font-bold">#{String(selectedSaleForInvoice?.sale_number || 0).padStart(4, '0')}</p>
                        <p className="text-[10px] mt-2 opacity-60">{selectedSaleForInvoice && new Date(selectedSaleForInvoice.created_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mb-8 flex justify-between text-xs">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-40 mb-1">Cajero / Agente</p>
                        <p className="font-bold">{session?.user?.email}</p>
                    </div>
                    <div className="text-center">
                        {selectedSaleForInvoice?.vehicle_plate && (
                            <>
                                <p className="text-[10px] font-black uppercase opacity-40 mb-1">Vehículo</p>
                                <p className="font-bold">{selectedSaleForInvoice.vehicle_plate}</p>
                            </>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase opacity-40 mb-1">Método de Pago</p>
                        <p className="font-bold">{selectedSaleForInvoice?.payment_method}</p>
                    </div>
                </div>

                {(selectedSaleForInvoice?.client_name || selectedSaleForInvoice?.client_rnc) && (
                    <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase opacity-40">Cliente / Razón Social</p>
                                <p className="font-bold">{selectedSaleForInvoice.client_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase opacity-40">RNC / Cédula</p>
                                <p className="font-bold">{selectedSaleForInvoice.client_rnc}</p>
                            </div>
                        </div>
                        {selectedSaleForInvoice.ncf && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-[9px] font-black uppercase opacity-40">NCF</p>
                                <p className="font-black text-sm tracking-tighter">{selectedSaleForInvoice.ncf}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-4 mb-10">
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-40 border-b border-slate-200 pb-2">
                        <span>Descripción</span>
                        <span>Total</span>
                    </div>
                    {selectedSaleForInvoice?.services && (
                        <div className="flex justify-between text-sm py-2">
                            <div>
                                <p className="font-bold uppercase">{selectedSaleForInvoice.services.name}</p>
                                <p className="text-[10px] opacity-60 italic">Servicio de Lavado</p>
                            </div>
                            <span className="font-bold">RD${Number(selectedSaleForInvoice.total_amount / (1 + ITBIS_RATE)).toFixed(2)}</span>
                        </div>
                    )}
                    {selectedSaleForInvoice?.sale_items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1">
                            <span>{item.quantity}x Producto ID: {item.product_id}</span>
                            <span className="font-bold">RD${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t-2 border-slate-900 pt-6 space-y-2 text-right">
                    <div className="flex justify-between text-xs">
                        <span className="opacity-40 uppercase font-black">Subtotal</span>
                        <span className="font-bold">RD${(selectedSaleForInvoice?.total_amount / (1 + ITBIS_RATE)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="opacity-40 uppercase font-black">ITBIS (18%)</span>
                        <span className="font-bold">RD${(selectedSaleForInvoice?.total_amount - (selectedSaleForInvoice?.total_amount / (1 + ITBIS_RATE))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-4">
                        <span className="uppercase tracking-tighter">Total Final</span>
                        <span>RD${Number(selectedSaleForInvoice?.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="mt-16 text-center space-y-4">
                    <div className="flex justify-center gap-10 opacity-60">
                        <div className="border-t border-slate-400 pt-2 w-32">
                            <p className="text-[8px] uppercase font-black">Entregado Por</p>
                        </div>
                        <div className="border-t border-slate-400 pt-2 w-32">
                            <p className="text-[8px] uppercase font-black">Recibido Por</p>
                        </div>
                    </div>
                    <p className="text-[9px] font-serif italic opacity-40 pt-10">Gracias por confiar en el estándar Kousa Luxury.</p>
                </div>
            </div>
        </>
    );
}

export default App;
