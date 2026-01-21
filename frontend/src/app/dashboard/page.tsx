'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface LatestData {
  temperature: number | null;
  gas_index: number | null;
  vibration_health: string;
  device_uptime: number | null;
  last_update: string | null;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  status: string;
  triggered_at: string;
}

interface Device {
  id: number;
  device_id: string;
  device_name: string;
  machine_name?: string;
  location?: string;
  is_active: boolean;
  last_seen: string | null;
  temperature?: number;
  gas_index?: number;
  vibration_x?: number;
  vibration_y?: number;
  vibration_z?: number;
  power_consumption?: number;
}

// Mock devices data
const MOCK_DEVICES: Device[] = [
  {
    id: 1,
    device_id: "ESP32-SF-001",
    device_name: "Furnace Monitor 1",
    machine_name: "Main Blast Furnace",
    location: "Floor 1, Bay A",
    is_active: true,
    last_seen: new Date(Date.now() - 60000).toISOString(),
    temperature: 875.5,
    gas_index: 245,
    vibration_x: 2.3,
    vibration_y: 1.8,
    vibration_z: 2.1,
    power_consumption: 42.5
  },
  {
    id: 2,
    device_id: "ESP32-SF-002",
    device_name: "Cooling Tower Monitor",
    machine_name: "Cooling Tower Unit 3",
    location: "Floor 2, Bay B",
    is_active: true,
    last_seen: new Date(Date.now() - 120000).toISOString(),
    temperature: 45.2,
    gas_index: 120,
    vibration_x: 1.5,
    vibration_y: 1.2,
    vibration_z: 1.4,
    power_consumption: 28.3
  },
  {
    id: 3,
    device_id: "ESP32-SF-003",
    device_name: "Press Machine Sensor",
    machine_name: "Hydraulic Press A",
    location: "Floor 1, Bay C",
    is_active: true,
    last_seen: new Date(Date.now() - 30000).toISOString(),
    temperature: 68.7,
    gas_index: 89,
    vibration_x: 4.2,
    vibration_y: 3.8,
    vibration_z: 4.0,
    power_consumption: 55.2
  },
  {
    id: 4,
    device_id: "ESP32-SF-004",
    device_name: "Compressor Monitor",
    machine_name: "Air Compressor Unit 1",
    location: "Floor 1, Bay D",
    is_active: true,
    last_seen: new Date(Date.now() - 90000).toISOString(),
    temperature: 52.3,
    gas_index: 156,
    vibration_x: 3.1,
    vibration_y: 2.9,
    vibration_z: 3.0,
    power_consumption: 38.7
  },
  {
    id: 5,
    device_id: "ESP32-SF-005",
    device_name: "Welding Station Sensor",
    machine_name: "Automated Welder 2",
    location: "Floor 2, Bay A",
    is_active: false,
    last_seen: new Date(Date.now() - 3600000).toISOString(),
    temperature: 0,
    gas_index: 0,
    vibration_x: 0,
    vibration_y: 0,
    vibration_z: 0,
    power_consumption: 0
  },
  {
    id: 6,
    device_id: "ESP32-SF-006",
    device_name: "Conveyor Belt Monitor",
    machine_name: "Main Assembly Line",
    location: "Floor 1, Bay E",
    is_active: true,
    last_seen: new Date(Date.now() - 45000).toISOString(),
    temperature: 38.5,
    gas_index: 78,
    vibration_x: 2.0,
    vibration_y: 1.7,
    vibration_z: 1.9,
    power_consumption: 22.1
  },
  {
    id: 7,
    device_id: "ESP32-CP-001",
    device_name: "Reactor Monitor",
    machine_name: "Chemical Reactor A",
    location: "Building 3, Floor 1",
    is_active: true,
    last_seen: new Date(Date.now() - 15000).toISOString(),
    temperature: 185.3,
    gas_index: 320,
    vibration_x: 1.2,
    vibration_y: 1.0,
    vibration_z: 1.1,
    power_consumption: 65.8
  },
  {
    id: 8,
    device_id: "ESP32-CP-002",
    device_name: "Mixing Tank Sensor",
    machine_name: "Industrial Mixer B",
    location: "Building 3, Floor 2",
    is_active: true,
    last_seen: new Date(Date.now() - 75000).toISOString(),
    temperature: 42.8,
    gas_index: 198,
    vibration_x: 2.8,
    vibration_y: 2.5,
    vibration_z: 2.7,
    power_consumption: 31.4
  }
];

