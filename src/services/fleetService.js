import { supabase } from '../supabaseClient';
<<<<<<< HEAD
import { withErrorHandling } from './errorHandling';

export const fleetService = {
  // Companies
  getCompanies: async () => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }, 'Obteniendo empresas');
  },

  createCompany: async (company) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select();
      if (error) throw error;
      return data[0];
    }, 'Creando empresa');
  },

  updateCompany: async (id, updates) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    }, 'Actualizando empresa');
  },

  deleteCompany: async (id) => {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }, 'Eliminando empresa');
  },

  // Fleet Vehicles
  getFleetVehicles: async (companyId = null) => {
    return withErrorHandling(async () => {
      let query = supabase.from('fleet_vehicles').select('*, companies(name)');
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      const { data, error } = await query.order('plate');
      if (error) throw error;
      return data;
    }, 'Obteniendo vehículos de flota');
  },

  addVehicleToFleet: async (vehicle) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .insert([vehicle])
        .select();
      if (error) throw error;
      return data[0];
    }, 'Añadiendo vehículo a flota');
  },

  removeVehicleFromFleet: async (plate) => {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('fleet_vehicles')
        .delete()
        .eq('plate', plate);
      if (error) throw error;
    }, 'Eliminando vehículo de flota');
  },

  updateFleetVehicle: async (plate, updates) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .update(updates)
        .eq('plate', plate)
        .select();
      if (error) throw error;
      return data[0];
    }, 'Actualizando vehículo de flota');
  },

  checkVehicleFleet: async (plate) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*, companies(name, rnc, debt, credit_limit)')
        .eq('plate', plate.toUpperCase())
        .maybeSingle();
      if (error) throw error;
      return data;
    }, 'Verificando flota de vehículo');
  },

  // Payments & History
  recordPayment: async (payment) => {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('fleet_payments')
        .insert([payment])
        .select();
      if (error) throw error;
      return data[0];
    }, 'Registrando pago de flota');
  },

  getCompanyHistory: async (companyId) => {
    return withErrorHandling(async () => {
      // Fetch Sales
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('id, created_at, total_amount, payment_method, vehicle_plate, services(name)')
        .eq('company_id', companyId)
        .eq('payment_method', 'Credito');

      if (salesError) throw salesError;

      // Fetch Payments
      const { data: payments, error: paymentsError } = await supabase
        .from('fleet_payments')
        .select('*')
        .eq('company_id', companyId);

      if (paymentsError) throw paymentsError;

      // Combine and Sort
      const history = [
        ...sales.map(s => ({ ...s, type: 'SALE', date: s.created_at, amount: s.total_amount })),
        ...payments.map(p => ({ ...p, type: 'PAYMENT', date: p.created_at, amount: p.amount }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      return history;
    }, 'Obteniendo historial de empresa');
  }
=======

export const fleetService = {
    // Companies
    getCompanies: async () => {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    createCompany: async (company) => {
        const { data, error } = await supabase
            .from('companies')
            .insert([company])
            .select();
        if (error) throw error;
        return data[0];
    },

    updateCompany: async (id, updates) => {
        const { data, error } = await supabase
            .from('companies')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    deleteCompany: async (id) => {
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Fleet Vehicles
    getFleetVehicles: async (companyId = null) => {
        let query = supabase.from('fleet_vehicles').select('*, companies(name)');
        if (companyId) {
            query = query.eq('company_id', companyId);
        }
        const { data, error } = await query.order('plate');
        if (error) throw error;
        return data;
    },

    addVehicleToFleet: async (vehicle) => {
        const { data, error } = await supabase
            .from('fleet_vehicles')
            .insert([vehicle])
            .select();
        if (error) throw error;
        return data[0];
    },

    removeVehicleFromFleet: async (plate) => {
        const { error } = await supabase
            .from('fleet_vehicles')
            .delete()
            .eq('plate', plate);
        if (error) throw error;
    },

    async updateFleetVehicle(plate, updates) {
        const { data, error } = await supabase
            .from('fleet_vehicles')
            .update(updates)
            .eq('plate', plate)
            .select();
        if (error) throw error;
        return data[0];
    },

    async checkVehicleFleet(plate) {
        const { data, error } = await supabase
            .from('fleet_vehicles')
            .select('*, companies(name, rnc, current_balance, credit_limit)')
            .eq('plate', plate.toUpperCase())
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    // Payments & History
    async recordPayment(payment) {
        const { data, error } = await supabase
            .from('fleet_payments')
            .insert([payment])
            .select();
        if (error) throw error;
        return data[0];
    },

    async getCompanyHistory(companyId) {
        // Fetch Sales
        const { data: sales, error: salesError } = await supabase
            .from('sales')
            .select('id, created_at, total_amount, payment_method, vehicle_plate, services(name)')
            .eq('company_id', companyId)
            .eq('payment_method', 'Credito');

        if (salesError) throw salesError;

        // Fetch Payments
        const { data: payments, error: paymentsError } = await supabase
            .from('fleet_payments')
            .select('*')
            .eq('company_id', companyId);

        if (paymentsError) throw paymentsError;

        // Combine and Sort
        const history = [
            ...sales.map(s => ({ ...s, type: 'SALE', date: s.created_at, amount: s.total_amount })),
            ...payments.map(p => ({ ...p, type: 'PAYMENT', date: p.created_at, amount: p.amount }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        return history;
    }
>>>>>>> cf5b3b7 (Branding & Vercel Prep: Added favicon, reference images, Vercel config, and fixed redundant code in App.jsx. Secured .env.)
};
