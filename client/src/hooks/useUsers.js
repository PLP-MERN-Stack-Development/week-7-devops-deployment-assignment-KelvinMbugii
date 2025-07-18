import { useState, useEffect } from "react";

/**
 * Custom hook for managing users
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUsers = [
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            email: "sarah@clinic.com",
            role: "doctor",
            status: "active",
            specialization: "Cardiology",
          },
          {
            id: 2,
            name: "John Smith",
            email: "john@email.com",
            role: "patient",
            status: "active",
          },
          {
            id: 3,
            name: "Dr. Michael Chen",
            email: "michael@clinic.com",
            role: "doctor",
            status: "active",
            specialization: "Dermatology",
          },
        ];

        setUsers(mockUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUser = async (userId, userData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...userData } : user
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteUser = async (userId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    updateUser,
    deleteUser,
  };
};
