import {
  ColumnDef,
  ColumnPinningState,
  RowSelectionState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import exportToCsv from "tanstack-table-export-to-csv";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[] | null;
  children?: React.ReactNode;
  displayBorder?: boolean;
  loading?: boolean;
  onDataSelected?: (data: TData[]) => void;
  isExportCsv?: boolean;
  setIsExportCsv?: (isExportCsv: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyArray: any[] = [];

export default function DataTable<TData, TValue>(
  props: DataTableProps<TData, TValue>
) {
  const {
    columns,
    data = null,
    children,
    displayBorder = false,
    loading = false,
    onDataSelected = () => { },
    isExportCsv = false,
    setIsExportCsv = () =>{}
  } = props;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: ['actions'],
  });
  const table = useReactTable({
    data: data ?? emptyArray,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnPinning
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
  });

  useEffect(() => {
    if (onDataSelected) {
      const selected = table
        .getSelectedRowModel()
        .rows.map(({ original }) => original);
      onDataSelected(selected);
    }
  }, [onDataSelected, rowSelection, table]);

  useEffect(() => {
    if (isExportCsv) {
      handleExportToCsv();
    }
  }, [isExportCsv]);

  const handleExportToCsv = (fileName: string = "data"): void => {
    const headers = table.getHeaderGroups().map((x) => x.headers).flat();
    const rows = table.getCoreRowModel().rows;
    exportToCsv(fileName, headers, rows);
    setIsExportCsv(false)
  };



  return (
    <>
      <div>{children}</div>
      <div className="rounded-md border overflow-x-auto ">
        <Table>
          <TableHeader className="bg-secondary/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`${displayBorder && "border-r"}`}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!loading && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`${displayBorder && "border-r"}`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="lds-ring w-[25px] h-[25px] me-2">
                        <div className="w-[25px] h-[25px] border-[4px]"></div>
                        <div className="w-[25px] h-[25px] border-[4px]"></div>
                        <div className="w-[25px] h-[25px] border-[4px]"></div>
                        <div className="w-[25px] h-[25px] border-[4px]"></div>
                      </div>
                      <div>Loading data...</div>
                    </div>
                  ) : (
                    "No results"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
