import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import SearchFilter from "../../components/common/SearchFilter";
import DataTable from "../../components/common/DataTable";
import { useUsers } from "../../hooks/useUsers";

/**
 * User management page component
 */
const UserManagement = () => {
  const { users, loading, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      key: "name",
      label: "User",
      render: (value, user) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      type: "badge",
      badgeVariant: (value) => {
        switch (value) {
          case "admin":
            return "destructive";
          case "doctor":
            return "default";
          case "patient":
            return "secondary";
          default:
            return "outline";
        }
      },
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      badgeVariant: (value) => (value === "active" ? "success" : "outline"),
    },
    {
      key: "actions",
      label: "Actions",
      type: "actions",
      actions: [
        { key: "edit", label: "Edit", variant: "outline" },
        { key: "delete", label: "Delete", variant: "destructive" },
      ],
    },
  ];

  const filters = [
    {
      key: "role",
      placeholder: "All Roles",
      value: selectedRole,
      options: [
        { value: "admin", label: "Admin" },
        { value: "doctor", label: "Doctor" },
        { value: "patient", label: "Patient" },
      ],
    },
  ];

  const handleRowAction = (action, user) => {
    switch (action) {
      case "edit":
        console.log("Edit user:", user);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this user?")) {
          deleteUser(user.id);
        }
        break;
      default:
        break;
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === "role") {
      setSelectedRole(value);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search users..."
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <DataTable
            columns={columns}
            data={filteredUsers}
            onRowAction={handleRowAction}
            emptyMessage="No users found matching your criteria."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
