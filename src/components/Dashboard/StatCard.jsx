import React from 'react';
import { Car, ShoppingCart } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, textColorClass, iconBgClass }) => {
  return (
    <div className={`${colorClass} p-8 rounded-[2.5rem] ${textColorClass} shadow-xl`}>
      <p className={`${textColorClass}/40 text-[10px] font-black uppercase tracking-[0.2em]`}>{title}</p>
      <div className="flex items-center justify-between mt-4">
        <h4 className="text-5xl font-black">{value}</h4>
        <div className={`p-3 ${iconBgClass} rounded-2xl`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
