
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusIcon, MoreHorizontal, Download, Search, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type ColumnDef = {
  title: string;
  field: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
};

interface DataTableProps {
  columns: ColumnDef[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRowClick?: (row: any) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  title?: string;
  searchable?: boolean;
}

const DataTable = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onRowClick,
  onExportPdf,
  onExportExcel,
  title,
  searchable = true,
}: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  // Filter data based on search query
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  // Sort data if sort field is set
  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === bValue) return 0;
        
        // Handle null or undefined values
        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        
        // String comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Number comparison
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      })
    : filteredData;

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Toggle sort
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Table header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {title && (
          <h2 className="text-xl font-semibold">{title}</h2>
        )}
        
        <div className="flex flex-wrap gap-2 items-center ml-auto">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search')}
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          {(onExportPdf || onExportExcel) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {t('export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('export_options')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onExportPdf && (
                  <DropdownMenuItem onClick={onExportPdf} className="cursor-pointer">
                    {t('export_pdf')}
                  </DropdownMenuItem>
                )}
                {onExportExcel && (
                  <DropdownMenuItem onClick={onExportExcel} className="cursor-pointer">
                    {t('export_excel')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('reset')}
          </Button>
          
          {onAdd && (
            <Button onClick={onAdd} className="ml-2">
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('add')}
            </Button>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, i) => (
                <TableHead
                  key={i}
                  className={column.sortable ? 'cursor-pointer select-none' : ''}
                  onClick={() => column.sortable && toggleSort(column.field)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && sortField === column.field && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead>{t('actions')}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {searchQuery
                    ? t('no_results_found')
                    : t('no_data_available')}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.render
                        ? column.render(row[column.field], row)
                        : row[column.field]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              className="cursor-pointer"
                            >
                              {t('edit')}
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                              }}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              {t('delete')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {t('showing')} {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{' '}
            {t('to')}{' '}
            {Math.min(currentPage * pageSize, sortedData.length)}{' '}
            {t('of')} {sortedData.length} {t('results')}
          </p>
          <div className="flex items-center ml-4">
            <p className="text-sm text-muted-foreground mr-2">{t('rows_per_page')}</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
