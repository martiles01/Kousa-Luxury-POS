import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  Package,
  BarChart3,
  Plus,
  LogOut,
  Settings
} from 'lucide-react';

import { supabase } from './supabaseClient';

const ITBIS_RATE = 0.18;

const LogoKousa = ({ className }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="flex items-baseline gap-1">
      <h1 className="text-2xl font-black tracking-tighter text-white">
        KOUSA <span className="text-luxury-red">LUXURY</span>
      </h1>
    </div>
    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Auto Import & Care</p>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [washQueue, setWashQueue] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Stats and Form States
  const [stats, setStats] = useState({ activeWashes: 0, dailySales: 0, activeBays: 0 });
  const [isWashModalOpen, setIsWashModalOpen] = useState(false);
  const [newWash, setNewWash] = useState({ plate: '', model: '', service_id: '', type: 'car', gama: 'estandar', client_phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [salesHistory, setSalesHistory] = useState([]);
  const [reportFilter, setReportFilter] = useState('today'); // today, week, month
  const [typeFilter, setTypeFilter] = useState('all'); // all, services, products
  const [revenueBreakdown, setRevenueBreakdown] = useState({ washes: 0, products: 0 });
  const [serviceMetrics, setServiceMetrics] = useState([]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [itemsToCreate, setItemsToCreate] = useState({ name: '', price: 0, category: 'Agua', stock: 10, icon: '📦' });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'Agente' });
  const [configActive, setConfigActive] = useState(false);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('Agente');
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [fiscalData, setFiscalData] = useState({ name: '', rnc: '', type: 'final' });
  const [selectedWashPay, setSelectedWashPay] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: invData, error: invError } = await supabase.from('inventory').select('*').order('name');
      if (invError) console.error('Error fetching inventory:', invError);

      const { data: serData, error: serError } = await supabase.from('services').select('*').order('price');
      if (serError) console.error('Error fetching services:', serError);

      // Fetch ALL recent washes (active AND completed) to allow notifications
      const { data: queueData, error: queueError } = await supabase.from('wash_queue')
        .select('*, services(name, price)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (invData) setInventory(invData);
      if (serData) setServices(serData);
      if (queueData) setWashQueue(queueData);

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
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkUserRole(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (session) {
      fetchData();

      // Fetch user profiles if admin
      if (currentUserRole === 'Administrador') {
        fetchUserProfiles();
      }

      // Subscribe to real-time changes
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, reportFilter, currentUserRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        console.error('Auth error:', error.message);
        if (error.message.includes('Email not confirmed')) {
          setAuthError('Email no verificado. Revisa tu correo o el panel de Supabase.');
        } else if (error.message.includes('Invalid login credentials')) {
          setAuthError('Correo o contraseña incorrectos.');
        } else {
          setAuthError(`Error: ${error.message}`);
        }
      }
      // If success, the onAuthStateChange listener will handle setting the session
    } catch (err) {
      console.error('Fatal login error:', err);
      setAuthError('Error de conexión con el servidor.');
    } finally {
      // Small delay to allow session change to trigger before unlocking UI
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleLogout = async () => {
    // 1. Immediate local cleanup to ensure UI responsiveness
    setSession(null);
    setCurrentUserRole('Agente');
    setActiveTab('dashboard');
    setLoading(false);

    // 2. Perform Supabase sign out in background (don't block UI)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    const productsTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const serviceTotal = selectedWashPay?.services?.price || 0;
    return productsTotal + serviceTotal;
  };

  const handleAddWash = async (e) => {
    e.preventDefault();
    if (!newWash.plate || !newWash.service_id) return;

    const { error } = await supabase.from('wash_queue').insert([
      {
        vehicle_plate: newWash.plate,
        vehicle_model: newWash.model || 'Desconocido',
        service_id: newWash.service_id,
        client_phone: newWash.client_phone,
        progress: 0,
        status: 'pending'
      }
    ]);

    if (!error) {
      setIsWashModalOpen(false);
      setNewWash({ plate: '', model: '', service_id: '', client_phone: '' });
      fetchData();
    } else {
      console.error('Error adding wash:', error);
    }
  };

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

      // Prepare sale data
      const saleData = {
        total_amount: total.toFixed(2),
        payment_method: method,
        client_name: fiscalData.name.toUpperCase(),
        client_rnc: fiscalData.rnc,
        invoice_type: fiscalData.type
      };

      // Add service info if applicable
      if (washServiceData) {
        saleData.service_id = washServiceData.service_id;
        saleData.vehicle_plate = washServiceData.vehicle_plate;
        // If the service is paid, mark as completed? Or just leave it?
        // Usually payment means ready to deliver, but let's just record the sale.
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

      // Update Inventory Stock (Atomic update not directly available in simple JS client, usually done via RPC or separate calls)
      for (const item of cart) {
        const { data: currentItem } = await supabase.from('inventory').select('stock').eq('id', item.id).single();
        await supabase.from('inventory').update({ stock: (currentItem?.stock || 0) - item.quantity }).eq('id', item.id);
      }

      setCart([]);
      setFiscalData({ name: '', rnc: '', type: 'final' }); // Reset form
      setSelectedWashPay(null);
      fetchData();
      const { data: fullSale } = await supabase
        .from('sales')
        .select('*, sale_items(*, inventory(name)), services(name, price)')
        .eq('id', sale[0].id)
        .single();
      handlePrintInvoice(fullSale);
    } catch (error) {
      console.error('Error in checkout:', error);
      alert('Error al procesar la venta');
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

    const { error } = await supabase.from('inventory')
      .update({
        name: editingItem.name,
        price: Number(editingItem.price),
        name: editingItem.name,
        price: Number(editingItem.price),
        category: editingItem.category,
        icon: editingItem.icon
      })
      .eq('id', editingItem.id);

    if (!error) {
      setIsEditModalOpen(false);
      setEditingItem(null);
      fetchData();
    } else {
      console.error('Error updating product:', error);
      alert('Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (id) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleAddInventoryItem = async (e) => {
    e.preventDefault();
    if (!itemsToCreate.name || itemsToCreate.price <= 0) return;

    const { error } = await supabase.from('inventory').insert([
      {
        name: itemsToCreate.name,
        price: Number(itemsToCreate.price),
        category: itemsToCreate.category,
        stock: Number(itemsToCreate.stock)
      }
    ]);

    if (!error) {
      setIsInventoryModalOpen(false);
      setItemsToCreate({ name: '', price: 0, category: 'Agua', stock: 10 });
      fetchData();
    } else {
      console.error('Error adding product:', error);
      alert('Error al agregar producto');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return;
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
        role: newUser.role
      });

      setIsUserModalOpen(false);
      setNewUser({ email: '', password: '', role: 'Agente' });
      alert('Usuario creado con éxito. Debe confirmar su correo si la opción está activa en Supabase.');
      fetchUserProfiles(); // Refresh user list
    } else {
      console.error('Error creating user:', error);
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const fetchUserProfiles = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUserProfiles(data);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      fetchUserProfiles();
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      alert('Rol actualizado correctamente');
    } else {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleDeleteUserProfile = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

    // Note: This will only delete the profile, not the auth user
    // To delete the auth user, you need admin API access
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (!error) {
      fetchUserProfiles();
      alert('Perfil eliminado correctamente');
    } else {
      console.error('Error deleting profile:', error);
      alert('Error al eliminar el perfil');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'car', label: 'Cola de Lavado', icon: Car },
    { id: 'pos', label: 'Ventas (POS)', icon: ShoppingCart },
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
              disabled={loading}
              className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-[0.3em] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
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
      <aside className="w-64 bg-luxury-dark text-white flex flex-col p-6 fixed h-full shadow-2xl z-20">
        <div className="mb-10">
          <LogoKousa />
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                ? 'bg-luxury-red shadow-lg shadow-red-900/20 font-bold'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 opacity-70 hover:opacity-100 transition-all text-slate-400"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500 text-sm">Operaciones en tiempo real — {new Date().toLocaleDateString('es-DO')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-red-100 text-luxury-red px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
              SUCURSAL CENTRAL
            </span>
          </div>
        </header>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-luxury-red p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-900/20">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Lavados Activos</p>
                <div className="flex items-center justify-between mt-4">
                  <h4 className="text-5xl font-black">{stats.activeWashes}</h4>
                  <div className="p-3 bg-white/10 rounded-2xl"><Car size={32} /></div>
                </div>
              </div>
              <div className="bg-luxury-dark p-8 rounded-[2.5rem] text-white shadow-xl">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Ventas del Día</p>
                <div className="flex items-center justify-between mt-4">
                  <h4 className="text-5xl font-black text-emerald-400">RD${Number(stats.dailySales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                  <div className="p-3 bg-white/10 rounded-2xl"><ShoppingCart size={32} /></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] text-slate-800 shadow-sm border border-slate-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Bahías en Uso</p>
                <div className="flex items-center justify-between mt-4">
                  <h4 className="text-5xl font-black text-luxury-blue">{stats.activeBays}</h4>
                  <div className="p-3 bg-slate-50 rounded-2xl text-luxury-blue"><Car size={32} /></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Actividad en Cola</h3>
                <div className="space-y-4">
                  {washQueue.slice(0, 4).map(w => (
                    <div key={w.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-luxury-red shadow-sm">{w.vehicle_plate.slice(0, 2)}</div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{w.vehicle_plate}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{w.services?.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {w.client_phone && (
                          <a
                            href={`https://wa.me/${w.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(w.status === 'completed'
                              ? `Hola! Tu vehículo ${w.vehicle_model} [${w.vehicle_plate}] está listo para retirar. Total a pagar: RD$${Number(w.services?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Gracias por preferir Kousa Luxury!`
                              : `Hola! Tu vehículo ${w.vehicle_model} [${w.vehicle_plate}] ha iniciado su proceso de lavado en Kousa Luxury.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
                            title="Enviar WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          </a>
                        )}
                        <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center">{w.status}</span>
                      </div>
                    </div>
                  ))}
                  {washQueue.length === 0 && <p className="text-center py-10 text-slate-300 font-bold italic">No hay actividad reciente</p>}
                </div>
                <button onClick={() => setActiveTab('car')} className="w-full mt-6 text-xs font-black text-luxury-blue hover:underline uppercase tracking-widest">Ver cola completa</button>
              </div>

              <div className="md:col-span-1 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Desglose de Ingresos</h3>
                <div className="flex-1 flex flex-col justify-center space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servicios de Lavado</span>
                      <span className="text-sm font-black text-luxury-red">RD${revenueBreakdown.washes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div
                        className="h-full bg-luxury-red transition-all duration-1000"
                        style={{ width: `${Math.max(5, (revenueBreakdown.washes / (revenueBreakdown.washes + revenueBreakdown.products || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ventas de Productos</span>
                      <span className="text-sm font-black text-luxury-blue">RD${revenueBreakdown.products.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div
                        className="h-full bg-luxury-blue transition-all duration-1000"
                        style={{ width: `${Math.max(5, (revenueBreakdown.products / (revenueBreakdown.washes + revenueBreakdown.products || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Basado en filtros actuales</p>
              </div>

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
                <div key={item.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative group">
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteWash(item.id)} className="text-slate-300 hover:text-luxury-red transition-colors text-xl font-bold">×</button>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center font-mono font-black text-xl text-white shadow-xl shadow-slate-900/20">{item.vehicle_plate}</div>
                    <div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight leading-tight">{item.vehicle_model}</h4>
                      <p className="text-[10px] font-black text-luxury-blue uppercase tracking-[0.2em] mt-1">{item.services?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Estado: {item.status}</span>
                      <span className="text-sm font-black text-slate-800">{item.progress}%</span>
                    </div>
                    <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                      <div className="h-full bg-luxury-red rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(185,28,28,0.4)]" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      {item.progress < 100 ? (
                        <>
                          <button onClick={() => updateProgress(item.id, item.progress)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-dark transition-all active:scale-95 shadow-lg shadow-slate-900/10">Avanzar</button>
                          <button onClick={() => updateProgress(item.id, 80)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"><Car size={16} className="text-slate-400" /></button>
                        </>
                      ) : (
                        /* When 100% completed, show Cobrar Button */
                        <button
                          onClick={() => {
                            setSelectedWashPay(item);
                            setActiveTab('pos');
                          }}
                          className="flex-1 py-4 bg-luxury-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={14} /> Cobrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="group relative bg-slate-50 p-6 rounded-[2.5rem] border border-transparent hover:border-luxury-blue hover:bg-white transition-all text-center space-y-3 active:scale-95"
                    >
                      <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.category}</p>
                        <h5 className="font-black text-slate-800 text-sm mt-1">{item.name}</h5>
                        <p className="text-luxury-red font-black text-sm mt-1">RD${item.price.toFixed(2)}</p>
                      </div>
                      <div className={`absolute top-2 right-4 text-[9px] font-black px-2 py-1 rounded-full ${item.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.stock}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="px-10 py-6 text-slate-800">Producto / Descripción</th>
                    <th className="px-10 py-6">Stock Actual</th>
                    <th className="px-10 py-6">Precio Venta</th>
                    <th className="px-10 py-6">Categoría</th>
                    <th className="px-10 py-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-800 font-medium">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl filter saturate-50">{item.icon}</span>
                          <span className="font-black text-sm uppercase tracking-tight">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {item.stock} UNIDADES
                        </span>
                      </td>
                      <td className="px-10 py-6 font-mono font-black text-sm">RD${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-10 py-6 text-[10px] font-black uppercase opacity-40 tracking-widest text-luxury-blue">{item.category}</td>
                      <td className="px-10 py-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem({ ...item });
                              setIsEditModalOpen(true);
                            }}
                            className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                            title="Editar Producto"
                          >
                            Editar
                          </button>
                          <button
                            onClick={async () => {
                              await supabase.from('inventory').update({ stock: item.stock + 10 }).eq('id', item.id);
                              fetchData();
                            }}
                            className="bg-slate-100 hover:bg-slate-900 hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                            title="Sumar 10"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="bg-red-50 hover:bg-luxury-red hover:text-white p-3 rounded-xl text-luxury-red transition-all shadow-sm active:scale-90"
                            title="Eliminar"
                          >
                            <span className="font-bold">×</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="space-y-10 text-slate-800 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl sticky top-0 z-10 mx-1">
              <h3 className="text-xl font-black uppercase tracking-tight ml-4">Periodo de Reporte</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {[
                  { id: 'today', label: 'Hoy' },
                  { id: 'week', label: '7 Días' },
                  { id: 'month', label: 'Mes' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setReportFilter(f.id)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportFilter === f.id ? 'bg-luxury-red text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-luxury-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Recaudación Total</p>
                <h4 className="text-3xl font-black mt-2 tracking-tighter">RD${(revenueBreakdown.washes + revenueBreakdown.products).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Servicios</p>
                <h4 className="text-3xl font-black mt-2 tracking-tighter text-luxury-red">RD${revenueBreakdown.washes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Venta Productos</p>
                <h4 className="text-3xl font-black mt-2 tracking-tighter text-luxury-blue">RD${revenueBreakdown.products.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              </div>
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Estado Contable</p>
                <h4 className="text-2xl font-black mt-2 tracking-tighter text-emerald-600 uppercase">Auditado</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm p-10 border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Historial de Ventas</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transacciones en periodo seleccionado</p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Todos</button>
                    <button onClick={() => setTypeFilter('services')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'services' ? 'bg-white shadow-sm text-luxury-red' : 'text-slate-400 hover:text-slate-600'}`}>Servicios</button>
                    <button onClick={() => setTypeFilter('products')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'products' ? 'bg-white shadow-sm text-luxury-blue' : 'text-slate-400 hover:text-slate-600'}`}>Productos</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {salesHistory
                    .filter(sale => {
                      if (typeFilter === 'services') return sale.services;
                      if (typeFilter === 'products') return sale.sale_items && sale.sale_items.length > 0;
                      return true;
                    })
                    .map(sale => (
                      <div key={sale.id} className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm font-black text-luxury-blue group-hover:bg-luxury-blue group-hover:text-white transition-colors">#</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-black text-slate-800 text-sm uppercase">Venta #{sale.id.slice(0, 5)}</p>
                              {sale.invoice_type === 'fiscal' && (
                                <span className="text-[8px] font-black bg-luxury-blue text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Fiscal</span>
                              )}
                              {sale.services ? (
                                <span className="text-[8px] font-black bg-luxury-red text-white px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1"><Car size={8} /> Lavado</span>
                              ) : (
                                <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">📦 Prod</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              {new Date(sale.created_at).toLocaleDateString()} — {sale.payment_method}
                              {sale.client_name && <span className="text-slate-600 border-l border-slate-300 pl-1 ml-1">{sale.client_name}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-black text-luxury-red text-lg block leading-none">RD${Number(sale.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${sale.payment_method === 'Efectivo' ? 'text-emerald-500' : 'text-blue-500'}`}>{sale.payment_method}</span>
                          </div>
                          <button
                            onClick={() => handlePrintInvoice(sale)}
                            className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-luxury-blue shadow-sm"
                            title="Imprimir Factura"
                          >
                            <BarChart3 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  {salesHistory.length === 0 && <p className="text-center py-20 opacity-20 italic font-black">No hay transacciones en este periodo</p>}
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm p-10 border border-slate-100 h-fit">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Servicios Top</h3>
                <div className="space-y-6">
                  {serviceMetrics.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black">{idx + 1}</div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">{m.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cant: {m.count}</p>
                        </div>
                      </div>
                      <div className="text-luxury-red"><BarChart3 size={16} /></div>
                    </div>
                  ))}
                  {serviceMetrics.length === 0 && <p className="text-center py-10 opacity-20 italic font-bold">Sin datos</p>}
                </div>
              </div>
            </div>
          </div>
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
                                onClick={() => handleDeleteUserProfile(user.id)}
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
      {isWashModalOpen && (
        <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-xl shadow-2xl scale-in-center overflow-y-auto max-h-[95vh] border-4 border-luxury-red/5">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">NUEVO SERVICIO</h3>
              <button onClick={() => setIsWashModalOpen(false)} className="bg-slate-50 p-4 rounded-full text-slate-400 hover:text-slate-900 transition-colors">×</button>
            </div>

            <form onSubmit={handleAddWash} className="space-y-8">
              {/* Tipo de Vehículo */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Categoría de Vehículo</label>
                <div className="flex gap-4 p-2 bg-slate-50 rounded-3xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setNewWash({ ...newWash, type: 'car', gama: 'estandar' })}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all text-xs tracking-widest ${newWash.type === 'car' ? 'bg-white text-luxury-red shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    CARRO / SUV
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewWash({ ...newWash, type: 'moto', gama: 'moto' })}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all text-xs tracking-widest ${newWash.type === 'moto' ? 'bg-white text-luxury-blue shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    MOTOCICLETA
                  </button>
                </div>
              </div>

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
                    {/* Fallback to show all */}
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
              <form onSubmit={handleCreateUser} className="space-y-6">
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
                  onClick={() => handleUpdateUserRole(editingUser.id, editingUser.role)}
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
