import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  Package,
  BarChart3,
  Plus,
  LogOut,
  Settings,
  Users,
<<<<<<< HEAD
  History,
  DollarSign,
  Trash2
} from 'lucide-react';

import { supabase } from './supabaseClient';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardStats from './components/Dashboard/DashboardStats';
import QueueItem from './components/Dashboard/QueueItem';
import RevenueBreakdown from './components/Dashboard/RevenueBreakdown';
import ProductCard from './components/POS/ProductCard';
import Cart from './components/POS/Cart';
import WashCard from './components/WashQueue/WashCard';
import NewWashModal from './components/WashQueue/NewWashModal';
import InventoryTable from './components/Inventory/InventoryTable';
import SaleHistoryItem from './components/Reports/SaleHistoryItem';
import ReportsDashboard from './components/Reports/ReportsDashboard';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';
import { useWashQueue } from './hooks/useWashQueue';
import { useSales } from './hooks/useSales';
import { useFleets } from './hooks/useFleets';
import { useEmployees } from './hooks/useEmployees';
import { useBranding } from './hooks/useBranding';

// Components
import FleetView from './components/Fleet/FleetView';
import EmployeeView from './components/Employees/EmployeeView';
import { FleetModal, VehicleModal, FleetHistoryModal, FleetPaymentModal } from './components/Fleet/FleetModals';
import { EmployeeModal } from './components/Employees/EmployeeModals';
=======
  Clock,
  DollarSign,
  History,
  FileText,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

import { supabase } from './supabaseClient';
import { employeeService } from './services/employeeService';
import { fleetService } from './services/fleetService';
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)

const ITBIS_RATE = 0.18;



