import React from "react";
import { Users, Calendar, Building, Activity } from "lucide-react";
import StatsCard from "../../components/common/StatsCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

/**
 * Admin overview page component
 */
const AdminOverview = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      icon: <Users className="h-6 w-6" />,
      trend: "+12% from last month",
    },
    {
      title: "Appointments",
      value: "3,456",
      icon: <Calendar className="h-6 w-6" />,
      trend: "+8% from last month",
    },
    {
      title: "Clinics",
      value: "12",
      icon: <Building className="h-6 w-6" />,
      trend: "+2 new this month",
    },
    {
      title: "Active Users",
      value: "892",
      icon: <Activity className="h-6 w-6" />,
      trend: "+5% from last month",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      message: "New user registration: John Doe",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "appointment",
      message: "Appointment scheduled: Dr. Smith",
      time: "5 minutes ago",
    },
    {
      id: 3,
      type: "clinic",
      message: "Clinic updated: City Medical Center",
      time: "10 minutes ago",
    },
  ];

  const systemHealth = [
    { service: "Database Status", status: "Healthy", color: "text-green-600" },
    { service: "SMS Service", status: "Active", color: "text-green-600" },
    { service: "WhatsApp Service", status: "Active", color: "text-green-600" },
    { service: "Email Service", status: "Active", color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Activity and Health Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {item.service}
                  </span>
                  <span className={`text-sm font-medium ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
