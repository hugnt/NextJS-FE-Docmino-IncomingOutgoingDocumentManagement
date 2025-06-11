"use client"

import documentDirectoryRequest from "@/api/documentDirectoryRequest"
import DataTablePagination from "@/components/data-table/DataTablePagination"
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog"
import SearchInput from "@/components/input/SearchInput"
import { Button } from "@/components/ui/button"
import { PARAM, PATH } from "@/constants/paths"
import { useDirectoryContext } from "@/context/directoryContext"
import { toastClientSuccess } from "@/lib/utils"
import { defaultDocumentDirectory, DirectoryType, DocumentDirectory, DocumentDirectoryFilter } from "@/types/DocumentDirectory"
import { ConfirmDialogState, confirmDialogStateDefault, FormMode, FormSetting, formSettingDefault } from "@/types/form"
import { Archive, ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import DirectoryFolder from "../components/DirectoryFolder"
import FormDetails from "./components/FormDetails"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/context/authContext"

export default function ShelfPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const warehouseId = searchParams.get(PARAM.INVENROTY_ID);

  const { refeshTree, tree, getInventory } = useDirectoryContext();
  const {hasStoreDocumentRight} = useAuthContext();
  const [data, setData] = useState<DocumentDirectory[]>([]);
  const [filter, setFilter] = useState<DocumentDirectoryFilter>({ parentDirectoryId: warehouseId, type: DirectoryType.Sheft, pageNumber: 1, pageSize: 5 });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
  const [detail, setDetail] = useState<DocumentDirectory>({ ...defaultDocumentDirectory, parentDirectoryId: warehouseId, type: DirectoryType.Sheft });
  const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState<string>>(confirmDialogStateDefault);
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    handleGetList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  useEffect(() => {
    if (warehouseId) {
      setFilter({ ...filter, parentDirectoryId: warehouseId });
      setDetail({ ...defaultDocumentDirectory, parentDirectoryId: warehouseId, type: DirectoryType.Sheft });
    }
    else {
      setFilter({ ...filter, parentDirectoryId: null });
      setDetail({ ...defaultDocumentDirectory, parentDirectoryId: null, type: DirectoryType.Sheft });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouseId])

  const handleGetList = () => {
    setIsLoading(true)
    documentDirectoryRequest.getByFilter(filter).then(res => {
      console.log("res:", res.data)
      res.data = res?.data?.map((item: DocumentDirectory) => {
        const selectedItem = tree.find(d => d.id === item.id);
        return {
          ...item,
          documentCount: selectedItem?.documentCount ?? 0,
        }
      }) ?? [];
      setData(res.data);
      setTotalRecords(res.totalRecords ?? 0)
    }).finally(() => setIsLoading(false));
  }

  const handleFormAction = (mode: FormMode, selectedItem?: DocumentDirectory) => {
    if (mode == FormMode.ADD) setDetail({ ...defaultDocumentDirectory, parentDirectoryId: warehouseId, type: DirectoryType.Sheft });
    else if (selectedItem && mode == FormMode.EDIT) setDetail(selectedItem);
    else if (selectedItem && mode == FormMode.REDIRECT) {
      router.push(`${PATH.SystemCategoryStorageBox}?${PARAM.SHEFT_ID}=${selectedItem.id}`);
      return;
    }
    setFormSetting({
      mode: mode,
      open: true
    })
  }

  const handleFormSubmit = (data: DocumentDirectory) => {
    data.type = DirectoryType.Sheft;
    if (formSetting.mode == FormMode.ADD) {
      documentDirectoryRequest.create(data).then(res => {
        toastClientSuccess("Thêm mới thành công!", res.message)
        refeshTree();
        handleGetList();
      });
    }
    else if (formSetting.mode == FormMode.EDIT) {
      documentDirectoryRequest.update(detail!.id, data).then(res => {
        toastClientSuccess("Cập nhập thư mục thành công", res.message)
        refeshTree();
        handleGetList();
      });
    }
    setFormSetting({ ...formSetting, open: false })
  }

  const handleConfirmDelete = () => {
    documentDirectoryRequest.delete(openDeleteDialog.id).then(res => {
      toastClientSuccess("Xóa thư mục thành công!", res.message)
      refeshTree();
      handleGetList();
    }).finally(() => setOpenDeleteDialog({ ...openDeleteDialog, open: false }));
  }


  //SEARCH & FILTER
  const handleSearch = (query: string) => {
    setFilter({ ...filter, pageNumber: 1, searchValue: query })
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        {warehouseId && <Link href={PATH.SystemCategoryStorageInventory}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách kho
          </Button>
        </Link>}
        <div className="flex items-center gap-2">
          <Archive className="h-6 w-6 text-teal-600" />
          <h1 className="text-lg font-semibold">
            Kệ Lưu trữ
            {warehouseId && <Badge className="ml-2 bg-blue-500">
              {getInventory(warehouseId)?.name}
            </Badge>}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {hasStoreDocumentRight&&<Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
            <span>Thêm kệ lưu trữ</span><Plus size={18} />
          </Button>}
        </div>
      </header>

      <main className="flex flex-1 flex-col p-3 space-y-3">
        <div className="flex items-center">
          <SearchInput className="col-span-2 w-1/3 bg-white" onSearch={handleSearch} />
        </div>
        <DirectoryFolder
          data={data}
          handleDetailClick={(detail: DocumentDirectory) => handleFormAction(FormMode.REDIRECT, detail)}
          handleEditClick={(detail: DocumentDirectory) => handleFormAction(FormMode.EDIT, detail)}
          handleDeleteClick={(detail: DocumentDirectory) => {
            setOpenDeleteDialog({
              open: true,
              name: detail.name,
              id: detail.id
            })
          }}
          loading={isLoading}
        />
        <DataTablePagination
          pageSizeList={[5, 8, 10]}
          pageSize={filter?.pageSize}
          pageNumber={filter?.pageNumber}
          totalRecords={totalRecords}
          onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
          onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageNumber: 1, pageSize: pageSize })} />

      </main>

      <FormDetails
        formSetting={formSetting}
        setFormSetting={setFormSetting}
        data={detail}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        destructive
        open={openDeleteDialog.open}
        onOpenChange={(v) => setOpenDeleteDialog({ ...openDeleteDialog, open: v })}
        handleConfirm={handleConfirmDelete}
        className='max-w-md'
        title={`Xóa thư mục: ${openDeleteDialog.name} ?`}
        desc={
          <>
            Bạn có chắc chắn muốn xóa thư mục <strong>{openDeleteDialog.name}</strong> không?
            <br /> Tất cả thư mục con và tài liệu trong thư mục này sẽ bị xóa vĩnh viễn.
            <br />Hành động này không thể hoàn tác.
          </>
        }
        confirmText='Xóa' />
    </div>
  )
}
