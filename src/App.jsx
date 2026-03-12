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
  History,
  DollarSign
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

// Components
import FleetView from './components/Fleet/FleetView';
import EmployeeView from './components/Employees/EmployeeView';
import { FleetModal, VehicleModal, FleetHistoryModal, FleetPaymentModal } from './components/Fleet/FleetModals';
import { EmployeeModal } from './components/Employees/EmployeeModals';

const ITBIS_RATE = 0.18;



const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportFilter, setReportFilter] = useState('today');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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
    loading: fleetLoading
  } = useFleets(session);

  // 6. Employee Hook
  const {
    employees,
    commissions,
    addEmployee: handleAddEmployee,
    updateEmployee: handleUpdateEmployee,
    deleteEmployee: handleDeleteEmployee,
    loading: empLoading
  } = useEmployees(session, reportFilter);

  // Form & UI States
  const [isWashModalOpen, setIsWashModalOpen] = useState(false);
  const [newWash, setNewWash] = useState({ plate: '', model: '', service_id: '', type: 'car', gama: 'estandar', client_phone: '' });
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [itemsToCreate, setItemsToCreate] = useState({ name: '', price: 0, category: 'Agua', stock: 10, icon: '📦' });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'Agente' });
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
      } else {
        setIsFleetVehicle(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [newWash.plate, checkVehicleFleet]);

  const loading = authLoading || invLoading || washLoading || salesLoading || fleetLoading || empLoading;

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
    
    // Add company_id if it's a fleet vehicle
    const washData = {
      ...newWash,
      company_id: isFleetVehicle?.company_id || null
    };
    
    const success = await apiAddWash(washData);
    if (success) {
      setIsWashModalOpen(false);
      setNewWash({ plate: '', model: '', service_id: '', type: 'car', gama: 'estandar', client_phone: '', employee_id: '' });
      setIsFleetVehicle(null);
    }
  };

  const handleCheckoutProcess = async (method = 'Efectivo') => {
    const result = await checkout(selectedWashPay);
    if (result.success) {
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
    const success = await handleUpdateItem(editingItem.id, editingItem);
    if (success) {
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
    const success = await handleCreateUser(newUser);
    if (success) {
      setIsUserModalOpen(false);
      setNewUser({ email: '', password: '', role: 'Agente' });
      alert('Usuario creado con éxito.');
    } else {
      alert('Error al crear usuario.');
    }
  };

  const handleAppUpdateUserRole = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      alert('Rol actualizado correctamente');
    } else {
      alert('Error al actualizar el rol');
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
    if (confirm('¿Estás seguro de que deseas eliminar esta empresa? Todos los vehículos vinculados perderán su asociación.')) {
      await deleteCompany(id);
    }
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'car', label: 'Cola de Lavado', icon: Car },
    { id: 'pos', label: 'Ventas (POS)', icon: ShoppingCart },
    { id: 'fleet', label: 'Flotillas', icon: Car },
    { id: 'employees', label: 'Empleados', icon: Users },
    { id: 'inventory', label: 'Inventario', icon: Package },
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

  return (
    <div className="flex min-h-screen w-full bg-gray-100 font-montserrat">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        menuItems={menuItems} 
        handleLogout={handleLogout} 
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
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
                            <p className="font-black text-slate-800 text-sm">{user.email}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              Rol: <span className={user.role === 'Administrador' ? 'text-luxury-red' : 'text-luxury-blue'}>{user.role}</span>
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
                              Editar Rol
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
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Nuevo Producto</h3>
              <button onClick={() => setIsInventoryModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400">×</button>
            </div>
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
              </div>
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
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol de Usuario</label>
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
                  CREAR ACCESO
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
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Usuario</p>
                  <p className="font-black text-slate-800">{editingUser.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nuevo Rol</label>
                  <select
                    className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="Agente">Agente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <button
                  onClick={() => handleAppUpdateUserRole(editingUser.id, editingUser.role)}
                  className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                >
                  GUARDAR CAMBIOS
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
    </div >
  );
};

export default App;
