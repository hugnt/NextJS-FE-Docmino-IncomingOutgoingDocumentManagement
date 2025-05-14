
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '../ui/button';

interface DataTablePaginationProps {
  selectedRows?: number,
  isDisplaySelectedRows?: boolean,
  pageSizeList?: number[],
  onPageSizeChanged?: (pageSize: number) => void,
  pageSize?: number,

  pageNumber?: number,
  onPageNumberChanged?: (pageNumber: number) => void,

  totalRecords?: number,
}

export default function DataTablePagination(props: DataTablePaginationProps) {
  const { isDisplaySelectedRows = false, selectedRows = 0, pageSizeList = [10, 20, 30, 40, 50], pageSize = 10, onPageSizeChanged = () => { }, pageNumber = 1, onPageNumberChanged = () => { }, totalRecords = 0 } = props;
  const totalPage = useMemo(() => totalRecords != 0 ? Math.ceil(totalRecords / pageSize) : 1, [totalRecords, pageSize])
  return (
    <div className={`flex items-center ${isDisplaySelectedRows ? 'justify-between' : 'justify-end'} overflow-auto px-2 `}>
      {isDisplaySelectedRows && <div className='hidden flex-1 text-sm text-muted-foreground sm:block'>
        {selectedRows} of{' '}
        {totalRecords} row(s) selected.
      </div>}
      <div className='flex items-center sm:space-x-6 lg:space-x-8 '>
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => { onPageSizeChanged(Number(value)) }}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeList.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {pageNumber} of{' '} {totalPage}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => onPageNumberChanged(1)}
            disabled={pageNumber == 1}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageNumberChanged(pageNumber - 1)}
            disabled={pageNumber == 1}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageNumberChanged(pageNumber + 1)}
            disabled={pageNumber == totalPage}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => onPageNumberChanged(totalPage)}
            disabled={pageNumber == totalPage}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