const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportFilter, setReportFilter] = useState('today');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Branding (logo + background)
  const { branding, updateBranding, resetBranding, handleLogoUpload, handleBgImageUpload } = useBranding();

  // 1. Auth Hook
  const { 
    session, 
    loading: authLoading, 
    authError, 
    login: apiLogin, 
    logout: apiLogout, 
    currentUserRole, 
    userProfiles, 
    createUser: handleCreateUser,
    updateUserRole,
    deleteUser
  } = useAuth();

  // 2. Inventory Hook
  const { 
    inventory, 
    services, 
    addStock, 
    addItem: handleAddItem,
    updateItem: handleUpdateItem,
    deleteItem: handleDeleteItem,
    loading: invLoading
  } = useInventory(session);

  // 3. Wash Queue Hook
  const { 
    washQueue, 
    stats: washStats, 
    addWash: apiAddWash, 
    updateProgress: updateWashProgress, 
    deleteWash: deleteWashQueueItem,
    loading: washLoading 
  } = useWashQueue(session);

  // 4. Sales Hook
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    paymentMethod,
    setPaymentMethod,
    fiscalData,
    setFiscalData,
    salesHistory,
    revenueBreakdown,
    serviceMetrics,
    checkout,
    loading: salesLoading
  } = useSales(session, reportFilter);

  // 5. Fleet Hook
  const {
    companies,
    fleetVehicles,
    fleetHistory,
    addCompany: handleAddCompany,
    updateCompany: handleUpdateCompany,
    addVehicle: handleAddVehicle,
    updateVehicle: handleUpdateVehicle,
    checkVehicleFleet,
    recordPayment: handleRecordPayment,
    fetchHistory: handleFetchFleetHistory,
    deleteCompany: deleteCompanyHook,
    loading: fleetLoading
  } = useFleets(session);

  // 6. Employee Hook
  const {
    employees,
    commissions,
    addEmployee: handleAddEmployee,
    updateEmployee: handleUpdateEmployee,
    deleteEmployee: deleteEmployeeHook,
    loading: empLoading
  } = useEmployees(session, reportFilter);

  // Form & UI States
  const [isWashModalOpen, setIsWashModalOpen] = useState(false);
  const [newWash, setNewWash] = useState({ plate: '', model: '', service_id: '', type: 'car', gama: 'estandar', client_phone: '' });
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [itemsToCreate, setItemsToCreate] = useState({ name: '', price: 0, category: 'Agua', stock: 10, icon: '📦' });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'Agente',
    full_name: '',
    phone: ''
  });
  const [configActive, setConfigActive] = useState(false);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedWashPay, setSelectedWashPay] = useState(null);

  const [isFleetVehicle, setIsFleetVehicle] = useState(null);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [fleetCompanyId, setFleetCompanyId] = useState(null);
  const [isFleetHistoryOpen, setIsFleetHistoryOpen] = useState(false);
  const [activeFleetCompany, setActiveFleetCompany] = useState(null);
  const [isFleetPaymentOpen, setIsFleetPaymentOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
<<<<<<< HEAD
  
  // Custom Delete Confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Auto-detect Fleet on Plate Change
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (newWash.plate && newWash.plate.length >= 3) {
        const fleetData = await checkVehicleFleet(newWash.plate);
        if (fleetData) {
          setIsFleetVehicle(fleetData);
          setNewWash(prev => ({ ...prev, model: fleetData.model || prev.model }));
        } else {
          setIsFleetVehicle(null);
        }
=======
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    phone: '',
    role: 'Lavador',
    commission_rate: 15,
    cedula: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    join_date: new Date().toISOString().split('T')[0]
  });

  // Fleet State
  const [companies, setCompanies] = useState([]);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    rnc: '',
    phone: '',
    email: '',
    credit_limit: 0,
    address: '',
    contact_person: '',
    representative_phone: ''
  });
  const [editingCompany, setEditingCompany] = useState(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [newFleetVehicle, setNewFleetVehicle] = useState({ company_id: '', plate: '', model: '' });
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isFleetHistoryModalOpen, setIsFleetHistoryModalOpen] = useState(false);
  const [isFleetPaymentModalOpen, setIsFleetPaymentModalOpen] = useState(false);
  const [fleetHistory, setFleetHistory] = useState([]);
  const [newFleetPayment, setNewFleetPayment] = useState({ amount: '', method: 'Efectivo', notes: '' });
  const [isFleetVehicle, setIsFleetVehicle] = useState(null); // Track if current wash is fleet
  const [fleetVehicles, setFleetVehicles] = useState([]); // List of all registered fleet vehicles

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: invData, error: invError } = await supabase.from('inventory').select('*').order('name');
      if (invError) console.error('Error fetching inventory:', invError);

      const { data: serData, error: serError } = await supabase.from('services').select('*').order('price');
      if (serError) console.error('Error fetching services:', serError);

      const { data: queueData, error: queueError } = await supabase.from('wash_queue')
        .select('*, services(name, price), employees(name), company_id')
        .order('created_at', { ascending: false })
        .limit(20);

      // Set basic data first to ensure non-employee modules work even if employees fails
      if (invData) setInventory(invData);
      if (serData) setServices(serData);
      if (queueData) setWashQueue(queueData);

      // Fetch Employees and Commissions (wrapped to avoid blocking everything)
      try {
        const empData = await employeeService.getEmployees();
        const commData = await employeeService.getCommissionReport(reportFilter);
        const compData = await fleetService.getCompanies();
        const fvData = await fleetService.getFleetVehicles();
        if (empData) setEmployees(empData);
        if (commData) setCommissions(commData);
        if (compData) setCompanies(compData);
        if (fvData) setFleetVehicles(fvData);
      } catch (empErr) {
        console.error('Error fetching employee/fleet data:', empErr);
      }

      // Fetch Stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let filterDate = new Date();
      if (reportFilter === 'today') filterDate.setHours(0, 0, 0, 0);
      else if (reportFilter === 'week') filterDate.setDate(today.getDate() - 7);
      else if (reportFilter === 'month') filterDate.setMonth(today.getMonth() - 1);

      const { data: allSales } = await supabase.from('sales')
        .select('*, sale_items(*, inventory(name)), services(name, price)')
        .gte('created_at', filterDate.toISOString());

      const { data: allWashes } = await supabase.from('wash_queue')
        .select('*, services(name, price)')
        .eq('status', 'completed')
        .gte('completed_at', filterDate.toISOString());

      // Calculate Revenue Breakdown
      const productRev = allSales?.reduce((acc, s) => acc + Number(s.total_amount), 0) || 0;
      const washRev = allWashes?.reduce((acc, w) => acc + (w.services?.price || 0), 0) || 0;

      setRevenueBreakdown({ washes: washRev, products: productRev });

      // Daily stats (Today only)
      const { data: salesToday } = await supabase.from('sales')
        .select('total_amount')
        .gte('created_at', today.toISOString());

      const totalDailySales = salesToday?.reduce((acc, s) => acc + Number(s.total_amount), 0) || 0;

      setStats({
        activeWashes: queueData?.filter(q => q.status !== 'completed').length || 0,
        dailySales: (totalDailySales + (allWashes?.filter(w => new Date(w.completed_at) >= today).reduce((acc, w) => acc + (w.services?.price || 0), 0) || 0)).toFixed(2),
        activeBays: queueData?.filter(q => q.status === 'in_progress').length || 0
      });

      // Service Popularity
      const popularity = {};
      allWashes?.forEach(w => {
        const name = w.services?.name || 'Otro';
        popularity[name] = (popularity[name] || 0) + 1;
      });
      const metrics = Object.entries(popularity)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setServiceMetrics(metrics);

      // Fetch Sales History (Filtered)
      setSalesHistory(allSales || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => setLoading(false), 300); // Subtle delay for smoother transitions
    }
  };

  // Helper to centralize role checking logic
  const checkUserRole = async (currentSession) => {
    if (!currentSession) {
      setCurrentUserRole('Agente');
      setLoading(false);
      return;
    }

    const email = currentSession.user.email?.toLowerCase();

    // 1. FAILSAFE: Hardcode admin access for owner
    if (email === 'admin@kousa.com') {
      console.log('Enforcing Admin Override for owner:', email);
      setCurrentUserRole('Administrador');
      fetchData(); // Fetch data immediately after confirming admin
      return;
    }

    // 2. Normal database check
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', currentSession.user.id)
      .single();

    if (error) console.error('Error fetching profile:', error);
    setCurrentUserRole(profile?.role || 'Agente');
    fetchData();
  };

  React.useEffect(() => {
    // 1. Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRole(session);
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
      } else {
        setIsFleetVehicle(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [newWash.plate, checkVehicleFleet]);

  const loading = authLoading || invLoading || washLoading || salesLoading || fleetLoading || empLoading;

  React.useEffect(() => {
    if (newWash.plate) {
      checkPlateFleet(newWash.plate);
    } else {
      setIsFleetVehicle(null);
    }
  }, [newWash.plate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await apiLogin(loginEmail, loginPassword);
  };

  const handleLogout = () => {
    apiLogout();
    setActiveTab('dashboard');
  };

  const getCartTotal = () => {
    const productsTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const serviceTotal = selectedWashPay?.services?.price || 0;
    return productsTotal + serviceTotal;
  };

  const handleApplyAddWash = async (e) => {
    e.preventDefault();
    if (!newWash.plate || !newWash.service_id) return;
<<<<<<< HEAD
    
    // Add company_id if it's a fleet vehicle
    const washData = {
      ...newWash,
      company_id: isFleetVehicle?.company_id || null
    };
    
    const success = await apiAddWash(washData);
    if (success) {
=======

    const { error } = await supabase.from('wash_queue').insert([
      {
        vehicle_plate: newWash.plate,
        vehicle_model: newWash.model || 'Desconocido',
        service_id: newWash.service_id,
        employee_id: newWash.employee_id,
        company_id: isFleetVehicle?.company_id, // Associate with company if fleet
        client_phone: newWash.client_phone,
        progress: 0,
        status: 'pending'
      }
    ]);

    if (!error) {
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
      setIsWashModalOpen(false);
      setNewWash({ plate: '', model: '', service_id: '', type: 'car', gama: 'estandar', client_phone: '', employee_id: '' });
      setIsFleetVehicle(null);
    }
  };

<<<<<<< HEAD
  const handleCheckoutProcess = async (method = 'Efectivo') => {
    const result = await checkout(selectedWashPay);
    if (result.success) {
=======
  const updateProgress = async (id, currentProgress) => {
    const newProgress = Math.min(100, Number(currentProgress) + 20);
    const { error } = await supabase
      .from('wash_queue')
      .update({
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'in_progress',
        completed_at: newProgress === 100 ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (!error) {
      fetchData();
    } else {
      console.error('Error updating progress:', error);
    }
  };

  const handleDeleteWash = async (id) => {
    const { error } = await supabase.from('wash_queue').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleCheckout = async (method = 'Efectivo', washServiceData = null) => {
    if (cart.length === 0 && !washServiceData) return;

    try {
      // Calculate totals
      const productSubtotal = getCartTotal() - (washServiceData?.services?.price || 0); // Correctly separate product subtotal
      const servicePrice = washServiceData?.services?.price || 0;
      const subtotal = productSubtotal + servicePrice;
      const tax = subtotal * ITBIS_RATE;
      const total = subtotal + tax;

      // Check Credit Limit for Fleet
      if (method === 'Credito' && washServiceData?.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('current_balance, credit_limit, name')
          .eq('id', washServiceData.company_id)
          .single();

        const projectedBalance = Number(company?.current_balance || 0) + total;
        if (projectedBalance > Number(company?.credit_limit || 0)) {
          alert(`CRÉDITO EXCEDIDO: ${company.name} ha superado su límite de RD$${company.credit_limit.toLocaleString()}. (Balance proyectado: RD$${projectedBalance.toLocaleString()})`);
          setLoading(false);
          return;
        }
      }

      // Prepare sale data
      const saleData = {
        total_amount: total.toFixed(2),
        payment_method: method,
        client_name: fiscalData.name.toUpperCase(),
        client_rnc: fiscalData.rnc,
        invoice_type: fiscalData.type,
        company_id: (method === 'Credito' && washServiceData) ? washServiceData.company_id : null
      };

      // Add service info if applicable
      if (washServiceData) {
        saleData.service_id = washServiceData.service_id;
        saleData.vehicle_plate = washServiceData.vehicle_plate;

        // Mark wash as completed in the queue
        await supabase.from('wash_queue')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', washServiceData.id);
      }

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([saleData])
        .select();

      if (saleError) throw saleError;

      const saleItems = cart.map(item => ({
        sale_id: sale[0].id,
        inventory_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase.from('sale_items').insert(saleItems);
      if (itemsError) throw itemsError;

      // Update Inventory Stock
      for (const item of cart) {
        const { data: currentItem } = await supabase.from('inventory').select('stock').eq('id', item.id).single();
        await supabase.from('inventory').update({ stock: (Number(currentItem?.stock || 0)) - item.quantity }).eq('id', item.id);
      }

      // Update Company Balance if Credit
      if (method === 'Credito' && washServiceData?.company_id) {
        const { data: company } = await supabase.from('companies').select('current_balance').eq('id', washServiceData.company_id).single();
        const newBalance = Number(company?.current_balance || 0) + total;

        await supabase.from('companies')
          .update({ current_balance: newBalance })
          .eq('id', washServiceData.company_id);
      }

      setCart([]);
      setFiscalData({ name: '', rnc: '', type: 'final' }); // Reset form
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
      setSelectedWashPay(null);
      handlePrintInvoice(result.sale);
    } else {
      alert(result.message);
    }
  };

  const handlePrintInvoice = (sale) => {
    setSelectedSaleForInvoice(sale);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingItem.name || editingItem.price <= 0) return;
<<<<<<< HEAD
    const success = await handleUpdateItem(editingItem.id, editingItem);
    if (success) {
=======

    const { error } = await supabase.from('inventory')
      .update({
        name: editingItem.name,
        price: Number(editingItem.price),
        category: editingItem.category,
        icon: editingItem.icon
      })
      .eq('id', editingItem.id);

    if (!error) {
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
      setIsEditModalOpen(false);
      setEditingItem(null);
    } else {
      alert('Error al actualizar producto');
    }
  };

  const handleAddInventoryItem = async (e) => {
    e.preventDefault();
    if (!itemsToCreate.name || itemsToCreate.price <= 0) return;
    const success = await handleAddItem(itemsToCreate);
    if (success) {
      setIsInventoryModalOpen(false);
      setItemsToCreate({ name: '', price: 0, category: 'Agua', stock: 10, icon: '📦' });
    } else {
      alert('Error al agregar producto');
    }
  };

  const handleAppCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return;
<<<<<<< HEAD
    const success = await handleCreateUser(newUser);
    if (success) {
      setIsUserModalOpen(false);
      setNewUser({ email: '', password: '', role: 'Agente' });
      alert('Usuario creado con éxito.');
=======
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        data: {
          role: newUser.role
        }
      }
    });

    if (!error && data.user) {
      // The trigger will auto-create the profile, but we can also manually ensure it
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.full_name,
        phone: newUser.phone
      });

      setIsUserModalOpen(false);
      setNewUser({
        email: '',
        password: '',
        role: 'Agente',
        full_name: '',
        phone: ''
      });
      alert('Usuario creado con éxito. Debe confirmar su correo si la opción está activa en Supabase.');
      fetchUserProfiles(); // Refresh user list
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
    } else {
      alert('Error al crear usuario.');
    }
  };

<<<<<<< HEAD
  const handleAppUpdateUserRole = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
=======
  const handleUpdateUserProfile = async (userId, profileData) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        role: profileData.role,
        full_name: profileData.full_name,
        phone: profileData.phone,
        address: profileData.address
      })
      .eq('id', userId);

    if (!error) {
      fetchUserProfiles();
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      alert('Perfil actualizado correctamente');
    } else {
<<<<<<< HEAD
      alert('Error al actualizar el rol');
=======
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
    }
  };

  const handleApplyAddCompany = async (formData) => {
    const result = editingCompany 
      ? await handleUpdateCompany(editingCompany.id, formData)
      : await handleAddCompany(formData);
    if (result) {
      setIsFleetModalOpen(false);
      setEditingCompany(null);
    }
  };
 
  const handleDeleteCompany = async (id) => {
    setItemToDelete({ id, type: 'company' });
    setIsDeleteModalOpen(true);
  };

<<<<<<< HEAD
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'company') {
      await deleteCompanyHook(itemToDelete.id);
    } else if (itemToDelete.type === 'employee') {
      await handleDeleteEmployee(itemToDelete.id);
=======
  // Employee Handlers
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, newEmployee);
        alert('Empleado actualizado correctamente');
      } else {
        await employeeService.createEmployee(newEmployee);
        alert('Empleado creado correctamente');
      }
      setIsEmployeeModalOpen(false);
      setEditingEmployee(null);
      setNewEmployee({
        name: '',
        phone: '',
        role: 'Lavador',
        commission_rate: 15,
        cedula: '',
        address: '',
        emergency_contact: '',
        emergency_phone: '',
        join_date: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      alert(error.message);
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
    }

    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteEmployee = async (id) => {
    setItemToDelete({ id, type: 'employee' });
    setIsDeleteModalOpen(true);
  };

  const handleApplyAddVehicle = async (formData) => {
    const result = editingVehicle
      ? await handleUpdateVehicle(editingVehicle.plate, formData)
      : await handleAddVehicle(formData);
    if (result) {
      setIsVehicleModalOpen(false);
      setEditingVehicle(null);
      setFleetCompanyId(null);
    }
  };

  const handleApplyEmployee = async (formData) => {
    const result = editingEmployee
      ? await handleUpdateEmployee(editingEmployee.id, formData)
      : await handleAddEmployee(formData);
    if (result) {
      setIsEmployeeModalOpen(false);
      setEditingEmployee(null);
    }
  };

  const handleApplyFleetPayment = async (paymentData) => {
    const success = await handleRecordPayment({
      ...paymentData,
      company_id: activeFleetCompany.id
    });
    if (success) {
      setIsFleetPaymentOpen(false);
      setActiveFleetCompany(null);
    }
  };

  // Fleet Handlers
  const handleFleetSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await fleetService.updateCompany(editingCompany.id, newCompany);
        alert('Empresa actualizada');
      } else {
        await fleetService.createCompany(newCompany);
        alert('Empresa registrada');
      }
      setIsFleetModalOpen(false);
      setEditingCompany(null);
      setNewCompany({
        name: '',
        rnc: '',
        phone: '',
        email: '',
        credit_limit: 0,
        address: '',
        contact_person: '',
        representative_phone: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error en gestión de flota:', error);
      alert('Error en gestión de flota: ' + (error.message || error.details || 'Error desconocido'));
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await fleetService.updateFleetVehicle(editingVehicle.plate, newFleetVehicle);
        alert('Vehículo actualizado');
      } else {
        await fleetService.addVehicleToFleet(newFleetVehicle);
        alert('Vehículo añadido a la flota');
      }
      setIsVehicleModalOpen(false);
      setEditingVehicle(null);
      setNewFleetVehicle({ company_id: '', plate: '', model: '' });
      fetchData();
    } catch (error) {
      console.error('Error al gestionar vehículo:', error);
      alert('Error: ' + (error.message || 'Error desconocido'));
    }
  };

  const checkPlateFleet = async (plate) => {
    if (plate.length < 3) return;
    try {
      const fleetData = await fleetService.checkVehicleFleet(plate);
      setIsFleetVehicle(fleetData);
      if (fleetData) {
        setNewWash(prev => ({ ...prev, model: fleetData.model || prev.model }));
      }
    } catch (error) {
      console.error('Error checking fleet:', error);
    }
  };

  const handleOpenHistory = async (company) => {
    try {
      setLoading(true);
      const history = await fleetService.getCompanyHistory(company.id);
      setFleetHistory(history);
      setEditingCompany(company);
      setIsFleetHistoryModalOpen(true);
    } catch (error) {
      alert('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (company) => {
    setEditingCompany(company);
    setNewFleetPayment({ amount: '', method: 'Efectivo', notes: '' });
    setIsFleetPaymentModalOpen(true);
  };

  const handleRecordFleetPayment = async (e) => {
    e.preventDefault();
    if (!newFleetPayment.amount || isNaN(newFleetPayment.amount) || Number(newFleetPayment.amount) <= 0) return;

    try {
      setLoading(true);
      const paymentData = {
        company_id: editingCompany.id,
        amount: Number(newFleetPayment.amount),
        payment_method: newFleetPayment.method,
        notes: newFleetPayment.notes
      };

      await fleetService.recordPayment(paymentData);

      const newBalance = Math.max(0, Number(editingCompany.current_balance || 0) - Number(newFleetPayment.amount));
      await fleetService.updateCompany(editingCompany.id, { current_balance: newBalance });

      alert(`Pago de RD$${paymentData.amount.toLocaleString()} registrado con éxito.`);
      setIsFleetPaymentModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Error al registrar pago');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'car', label: 'Cola de Lavado', icon: Car },
    { id: 'pos', label: 'Ventas (POS)', icon: ShoppingCart },
    { id: 'fleet', label: 'Flotillas', icon: Car },
    { id: 'employees', label: 'Empleados', icon: Users },
<<<<<<< HEAD
    { id: 'inventory', label: 'Inventario', icon: Package },
=======
    { id: 'fleet', label: 'Flotillas', icon: Car },
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-montserrat">
        <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">
              KOUSA <span className="text-luxury-red">LUXURY</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">Control de Acceso Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Correo Electrónico</label>
              <input
                type="email"
                required
                className="w-full mt-2 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-bold text-slate-800"
                placeholder="usuario@kousa.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Contraseña</label>
              <input
                type="password"
                required
                className="w-full mt-2 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-bold text-slate-800"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            {authError && (
              <p className="text-center text-luxury-red text-[10px] font-black uppercase tracking-tight bg-red-50 p-3 rounded-xl animate-bounce">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-[0.3em] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
            Kousa Auto Import & Care — v1.0.2
          </p>
        </div>
      </div>
    );
  }

  // Compute dynamic background style
  const getBgStyle = () => {
    if (branding.bgType === 'image' && branding.bgImageUrl) {
      return {
        backgroundImage: `url(${branding.bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    return { backgroundColor: branding.bgColor || '#f1f5f9' };
  };

  return (
    <div className="flex min-h-screen w-screen font-montserrat" style={getBgStyle()}>
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        menuItems={menuItems} 
        handleLogout={handleLogout}
        branding={branding}
      />

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen w-full overflow-x-hidden">
        <Header activeTabLabel={menuItems.find(i => i.id === activeTab)?.label} />

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <DashboardStats stats={washStats} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Actividad en Cola</h3>
                <div className="space-y-4">
                  {washQueue.slice(0, 4).map(w => (
                    <QueueItem 
                      key={w.id} 
                      item={w} 
                      onUpdateProgress={updateWashProgress} 
                      onDeleteWash={deleteWashQueueItem} 
                    />
                  ))}
                  {washQueue.length === 0 && <p className="text-center py-10 text-slate-300 font-bold italic">No hay actividad reciente</p>}
                </div>
                <button onClick={() => setActiveTab('car')} className="w-full mt-6 text-xs font-black text-luxury-blue hover:underline uppercase tracking-widest">Ver cola completa</button>
              </div>

              <RevenueBreakdown breakdown={revenueBreakdown} />

              <div className="md:col-span-1 bg-luxury-blue p-8 rounded-[3rem] text-white shadow-lg shadow-blue-900/10 flex flex-col justify-center items-center text-center">
                <Plus className="mb-4 opacity-30" size={64} />
                <h3 className="text-2xl font-black mb-2">Nuevo Lavado</h3>
                <p className="text-white/60 text-xs mb-8 max-w-[200px]">Crea una nueva orden de servicio para cualquier tipo de vehículo.</p>
                <button
                  onClick={() => setIsWashModalOpen(true)}
                  className="bg-white text-luxury-blue px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl uppercase text-xs tracking-widest"
                >
                  REGISTRAR ENTRADA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wash Queue View */}
        {activeTab === 'car' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">En Línea</span>
              <button onClick={() => setIsWashModalOpen(true)} className="text-xs font-black text-luxury-red flex items-center gap-1 uppercase tracking-widest"><Plus size={14} /> Agregar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {washQueue.map(item => (
                <WashCard 
                  key={item.id} 
                  item={item} 
                  onUpdateProgress={updateWashProgress} 
                  onDeleteWash={deleteWashQueueItem} 
                  onPay={(wash) => {
                    setSelectedWashPay(wash);
                    setActiveTab('pos');
                  }}
                />
              ))}
              {washQueue.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-20">
                  <Car size={80} className="mx-auto mb-4" />
                  <p className="text-2xl font-black">NO HAY LAVADOS ACTIVOS</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* POS View */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Catálogo de Productos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {inventory.map(item => (
                    <ProductCard 
                      key={item.id} 
                      product={item} 
                      onAddToCart={addToCart} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
<<<<<<< HEAD
              <Cart 
                cart={cart}
                selectedWashPay={selectedWashPay}
                onRemoveWashPay={() => setSelectedWashPay(null)}
                onClearCart={clearCart}
                itbisRate={ITBIS_RATE}
                fiscalData={fiscalData}
                setFiscalData={setFiscalData}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onCheckout={handleCheckoutProcess}
              />
=======
              <div className="bg-luxury-dark rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-red/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-black mb-8 tracking-tighter">SU CARRITO</h3>

                {selectedWashPay && (
                  <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-2xl relative">
                    <button onClick={() => setSelectedWashPay(null)} className="absolute top-2 right-2 text-white/50 hover:text-white">×</button>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Pagando Servicio</p>
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="font-bold text-sm">{selectedWashPay.services?.name}</p>
                        <p className="text-[10px] opacity-60 font-mono">{selectedWashPay.vehicle_plate} — {selectedWashPay.vehicle_model}</p>
                      </div>
                      <span className="font-black">RD${Number(selectedWashPay.services?.price).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-sm tracking-tight">{item.name}</p>
                        <p className="text-[10px] opacity-40 font-bold">{item.quantity} x RD${item.price.toFixed(2)}</p>
                      </div>
                      <span className="font-black text-luxury-red">RD${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {cart.length === 0 && <p className="text-center py-10 opacity-20 italic font-bold">Carrito vacío</p>}
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="space-y-4 mb-4 border-b border-white/10 pb-4">
                    <div className="flex bg-white/5 rounded-xl p-1">
                      <button
                        onClick={() => setFiscalData({ ...fiscalData, type: 'final' })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${fiscalData.type === 'final' ? 'bg-luxury-red text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                      >
                        Consumidor Final
                      </button>
                      <button
                        onClick={() => setFiscalData({ ...fiscalData, type: 'fiscal' })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${fiscalData.type === 'fiscal' ? 'bg-luxury-blue text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                      >
                        Crédito Fiscal
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="RNC / Cédula"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
                        value={fiscalData.rnc}
                        onChange={(e) => setFiscalData({ ...fiscalData, rnc: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Nombre / Razón Social"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all uppercase"
                        value={fiscalData.name}
                        onChange={(e) => setFiscalData({ ...fiscalData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Método de Pago</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all font-montserrat"
                    >
                      <option value="Efectivo" className="bg-luxury-dark text-white">💵 Efectivo</option>
                      <option value="Tarjeta" className="bg-luxury-dark text-white">💳 Tarjeta (Azul/PVP)</option>
                      <option value="Transferencia" className="bg-luxury-dark text-white">🔄 Transferencia</option>
                      {selectedWashPay && companies.some(c => c.id === selectedWashPay.company_id) && (
                        <option value="Credito" className="bg-luxury-dark text-white">🏢 Crédito Flotilla</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-2 mb-6 border-b border-white/10 pb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                      <span>Subtotal</span>
                      <span>RD${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-luxury-red">
                      <span>ITBIS (18%)</span>
                      <span>RD${(getCartTotal() * ITBIS_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-8">
                    <span className="text-xs font-bold opacity-30 uppercase tracking-widest">Total</span>
                    <h4 className="text-4xl font-black tracking-tighter">RD${(getCartTotal() * (1 + ITBIS_RATE)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                  </div>

                  <button
                    onClick={() => handleCheckout(paymentMethod, selectedWashPay)}
                    disabled={cart.length === 0 && !selectedWashPay}
                    className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all shadow-2xl shadow-red-900/40 uppercase ${cart.length > 0 || selectedWashPay ? 'bg-luxury-red hover:bg-red-800' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                  >
                    PROCESAR COBRO
                  </button>

                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="w-full text-[10px] font-black opacity-20 hover:opacity-50 uppercase tracking-tighter">Limpiar Todo</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees View */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100 animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-luxury-blue text-white">
              <div>
                <h3 className="text-xl font-black tracking-tighter uppercase">Gestión de Personal</h3>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Nómina y Comisiones</p>
              </div>
              <button
                onClick={() => {
                  setEditingEmployee(null);
                  setNewEmployee({ name: '', phone: '', role: 'Lavador', commission_rate: 15 });
                  setIsEmployeeModalOpen(true);
                }}
                className="bg-white text-luxury-blue px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg"
              >
                + Nuevo Empleado
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="px-10 py-6 text-slate-800">Nombre / Rol</th>
                    <th className="px-10 py-6">Cédula</th>
                    <th className="px-10 py-6">Teléfono</th>
                    <th className="px-10 py-6 text-center">Tasa Comisión</th>
                    <th className="px-10 py-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-800 font-medium">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-luxury-blue">
                            <Users size={20} />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-mono text-sm">{emp.cedula || '---'}</td>
                      <td className="px-10 py-6 font-mono text-sm">{emp.phone || '---'}</td>
                      <td className="px-10 py-6 text-center">
                        <span className="px-3 py-1 bg-blue-50 text-luxury-blue rounded-full text-xs font-black">
                          {emp.commission_rate}%
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setNewEmployee({
                                name: emp.name,
                                phone: emp.phone || '',
                                role: emp.role,
                                commission_rate: emp.commission_rate,
                                cedula: emp.cedula || '',
                                address: emp.address || '',
                                emergency_contact: emp.emergency_contact || '',
                                emergency_phone: emp.emergency_phone || '',
                                join_date: emp.join_date || new Date().toISOString().split('T')[0]
                              });
                              setIsEmployeeModalOpen(true);
                            }}
                            className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="bg-red-50 hover:bg-luxury-red hover:text-white p-3 rounded-xl text-luxury-red transition-all shadow-sm active:scale-90"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-10 py-20 text-center opacity-20">
                        <Users size={64} className="mx-auto mb-4" />
                        <p className="text-xl font-black uppercase">No hay empleados registrados</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
            </div>
          </div>
        )}

        {/* Fleet View */}
        {activeTab === 'fleet' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-lg">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Empresas</p>
                  <p className="text-3xl font-black text-slate-800 tracking-tighter">{companies.length}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-red-50 text-luxury-red rounded-3xl flex items-center justify-center shadow-lg border border-red-100">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Deuda Total</p>
                  <p className="text-3xl font-black text-luxury-red tracking-tighter">
                    RD${companies.reduce((acc, c) => acc + Number(c.current_balance || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg border border-emerald-100">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Crédito Libre</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                    RD${companies.reduce((acc, c) => acc + Math.max(0, Number(c.credit_limit || 0) - Number(c.current_balance || 0)), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-luxury-blue text-white">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">Gestión de Flotillas</h3>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Clientes Corporativos y Vehículos</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCompany(null);
                    setNewCompany({
                      name: '',
                      rnc: '',
                      phone: '',
                      email: '',
                      credit_limit: 0,
                      address: '',
                      contact_person: '',
                      representative_phone: ''
                    });
                    setIsFleetModalOpen(true);
                  }}
                  className="bg-white text-luxury-blue px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg"
                >
                  + Nueva Empresa
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                      <th className="px-10 py-6 text-slate-800">Empresa / RNC</th>
                      <th className="px-10 py-6">Representante</th>
                      <th className="px-10 py-6">Deuda Actual / Límite</th>
                      <th className="px-10 py-6 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-800 font-medium">
                    {companies.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-luxury-blue">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="font-black text-sm uppercase tracking-tight">{company.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">RNC: {company.rnc || '---'}</p>

                              {/* List of Vehicles */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                {fleetVehicles
                                  .filter(v => v.company_id === company.id)
                                  .map(vehicle => (
                                    <button
                                      key={vehicle.plate}
                                      onClick={() => {
                                        setEditingVehicle(vehicle);
                                        setNewFleetVehicle({ plate: vehicle.plate, model: vehicle.model, company_id: vehicle.company_id });
                                        setIsVehicleModalOpen(true);
                                      }}
                                      className="text-[9px] font-black bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 uppercase hover:bg-luxury-blue hover:text-white transition-all flex items-center gap-1 group"
                                    >
                                      {vehicle.plate} {vehicle.model ? `(${vehicle.model})` : ''}
                                      <Edit2 size={8} className="opacity-0 group-hover:opacity-100" />
                                    </button>
                                  ))
                                }
                                {fleetVehicles.filter(v => v.company_id === company.id).length === 0 && (
                                  <span className="text-[9px] font-bold text-slate-300 italic">Sin vehículos asignados</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <p className="font-black text-sm uppercase">{company.contact_person || '---'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{company.representative_phone || ''}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div>
                            <p className={`font-black text-sm ${Number(company.current_balance || 0) > 0 ? 'text-luxury-red' : 'text-emerald-600'}`}>
                              RD${Number(company.current_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Límite: RD${Number(company.credit_limit || 0).toLocaleString()}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleOpenHistory(company)}
                              className="bg-slate-100 hover:bg-slate-900 hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                              title="Ver Historial"
                            >
                              <History size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenPayment(company)}
                              className="bg-emerald-50 hover:bg-emerald-600 hover:text-white p-3 rounded-xl text-emerald-600 transition-all shadow-sm active:scale-90"
                              title="Registrar Pago"
                            >
                              <DollarSign size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingCompany(company);
                                setNewCompany({ ...company });
                                setIsFleetModalOpen(true);
                              }}
                              className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                              title="Editar Empresa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setNewFleetVehicle({ ...newFleetVehicle, company_id: company.id });
                                setEditingVehicle(null);
                                setIsVehicleModalOpen(true);
                              }}
                              className="bg-blue-50 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-luxury-blue transition-all shadow-sm active:scale-90"
                              title="Vincular Vehículo"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {companies.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-10 py-20 text-center opacity-20">
                          <Car size={64} className="mx-auto mb-4" />
                          <p className="text-xl font-black uppercase">No hay empresas registradas</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory View */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100 animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-luxury-dark text-white">
              <div>
                <h3 className="text-xl font-black tracking-tighter uppercase">Gestión de Stock</h3>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Suministros y Accesorios</p>
              </div>
              <button
                onClick={() => setIsInventoryModalOpen(true)}
                className="bg-luxury-red px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
              >
                + Nuevo Item
              </button>
            </div>
            <InventoryTable 
              inventory={inventory}
              onEdit={(item) => {
                setEditingItem({ ...item });
                setIsEditModalOpen(true);
              }}
              onAddStock={addStock}
              onDelete={handleDeleteItem}
            />
          </div>
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
          <ReportsDashboard 
            reportFilter={reportFilter}
            setReportFilter={setReportFilter}
            revenueBreakdown={revenueBreakdown}
            salesHistory={salesHistory}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            serviceMetrics={serviceMetrics}
            onPrintInvoice={handlePrintInvoice}
          />
        )}

        {/* Fleet View */}
        {activeTab === 'fleet' && (
          <FleetView 
            companies={companies}
            fleetVehicles={fleetVehicles}
            onOpenHistory={async (company) => {
              setActiveFleetCompany(company);
              await handleFetchFleetHistory(company.id);
              setIsFleetHistoryOpen(true);
            }}
            onOpenPayment={(company) => {
              setActiveFleetCompany(company);
              setIsFleetPaymentOpen(true);
            }}
            onOpenFleetModal={(company) => {
              setEditingCompany(company || null);
              setIsFleetModalOpen(true);
            }}
            onOpenVehicleModal={(vehicle, companyId) => {
              setEditingVehicle(vehicle || null);
              setFleetCompanyId(companyId || null);
              setIsVehicleModalOpen(true);
            }}
            onDeleteCompany={handleDeleteCompany}
          />
        )}

        {/* Employees View */}
        {activeTab === 'employees' && (
          <EmployeeView 
            employees={employees}
            commissions={commissions}
            onOpenEmployeeModal={(emp) => {
              setEditingEmployee(emp || null);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}
        {/* Configuration View */}
        {activeTab === 'config' && (
          <div className="space-y-10 animate-in fade-in duration-500">

            {/* Branding Panel */}
            <div className="bg-white rounded-[3rem] shadow-xl p-10 border border-slate-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-luxury-red text-white rounded-3xl shadow-lg shadow-red-900/20">
                  <Settings size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Personalización</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Logo y Fondo de la Aplicación</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Logo de la Empresa</h4>
                  <div 
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-6 overflow-hidden bg-luxury-dark cursor-pointer hover:border-luxury-red transition-all"
                    onClick={() => document.getElementById('logo-upload').click()}
                  >
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="max-h-24 max-w-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <p className="text-white/20 text-3xl font-black">{branding.logoText || 'KOUSA'}</p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Click para cambiar</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleLogoUpload(file);
                    }}
                  />
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Principal</label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-luxury-red"
                        value={branding.logoText || ''}
                        placeholder="KOUSA"
                        onChange={(e) => updateBranding({ logoText: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Secundario</label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-luxury-red"
                        value={branding.logoSubtext || ''}
                        placeholder="LUXURY"
                        onChange={(e) => updateBranding({ logoSubtext: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Slogan / Tagline</label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-luxury-red"
                        value={branding.tagline || ''}
                        placeholder="Auto Import & Care"
                        onChange={(e) => updateBranding({ tagline: e.target.value })}
                      />
                    </div>
                    {branding.logoUrl && (
                      <button
                        onClick={() => updateBranding({ logoUrl: null })}
                        className="w-full py-3 bg-red-50 text-luxury-red rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all"
                      >
                        Eliminar Imagen de Logo
                      </button>
                    )}
                  </div>
                </div>

                {/* Background Settings */}
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Fondo de la Aplicación</h4>
                  
                  <div className="space-y-5">
                    <div className="flex rounded-2xl overflow-hidden border border-slate-200">
                      {[
                        { id: 'color', label: 'Color' },
                        { id: 'image', label: 'Imagen' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updateBranding({ bgType: opt.id })}
                          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${branding.bgType === opt.id ? 'bg-luxury-blue text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {branding.bgType === 'color' && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Color de Fondo</label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            className="w-16 h-14 rounded-2xl border-2 border-slate-200 cursor-pointer"
                            value={branding.bgColor || '#f1f5f9'}
                            onChange={(e) => updateBranding({ bgColor: e.target.value })}
                          />
                          <input
                            type="text"
                            className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-luxury-blue"
                            value={branding.bgColor || '#f1f5f9'}
                            onChange={(e) => updateBranding({ bgColor: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          {['#f1f5f9','#1e293b','#0f172a','#faf7f2','#e2e8f0'].map(color => (
                            <button
                              key={color}
                              onClick={() => updateBranding({ bgColor: color, bgType: 'color' })}
                              className="w-full h-10 rounded-xl border-2 border-white shadow-sm hover:scale-105 transition-transform"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {branding.bgType === 'image' && (
                      <div className="space-y-3">
                        <div
                          className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-100 cursor-pointer hover:border-luxury-red transition-all"
                          onClick={() => document.getElementById('bg-upload').click()}
                        >
                          {branding.bgImageUrl ? (
                            <img src={branding.bgImageUrl} alt="Background Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Subir Imagen de Fondo</p>
                              <p className="text-slate-300 text-[9px] mt-1">JPG, PNG, WEBP — Click aquí</p>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          id="bg-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) await handleBgImageUpload(file);
                          }}
                        />
                        {branding.bgImageUrl && (
                          <button
                            onClick={() => updateBranding({ bgImageUrl: null, bgType: 'color' })}
                            className="w-full py-3 bg-red-50 text-luxury-red rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all"
                          >
                            Eliminar Imagen de Fondo
                          </button>
                        )}
                      </div>
                    )}

                    {/* Sidebar Color */}
                    <div className="space-y-2 border-t border-slate-200 pt-5 mt-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Color del Panel Lateral</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          className="w-16 h-14 rounded-2xl border-2 border-slate-200 cursor-pointer"
                          value={branding.sidebarColor || '#0a0f1e'}
                          onChange={(e) => updateBranding({ sidebarColor: e.target.value })}
                        />
                        <input
                          type="text"
                          className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-luxury-blue"
                          value={branding.sidebarColor || '#0a0f1e'}
                          onChange={(e) => updateBranding({ sidebarColor: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Reset */}
                    <button
                      onClick={resetBranding}
                      className="w-full py-4 bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-300 transition-all mt-2"
                    >
                      Restaurar Configuración por Defecto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl p-10 border border-slate-100 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-luxury-blue text-white rounded-3xl shadow-lg shadow-blue-900/20">
                  <LogOut size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Gestión de Usuarios</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Administración de Accesos</p>
                </div>
              </div>

              {currentUserRole === 'Administrador' ? (
                <>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 mb-8">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Nuevo Usuario</h4>
                    <div className="flex flex-col gap-6">
                      <p className="text-xs text-slate-500 italic">Cada nuevo usuario recibirá un correo de confirmación para activar su cuenta.</p>
                      <button
                        onClick={() => setIsUserModalOpen(true)}
                        className="w-full py-5 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
                      >
                        <Plus size={18} /> REGISTRAR NUEVO USUARIO
                      </button>
                    </div>
                  </div>

                  {/* User Management Table */}
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Usuarios Registrados</h4>
                    <div className="space-y-3">
                      {userProfiles.map((user) => (
                        <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-black text-slate-800 text-sm uppercase">{user.full_name || 'Sin Nombre'}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest">{user.email}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest mt-2">
                              Acceso: <span className={user.role === 'Administrador' ? 'text-luxury-red' : 'text-luxury-blue'}>{user.role}</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setIsEditUserModalOpen(true);
                              }}
                              className="px-4 py-2 bg-luxury-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-900 transition-all"
                            >
                              Editar Perfil
                            </button>
                            {user.email !== session?.user?.email && (
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {userProfiles.length === 0 && (
                        <p className="text-center py-10 text-slate-400 italic">No hay usuarios registrados</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-center gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-full">!</div>
                  <p className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Tu cuenta no tiene permisos para crear nuevos accesos.</p>
                </div>
              )}

              <div className="mt-10 pt-10 border-t border-slate-100 flex justify-between items-center text-slate-400">
                <div className="text-[10px] font-black uppercase tracking-widest">Rol / Sesión</div>
                <div className="font-bold text-sm text-slate-800">
                  <span className="text-luxury-red uppercase mr-2 tracking-widest">{currentUserRole}</span>
                  {session?.user?.email}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleLogout}
                className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <LogOut size={20} /> CERRAR SESIÓN
              </button>
            </div>
          </div>
        )}
      </main>

      {/* New Wash Modal */}
      <NewWashModal 
        isOpen={isWashModalOpen}
        onClose={() => setIsWashModalOpen(false)}
        onSubmit={handleApplyAddWash}
        newWash={newWash}
        setNewWash={setNewWash}
        services={services}
        employees={employees}
        companies={companies}
        isFleetVehicle={isFleetVehicle}
        setIsFleetVehicle={setIsFleetVehicle}
      />

      {/* Fleet Modals */}
      <FleetModal 
        isOpen={isFleetModalOpen}
        onClose={() => setIsFleetModalOpen(false)}
        company={editingCompany}
        onSubmit={handleApplyAddCompany}
      />
      <VehicleModal 
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicle={editingVehicle}
        companyId={fleetCompanyId}
        companies={companies}
        onSubmit={handleApplyAddVehicle}
      />
      <FleetHistoryModal 
        isOpen={isFleetHistoryOpen}
        onClose={() => setIsFleetHistoryOpen(false)}
        company={activeFleetCompany}
        history={fleetHistory}
      />
      <FleetPaymentModal 
        isOpen={isFleetPaymentOpen}
        onClose={() => setIsFleetPaymentOpen(false)}
        company={activeFleetCompany}
        onSubmit={handleApplyFleetPayment}
      />

<<<<<<< HEAD
      {/* Employee Modals */}
      <EmployeeModal 
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employee={editingEmployee}
        onSubmit={handleApplyEmployee}
      />
      {/* New Inventory Item Modal */}
      {isInventoryModalOpen && (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
=======
              {newWash.type === 'car' && (
                <div className="flex gap-2 p-1 bg-slate-50/50 rounded-2xl">
                  {['estandar', 'media', 'alta'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewWash({ ...newWash, gama: g })}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${newWash.gama === g ? 'bg-luxury-dark text-white' : 'text-slate-400 hover:bg-slate-200'}`}
                    >
                      {g === 'estandar' ? 'Económico' : g === 'media' ? 'Gama Media' : 'Gama Alta'}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Teléfono / WhatsApp (Opcional)</label>
                <input
                  type="tel"
                  placeholder="Ej: 8095551234"
                  className="w-full p-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-green-500 outline-none transition-all font-mono font-bold text-slate-800"
                  value={newWash.client_phone}
                  onChange={(e) => setNewWash({ ...newWash, client_phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Número de Placa</label>
                  <input
                    type="text"
                    placeholder="Ej: A123456"
                    required
                    className="w-full mt-2 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-mono font-black uppercase text-slate-800 text-xl tracking-tighter"
                    value={newWash.plate}
                    onChange={(e) => setNewWash({ ...newWash, plate: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Marca / Modelo</label>
                  <input
                    type="text"
                    placeholder="Ej: Toyota Hilux"
                    className="w-full mt-2 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all text-slate-800 font-bold"
                    value={newWash.model}
                    onChange={(e) => setNewWash({ ...newWash, model: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Asignar Empleado</label>
                  <select
                    className="w-full mt-2 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all text-slate-800 font-bold"
                    value={newWash.employee_id}
                    onChange={(e) => setNewWash({ ...newWash, employee_id: e.target.value })}
                  >
                    <option value="">Seleccionar empleado...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">¿Es un Vehículo de Flota?</label>
                  <div className="mt-2 flex flex-col gap-4">
                    <select
                      className={`w-full p-5 rounded-3xl bg-slate-50 border-2 outline-none transition-all font-bold ${isFleetVehicle ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-800'}`}
                      value={isFleetVehicle?.company_id || ''}
                      onChange={(e) => {
                        const companyId = e.target.value;
                        if (!companyId) {
                          setIsFleetVehicle(null);
                        } else {
                          const company = companies.find(c => c.id === companyId);
                          setIsFleetVehicle({ company_id: companyId, companies: { name: company.name } });
                        }
                      }}
                    >
                      <option value="">No es de flota / Particular</option>
                      {companies.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.name} {comp.rnc ? `(RNC: ${comp.rnc})` : ''}</option>
                      ))}
                    </select>
                    {isFleetVehicle && (
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black">✓</div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Identificado como Flota</p>
                          <p className="text-sm font-black text-emerald-900">{isFleetVehicle.companies.name}</p>
                          {isFleetVehicle.companies.current_balance !== undefined && (
                            <p className="text-[10px] font-black text-luxury-red mt-1">
                              SALDO PENDIENTE: RD${Number(isFleetVehicle.companies.current_balance || 0).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(
                    newWash.type === 'moto'
                      ? ['CG', 'Loncin', 'Yamaha', 'Suzuki', 'Bajaj']
                      : newWash.gama === 'alta'
                        ? ['BMW', 'MB', 'Audi', 'Porsche', 'Rover']
                        : newWash.gama === 'media'
                          ? ['Mazda', 'Ford', 'VW', 'Chevy', 'Jeep']
                          : ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan']
                  ).map(brand => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setNewWash({ ...newWash, model: brand })}
                      className="text-[9px] font-black px-3 py-2 bg-slate-100 hover:bg-luxury-blue hover:text-white rounded-xl transition-all text-slate-500 uppercase tracking-tighter border border-transparent hover:border-luxury-blue"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Seleccionar Servicio</label>
                <div className="relative">
                  <select
                    required
                    className="w-full mt-1 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all appearance-none text-slate-800 font-bold pr-12"
                    value={newWash.service_id}
                    onChange={(e) => setNewWash({ ...newWash, service_id: e.target.value })}
                  >
                    <option value="">Buscar servicio...</option>
                    {services.filter(s => {
                      const name = s.name.toLowerCase();
                      if (newWash.type === 'moto') return name.includes('motor');
                      if (newWash.gama === 'alta') return name.includes('alta') || name.includes('luxury') || name.includes('vip');
                      if (newWash.gama === 'media') return !name.includes('básico') && !name.includes('motor');
                      return name.includes('básico') || name.includes('express');
                    }).map(s => (
                      <option key={s.id} value={s.id}>{s.name} — RD${s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</option>
                    ))}
                    <option disabled className="text-slate-300">——— Otros Servicios ———</option>
                    {services.map(s => (
                      <option key={`all-${s.id}`} value={s.id}>{s.name} — RD${s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><Plus size={16} /></div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-6 bg-luxury-blue text-white rounded-[1.8rem] font-black hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/40 uppercase text-xs tracking-[0.3em] active:scale-95"
                >
                  REGISTRAR SERVICIO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Nuevo Producto</h3>
              <button onClick={() => setIsInventoryModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400">×</button>
            </div>
<<<<<<< HEAD
            <form onSubmit={handleAddInventoryItem} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre del Producto</label>
                <input
                  required
                  className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold"
                  value={itemsToCreate.name}
                  onChange={(e) => setItemsToCreate({ ...itemsToCreate, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
=======

            <form onSubmit={handleEmployeeSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Completo</label>
                  <input
                    required
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cédula</label>
                  <input
                    placeholder="001-0000000-0"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newEmployee.cedula}
                    onChange={(e) => setNewEmployee({ ...newEmployee, cedula: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono</label>
                  <input
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dirección Residencial</label>
                  <textarea
                    rows="2"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold resize-none"
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                  />
                </div>

                {/* Job Info */}
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio RD$</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold"
                    value={itemsToCreate.price}
                    onChange={(e) => setItemsToCreate({ ...itemsToCreate, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stock Inicial</label>
                  <input
                    required
                    type="number"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold"
                    value={itemsToCreate.stock}
                    onChange={(e) => setItemsToCreate({ ...itemsToCreate, stock: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha de Ingreso</label>
                  <input
                    type="date"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newEmployee.join_date}
                    onChange={(e) => setNewEmployee({ ...newEmployee, join_date: e.target.value })}
                  />
                </div>

                {/* Emergency Contact */}
                <div className="bg-slate-50 p-6 rounded-3xl col-span-full space-y-4 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contacto de Emergencia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Nombre del Contacto</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-luxury-blue outline-none font-bold text-sm"
                        value={newEmployee.emergency_contact}
                        onChange={(e) => setNewEmployee({ ...newEmployee, emergency_contact: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Teléfono de Emergencia</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-luxury-blue outline-none font-bold text-sm"
                        value={newEmployee.emergency_phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, emergency_phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoría del Producto</label>
                <select
                  required
                  className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold appearance-none"
                  value={itemsToCreate.category}
                  onChange={(e) => setItemsToCreate({ ...itemsToCreate, category: e.target.value })}
                >
                  <option value="Agua">Aguas</option>
                  <option value="Cerveza">Cervezas</option>
                  <option value="Licores">Alcoholes y Licores</option>
                  <option value="Energizantes">Bebidas Energizantes</option>
                  <option value="Refrescos">Refrescos / Sodas</option>
                  <option value="Accesorio">Accesorios</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Químicos">Químicos</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Icono</label>
                <div className="grid grid-cols-6 gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  {['📦', '🥤', '🍺', '🧊', '🍫', '🌲', '🧼', '✨', '🔧', '🧴', '🍟', '💧'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setItemsToCreate({ ...itemsToCreate, icon })}
                      className={`text-2xl p-2 rounded-xl hover:bg-white hover:scale-110 transition-all ${itemsToCreate.icon === icon ? 'bg-luxury-blue shadow-lg scale-110' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-luxury-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-95 transition-all">
                AGREGAR AL INVENTARIO
=======
              <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                {editingEmployee ? 'GUARDAR CAMBIOS' : 'REGISTRAR EMPLEADO'}
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Inventory Item Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Editar Producto</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Modificar Atributos de Inventario</p>
              </div>
              <button onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre del Producto</label>
                <input
                  required
                  className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800 transition-all"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Precio RD$</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-luxury-red transition-all"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoría</label>
                  <select
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none text-slate-800 transition-all"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    <option value="Producto">Producto</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Accesorio">Accesorio</option>
                    <option value="Químicos">Químicos</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Icono</label>
                <div className="grid grid-cols-6 gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  {['📦', '🥤', '🍺', '🧊', '🍫', '🌲', '🧼', '✨', '🔧', '🧴', '🍟', '💧'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, icon })}
                      className={`text-2xl p-2 rounded-xl hover:bg-white hover:scale-110 transition-all ${editingItem.icon === icon ? 'bg-luxury-blue shadow-lg scale-110' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-blue-900">
                GUARDAR CAMBIOS
              </button>
            </form>
          </div>
        </div >
      )}

      {/* New User Modal */}
      {
        isUserModalOpen && (
          <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Registrar Acceso</h3>
                <button onClick={() => setIsUserModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400">×</button>
              </div>
<<<<<<< HEAD
              <form onSubmit={handleAppCreateUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
=======
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Completo</label>
                    <input
                      required
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email de Acceso</label>
                    <input
                      required
                      type="email"
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>

>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contraseña</label>
                    <input
                      required
                      type="password"
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono</label>
                    <input
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol de Sistema</label>
                    <select
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="Agente">Agente</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                  CREAR ACCESO DE USUARIO
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* Edit User Role Modal */}
      {
        isEditUserModalOpen && editingUser && (
          <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Editar Rol de Usuario</h3>
                <button onClick={() => {
                  setIsEditUserModalOpen(false);
                  setEditingUser(null);
                }} className="bg-slate-50 p-3 rounded-full text-slate-400">×</button>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Usuario (Email)</p>
                  <p className="font-black text-slate-800">{editingUser.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Completo</label>
                    <input
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                      value={editingUser.full_name || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono</label>
                    <input
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol de Sistema</label>
                    <select
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="Agente">Agente</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dirección</label>
                    <textarea
                      rows="2"
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold resize-none"
                      value={editingUser.address || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                    />
                  </div>
                </div>

                <button
<<<<<<< HEAD
                  onClick={() => handleAppUpdateUserRole(editingUser.id, editingUser.role)}
                  className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
=======
                  onClick={() => handleUpdateUserProfile(editingUser.id, editingUser)}
                  className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-blue-900"
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
                >
                  GUARDAR CAMBIOS DE PERFIL
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Printable Invoice */}
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
            <p className="text-lg font-bold">#{String(selectedSaleForInvoice?.sale_number).padStart(4, '0')}</p>
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
          <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Datos del Cliente</h4>
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>{selectedSaleForInvoice.client_name || '---'}</span>
              <span className="font-mono">{selectedSaleForInvoice.client_rnc || '---'}</span>
            </div>
          </div>
        )}

        <table className="w-full mb-10">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[10px] font-black uppercase">
              <th className="py-4">V-Item</th>
              <th className="py-4 text-center">Cant</th>
              <th className="py-4 text-right">Precio</th>
              <th className="py-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {selectedSaleForInvoice?.services && (
              <tr className="border-b-2 border-slate-300 bg-blue-50">
                <td className="py-4 font-black uppercase text-luxury-blue">SERVICIO: {selectedSaleForInvoice.services.name}</td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">RD${Number(selectedSaleForInvoice.services.price).toFixed(2)}</td>
                <td className="py-4 text-right font-black">RD${Number(selectedSaleForInvoice.services.price).toFixed(2)}</td>
              </tr>
            )}
            {selectedSaleForInvoice?.sale_items?.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-4 font-bold uppercase">{item.inventory?.name || 'Producto'}</td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">RD${Number(item.unit_price).toFixed(2)}</td>
                <td className="py-4 text-right font-black">RD${(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end pt-8 border-t-2 border-slate-900">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="opacity-40">Subtotal</span>
              <span className="font-bold text-right">RD${(Number(selectedSaleForInvoice?.total_amount) / (1 + ITBIS_RATE)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-red-600 font-bold">
              <span>ITBIS (18.0%)</span>
              <span className="text-right">RD${(Number(selectedSaleForInvoice?.total_amount) - (Number(selectedSaleForInvoice?.total_amount) / (1 + ITBIS_RATE))).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black border-t border-slate-200 pt-2">
              <span>TOTAL</span>
              <span className="text-luxury-red">RD${Number(selectedSaleForInvoice?.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center border-t border-slate-100 pt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Gracias por preferir a KOUSA LUXURY</p>
          <p className="text-[8px] mt-2 opacity-40 italic">"Excelencia en cuidado automotriz"</p>
        </div>
      </div>

      {/* Fleet Company Modal */}
      {isFleetModalOpen && (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
              <button onClick={() => setIsFleetModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400">×</button>
            </div>
            <form onSubmit={handleFleetSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre de la Empresa</label>
                  <input
                    required
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">RNC</label>
                  <input
                    placeholder="1-31-00000-0"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                    value={newCompany.rnc}
                    onChange={(e) => setNewCompany({ ...newCompany, rnc: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Límite de Crédito RD$</label>
                  <input
                    type="number"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-luxury-red"
                    value={newCompany.credit_limit}
                    onChange={(e) => setNewCompany({ ...newCompany, credit_limit: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dirección Comercial</label>
                  <textarea
                    rows="2"
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold resize-none"
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  />
                </div>

                {/* Contact Info */}
                <div className="bg-slate-50 p-6 rounded-3xl col-span-full space-y-4 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Persona de Contacto / Representante</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Nombre del Representante</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-luxury-blue outline-none font-bold text-sm"
                        value={newCompany.contact_person}
                        onChange={(e) => setNewCompany({ ...newCompany, contact_person: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Teléfono Directo</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white border border-slate-200 focus:border-luxury-blue outline-none font-bold text-sm"
                        value={newCompany.representative_phone}
                        onChange={(e) => setNewCompany({ ...newCompany, representative_phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                {editingCompany ? 'GUARDAR CAMBIOS' : 'REGISTRAR EMPRESA'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Fleet Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{editingVehicle ? 'Editar Vehículo' : 'Vincular Vehículo'}</h3>
              <button onClick={() => setIsVehicleModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400">×</button>
            </div>
            <form onSubmit={handleVehicleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Placa</label>
                <input required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-black text-2xl tracking-[0.2em] uppercase" placeholder="A000000" value={newFleetVehicle.plate} onChange={e => setNewFleetVehicle({ ...newFleetVehicle, plate: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modelo / Descripción</label>
                <input
                  required
                  className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold transition-all"
                  placeholder="Ej: Toyota Hilux Blanca"
                  value={newFleetVehicle.model}
                  onChange={e => setNewFleetVehicle({ ...newFleetVehicle, model: e.target.value })}
                />

                {/* Quick Model Suggestions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Toyota Hilux', 'Hyundai Sonata', 'Kia K5', 'Honda CR-V', 'Toyota Corolla', 'Ford F-150', 'Jeep Grand Ch.'].map(model => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setNewFleetVehicle({ ...newFleetVehicle, model })}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] font-black uppercase text-slate-500 border border-slate-100 hover:bg-luxury-blue hover:text-white hover:border-luxury-blue transition-all"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                {editingVehicle ? 'GUARDAR CAMBIOS' : 'VINCULAR A FLOTA'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { margin: 0; }
          body * {
            visibility: hidden;
          }
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: block !important;
            padding: 2cm;
          }
        }
      ` }} />
<<<<<<< HEAD
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 text-luxury-red rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg border border-red-100">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-center uppercase tracking-tighter mb-4">¿Confirmar Eliminación?</h3>
            <p className="text-slate-500 text-center text-sm leading-relaxed mb-10">
              Esta acción es permanente. {itemToDelete?.type === 'company' ? 'Todos los vehículos vinculados a esta empresa perderán su asociación.' : 'Este empleado será marcado como inactivo.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-luxury-red text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
              >
                Eliminar
              </button>
=======

      {/* Fleet Payment Modal */}
      {isFleetPaymentModalOpen && editingCompany && (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center border border-slate-100 relative">
            <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5">
              <DollarSign size={200} strokeWidth={2.5} className="text-emerald-900" />
            </div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase text-luxury-red">Registrar Pago</h3>
                <p className="text-[10px] font-black text-slate-400 border-l-4 border-luxury-red pl-2 uppercase tracking-widest mt-1">{editingCompany.name}</p>
              </div>
              <button onClick={() => setIsFleetPaymentModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:text-luxury-red transition-colors pointer-events-auto">×</button>
            </div>

            <form onSubmit={handleRecordFleetPayment} className="space-y-6 relative z-10">
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 mb-4 text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Deuda Pendiente Actual</p>
                <p className="text-4xl font-black text-emerald-700 tracking-tighter">RD${Number(editingCompany.current_balance || 0).toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Monto del Abono (RD$)</label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full p-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-black text-3xl text-emerald-600 placeholder:opacity-20 transition-all"
                  value={newFleetPayment.amount}
                  onChange={(e) => setNewFleetPayment({ ...newFleetPayment, amount: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Método</label>
                  <select
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none cursor-pointer"
                    value={newFleetPayment.method}
                    onChange={(e) => setNewFleetPayment({ ...newFleetPayment, method: e.target.value })}
                  >
                    <option value="Efectivo">Efectivo 💵</option>
                    <option value="Transferencia">Transferencia 🔄</option>
                    <option value="Cheque">Cheque 🎫</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Referencia</label>
                  <input
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold placeholder:opacity-40"
                    placeholder="# Ref / Fact"
                    value={newFleetPayment.notes}
                    onChange={(e) => setNewFleetPayment({ ...newFleetPayment, notes: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-7 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/20 active:scale-95 transition-all hover:bg-emerald-700">
                APLICAR PAGO A CUENTA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Fleet History Modal */}
      {isFleetHistoryModalOpen && editingCompany && (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] p-12 w-full max-w-3xl shadow-2xl scale-in-center border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start mb-10 shrink-0">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Estado de Cuenta</h3>
                <div className="flex items-center gap-2 mt-4">
                  <p className="px-4 py-1.5 bg-luxury-blue text-white rounded-full text-[10px] font-black uppercase tracking-widest">{editingCompany.name}</p>
                  <p className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Desde Registro</p>
                </div>
              </div>
              <button onClick={() => setIsFleetHistoryModalOpen(false)} className="bg-slate-50 p-4 rounded-full text-slate-400 hover:text-luxury-red transition-all shadow-sm active:scale-90">×</button>
            </div>

            <div className="overflow-y-auto flex-1 pr-4 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white border-b-2 border-slate-50 z-10">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-6 pr-4">Fecha</th>
                    <th className="py-6">Concepto / Referencia</th>
                    <th className="py-6 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fleetHistory.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-6 pr-4 text-[10px] font-bold text-slate-400 font-mono">
                        {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${item.type === 'SALE' ? 'bg-red-50 text-luxury-red border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            {item.type === 'SALE' ? <ShoppingCart size={16} /> : <DollarSign size={16} />}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-slate-800 tracking-tight">
                              {item.type === 'SALE' ? `SERVICIO: ${item.services?.name}` : `PAGO RECIBIDO: ${item.payment_method}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {item.vehicle_plate && <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">PLACA: {item.vehicle_plate}</span>}
                              {item.notes && <span className="text-[9px] font-bold text-slate-400 italic"> — "{item.notes}"</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-right">
                        <p className={`font-black text-base tracking-tighter ${item.type === 'SALE' ? 'text-luxury-red' : 'text-emerald-700'}`}>
                          {item.type === 'SALE' ? '+' : '-'} RD${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                    </tr>
                  ))}
                  {fleetHistory.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-32 text-center">
                        <History size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No hay transacciones registradas</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-10 pt-10 border-t-4 border-slate-900 flex justify-between items-end shrink-0 bg-white">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] leading-none">Cerrar Balance Pendiente</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-luxury-red animate-pulse"></div>
                  <p className="text-xs font-bold text-slate-800 uppercase">Estado de Cuenta Actualizado</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-luxury-red tracking-widest mb-1">TOTAL DEUDA</p>
                <p className="text-5xl font-black text-luxury-red leading-none tracking-tighter">
                  RD${Number(editingCompany.current_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD
    </div>
=======
    </div >
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
  );
};

export default App;
