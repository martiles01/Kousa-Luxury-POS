import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  Package,
  BarChart3,
  Plus,
  Settings,
  Users,
  Building,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const ITBIS_RATE = 0.18;

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'car', label: 'Cola de Lavado', path: '/queue', icon: Car },
  { id: 'pos', label: 'Ventas (POS)', path: '/pos', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventario', path: '/inventory', icon: Package },
  { id: 'fleet', label: 'Flotillas', path: '/fleet', icon: Building },
  { id: 'employees', label: 'Personal', path: '/employees', icon: Users },
  { id: 'reports', label: 'Reportes', path: '/reports', icon: BarChart3 },
  { id: 'users', label: 'Usuarios', path: '/users', icon: ShieldCheck },
  { id: 'config', label: 'Configuración', path: '/config', icon: Settings },
];
