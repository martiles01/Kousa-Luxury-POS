import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ITBIS_RATE } from '../utils/constants';

const POS = ({
    inventory,
    addToCart,
    cart,
    setCart,
    selectedWashPay,
    setSelectedWashPay,
    fiscalData,
    setFiscalData,
    paymentMethod,
    setPaymentMethod,
    fleetVehicles,
    handleCheckout
}) => {
    const getCartTotal = () => {
        const productsTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const serviceTotal = selectedWashPay?.services?.price || 0;
        return productsTotal + serviceTotal;
    };

    const subtotal = getCartTotal();
    const tax = subtotal * ITBIS_RATE;
    const total = subtotal + tax;

    return (
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
                                    {selectedWashPay.employees?.name && (
                                        <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mt-1">
                                            Lavador: {selectedWashPay.employees.name}
                                        </p>
                                    )}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all font-montserrat"
                                    value={fiscalData.rnc}
                                    onChange={(e) => setFiscalData({ ...fiscalData, rnc: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Nombre / Razón Social"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all uppercase font-montserrat"
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
                                {selectedWashPay && fleetVehicles.some(v => v.plate === selectedWashPay.vehicle_plate) && (
                                    <option value="Crédito" className="bg-luxury-dark text-luxury-blue font-black">🏢 Pago a Cuenta (Flotilla)</option>
                                )}
                            </select>
                        </div>

                        <div className="space-y-2 mb-6 border-b border-white/10 pb-6">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                                <span>Subtotal</span>
                                <span>RD${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-luxury-red">
                                <span>ITBIS (18%)</span>
                                <span>RD${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="text-xs font-bold opacity-30 uppercase tracking-widest">Total</span>
                            <h4 className="text-4xl font-black tracking-tighter">RD${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
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
    );
};

export default POS;
