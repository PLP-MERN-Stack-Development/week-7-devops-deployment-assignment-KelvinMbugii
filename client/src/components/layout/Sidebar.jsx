import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

/**
 * Sidebar navigation component
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @param {string} props.activeItem - Currently active item
 * @param {Function} props.onItemClick - Item click handler
 * @param {string} props.className - Additional CSS classes
 */
const Sidebar = ({ items = [], activeItem, onItemClick, className }) => {
  return (
    <aside
      className={cn(
        "w-64 bg-white shadow-sm border-r border-gray-200",
        className
      )}
    >
      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => onItemClick(item.id)}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
