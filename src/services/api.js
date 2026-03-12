import { validateSale, validateWash, validateInventory, validateUser } from './validation';
import { withErrorHandling, CarWashError } from './errorHandling';
import { supabase } from '../supabaseClient';

// Función para procesar una venta con validación y manejo de errores
export const processSale = async (saleData) => {
  return withErrorHandling(async () => {
    // 1. Validar datos de entrada
    const validatedData = validateSale(saleData);
    
    // 2. Verificar stock disponible para cada ítem
    for (const item of validatedData.sale_items) {
      const { data: inventoryItem } = await supabase
        .from('inventory')
        .select('stock, name')
        .eq('id', item.inventory_id)
        .single();
      
      if (!inventoryItem) {
        throw CarWashError.notFound('Producto', item.inventory_id);
      }
      
      if (inventoryItem.stock < item.quantity) {
        throw CarWashError.insufficientStock(
          item.inventory_id, 
          item.quantity, 
          inventoryItem.stock
        );
      }
    }
    
    // 3. Iniciar transacción de venta
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        total_amount: validatedData.total_amount,
        payment_method: validatedData.payment_method,
        client_name: validatedData.client_name,
        client_rnc: validatedData.client_rnc,
        invoice_type: validatedData.invoice_type,
        company_id: validatedData.company_id || null,
        vehicle_plate: validatedData.vehicle_plate || null
      }])
      .select()
      .single();
    
    if (saleError) throw saleError;
    
    // 4. Insertar ítems de venta
    const saleItems = validatedData.sale_items.map(item => ({
      sale_id: sale.id,
      inventory_id: item.inventory_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));
    
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);
    
    if (itemsError) throw itemsError;
    
    // 5. Actualizar inventario (operación atómica)
    for (const item of validatedData.sale_items) {
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          stock: supabase.sql`stock - ${item.quantity}` 
        })
        .eq('id', item.inventory_id);
      
      if (updateError) throw updateError;
    }

    // 6. Update company debt if "Crédito Flotilla"
    if (validatedData.payment_method === 'Crédito Flotilla' && validatedData.company_id) {
      const { error: debtError } = await supabase
        .from('companies')
        .update({
          debt: supabase.sql`debt + ${validatedData.total_amount}`
        })
        .eq('id', validatedData.company_id);
      
      if (debtError) throw debtError;
    }
    
    // 6. Retornar venta completa
    const { data: fullSale } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          *,
          inventory (name, category)
        )
      `)
      .eq('id', sale.id)
      .single();
    
    return fullSale;
  }, 'Procesando venta');
};

// Función para crear un lavado con validación
export const createWash = async (washData) => {
  return withErrorHandling(async () => {
    // 1. Validar datos
    const validatedData = validateWash(washData);
    
    // 2. Verificar que el servicio existe
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', validatedData.service_id)
      .single();
    
    if (serviceError || !service) {
      throw CarWashError.invalidService(validatedData.service_id);
    }
    
    // 3. Verificar que no haya un lavado pendiente con la misma placa
    const { data: existingWash } = await supabase
      .from('wash_queue')
      .select('id')
      .eq('vehicle_plate', validatedData.vehicle_plate)
      .eq('status', 'pending')
      .single();
    
    if (existingWash) {
      throw CarWashError.duplicateResource(
        'Lavado pendiente',
        'placa',
        validatedData.vehicle_plate
      );
    }
    
    // 4. Crear el lavado
    const { data, error } = await supabase
      .from('wash_queue')
      .insert([{
        vehicle_plate: validatedData.vehicle_plate,
        vehicle_model: validatedData.vehicle_model,
        service_id: validatedData.service_id,
        client_phone: validatedData.client_phone,
        type: validatedData.type,
        gama: validatedData.gama,
        status: 'pending',
        progress: 0
      }])
      .select(`
        *,
        services (name, price, duration_minutes)
      `)
      .single();
    
    if (error) throw error;
    
    return data;
  }, 'Creando lavado');
};

// Función para actualizar inventario con validación
export const updateInventoryItem = async (itemId, updateData) => {
  return withErrorHandling(async () => {
    // 1. Validar datos de actualización
    const validatedData = validateInventory(updateData);
    
    // 2. Verificar que el item existe
    const { data: existingItem, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', itemId)
      .single();
    
    if (fetchError || !existingItem) {
      throw CarWashError.notFound('Producto de inventario', itemId);
    }
    
    // 3. Si se está actualizando el stock, no permitir valores negativos
    if (validatedData.stock !== undefined && validatedData.stock < 0) {
      throw CarWashError.validationError('El stock no puede ser negativo');
    }
    
    // 4. Verificar que el nombre no exista en otro producto
    if (validatedData.name && validatedData.name !== existingItem.name) {
      const { data: duplicate } = await supabase
        .from('inventory')
        .select('id')
        .eq('name', validatedData.name)
        .neq('id', itemId)
        .single();
      
      if (duplicate) {
        throw CarWashError.duplicateResource('Producto', 'nombre', validatedData.name);
      }
    }
    
    // 5. Actualizar el item
    const { data, error } = await supabase
      .from('inventory')
      .update(validatedData)
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }, 'Actualizando inventario');
};

// Función para crear usuario con validación
export const createUser = async (userData) => {
  return withErrorHandling(async () => {
    // 1. Validar datos de usuario
    const validatedData = validateUser(userData);
    
    // 2. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          role: validatedData.role
        }
      }
    });
    
    if (authError) {
      if (authError.message.includes('User already registered')) {
        throw CarWashError.duplicateResource('Usuario', 'email', validatedData.email);
      }
      throw authError;
    }
    
    // 3. Crear perfil en la base de datos
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: validatedData.email,
        role: validatedData.role
      }])
      .select()
      .single();
    
    if (profileError) throw profileError;
    
    return {
      user: authData.user,
      profile
    };
  }, 'Creando usuario');
};

// Función para actualizar progreso de lavado con validación
export const updateWashProgress = async (washId, newProgress) => {
  return withErrorHandling(async () => {
    // 1. Validar que el progreso sea un número válido entre 0 y 100
    if (typeof newProgress !== 'number' || newProgress < 0 || newProgress > 100) {
      throw CarWashError.validationError('El progreso debe estar entre 0 y 100');
    }
    
    // 2. Verificar que el lavado existe
    const { data: wash, error: fetchError } = await supabase
      .from('wash_queue')
      .select('*')
      .eq('id', washId)
      .single();
    
    if (fetchError || !wash) {
      throw CarWashError.notFound('Lavado', washId);
    }
    
    // 3. No permitir retroceder el progreso
    if (newProgress < wash.progress) {
      throw CarWashError.validationError('No se puede retroceder el progreso del lavado');
    }
    
    // 4. No permitir actualizar lavados completados
    if (wash.status === 'completed') {
      throw CarWashError.validationError('No se puede actualizar un lavado completado');
    }
    
    // 5. Determinar el nuevo estado
    const status = newProgress === 100 ? 'completed' : 
                   newProgress === 0 ? 'pending' : 'in_progress';
    
    const completed_at = newProgress === 100 ? new Date().toISOString() : null;
    
    // 6. Actualizar el lavado
    const { data, error } = await supabase
      .from('wash_queue')
      .update({
        progress: newProgress,
        status,
        completed_at
      })
      .eq('id', washId)
      .select(`
        *,
        services (name, price)
      `)
      .single();
    
    if (error) throw error;
    
    return data;
  }, 'Actualizando progreso de lavado');
};

// Función para eliminar producto de inventario con validación
export const deleteInventoryItem = async (itemId) => {
  return withErrorHandling(async () => {
    // 1. Verificar que el item existe
    const { data: existingItem, error: fetchError } = await supabase
      .from('inventory')
      .select('name, stock')
      .eq('id', itemId)
      .single();
    
    if (fetchError || !existingItem) {
      throw CarWashError.notFound('Producto de inventario', itemId);
    }
    
    // 2. Verificar que no esté en uso en ventas activas
    const { data: activeSale } = await supabase
      .from('sale_items')
      .select('id')
      .eq('inventory_id', itemId)
      .limit(1);
    
    if (activeSale && activeSale.length > 0) {
      throw CarWashError.validationError(
        'No se puede eliminar un producto que está en uso en ventas activas'
      );
    }
    
    // 3. Eliminar el item
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
    
    return existingItem;
  }, 'Eliminando producto de inventario');
};