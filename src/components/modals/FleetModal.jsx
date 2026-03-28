import React from 'react';

const FleetModal = ({
    isOpen,
    onClose,
    selectedCompanyForFleet,
    newFleetPlate,
    setNewFleetPlate,
    handleAddFleetVehicle,
    handleDeleteFleetVehicle,
    fleetVehicles
}) => {
    if (!isOpen || !selectedCompanyForFleet) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Gestionar Flotilla</h3>
                        <p className="text-[10px] font-black text-luxury-blue uppercase tracking-widest mt-1">{selectedCompanyForFleet.name}</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>

                <form onSubmit={handleAddFleetVehicle} className="flex gap-4 mb-8">
                    <input
                        required
                        className="flex-1 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-black font-mono text-xl uppercase tracking-tighter"
                        placeholder="PLACA (Ej: A123456)"
                        value={newFleetPlate}
                        onChange={(e) => setNewFleetPlate(e.target.value.toUpperCase())}
                    />
                    <button type="submit" className="bg-luxury-blue text-white w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg hover:bg-blue-900 transition-all">+</button>
                </form>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-4">Placas Registradas</h4>
                    {fleetVehicles.filter(v => v.company_id === selectedCompanyForFleet.id).map(v => (
                        <div key={v.plate} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group">
                            <span className="font-black font-mono text-lg text-slate-800">{v.plate}</span>
                            <button
                                onClick={() => handleDeleteFleetVehicle(v.plate)}
                                className="text-slate-300 hover:text-red-500 font-bold text-xl opacity-0 group-hover:opacity-100 transition-all"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {fleetVehicles.filter(v => v.company_id === selectedCompanyForFleet.id).length === 0 && (
                        <p className="text-center py-10 text-slate-300 font-bold italic">No hay placas registradas</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FleetModal;
