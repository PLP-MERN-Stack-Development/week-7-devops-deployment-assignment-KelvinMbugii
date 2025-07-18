import { useState, useEffect } from "react";

/**
 * Custom hook for managing appointments
 * @param {string} userRole - Current user role
 * @param {string} userId - Current user ID
 */
export const useAppointments = (userRole, userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockAppointments = [
          {
            id: 1,
            patient: "John Smith",
            patientPhone: "(555) 123-4567",
            doctor: "Dr. Sarah Johnson",
            date: "2024-01-15",
            time: "10:00 AM",
            type: "consultation",
            status: "scheduled",
            symptoms: "Headache and fever",
          },
          {
            id: 2,
            patient: "Jane Doe",
            patientPhone: "(555) 987-6543",
            doctor: "Dr. Michael Chen",
            date: "2024-01-15",
            time: "2:00 PM",
            type: "follow-up",
            status: "confirmed",
            symptoms: "Follow-up on previous treatment",
          },
        ];

        setAppointments(mockAppointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userRole, userId]);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAppointment = {
        id: Date.now(),
        ...appointmentData,
        status: "scheduled",
      };

      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    updateAppointmentStatus,
    createAppointment,
  };
};
