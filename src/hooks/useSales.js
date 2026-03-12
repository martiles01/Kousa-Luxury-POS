import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { processSale as apiProcessSale } from '../services/api';

const ITBIS_RATE = 0.18;

export const useSales = (session, reportFilter) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [fiscalData, setFiscalData] = useState({ name: '', rnc: '', type: 'final' });
  const [salesHistory, setSalesHistory] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState({ washes: 0, products: 0 });
  const [serviceMetrics, setServiceMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesData = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let filterDate = new Date();
      if (reportFilter === 'today') filterDate.setHours(0, 0, 0, 0);
      else if (reportFilter === 'week') filterDate.setDate(today.getDate() - 7);
      else if (reportFilter === 'month') filterDate.setMonth(today.getMonth() - 1);

      const [salesRes, washesRes] = await Promise.all([
        supabase.from('sales')
          .select('*, sale_items(*, inventory(name)), services(name, price)')
          .gte('created_at', filterDate.toISOString())
          .order('created_at', { ascending: false }),
        supabase.from('wash_queue')
          .select('*, services(name, price)')
          .eq('status', 'completed')
          .gte('completed_at', filterDate.toISOString())
      ]);

      if (salesRes.error) throw salesRes.error;
      if (washesRes.error) throw washesRes.error;

      const allSales = salesRes.data || [];
      const allWashes = washesRes.data || [];

      // Calculate Revenue Breakdown
      const productRev = allSales.reduce((acc, s) => acc + Number(s.total_amount), 0);
      const washRev = allWashes.reduce((acc, w) => acc + (w.services?.price || 0), 0);

      setRevenueBreakdown({ washes: washRev, products: productRev });
      setSalesHistory(allSales);

      // Service Popularity
      const popularity = {};
      allWashes.forEach(w => {
        const name = w.services?.name || 'Otro';
        popularity[name] = (popularity[name] || 0) + 1;
      });
      const metrics = Object.entries(popularity)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setServiceMetrics(metrics);

    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();

    // Global real-time listener for sales and completed washes
    const channel = supabase
      .channel('sales-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, fetchSalesData)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wash_queue', filter: 'status=eq.completed' }, fetchSalesData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, reportFilter]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const checkout = async (selectedWashPay = null) => {
    if (cart.length === 0 && !selectedWashPay) return { success: false, message: 'Carrito vacío' };

    try {
      const productsTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const servicePrice = selectedWashPay?.services?.price || 0;
      const subtotal = productsTotal + servicePrice;
      const tax = subtotal * ITBIS_RATE;
      const total = subtotal + tax;

      const saleData = {
        total_amount: total.toFixed(2),
        payment_method: paymentMethod,
        client_name: fiscalData.name.toUpperCase(),
        client_rnc: fiscalData.rnc,
        invoice_type: fiscalData.type,
        sale_items: cart.map(item => ({
          inventory_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      };

      if (selectedWashPay) {
        saleData.service_id = selectedWashPay.service_id;
        saleData.vehicle_plate = selectedWashPay.vehicle_plate;
        saleData.company_id = selectedWashPay.company_id;
      }

      const fullSale = await apiProcessSale(saleData);
      
      if (fullSale) {
        setCart([]);
        setFiscalData({ name: '', rnc: '', type: 'final' });
        fetchSalesData();
        return { success: true, sale: fullSale };
      }
      return { success: false, message: 'Error en el proceso de venta' };
    } catch (error) {
      console.error('Checkout error:', error);
      return { success: false, message: error.message || 'Error al procesar la venta' };
    }
  };

  return {
    cart,
    paymentMethod,
    setPaymentMethod,
    fiscalData,
    setFiscalData,
    salesHistory,
    revenueBreakdown,
    serviceMetrics,
    loading,
    addToCart,
    removeFromCart,
    clearCart: () => setCart([]),
    checkout,
    refreshSales: fetchSalesData
  };
};
