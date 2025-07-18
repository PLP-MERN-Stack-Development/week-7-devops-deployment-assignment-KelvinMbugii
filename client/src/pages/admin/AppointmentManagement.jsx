import React, { useState } from "react";
import { Plus, Calendar, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import SearchFilter from "../../components/common/SearchFilter";
import DataTable from "../../components/common/DataTable";
import { useAppointments } from "../../hooks/useAppointment";

/**
 * Appointment management page component
 */
const AppointmentManagement = () => {
  const { appointments, loading, updateAppointmentStatus } =
    useAppointments("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "" || appointment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "patient",
      label: "Patient",
      render: (value) => <div className="font-medium">{value}</div>,
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (value) => <div className="text-sm">{value}</div>,
    },
    {
      key: "date",
      label: "Date & Time",
      render: (value, appointment) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {appointment.date}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {appointment.time}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      badgeVariant: (value) => {
        switch (value) {
          case "scheduled":
            return "warning";
          case "confirmed":
            return "success";
          case "cancelled":
            return "destructive";
          case "completed":
            return "info";
          default:
            return "outline";
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      type: "actions",
      actions: [
        { key: "view", label: "View", variant: "outline" },
        { key: "edit", label: "Edit", variant: "outline" },
        { key: "cancel", label: "Cancel", variant: "destructive" },
      ],
    },
  ];

  const filters = [
    {
      key: "status",
      placeholder: "All Status",
      value: selectedStatus,
      options: [
        { value: "scheduled", label: "Scheduled" },
        { value: "confirmed", label: "Confirmed" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  const handleRowAction = (action, appointment) => {
    switch (action) {
      case "view":
        console.log("View appointment:", appointment);
        break;
      case "edit":
        console.log("Edit appointment:", appointment);
        break;
      case "cancel":
        if (
          window.confirm("Are you sure you want to cancel this appointment?")
        ) {
          updateAppointmentStatus(appointment.id, "cancelled");
        }
        break;
      default:
        break;
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === "status") {
      setSelectedStatus(value);
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
            <CardTitle>Appointment Management</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search appointments..."
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <DataTable
            columns={columns}
            data={filteredAppointments}
            onRowAction={handleRowAction}
            emptyMessage="No appointments found matching your criteria."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
