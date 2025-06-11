import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { COLUMN_WIDTH } from "@/constants/columnWidth"
import { formatDate } from "@/lib/utils"
import { getDocTypeName, getDocumentUrl, type ProcessingDocument } from "@/types/Document"
import type { ColumnDef } from "@tanstack/react-table"
import { Calendar, Eye, Folder } from "lucide-react"
import Link from "next/link"

export const ColumnsData: ColumnDef<ProcessingDocument>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.shortName}`} column={column} title="Tên văn bản" />
    ),
    cell: ({ row }) => (
      <Link href={getDocumentUrl(row.original.documentType, row.original.id)}
        className="text-blue-600 hover:underline">
        {row.getValue("name")}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "codeNotation",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title="Số ký hiệu" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border text-gray-700">
        {row.getValue("codeNotation")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "documentType",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.status}`} column={column} title="Loại văn bản" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        {getDocTypeName(row.getValue("documentType"))}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "currentStepNumber",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.number}`} column={column} title="Bước duyệt" />
    ),
    cell: ({ row }) => {
      const current = row.getValue("currentStepNumber") as number
      const total = row.original.totalStepNumber as number
      const progress = Math.min(Math.max((current / total) * 100, 0), 100) // Ensure progress is between 0-100

      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-700">
              {current}/{total}
            </span>
            <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${progress >= 75
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : progress >= 50
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                  : progress >= 25
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                    : "bg-gradient-to-r from-red-500 to-pink-600"
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.shortText}`} column={column} title="Danh mục" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Folder className="h-4 w-4 text-amber-500" />
        <span className="text-gray-700">{row.getValue("categoryName")}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "issuedDate",
    header: ({ column }) => (
      <DataTableColumnHeader className={`${COLUMN_WIDTH.date}`} column={column} title="Ngày văn bản" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2 text-gray-600">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{formatDate(row.getValue("issuedDate"))}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title="Thao tác" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link href={getDocumentUrl(row.original.documentType, row.original.id)}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 py-0 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors duration-200 group"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="ml-1 text-xs">Xem</span>
          </Button>
        </Link>
      </div>
    ),
  },
]
