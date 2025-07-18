import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const DataTable = ({ columns = [], data = [], onRowAction, emptyMessage = "No data available" }) => {
  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    const value = item[column.key];

    // Handle badge rendering
    if (column.type === 'badge') {
      const variant = column.badgeVariant?.(value) || 'default';
      return <Badge variant={variant}>{value}</Badge>;
    }

    // Handle date rendering
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    // Handle actions
    if (column.type === 'actions' && column.actions) {
      return (
        <div className="flex space-x-2">
          {column.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => onRowAction?.(action.key, item)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      );
    }

    return value;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id || index}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {renderCellContent(item, column)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;