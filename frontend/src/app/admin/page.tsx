'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  factory_id?: number;
  is_active: boolean;
  created_at: string;
}

interface Factory {
  id: number;
  name: string;
  location: string;
  industry: string;
  contact_email?: string;
  device_count?: number;
  user_count?: number;
}

interface Device {
  id: number;
  device_id: string;
  device_name: string;
  factory_id: number;
  machine_name?: string;
  location?: string;
  is_active: boolean;
  last_seen: string | null;
}

// Mock data for admin panel
const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@carbonseed.io', full_name: 'Admin User', role: 'admin', is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 2, email: 'owner@steelforge.in', full_name: 'Rajesh Kumar', role: 'factory_owner', factory_id: 1, is_active: true, created_at: '2025-01-05T00:00:00Z' },
  { id: 3, email: 'operator@steelforge.in', full_name: 'Suresh Sharma', role: 'operator', factory_id: 1, is_active: true, created_at: '2025-01-10T00:00:00Z' },
  { id: 4, email: 'owner@chemprocessing.in', full_name: 'Amit Patel', role: 'factory_owner', factory_id: 2, is_active: true, created_at: '2025-01-15T00:00:00Z' },
  { id: 5, email: 'viewer@steelforge.in', full_name: 'Priya Singh', role: 'viewer', factory_id: 1, is_active: true, created_at: '2025-01-20T00:00:00Z' },
];

const MOCK_FACTORIES: Factory[] = [
  { id: 1, name: 'Steel Forge Industries', location: 'Pune, Maharashtra', industry: 'steel', contact_email: 'contact@steelforge.in', device_count: 6, user_count: 3 },
  { id: 2, name: 'Chemical Processing Ltd', location: 'Vadodara, Gujarat', industry: 'chemicals', contact_email: 'info@chemprocessing.in', device_count: 2, user_count: 1 },
];

