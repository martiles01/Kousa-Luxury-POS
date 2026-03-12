import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { supabase } from '../supabaseClient';

export const useEmployees = (session, reportFilter = 'today') => {
  const [employees, setEmployees] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session) return;
    try {
      setLoading(true);
      const [emps, comms] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getCommissionReport(reportFilter)
      ]);
      setEmployees(emps || []);
      setCommissions(comms || []);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  }, [session, reportFilter]);

  useEffect(() => {
    fetchData();

    if (session) {
      const channel = supabase
        .channel('employee-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, fetchData)
        // Also listen for wash updates to recalculate commissions
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wash_queue' }, fetchData)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session, fetchData]);

  const addEmployee = async (employeeData) => {
    const result = await employeeService.createEmployee(employeeData);
    if (result) fetchData();
    return result;
  };

  const updateEmployee = async (id, updates) => {
    const result = await employeeService.updateEmployee(id, updates);
    if (result) fetchData();
    return result;
  };

  const deleteEmployee = async (id) => {
    await employeeService.deleteEmployee(id);
    fetchData();
  };

  return {
    employees,
    commissions,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees: fetchData
  };
};
