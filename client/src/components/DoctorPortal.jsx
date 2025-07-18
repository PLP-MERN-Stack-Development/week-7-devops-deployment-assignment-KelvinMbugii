import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Calendar, Clock, Users, Bell, LogOut, Plus, Search, Filter, User, Phone, Mail, FileText} from 'lucide-react';

const DoctorPortal = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Simulate API calls
    setAppointments([
      {
        id: 1,
        patient: 'John Smith',
        patientPhone: '(555) 123-4567',
        date: '2024-01-15',
        time: '10:00 AM',
        type: 'consultation',
        status: 'scheduled',
        symptoms: 'Headache and fever'
      },
      {
        id: 2,
        patient: 'Jane Doe',
        patientPhone: '(555) 987-6543',
        date: '2024-01-15',
        time: '2:00 PM',
        type: 'follow-up',
        status: 'confirmed',
        symptoms: 'Follow-up on previous treatment'
      },
      {
        id: 3,
        patient: 'Bob Wilson',
        patientPhone: '(555) 456-7890',
        date: '2024-01-16',
        time: '9:00 AM',
        type: 'routine',
        status: 'scheduled',
        symptoms: 'Regular checkup'
      }
    ]);

    setPatients([
      {
        id: 1,
        name: 'John Smith',
        phone: '(555) 123-4567',
        email: 'john@email.com',
        lastVisit: '2024-01-10',
        upcomingAppointments: 1
      },
      {
        id: 2,
        name: 'Jane Doe',
        phone: '(555) 987-6543',
        email: 'jane@email.com',
        lastVisit: '2024-01-12',
        upcomingAppointments: 1
      }
    ]);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) > new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 flex items-center space-x-1"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Patients</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'appointments' && (
            <AppointmentsTab appointments={appointments} />
          )}
          {activeTab === 'patients' && (
            <PatientsTab patients={patients} />
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentsTab = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    const matchesDate = apt.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
    return matchesDate && matchesStatus;
  });

  const updateAppointmentStatus = (id, newStatus) => {
    // Handle status update
    console.log(`Updating appointment ${id} to ${newStatus}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{appointment.patient}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{appointment.patientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{appointment.symptoms}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {appointment.status === 'scheduled' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Confirm
                  </button>
                )}
                {appointment.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Complete
                  </button>
                )}
                <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found for the selected date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PatientsTab = ({ patients }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Patients</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Last visit: {patient.lastVisit}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600 font-medium">
                {patient.upcomingAppointments} upcoming
              </span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No patients found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;