import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className="group relative bg-slate-50 p-6 rounded-[2.5rem] border border-transparent hover:border-luxury-blue hover:bg-white transition-all text-center space-y-3 active:scale-95"
    >
      <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
        {product.icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {product.category}
        </p>
        <h5 className="font-black text-slate-800 text-sm mt-1">{product.name}</h5>
        <p className="text-luxury-red font-black text-sm mt-1">RD${product.price.toFixed(2)}</p>
      </div>
      <div className={`absolute top-2 right-4 text-[9px] font-black px-2 py-1 rounded-full ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
        {product.stock}
      </div>
    </button>
  );
};

export default ProductCard;