// Mock alerts data
const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    title: "High Temperature Alert",
    message: "Furnace temperature exceeded threshold of 900°C - current reading 925.5°C",
    severity: "warning",
    status: "active",
    triggered_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 2,
    title: "Critical Vibration Detected",
    message: "Press Machine showing abnormal vibration levels - immediate inspection required",
    severity: "critical",
    status: "active",
    triggered_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    title: "Gas Index Warning",
    message: "Chemical Reactor gas index elevated to 320 ppm - monitor closely",
    severity: "warning",
    status: "active",
    triggered_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 4,
    title: "Device Offline",
    message: "Welding Station Sensor has been offline for over 1 hour",
    severity: "info",
    status: "active",
    triggered_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 5,
    title: "Maintenance Due",
    message: "Compressor Unit 1 scheduled maintenance is overdue by 3 days",
    severity: "warning",
    status: "acknowledged",
    triggered_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Generate mock time series data
const generateMockTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  for (let i = 19; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: 850 + Math.random() * 80 - 40,
      gas_index: 200 + Math.random() * 100 - 50,
    });
  }
  return data;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'alerts'>('overview');
  const [useMockData, setUseMockData] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // First get user data
      const userRes = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!userRes.ok) throw new Error('Unauthorized');
      const userData = await userRes.json();
      setUser(userData);

      // Try to fetch real data
      try {
        const [latestRes, alertsRes, devicesRes] = await Promise.all([
          fetch(`${apiUrl}/data/latest`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/alerts?status=active`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/devices`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const latest = await latestRes.json();
        const alertsData = await alertsRes.json();
        const devicesData = await devicesRes.json();

        // Check if we have real data or use mock
        if (devicesData.length === 0 || !latest.temperature) {
          loadMockData();
        } else {
          setLatestData(latest);
          setAlerts(alertsData.slice(0, 5));
          setDevices(devicesData);
          setUseMockData(false);

          if (devicesData.length > 0) {
            const deviceId = devicesData[0].id;
            const tsRes = await fetch(`${apiUrl}/data/timeseries?device_id=${deviceId}&limit=100`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            const tsData = await tsRes.json();
            
            const formattedData = tsData.map((d: any) => ({
              time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              temperature: d.temperature,
              gas_index: d.gas_index,
            })).reverse();
            
            setTimeSeriesData(formattedData.slice(-20));
          }
        }
      } catch {
        // API error, use mock data
        loadMockData();
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const loadMockData = () => {
    setUseMockData(true);
    setDevices(MOCK_DEVICES);
    setAlerts(MOCK_ALERTS);
    setTimeSeriesData(generateMockTimeSeriesData());
    
    // Calculate latest data from mock devices
    const activeDevices = MOCK_DEVICES.filter(d => d.is_active);
    const avgTemp = activeDevices.reduce((sum, d) => sum + (d.temperature || 0), 0) / activeDevices.length;
    const avgGas = activeDevices.reduce((sum, d) => sum + (d.gas_index || 0), 0) / activeDevices.length;
    const maxVibration = Math.max(...activeDevices.map(d => Math.max(d.vibration_x || 0, d.vibration_y || 0, d.vibration_z || 0)));
    
    setLatestData({
      temperature: avgTemp,
      gas_index: avgGas,
      vibration_health: maxVibration > 4 ? 'moderate' : 'healthy',
      device_uptime: (activeDevices.length / MOCK_DEVICES.length) * 100,
      last_update: new Date().toISOString()
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const downloadReport = async (reportType: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${apiUrl}/reports/${reportType}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const report = await res.json();
      
      const dataStr = JSON.stringify(report, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `carbonseed-${reportType}-report.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-ink-muted">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-ink text-white hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-semibold">carbonseed</Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )},
              { id: 'devices', label: 'Devices', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              )},
              { id: 'alerts', label: 'Alerts', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              )},
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
                  {item.id === 'alerts' && alerts.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {alerts.length}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Admin link for admin users */}
          {user?.role === 'admin' && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link 
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Admin Panel</span>
              </Link>
            </div>
          )}
        </nav>
        
        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
              <span className="text-accent-green font-medium">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-white/50 capitalize">{user?.role.replace('_', ' ')}</p>
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
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-surface-elevated/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-ink">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'devices' && 'Device Management'}
                {activeTab === 'alerts' && 'Alert Center'}
              </h1>
              <p className="text-sm text-ink-muted mt-0.5">
                {useMockData && <span className="text-accent-amber">[Demo Mode] </span>}
                {latestData?.last_update 
                  ? `Last updated ${new Date(latestData.last_update).toLocaleString()}`
                  : 'Real-time monitoring active'
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              {useMockData && (
                <span className="px-3 py-1.5 text-xs font-medium text-accent-amber bg-accent-amber/10 rounded-full">
                  Mock Data
                </span>
              )}
              {(user?.role === 'admin' || user?.role === 'factory_owner') && (
                <button
                  onClick={() => router.push('/simulator')}
                  className="px-4 py-2 text-sm font-medium text-ink bg-surface border border-border rounded-lg hover:bg-surface-muted transition-all"
                >
                  Data Simulator
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  label="Avg Temperature"
                  value={latestData?.temperature ? `${latestData.temperature.toFixed(1)}°` : '--'}
                  unit="C"
                  status={latestData?.temperature && latestData.temperature > 200 ? 'warning' : 'normal'}
                  icon={<TemperatureIcon />}
                />
                <MetricCard
                  label="Avg Gas Index"
                  value={latestData?.gas_index ? latestData.gas_index.toFixed(0) : '--'}
                  unit="ppm"
                  status={latestData?.gas_index && latestData.gas_index > 250 ? 'warning' : 'normal'}
                  icon={<GasIcon />}
                />
                <MetricCard
                  label="Vibration"
                  value={latestData?.vibration_health || '--'}
                  status={latestData?.vibration_health === 'critical' ? 'critical' : 
                         latestData?.vibration_health === 'moderate' ? 'warning' : 'normal'}
                  icon={<VibrationIcon />}
                />
                <MetricCard
                  label="Uptime"
                  value={latestData?.device_uptime ? latestData.device_uptime.toFixed(1) : '--'}
                  unit="%"
                  status={latestData?.device_uptime && latestData.device_uptime < 80 ? 'warning' : 'normal'}
                  icon={<UptimeIcon />}
                />
              </div>

              {/* Charts and Info */}
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Temperature Chart */}
                <div className="lg:col-span-2 bg-surface-elevated rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-semibold text-ink">Temperature Trend</h2>
                    <span className="text-xs text-ink-faint">Last 20 readings</span>
                  </div>
                  {timeSeriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={timeSeriesData}>
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#059669" stopOpacity={0.2}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                        <XAxis dataKey="time" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e5e5',
                            borderRadius: '12px',
                            fontSize: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#059669" 
                          strokeWidth={2} 
                          fill="url(#tempGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-ink-faint">
                      No data available
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-surface-elevated rounded-2xl border border-border p-6">
                  <h2 className="text-base font-semibold text-ink mb-4">Quick Reports</h2>
                  <div className="space-y-3">
                    <ReportButton title="Weekly Summary" onClick={() => downloadReport('weekly')} color="green" />
                    <ReportButton title="Monthly Analysis" onClick={() => downloadReport('monthly')} color="blue" />
                    <ReportButton title="Compliance Report" onClick={() => downloadReport('compliance')} color="amber" />
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-ink mb-3">Active Devices</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-semibold text-ink">
                          {devices.filter(d => d.is_active).length}
                          <span className="text-ink-faint text-base font-normal"> / {devices.length}</span>
                        </div>
                        <p className="text-xs text-ink-muted">Online now</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              {alerts.length > 0 && (
                <div className="bg-surface-elevated rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-ink">Recent Alerts</h2>
                    <button 
                      onClick={() => setActiveTab('alerts')}
                      className="text-sm text-accent-green hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {alerts.slice(0, 3).map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'devices' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Device Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-elevated rounded-xl border border-border p-4">
                  <p className="text-sm text-ink-muted">Total Devices</p>
                  <p className="text-2xl font-semibold text-ink mt-1">{devices.length}</p>
                </div>
                <div className="bg-surface-elevated rounded-xl border border-border p-4">
                  <p className="text-sm text-ink-muted">Online</p>
                  <p className="text-2xl font-semibold text-accent-green mt-1">
                    {devices.filter(d => d.is_active).length}
                  </p>
                </div>
                <div className="bg-surface-elevated rounded-xl border border-border p-4">
                  <p className="text-sm text-ink-muted">Offline</p>
                  <p className="text-2xl font-semibold text-ink-faint mt-1">
                    {devices.filter(d => !d.is_active).length}
                  </p>
                </div>
                <div className="bg-surface-elevated rounded-xl border border-border p-4">
                  <p className="text-sm text-ink-muted">Alerts</p>
                  <p className="text-2xl font-semibold text-accent-amber mt-1">
                    {alerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <DeviceCard 
                    key={device.id} 
                    device={device} 
                    onClick={() => setSelectedDevice(device)}
                    selected={selectedDevice?.id === device.id}
                  />
                ))}
              </div>

              {/* Device Detail Modal */}
              {selectedDevice && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedDevice(null)}
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-surface-elevated rounded-2xl border border-border p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-ink">{selectedDevice.device_name}</h3>
                        <p className="text-sm text-ink-muted font-mono">{selectedDevice.device_id}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedDevice(null)}
                        className="p-2 hover:bg-surface-muted rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-muted rounded-xl p-4">
                          <p className="text-xs text-ink-muted mb-1">Machine</p>
                          <p className="text-sm font-medium text-ink">{selectedDevice.machine_name || '-'}</p>
                        </div>
                        <div className="bg-surface-muted rounded-xl p-4">
                          <p className="text-xs text-ink-muted mb-1">Location</p>
                          <p className="text-sm font-medium text-ink">{selectedDevice.location || '-'}</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-medium text-ink mb-3">Live Readings</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-surface-muted rounded-xl p-3">
                            <p className="text-xs text-ink-muted">Temperature</p>
                            <p className="text-lg font-semibold text-ink">{selectedDevice.temperature?.toFixed(1) || '-'}°C</p>
                          </div>
                          <div className="bg-surface-muted rounded-xl p-3">
                            <p className="text-xs text-ink-muted">Gas Index</p>
                            <p className="text-lg font-semibold text-ink">{selectedDevice.gas_index?.toFixed(0) || '-'} ppm</p>
                          </div>
                          <div className="bg-surface-muted rounded-xl p-3">
                            <p className="text-xs text-ink-muted">Vibration (X/Y/Z)</p>
                            <p className="text-lg font-semibold text-ink">
                              {selectedDevice.vibration_x?.toFixed(1) || '-'} / {selectedDevice.vibration_y?.toFixed(1) || '-'} / {selectedDevice.vibration_z?.toFixed(1) || '-'}
                            </p>
                          </div>
                          <div className="bg-surface-muted rounded-xl p-3">
                            <p className="text-xs text-ink-muted">Power</p>
                            <p className="text-lg font-semibold text-ink">{selectedDevice.power_consumption?.toFixed(1) || '-'} kW</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-ink-muted">Status</p>
                            <p className={`text-sm font-medium ${selectedDevice.is_active ? 'text-accent-green' : 'text-ink-faint'}`}>
                              {selectedDevice.is_active ? 'Online' : 'Offline'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-ink-muted">Last Seen</p>
                            <p className="text-sm text-ink">
                              {selectedDevice.last_seen ? new Date(selectedDevice.last_seen).toLocaleString() : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} expanded />
                  ))}
                </div>
              ) : (
                <div className="bg-surface-elevated rounded-2xl border border-border p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-2">All clear!</h3>
                  <p className="text-ink-muted">No active alerts at the moment.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// Icons
const TemperatureIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const GasIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const VibrationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UptimeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

function MetricCard({ label, value, unit, status, icon }: { 
  label: string;
  value: string;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
}) {
  const statusColors = {
    normal: 'bg-accent-green/10 text-accent-green',
    warning: 'bg-accent-amber/10 text-accent-amber',
    critical: 'bg-red-100 text-red-600',
  };

  const valueColors = {
    normal: 'text-ink',
    warning: 'text-accent-amber',
    critical: 'text-red-600',
  };

  return (
    <div className="bg-surface-elevated rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-ink-muted">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusColors[status]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-semibold ${valueColors[status]}`}>{value}</span>
        {unit && <span className="text-ink-muted text-sm">{unit}</span>}
      </div>
    </div>
  );
}

function AlertCard({ alert, expanded }: { alert: Alert; expanded?: boolean }) {
  const severityStyles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-500' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'text-amber-500' },
    critical: { bg: 'bg-red-50', border: 'border-red-100', icon: 'text-red-500' },
  };

  const style = severityStyles[alert.severity as keyof typeof severityStyles] || severityStyles.info;

  return (
    <div className={`${style.bg} ${style.border} border rounded-xl p-4 ${expanded ? 'flex items-start gap-4' : ''}`}>
      <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
        <svg className={`w-5 h-5 ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className={expanded ? 'flex-1' : 'mt-3'}>
        <h4 className="text-sm font-semibold text-ink">{alert.title}</h4>
        <p className="text-sm text-ink-muted mt-1">{alert.message}</p>
        <p className="text-xs text-ink-faint mt-2 font-mono">
          {new Date(alert.triggered_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function DeviceCard({ device, onClick, selected }: { device: Device; onClick?: () => void; selected?: boolean }) {
  const isOnline = device.is_active;

  return (
    <div 
      className={`bg-surface-elevated rounded-2xl border ${selected ? 'border-accent-green' : 'border-border'} p-5 cursor-pointer hover:border-accent-green/50 transition-all`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface-muted flex items-center justify-center">
          <svg className="w-6 h-6 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
          isOnline ? 'bg-accent-green/10 text-accent-green' : 'bg-surface-muted text-ink-faint'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-accent-green' : 'bg-ink-faint'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <h3 className="text-base font-semibold text-ink">{device.device_name}</h3>
      <p className="text-sm text-ink-faint font-mono mt-1">{device.device_id}</p>
      {device.machine_name && (
        <p className="text-xs text-ink-muted mt-2">{device.machine_name}</p>
      )}
      {device.location && (
        <p className="text-xs text-ink-faint mt-1">{device.location}</p>
      )}
      {isOnline && device.temperature !== undefined && (
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-ink-faint">Temp</p>
            <p className="text-sm font-medium text-ink">{device.temperature?.toFixed(1)}°C</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Gas</p>
            <p className="text-sm font-medium text-ink">{device.gas_index?.toFixed(0)} ppm</p>
          </div>
        </div>
      )}
      {device.last_seen && (
        <p className="text-xs text-ink-muted mt-3">
          Last seen: {new Date(device.last_seen).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function ReportButton({ title, onClick, color }: { title: string; onClick: () => void; color: 'green' | 'blue' | 'amber' }) {
  const colors = {
    green: 'hover:border-accent-green/30 hover:bg-accent-green/5',
    blue: 'hover:border-accent-blue/30 hover:bg-accent-blue/5',
    amber: 'hover:border-accent-amber/30 hover:bg-accent-amber/5',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border border-border rounded-xl transition-all ${colors[color]}`}
    >
      <span className="text-sm font-medium text-ink">{title}</span>
      <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </button>
  );
}
