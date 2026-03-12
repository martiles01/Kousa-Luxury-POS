import { useState, useEffect, useCallback } from 'react';
import { fleetService } from '../services/fleetService';
import { supabase } from '../supabaseClient';

export const useFleets = (session) => {
  const [companies, setCompanies] = useState([]);
  const [fleetVehicles, setFleetVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fleetHistory, setFleetHistory] = useState([]);

  const fetchData = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      const [comps, vehicles] = await Promise.all([
        fleetService.getCompanies(),
        fleetService.getFleetVehicles()
      ]);
      setCompanies(comps || []);
      setFleetVehicles(vehicles || []);
    } catch (error) {
      console.error('Error fetching fleet data:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    if (session) {
      const channel = supabase
        .channel('fleet-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet_vehicles' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet_payments' }, fetchData)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, fetchData]);

  const addCompany = async (companyData) => {
    const result = await fleetService.createCompany(companyData);
    if (result) fetchData();
    return result;
  };

  const updateCompany = async (id, updates) => {
    const result = await fleetService.updateCompany(id, updates);
    if (result) fetchData();
    return result;
  };

  const deleteCompany = async (id) => {
    await fleetService.deleteCompany(id);
    fetchData();
  };

  const addVehicle = async (vehicleData) => {
    const result = await fleetService.addVehicleToFleet(vehicleData);
    if (result) fetchData();
    return result;
  };

  const updateVehicle = async (plate, updates) => {
    const result = await fleetService.updateFleetVehicle(plate, updates);
    if (result) fetchData();
    return result;
  };

  const removeVehicle = async (plate) => {
    await fleetService.removeVehicleFromFleet(plate);
    fetchData();
  };

  const checkVehicleFleet = async (plate) => {
    return await fleetService.checkVehicleFleet(plate);
  };

  const recordPayment = async (paymentData) => {
    const result = await fleetService.recordPayment(paymentData);
    if (result) {
      // Update company balance locally/DB
      const company = companies.find(c => c.id === paymentData.company_id);
      if (company) {
        const newDebt = Math.max(0, Number(company.debt || 0) - Number(paymentData.amount));
        await fleetService.updateCompany(company.id, { debt: newDebt });
      }
      fetchData();
    }
    return result;
  };

  const fetchHistory = async (companyId) => {
    const history = await fleetService.getCompanyHistory(companyId);
    setFleetHistory(history || []);
    return history;
  };

  return {
    companies,
    fleetVehicles,
    fleetHistory,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    addVehicle,
    updateVehicle,
    removeVehicle,
    checkVehicleFleet,
    recordPayment,
    fetchHistory,
    refreshFleets: fetchData
  };
};
