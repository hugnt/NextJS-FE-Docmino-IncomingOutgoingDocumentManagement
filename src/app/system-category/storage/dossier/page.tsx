"use client"

import storageRequest from "@/api/storageRequest"
import DataTablePagination from "@/components/data-table/DataTablePagination"
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog"
import SearchInput from "@/components/input/SearchInput"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PARAM, PATH } from "@/constants/paths"
import { useDirectoryContext } from "@/context/directoryContext"
import { toastClientSuccess } from "@/lib/utils"
import { defaultDossier, Dossier, DossierFilter } from "@/types/Dossier"
import { ConfirmDialogState, confirmDialogStateDefault, FormMode, FormSetting, formSettingDefault } from "@/types/form"
import { ChevronLeft, Folder, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import DossierGrid from "./components/DossierGrid"
import FormDetails from "./components/FormDetails"
import { useAuthContext } from "@/context/authContext"

export default function DossierPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const boxId = searchParams.get(PARAM.BOX_ID)

    const { refeshTree, getBox } = useDirectoryContext();
    const { hasStoreDocumentRight } = useAuthContext();

    const [data, setData] = useState<Dossier[]>([]);
    const [filter, setFilter] = useState<DossierFilter>({ boxId: boxId, pageNumber: 1, pageSize: 5 });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);
    const [detail, setDetail] = useState<Dossier>(defaultDossier);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<ConfirmDialogState<string>>(confirmDialogStateDefault);
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        handleGetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    useEffect(() => {
        if (boxId) {
            setFilter({ ...filter, boxId });
        }
        else {
            setFilter({ ...filter, boxId: null });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boxId])

    const handleGetList = () => {
        setIsLoading(true)
        storageRequest.getByFilter(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setIsLoading(false));
    }

    const handleFormAction = (mode: FormMode, selectedItem?: Dossier) => {
        if (mode == FormMode.ADD) setDetail({ ...defaultDossier, boxId: boxId ?? ''});
        else if (selectedItem && mode == FormMode.EDIT) setDetail(selectedItem);
        else if (selectedItem && mode == FormMode.REDIRECT) {
            router.push(`${PATH.SystemCategoryStorageDossier}/${selectedItem.id}`);
            return;
        }
        setFormSetting({
            mode: mode,
            open: true
        })
    }

    const handleFormSubmit = (data: Dossier) => {
        if (formSetting.mode == FormMode.ADD) {
            storageRequest.create(data).then(res => {
                toastClientSuccess("Thêm mới thành công!", res.message)
                refeshTree();
                handleGetList();
            });
        }
        else if (formSetting.mode == FormMode.EDIT) {
            storageRequest.update(detail!.id, data).then(res => {
                toastClientSuccess("Cập nhập hồ sơ thành công", res.message)
                refeshTree();
                handleGetList();
            });
        }
        setFormSetting({ ...formSetting, open: false })
    }

    const handleConfirmDelete = () => {
        storageRequest.delete(openDeleteDialog.id).then(res => {
            toastClientSuccess("Xóa hồ sơ thành công!", res.message)
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
                {boxId && <Link href={`${PATH.SystemCategoryStorageBox}?${PARAM.SHEFT_ID}=${getBox(boxId)?.parentDirectoryId}`} className="flex items-center">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách hộp
                    </Button>
                </Link>}
                <div className="flex items-center gap-2">
                    <Folder className="h-6 w-6 text-teal-600" />
                    <h1 className="text-lg font-semibold">
                        Hồ sơ lưu trữ
                        {boxId && <Badge className="ml-2 bg-blue-500">
                            {getBox(boxId)?.name}
                        </Badge>}
                    </h1>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    {hasStoreDocumentRight&&<Button onClick={() => handleFormAction(FormMode.ADD)} className='space-x-1'>
                        <span>Thêm hồ sơ</span><Plus size={18} />
                    </Button>}
                </div>
            </header>

            <main className="flex flex-1 flex-col p-3 space-y-3">
                <div className="flex items-center">
                    <SearchInput className="col-span-2 w-1/3 bg-white" onSearch={handleSearch} />
                </div>
                <DossierGrid
                    data={data}
                    handleDetailClick={(detail: Dossier) => handleFormAction(FormMode.REDIRECT, detail)}
                    handleEditClick={(detail: Dossier) => handleFormAction(FormMode.EDIT, detail)}
                    handleDeleteClick={(detail: Dossier) => {
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
