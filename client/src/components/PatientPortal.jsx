import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Calendar, Clock, User, Bell, LogOut, Plus, Settings, Phone, Mail, MapPin, FileText, Heart, } from "lucide-react";

const PatientPortal = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Simulate API calls
    setAppointments([
      {
        id: 1,
        doctor: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        date: "2024-01-15",
        time: "10:00 AM",
        clinic: "City Medical Center",
        status: "scheduled",
        type: "consultation",
      },
      {
        id: 2,
        doctor: "Dr. Michael Chen",
        specialization: "Dermatology",
        date: "2024-01-20",
        time: "2:00 PM",
        clinic: "Downtown Clinic",
        status: "confirmed",
        type: "follow-up",
      },
    ]);

    setDoctors([
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        clinic: "City Medical Center",
        rating: 4.9,
        availability: "Available",
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        specialization: "Dermatology",
        clinic: "Downtown Clinic",
        rating: 4.8,
        availability: "Available",
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialization: "Pediatrics",
        clinic: "City Medical Center",
        rating: 4.9,
        availability: "Busy",
      },
    ]);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Patient Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name}
                </p>
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
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Health Journey</h2>
              <p className="text-blue-100">
                {upcomingAppointments.length > 0
                  ? `You have ${
                      upcomingAppointments.length
                    } upcoming appointment${
                      upcomingAppointments.length > 1 ? "s" : ""
                    }`
                  : "No upcoming appointments scheduled"}
              </p>
            </div>
            <div className="text-right">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingAppointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Records</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "appointments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>My Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "doctors"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Find Doctors</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === "appointments" && (
            <AppointmentsTab appointments={appointments} />
          )}
          {activeTab === "doctors" && <DoctorsTab doctors={doctors} />}
          {activeTab === "profile" && <ProfileTab user={user} />}
        </div>
      </div>
    </div>
  );
};

const AppointmentsTab = ({ appointments }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "upcoming") return new Date(apt.date) >= new Date();
    if (selectedFilter === "past") return new Date(apt.date) < new Date();
    return apt.status === selectedFilter;
  });

  const cancelAppointment = (id) => {
    console.log(`Cancelling appointment ${id}`);
  };

  const rescheduleAppointment = (id) => {
    console.log(`Rescheduling appointment ${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Appointments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            "all",
            "upcoming",
            "past",
            "scheduled",
            "confirmed",
            "completed",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {appointment.doctor}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {appointment.specialization}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.date}</span>
                    <Clock className="h-4 w-4 ml-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.clinic}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Type: {appointment.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {appointment.status === "scheduled" && (
                  <>
                    <button
                      onClick={() => rescheduleAppointment(appointment.id)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No appointments found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const DoctorsTab = ({ doctors }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  const specializations = [
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const bookAppointment = (doctorId) => {
    console.log(`Booking appointment with doctor ${doctorId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Find Doctors</h2>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{doctor.clinic}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-yellow-500">★</span>
                <span>{doctor.rating}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    doctor.availability === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {doctor.availability}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => bookAppointment(doctor.id)}
                disabled={doctor.availability === "Busy"}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                  doctor.availability === "Available"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Book Appointment
              </button>
              <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            No doctors found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

const ProfileTab = ({ user }) => {
  const [preferences, setPreferences] = useState({
    sms: true,
    whatsapp: true,
    email: true,
    reminderTimes: {
      twentyFourHours: true,
      twoHours: true,
      thirtyMinutes: true,
    },
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Profile Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    SMS Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive appointment reminders via SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={(e) =>
                    handlePreferenceChange("sms", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    WhatsApp Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive appointment reminders via WhatsApp
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.whatsapp}
                  onChange={(e) =>
                    handlePreferenceChange("whatsapp", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive appointment reminders via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(e) =>
                    handlePreferenceChange("email", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reminder Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    24 Hours Before
                  </label>
                  <p className="text-sm text-gray-500">
                    Get reminded 24 hours before appointments
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reminderTimes.twentyFourHours}
                  onChange={(e) =>
                    handlePreferenceChange("reminderTimes", {
                      ...preferences.reminderTimes,
                      twentyFourHours: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    2 Hours Before
                  </label>
                  <p className="text-sm text-gray-500">
                    Get reminded 2 hours before appointments
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reminderTimes.twoHours}
                  onChange={(e) =>
                    handlePreferenceChange("reminderTimes", {
                      ...preferences.reminderTimes,
                      twoHours: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    30 Minutes Before
                  </label>
                  <p className="text-sm text-gray-500">
                    Get reminded 30 minutes before appointments
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reminderTimes.thirtyMinutes}
                  onChange={(e) =>
                    handlePreferenceChange("reminderTimes", {
                      ...preferences.reminderTimes,
                      thirtyMinutes: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PatientPortal;
