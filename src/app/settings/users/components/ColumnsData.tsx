import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { COLUMN_WIDTH } from "@/constants/columnWidth";
import { UserDetail } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";

export const ColumnsData: ColumnDef<UserDetail>[] = [
    {
        accessorKey: 'fullname',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.name}`} column={column} title='Full Name' />
        ),
        cell: ({ row }) => <div>{row.getValue('fullname')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'username',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Tên đăng nhập' />
        ),
        cell: ({ row }) => <div>{row.getValue('username')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Email' />
        ),
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'roleName',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Vai trò' />
        ),
        cell: ({ row }) => <div>{row.getValue('roleName')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'positionName',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Chức vụ' />
        ),
        cell: ({ row }) => <div>{row.getValue('positionName')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'departmentName',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Phòng ban' />
        ),
        cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'isDeleted',
        header: ({ column }) => (
            <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title='Trạng thái' />
        ),
        cell: ({ row }) => <Badge
            className={!row.getValue('isDeleted')
                ? "bg-green-100 text-green-800 border border-green-300 rounded-full px-3 py-1 text-xs"
                : "bg-red-100 text-red-800 border border-red-300 rounded-full px-3 py-1 text-xs"
            }
        >
            {!row.getValue('isDeleted') ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>,
        enableSorting: false,
        enableHiding: false,
    },
];