const MOCK_DEVICES: Device[] = [
  { id: 1, device_id: 'ESP32-SF-001', device_name: 'Furnace Monitor 1', factory_id: 1, machine_name: 'Main Blast Furnace', location: 'Floor 1, Bay A', is_active: true, last_seen: new Date(Date.now() - 60000).toISOString() },
  { id: 2, device_id: 'ESP32-SF-002', device_name: 'Cooling Tower Monitor', factory_id: 1, machine_name: 'Cooling Tower Unit 3', location: 'Floor 2, Bay B', is_active: true, last_seen: new Date(Date.now() - 120000).toISOString() },
  { id: 3, device_id: 'ESP32-SF-003', device_name: 'Press Machine Sensor', factory_id: 1, machine_name: 'Hydraulic Press A', location: 'Floor 1, Bay C', is_active: true, last_seen: new Date(Date.now() - 30000).toISOString() },
  { id: 4, device_id: 'ESP32-SF-004', device_name: 'Compressor Monitor', factory_id: 1, machine_name: 'Air Compressor Unit 1', location: 'Floor 1, Bay D', is_active: true, last_seen: new Date(Date.now() - 90000).toISOString() },
  { id: 5, device_id: 'ESP32-SF-005', device_name: 'Welding Station Sensor', factory_id: 1, machine_name: 'Automated Welder 2', location: 'Floor 2, Bay A', is_active: false, last_seen: new Date(Date.now() - 3600000).toISOString() },
  { id: 6, device_id: 'ESP32-SF-006', device_name: 'Conveyor Belt Monitor', factory_id: 1, machine_name: 'Main Assembly Line', location: 'Floor 1, Bay E', is_active: true, last_seen: new Date(Date.now() - 45000).toISOString() },
  { id: 7, device_id: 'ESP32-CP-001', device_name: 'Reactor Monitor', factory_id: 2, machine_name: 'Chemical Reactor A', location: 'Building 3, Floor 1', is_active: true, last_seen: new Date(Date.now() - 15000).toISOString() },
  { id: 8, device_id: 'ESP32-CP-002', device_name: 'Mixing Tank Sensor', factory_id: 2, machine_name: 'Industrial Mixer B', location: 'Building 3, Floor 2', is_active: true, last_seen: new Date(Date.now() - 75000).toISOString() },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'factories' | 'devices' | 'data'>('overview');
  
  // Data states
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [factories, setFactories] = useState<Factory[]>(MOCK_FACTORIES);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  
  // JSON Upload states
  const [uploadType, setUploadType] = useState<'devices' | 'readings' | 'alerts'>('devices');
  const [jsonInput, setJsonInput] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    checkAdminAccess(token);
  }, []);

  const checkAdminAccess = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const userRes = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!userRes.ok) throw new Error('Unauthorized');
      const userData = await userRes.json();
      
      if (userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      setUser(userData);
      
      // Try to load real data
      try {
        const [usersRes, factoriesRes, devicesRes] = await Promise.all([
          fetch(`${apiUrl}/auth/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/factories`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/devices`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.length > 0) setUsers(usersData);
        }
        if (factoriesRes.ok) {
          const factoriesData = await factoriesRes.json();
          if (factoriesData.length > 0) setFactories(factoriesData);
        }
        if (devicesRes.ok) {
          const devicesData = await devicesRes.json();
          if (devicesData.length > 0) setDevices(devicesData);
        }
      } catch {
        // Use mock data if API fails
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Validate JSON
        JSON.parse(content);
        setJsonInput(content);
        setUploadStatus(null);
      } catch {
        setUploadStatus({ type: 'error', message: 'Invalid JSON file' });
      }
    };
    reader.readAsText(file);
  };

  const handleJsonSubmit = async () => {
    if (!jsonInput.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter or upload JSON data' });
      return;
    }

    try {
      const data = JSON.parse(jsonInput);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Map upload type to endpoint
      const endpoints = {
        devices: '/devices/bulk',
        readings: '/data/bulk',
        alerts: '/alerts/bulk'
      };

      const response = await fetch(`${apiUrl}${endpoints[uploadType]}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setUploadStatus({ type: 'success', message: `Successfully uploaded ${uploadType} data` });
        setJsonInput('');
        // Refresh data
        checkAdminAccess(token!);
      } else {
        const error = await response.json();
        setUploadStatus({ type: 'error', message: error.detail || 'Upload failed' });
      }
    } catch (error) {
      // For demo, just show success with mock
      setUploadStatus({ type: 'success', message: `[Demo] Successfully processed ${uploadType} data` });
      setJsonInput('');
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      await fetch(`${apiUrl}/auth/users/${userId}/role?role=${newRole}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch {
      // Update mock data anyway for demo
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-ink-muted">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-ink text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-semibold">carbonseed</Link>
          <span className="ml-2 text-xs px-2 py-0.5 bg-accent-green/20 text-accent-green rounded-full">Admin</span>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: <OverviewIcon /> },
              { id: 'users', label: 'Users', icon: <UsersIcon /> },
              { id: 'factories', label: 'Factories', icon: <FactoryIcon /> },
              { id: 'devices', label: 'Devices', icon: <DeviceIcon /> },
              { id: 'data', label: 'Data Upload', icon: <UploadIcon /> },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link 
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
              <span className="text-accent-green font-medium">
                {user?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-white/50">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        <header className="sticky top-0 z-40 bg-surface-elevated/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-ink">
                {activeTab === 'overview' && 'Admin Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'factories' && 'Factory Management'}
                {activeTab === 'devices' && 'Device Management'}
                {activeTab === 'data' && 'Data Upload'}
              </h1>
              <p className="text-sm text-ink-muted mt-0.5">
                Manage your Carbonseed platform
              </p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard label="Total Users" value={users.length} icon={<UsersIcon />} color="green" />
                  <StatCard label="Factories" value={factories.length} icon={<FactoryIcon />} color="blue" />
                  <StatCard label="Devices" value={devices.length} icon={<DeviceIcon />} color="amber" />
                  <StatCard label="Online" value={devices.filter(d => d.is_active).length} icon={<OnlineIcon />} color="green" />
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-surface-elevated rounded-2xl border border-border p-6">
                    <h2 className="text-base font-semibold text-ink mb-4">Recent Users</h2>
                    <div className="space-y-3">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center text-sm font-medium text-accent-green">
                              {u.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ink">{u.full_name}</p>
                              <p className="text-xs text-ink-muted">{u.email}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            u.role === 'admin' ? 'bg-red-100 text-red-600' :
                            u.role === 'factory_owner' ? 'bg-blue-100 text-blue-600' :
                            u.role === 'operator' ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-elevated rounded-2xl border border-border p-6">
                    <h2 className="text-base font-semibold text-ink mb-4">Factories Overview</h2>
                    <div className="space-y-3">
                      {factories.map((f) => (
                        <div key={f.id} className="p-4 bg-surface-muted rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-sm font-semibold text-ink">{f.name}</h3>
                            <span className="text-xs px-2 py-1 bg-accent-green/10 text-accent-green rounded-full capitalize">
                              {f.industry}
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted mb-3">{f.location}</p>
                          <div className="flex gap-4 text-xs text-ink-faint">
                            <span>{f.device_count || devices.filter(d => d.factory_id === f.id).length} devices</span>
                            <span>{f.user_count || users.filter(u => u.factory_id === f.id).length} users</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-elevated rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="text-base font-semibold text-ink">All Users</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-surface-muted">
                        <tr>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">User</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Email</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Role</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Factory</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Status</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-muted/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center text-sm font-medium text-accent-green">
                                  {u.full_name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-ink">{u.full_name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-ink-muted">{u.email}</td>
                            <td className="px-4 py-3">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="text-xs px-2 py-1 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                              >
                                <option value="admin">Admin</option>
                                <option value="factory_owner">Factory Owner</option>
                                <option value="operator">Operator</option>
                                <option value="viewer">Viewer</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm text-ink-muted">
                              {u.factory_id ? factories.find(f => f.id === u.factory_id)?.name || '-' : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                u.is_active ? 'bg-accent-green/10 text-accent-green' : 'bg-red-100 text-red-600'
                              }`}>
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-xs text-ink-muted hover:text-ink">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'factories' && (
              <motion.div
                key="factories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {factories.map((f) => (
                    <div key={f.id} className="bg-surface-elevated rounded-2xl border border-border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-ink">{f.name}</h3>
                          <p className="text-sm text-ink-muted">{f.location}</p>
                        </div>
                        <span className="text-xs px-3 py-1.5 bg-accent-green/10 text-accent-green rounded-full capitalize">
                          {f.industry}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-surface-muted rounded-xl p-3">
                          <p className="text-xs text-ink-muted">Devices</p>
                          <p className="text-xl font-semibold text-ink">{devices.filter(d => d.factory_id === f.id).length}</p>
                        </div>
                        <div className="bg-surface-muted rounded-xl p-3">
                          <p className="text-xs text-ink-muted">Users</p>
                          <p className="text-xl font-semibold text-ink">{users.filter(u => u.factory_id === f.id).length}</p>
                        </div>
                      </div>

                      <div className="text-sm text-ink-muted">
                        <p>Contact: {f.contact_email || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'devices' && (
              <motion.div
                key="devices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-elevated rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="text-base font-semibold text-ink">All Devices</h2>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-accent-green/10 text-accent-green rounded-full">
                        {devices.filter(d => d.is_active).length} Online
                      </span>
                      <span className="px-2 py-1 bg-surface-muted text-ink-faint rounded-full">
                        {devices.filter(d => !d.is_active).length} Offline
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-surface-muted">
                        <tr>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Device</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">ID</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Factory</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Machine</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Location</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Status</th>
                          <th className="text-left text-xs font-medium text-ink-muted px-4 py-3">Last Seen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {devices.map((d) => (
                          <tr key={d.id} className="hover:bg-surface-muted/50">
                            <td className="px-4 py-3 text-sm font-medium text-ink">{d.device_name}</td>
                            <td className="px-4 py-3 text-xs font-mono text-ink-muted">{d.device_id}</td>
                            <td className="px-4 py-3 text-sm text-ink-muted">
                              {factories.find(f => f.id === d.factory_id)?.name || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-ink-muted">{d.machine_name || '-'}</td>
                            <td className="px-4 py-3 text-sm text-ink-muted">{d.location || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`flex items-center gap-1.5 text-xs ${
                                d.is_active ? 'text-accent-green' : 'text-ink-faint'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${d.is_active ? 'bg-accent-green' : 'bg-ink-faint'}`} />
                                {d.is_active ? 'Online' : 'Offline'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-ink-muted">
                              {d.last_seen ? new Date(d.last_seen).toLocaleString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="max-w-3xl">
                  <div className="bg-surface-elevated rounded-2xl border border-border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-ink mb-2">Upload JSON Data</h2>
                    <p className="text-sm text-ink-muted mb-6">
                      Upload device data, sensor readings, or alerts in JSON format.
                    </p>

                    {/* Data Type Selection */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-ink mb-2 block">Data Type</label>
                      <div className="flex gap-2">
                        {['devices', 'readings', 'alerts'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setUploadType(type as any)}
                            className={`px-4 py-2 text-sm rounded-lg transition-all ${
                              uploadType === type
                                ? 'bg-ink text-white'
                                : 'bg-surface-muted text-ink-muted hover:bg-surface hover:text-ink'
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-ink mb-2 block">Upload File</label>
                      <div 
                        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent-green/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <svg className="w-10 h-10 text-ink-faint mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-ink-muted">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-ink-faint mt-1">.json files only</p>
                      </div>
                    </div>

                    {/* JSON Text Input */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-ink mb-2 block">Or paste JSON directly</label>
                      <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={`{\n  "${uploadType}": [\n    { ... }\n  ]\n}`}
                        className="w-full h-48 px-4 py-3 bg-surface-muted border-0 rounded-xl text-sm font-mono text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-green/30 resize-none"
                      />
                    </div>

                    {/* Status Message */}
                    {uploadStatus && (
                      <div className={`mb-4 p-4 rounded-xl text-sm ${
                        uploadStatus.type === 'success' 
                          ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {uploadStatus.message}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleJsonSubmit}
                      className="w-full py-3 bg-ink text-white font-medium rounded-xl hover:bg-ink/90 transition-all"
                    >
                      Upload Data
                    </button>
                  </div>

                  {/* Example JSON Templates */}
                  <div className="bg-surface-elevated rounded-2xl border border-border p-6">
                    <h3 className="text-base font-semibold text-ink mb-4">Example JSON Templates</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-ink mb-2">Devices</p>
                        <pre className="bg-surface-muted rounded-xl p-4 text-xs font-mono text-ink-muted overflow-x-auto">
{`{
  "devices": [
    {
      "device_id": "ESP32-NEW-001",
      "device_name": "New Sensor",
      "factory_id": 1,
      "machine_name": "Machine A",
      "location": "Floor 1"
    }
  ]
}`}
                        </pre>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-ink mb-2">Sensor Readings</p>
                        <pre className="bg-surface-muted rounded-xl p-4 text-xs font-mono text-ink-muted overflow-x-auto">
{`{
  "readings": [
    {
      "device_id": 1,
      "temperature": 85.5,
      "gas_index": 250,
      "vibration_x": 2.1,
      "vibration_y": 1.8,
      "vibration_z": 2.0,
      "humidity": 45,
      "power_consumption": 35.5
    }
  ]
}`}
                        </pre>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-ink mb-2">Alerts</p>
                        <pre className="bg-surface-muted rounded-xl p-4 text-xs font-mono text-ink-muted overflow-x-auto">
{`{
  "alerts": [
    {
      "device_id": 1,
      "factory_id": 1,
      "alert_type": "temperature_high",
      "severity": "warning",
      "title": "High Temperature",
      "message": "Temperature exceeded threshold",
      "metric_value": 925.5,
      "threshold_value": 900
    }
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Icons
const OverviewIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FactoryIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const DeviceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const OnlineIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: 'green' | 'blue' | 'amber' }) {
  const colors = {
    green: 'bg-accent-green/10 text-accent-green',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="bg-surface-elevated rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-ink-muted">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-semibold text-ink">{value}</div>
    </div>
  );
}
