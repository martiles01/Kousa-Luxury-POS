import { supabase } from '../supabaseClient';
import { withErrorHandling } from './errorHandling';

/**
 * Service to handle employee-related operations and commission calculations.
 */
export const employeeService = {
  /**
   * Fetch all active employees.
   * @returns {Promise<Array>} List of active employees.
   */
  async getEmployees() {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }, 'Obteniendo empleados');
  },

  /**
   * Create a new employee.
   * @param {Object} employeeData - Data for the new employee.
   * @returns {Promise<Object>} Created employee.
   */
  async createEmployee(employeeData) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }, 'Creando empleado');
  },

  /**
   * Update an existing employee.
   * @param {string} id - Employee ID.
   * @param {Object} updates - Updated fields.
   * @returns {Promise<Object>} Updated employee.
   */
  async updateEmployee(id, updates) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }, 'Actualizando empleado');
  },

  /**
   * Soft delete an employee by setting active to false.
   * @param {string} id - Employee ID.
   * @returns {Promise<Object>} Deleted employee record.
   */
  async deleteEmployee(id) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('employees')
        .update({ active: false })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }, 'Eliminando empleado');
  },

  /**
   * Generate commission report for a specific period.
   * @param {string} filter - Period filter ('today', 'week', 'month').
   * @returns {Promise<Array>} Commission data per employee.
   */
  async getCommissionReport(filter = 'today') {
    return withErrorHandling(async () => {
      let startDate = new Date();
      if (filter === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (filter === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      }
      startDate.setHours(0, 0, 0, 0);

      const { data: washes, error } = await supabase
        .from('wash_queue')
        .select(`
          id,
          completed_at,
          employee_id,
          employees (name, commission_rate),
          services (name, price)
        `)
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString());

      if (error) throw error;

      // Group by employee and calculate commissions
      const report = washes.reduce((acc, wash) => {
        if (!wash.employee_id || !wash.employees) return acc;

        const empId = wash.employee_id;
        if (!acc[empId]) {
          acc[empId] = {
            id: empId,
            name: wash.employees.name,
            total_sales: 0,
            commission_earned: 0,
            services_count: 0
          };
        }

        const price = Number(wash.services?.price || 0);
        const rate = Number(wash.employees?.commission_rate || 0) / 100;
        
        acc[empId].total_sales += price;
        acc[empId].commission_earned += price * rate;
        acc[empId].services_count += 1;

        return acc;
      }, {});

      return Object.values(report).sort((a, b) => b.commission_earned - a.commission_earned);
    }, 'Generando reporte de comisiones');
  }
};
