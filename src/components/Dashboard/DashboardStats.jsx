import React from 'react';
import StatCard from './StatCard';
import { Car, ShoppingCart } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Lavados Activos"
        value={stats.activeWashes}
        icon={Car}
        colorClass="bg-luxury-red"
        textColorClass="text-white"
        iconBgClass="bg-white/10"
      />
      <StatCard
        title="Ventas del Día"
        value={`RD$${Number(stats.dailySales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={ShoppingCart}
        colorClass="bg-luxury-dark"
        textColorClass="text-white"
        iconBgClass="bg-white/10"
      />
      <StatCard
        title="Bahías en Uso"
        value={stats.activeBays}
        icon={Car}
        colorClass="bg-white"
        textColorClass="text-slate-800"
        iconBgClass="bg-slate-50 text-luxury-blue"
      />
    </div>
  );
};

export default DashboardStats;
