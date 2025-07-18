import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Users, Calendar, Building, Settings, BarChart3, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Header from './layout/Header';
import AdminOverview from '../pages/admin/AdminOverview';
import UserManagement from '../pages/admin/UserManagement';
import AppointmentManagement from '../pages/admin/AppointmentManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Admin Dashboard"
        subtitle="Manage your medical appointment system"
        user={user}
        notifications={notifications}
        onLogout={handleLogout}
        icon={<Heart className="h-8 w-8" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="clinics" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Clinics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentManagement />
          </TabsContent>

          <TabsContent value="clinics">
            <ClinicsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ClinicsTab = () => {
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    // Simulate API call
    setClinics([
      {
        id: 1,
        name: 'City Medical Center',
        address: '123 Main St, City, State',
        phone: '(555) 123-4567',
        doctors: 5,
        status: 'active'
      },
      {
        id: 2,
        name: 'Downtown Clinic',
        address: '456 Oak Ave, City, State',
        phone: '(555) 987-6543',
        doctors: 3,
        status: 'active'
      }
    ]);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Clinic Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Clinic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                clinic.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {clinic.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">{clinic.address}</p>
              <p className="text-sm text-gray-600">{clinic.phone}</p>
              <p className="text-sm text-gray-600">{clinic.doctors} doctors</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                View Details
              </button>
              <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    smsEnabled: true,
    whatsappEnabled: true,
    emailEnabled: true,
    reminderTimes: {
      twentyFourHours: true,
      twoHours: true,
      thirtyMinutes: true
    }
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                <p className="text-sm text-gray-500">Send appointment reminders via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsEnabled}
                onChange={(e) => handleSettingChange('smsEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">WhatsApp Notifications</label>
                <p className="text-sm text-gray-500">Send appointment reminders via WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={settings.whatsappEnabled}
                onChange={(e) => handleSettingChange('whatsappEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Send appointment reminders via email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => handleSettingChange('emailEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">24 Hours Before</label>
                <p className="text-sm text-gray-500">Send reminder 24 hours before appointment</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reminderTimes.twentyFourHours}
                onChange={(e) => handleSettingChange('reminderTimes', {
                  ...settings.reminderTimes,
                  twentyFourHours: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">2 Hours Before</label>
                <p className="text-sm text-gray-500">Send reminder 2 hours before appointment</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reminderTimes.twoHours}
                onChange={(e) => handleSettingChange('reminderTimes', {
                  ...settings.reminderTimes,
                  twoHours: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">30 Minutes Before</label>
                <p className="text-sm text-gray-500">Send reminder 30 minutes before appointment</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reminderTimes.thirtyMinutes}
                onChange={(e) => handleSettingChange('reminderTimes', {
                  ...settings.reminderTimes,
                  thirtyMinutes: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;