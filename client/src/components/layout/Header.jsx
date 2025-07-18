import React from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

/**
 * Header component for the application
 * @param {Object} props - Component props
 * @param {string} props.title - Header title
 * @param {string} props.subtitle - Header subtitle
 * @param {Object} props.user - User object
 * @param {Array} props.notifications - Array of notifications
 * @param {Function} props.onLogout - Logout handler
 * @param {React.ReactNode} props.icon - Header icon
 * @param {React.ReactNode} props.actions - Additional header actions
 */
const Header = ({
  title,
  subtitle,
  user,
  notifications = [],
  onLogout,
  icon,
  actions,
}) => {
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {actions}

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
