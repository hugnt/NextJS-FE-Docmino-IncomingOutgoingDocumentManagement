"use client"

import storageRequest from "@/api/storageRequest"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PARAM, PATH } from "@/constants/paths"
import { useDirectoryContext } from "@/context/directoryContext"
import { getDirectoryIcon, getDossierStatusBadge } from "@/lib/directoryHelper"
import { formatDate, toastClientSuccess } from "@/lib/utils"
import { getDocumentUrl } from "@/types/Document"
import { DirectoryTreeItem } from "@/types/DocumentDirectory"
import { Dossier, DossierDetail, PublishDocument } from "@/types/Dossier"
import { FormMode, FormSetting, formSettingDefault } from "@/types/form"
import {
    Calendar,
    ChevronLeft,
    Clock,
    Download,
    Edit,
    FileText,
    Folder
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import DocumentLookup from "../../components/DocumentLookup"
import FormDetails from "../components/FormDetails"
import { useAuthContext } from "@/context/authContext"



export default function DossierDetailPage() {
    const params = useParams()
    const dossierId = params.id as string
    const { trackingFolder, refeshTree } = useDirectoryContext()
    const {hasStoreDocumentRight} = useAuthContext();
    const [lookupOpen, setLookupOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [dossier, setDossier] = useState<DossierDetail>()
    const [parentDirectory, setParentDirectory] = useState<DirectoryTreeItem[]>([])
    const [formSetting, setFormSetting] = useState<FormSetting>(formSettingDefault);


    useEffect(() => {
        if(!dossierId) {
            return;
        }
        handleGetDetail();
    }, [dossierId])

    const handleGetDetail = () => {
        setIsLoading(true);
        storageRequest.getDetail(dossierId).then(res => {
            if (res.data) {
                setDossier(res.data);
                const lstParent = trackingFolder(res.data.boxId)
                setParentDirectory(lstParent)
            }
        }).finally(() => setIsLoading(false));
    }

    const handleFormSubmit = (data: Dossier) => {
        storageRequest.update(dossierId, data).then(res => {
            toastClientSuccess("Cập nhập hồ sơ thành công", res.message)
            refeshTree();
            handleGetDetail();
        });
        setFormSetting({ ...formSetting, open: false })
    }

    const handleUpdateDocument = (documents: PublishDocument[]) => {
        if (!dossier) return;
        setIsLoading(true);
        storageRequest.updateDocuments(dossierId, {listDocumentIds: documents?.map(x=>x.id)??[]}).then(res => {
            toastClientSuccess("Cập nhật văn bản trong hồ sơ thành công", res.message)
            refeshTree();
            handleGetDetail();
        }).finally(() => {
            setIsLoading(false);
            setLookupOpen(false);
        });
    }

    if (!dossier || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p>Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Folder className="h-6 w-6 text-teal-600" />
                    <h1 className="text-lg font-semibold">Chi tiết Hồ sơ</h1>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    {hasStoreDocumentRight&&<Button onClick={() => setFormSetting({ ...formSetting, mode: FormMode.EDIT, open: true })} 
                            variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Button>}
                </div>
            </header>

            <main className="flex flex-1 flex-col p-3 gap-3">
                <div className="flex items-center gap-4">
                    <Link href={`${PATH.SystemCategoryStorageDossier}?${PARAM.BOX_ID}=${dossier.boxId}`}>
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách hồ sơ
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold">Chi tiết hồ sơ: {dossier.code}</h2>
                </div>

                {/* Dossier Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Folder className="h-6 w-6 text-yellow-600" />
                                Thông tin hồ sơ
                            </CardTitle>
                            {getDossierStatusBadge(dossier.status)}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Mã hồ sơ</Label>
                                    <p className="text-lg font-semibold">{dossier.code}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Tiêu đề</Label>
                                    <p className="text-lg">{dossier.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Năm lập hồ sơ</Label>
                                    <p className="text-lg">{dossier.year}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Thời hạn bảo quản</Label>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-lg">{dossier.storagePeriodName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Vị trí lưu trữ</Label>
                                    <div className="space-y-2">
                                        {
                                            parentDirectory.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    {getDirectoryIcon(item.type, 4)}
                                                    <span>{item.name}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Ngày tạo</Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p>{formatDate(dossier.createdAt)}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p>{formatDate(dossier.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                            <p className="mt-1 text-gray-700">{dossier.description}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents Table */}
                <Card className="gap-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-6 w-6 text-blue-600" />
                                Danh sách văn bản ({dossier.documentCount ?? 0})
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất danh sách
                                </Button>
                                {hasStoreDocumentRight&&<Button onClick={() => setLookupOpen(true)}
                                     variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Sửa
                                </Button>}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead>Stt</TableHead>
                                    <TableHead>Tiêu đề</TableHead>
                                    <TableHead>Số ký hiệu</TableHead>
                                    <TableHead>Sổ đăng ký</TableHead>
                                    <TableHead>Ngày ban hành</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dossier.documents && dossier.documents.map((doc, i) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                            <Link href={getDocumentUrl(doc.documentType, doc.id)}
                                                className="text-blue-600 hover:underline">
                                                {doc.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{doc.codeNotation}</TableCell>
                                        <TableCell>{doc.documentRegisterName}</TableCell>
                                        <TableCell>{formatDate(doc.publishDate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>

            <FormDetails
                formSetting={formSetting}
                setFormSetting={setFormSetting}
                data={dossier}
                onSubmit={handleFormSubmit}
            />

            <DocumentLookup 
                open={lookupOpen}
                onOpenChange={setLookupOpen}
                existedDocuments = {dossier.documents || []}
                onDocumentsSelected={handleUpdateDocument}
            />
        </div>
    )
}
