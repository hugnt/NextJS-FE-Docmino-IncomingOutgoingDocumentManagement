"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";

type DataTablePaginationProps = {
  selectedRows?: number;
  isDisplaySelectedRows?: boolean;
  pageSizeList?: number[];
  onPageSizeChanged?: (pageSize: number) => void;
  pageSize?: number;

  pageNumber?: number;
  onPageNumberChanged?: (pageNumber: number) => void;

  totalRecords?: number;
  maxPageButtons?: number;
};

export default function DataTablePagination(props: DataTablePaginationProps) {
  const {
    isDisplaySelectedRows = false,
    selectedRows = 0,
    pageSizeList = [10, 20, 30, 40, 50],
    pageSize = 10,
    onPageSizeChanged = () => { },
    pageNumber = 1,
    onPageNumberChanged = () => { },
    totalRecords = 0,
    maxPageButtons = 5,
  } = props;

  const totalPage = useMemo(
    () => (totalRecords != 0 ? Math.ceil(totalRecords / pageSize) : 1),
    [totalRecords, pageSize],
  );

  // Generate the array of page numbers to display with ellipsis
  const pageNumbers = useMemo(() => {
    // If total pages is less than or equal to max buttons, show all pages
    if (totalPage <= maxPageButtons) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    // Always show first page, last page, and some pages around the current page
    const result: (number | string)[] = [];

    // Always add page 1
    result.push(1);

    // Calculate the range of pages to show around the current page
    const leftSiblingIndex = Math.max(2, pageNumber - 1);
    const rightSiblingIndex = Math.min(totalPage - 1, pageNumber + 1);

    // Add ellipsis if there's a gap after page 1
    if (leftSiblingIndex > 2) {
      result.push("ellipsis-left");
    }

    // Add pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPage) {
        result.push(i);
      }
    }

    // Add ellipsis if there's a gap before the last page
    if (rightSiblingIndex < totalPage - 1) {
      result.push("ellipsis-right");
    }

    // Always add the last page
    if (totalPage > 1) {
      result.push(totalPage);
    }

    return result;
  }, [totalPage, pageNumber, maxPageButtons]);

  return (
    <div
      className={`flex items-center ${isDisplaySelectedRows ? "justify-between" : "justify-end"} overflow-auto px-2`}
    >
      {isDisplaySelectedRows && (
        <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
          {selectedRows} of {totalRecords} row(s) selected.
        </div>
      )}
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">
            Rows per page
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChanged(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeList.map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageNumber} of {totalPage}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageNumberChanged(1)}
            disabled={pageNumber === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageNumberChanged(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((page, index) => {
            if (
              page === "ellipsis-left" ||
              page === "ellipsis-right"
            ) {
              return (
                <Button
                  key={`ellipsis-${index}`}
                  variant="outline"
                  className="h-8 w-8 cursor-default p-0"
                  disabled
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              );
            }

            return (
              <Button
                key={index}
                variant={
                  pageNumber === page ? "default" : "outline"
                }
                className={`h-8 w-8 p-0 ${pageNumber === page ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() =>
                  onPageNumberChanged(page as number)
                }
              >
                <span className="sr-only">
                  Go to page {page}
                </span>
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageNumberChanged(pageNumber + 1)}
            disabled={pageNumber === totalPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageNumberChanged(totalPage)}
            disabled={pageNumber === totalPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
