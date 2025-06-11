"use client"
import confirmProcessRequest from "@/api/confirmProcessRequest"
import documentRequest from "@/api/documentRequest"
import externalDocumentRequest from "@/api/externalDocumentRequest"
import { createDocumentFormData } from "@/api/mappings/documentMapping"
import ApprovalDialog from "@/app/document/components/ApprovalDialog"
import CompactStatus from "@/app/document/components/CompactStatus"
import RejectDialog from "@/app/document/components/RejectDialog"
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog"
import DocumentFormSkeleton from "@/components/loading/DocumentFormSkeleton"
import PageHeader from "@/components/page/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useSidebar } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BUTTON_NAME } from "@/constants/buttons"
import { TAB_KEY } from "@/constants/tabs"
import { toastClientError, toastClientSuccess } from "@/lib/utils"
import { ApproveDocumentRequest, ImageSignature, ProcessDetail, RejectDocumentRequest, SignType } from "@/types/ConfirmProcess"
import { DocumentStatus } from "@/types/Document"
import { defaultExternalDocumentDetail, ExternalDocumentDetail } from "@/types/ExternalDocument"
import { FormMode } from "@/types/form"
import "@cyntler/react-doc-viewer/dist/index.css"
import { CheckCircle, FileCheck, Pen, RotateCcw, Save, StepForward, XCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ConfirmProcessTracking from "../../../components/ConfirmProcessTracking"
import ConfirmProcessSettings from "./components/ConfirmProcessSettings"
import FileAttachment from "./components/FileAttachment"
import GeneralInformationForm from "./components/GeneralInformationForm"
import { useAuthContext } from "@/context/authContext"
import { createApprovalFormData } from "@/api/mappings/confirmProcessMapping"


export default function ExternalDocumentDetailPage() {
    const { setOpen } = useSidebar();
    const params = useParams();
    const router = useRouter();
    const { user, hasIncomingDocumentRight, hasInitialConfirmProcessRight } = useAuthContext();
    const id = params?.id as string;
    const isCreate = id === "create";
    const [formMode, setFormMode] = useState<FormMode>(isCreate ? FormMode.ADD : FormMode.VIEW)

    const [loading, setLoading] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [activeTab, setActiveTab] = useState(TAB_KEY.Information)
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

    const [signerProcess, setSignerProcess] = useState<ProcessDetail | null>(null);
    const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
    const [showApprovalDialog, setShowApprovalDialog] = useState<boolean>(false)
    const [imageSignatures, setImageSignatures] = useState<ImageSignature[]>();

    const form = useForm<ExternalDocumentDetail>({ defaultValues: defaultExternalDocumentDetail })

    useEffect(() => {
        if (!id || id == null) {
            return;
        }
        setOpen(false)
        if (id && id !== "create" && form.getValues("id") !== id) {
            checkUserSigningPermission(id);
            handleGetDetails(id)
        }
    }, [id])

    const handleGetDetails = (id: string) => {
        setLoading(true)
        externalDocumentRequest
            .getById(id)
            .then((res) => {
                console.log("res-details", res.data)
                const data = res.data;
                if (data) {
                    data.processCount = data?.confirmProcess?.processDetails?.length ?? 0;
                    data.documentFiles = data?.documentFiles?.map((file, i) => ({
                        ...file,
                        fileIndex: i,
                    })) ?? [];
                    for (const processDetail of data.confirmProcess?.processDetails ?? []) {
                        for (const signDetail of processDetail.signDetails ?? []) {
                            signDetail.fileIndex = data.documentFiles.findIndex(file => file.id === signDetail.fileId);
                        }
                    }
                    form.reset(data);
                }
            })
            .finally(() => setLoading(false))
    }

    const checkUserSigningPermission = (id: string) => {
        confirmProcessRequest.getUserConfirmDocument(id)
            .then(async (res) => {
                if (res.data && res.data != null) {
                    if (res.data.signDetails && res.data.signDetails.length > 0) {
                        try {
                            const response = await fetch(user?.imageSignature as string);
                            const blob = await response.blob();
                            const file = new window.File([blob], "user-signature.png", {
                                type: blob.type || "image/png",
                            });
                            const imageSignatures = res.data.signDetails.map(x => ({
                                fileId: x.fileId,
                                image: file,
                                isVerify: false,
                            }));
                            setImageSignatures(imageSignatures);
                        } catch {
                            setImageSignatures([]);
                        }
                    }
                    setSignerProcess(res.data);
                }
                else {
                    setSignerProcess(null);
                    setImageSignatures([]);
                }
            })
    }

    const handleSave = (data: ExternalDocumentDetail) => {
        console.log(data)
        setLoadingSave(true)
        const formData = createDocumentFormData(data)
        if (formMode === FormMode.ADD) {
            externalDocumentRequest.addIncomingDocument(formData)
                .then((res) => {
                    toastClientSuccess("Văn bản thêm đã được thêm", "Văn bản đã được thêm mới")
                    setFormMode(FormMode.VIEW)
                    router.push(`/document/external/incoming/${res.data}`);
                })
                .finally(() => setLoadingSave(false))
        }
        else if (formMode === FormMode.EDIT) {
            externalDocumentRequest.updateIncomingDocument(id, formData)
                .then(() => {
                    toastClientSuccess("Văn bản đã được cập nhật", "Cập nhật văn bản đến thành công")
                    setFormMode(FormMode.VIEW);
                    handleGetDetails(id);
                })
                .finally(() => setLoadingSave(false))
        }


    }

    const handleInitiateProcess = () => {
        setLoadingSave(true)
        documentRequest.initiateConfirmProcess(id)
            .then(() => {
                toastClientSuccess("Quy trình duyệt đã được khởi tạo", "Khởi tạo quy trình duyệt thành công")
                setFormMode(FormMode.VIEW);
                handleReload();
            })
            .finally(() => {
                setOpenConfirmDialog(false);
                setLoadingSave(false)
            })
    }

    const handleReload = () => {
        if (id && id !== "create") {
            checkUserSigningPermission(id);
            handleGetDetails(id);
        }
        else form.reset(defaultExternalDocumentDetail);
    }


    const handleCheckApprove = () => {
        if (signerProcess?.signDetails && signerProcess.signDetails.length > 0) {
            const allSigned = imageSignatures?.every(x => x.isVerify) ?? false;
            if (!allSigned) {
                toastClientError("Vui lòng ký vào văn bản trước khi duyệt", "Các chữ ký chưa được xác nhận hết");
                return;
            }
        }
        setShowApprovalDialog(true)
    }

    const handleReject = async (rejectRequest: RejectDocumentRequest) => {
        console.log("handleReject", rejectRequest)
        setLoadingSave(true)
        await confirmProcessRequest.rejectDocument(id, rejectRequest)
            .then(() => {
                toastClientSuccess("Văn bản đã bị từ chối", "Từ chối văn bản thành công")
                setShowRejectDialog(false);
                handleReload();
            }).finally(() => {
                setLoadingSave(false)
            })
    }

    const handleApprove = async (approveRequest: ApproveDocumentRequest) => {
        if (signerProcess?.signType == SignType.Image || signerProcess?.signType == SignType.DigitalSignature) {
            approveRequest.imageSignatures = imageSignatures;
        }
        console.log("approveRequest", approveRequest)
        const formData = createApprovalFormData(approveRequest);
        await confirmProcessRequest.approveDocument(id, formData)
            .then(() => {
                toastClientSuccess("Văn bản đã được duyệt", "Duyệt văn bản thành công")
                setShowApprovalDialog(false);
                handleReload();
            }).finally(() => {
                setLoadingSave(false)
            })
    }

    return (
        <div>
            {loading ? <DocumentFormSkeleton /> :
                <Form {...form}>
                    <form id='document-form'
                        onSubmit={form.handleSubmit(handleSave)}
                        className='flex-1 space-y-5'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}>
                        <PageHeader
                            title={id && id !== "create" ? "Chi tiết văn bản đến" : "Thêm văn bản đến"}
                            subtitle={id && id !== "create" ? "Chi tiết thông tin văn bản đến" : "Thêm mới văn bản đến"}>
                            {form.getValues("documentStatus") != DocumentStatus.Draff &&
                                (signerProcess == null ? <CompactStatus status={form.getValues("documentStatus")} /> :
                                    <div className="flex items-center justify-end space-x-3 py-2 px-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex items-center text-gray-700">
                                            <FileCheck className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium">{signerProcess?.actionName}</span>
                                            <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200 font-normal">
                                                Bước duyệt {signerProcess?.stepNumber} / {form.getValues("confirmProcess.processDetails")?.length}
                                            </Badge>
                                        </div>
                                        <div className="h-5 w-px bg-gray-200 mx-1"></div>
                                        <Button
                                            variant="outline"
                                            className="h-9 px-4 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium"
                                            type="button"
                                            onClick={() => setShowRejectDialog(true)}
                                            disabled={loadingSave}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            <span>{BUTTON_NAME.Reject}</span>
                                        </Button>
                                        <Button
                                            className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                            type="button"
                                            onClick={handleCheckApprove}
                                            disabled={loadingSave}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            <span>{BUTTON_NAME.Approve}</span>
                                        </Button>
                                    </div>)
                            }
                            {formMode == FormMode.VIEW && form.getValues("documentStatus") == DocumentStatus.Draff &&
                                <Fragment>
                                    {hasIncomingDocumentRight && <Button className="space-x-1 bg-blue-500"
                                        onClick={() => setFormMode(FormMode.EDIT)} type="button" loading={loadingSave}>
                                        <Pen size={18} />
                                        <span>{BUTTON_NAME.Edit}</span>
                                    </Button>}
                                    {hasInitialConfirmProcessRight
                                        && form.getValues("confirmProcess")
                                        && form.getValues("confirmProcess") != null
                                        && <Button className="space-x-1 bg-green-500"
                                            onClick={() => setOpenConfirmDialog(true)} type="button" loading={loadingSave}>
                                            <span>{BUTTON_NAME.StartProcess}</span>
                                            <StepForward size={18} />
                                        </Button>}
                                </Fragment>
                            }
                            {(formMode == FormMode.ADD || formMode == FormMode.EDIT) &&
                                <Fragment>
                                    <Button className=" bg-yellow-500"
                                        type="button" loading={loadingSave} onClick={handleReload}>
                                        <RotateCcw size={18} />
                                    </Button>
                                    <Button className="space-x-1 bg-green-500" type="submit" loading={loadingSave}>
                                        <Save size={18} />
                                        <span>{BUTTON_NAME.Save}</span>
                                    </Button>
                                </Fragment>
                            }
                        </PageHeader>

                        <Card className="py-3">
                            <CardContent className="pt-0 px-3">
                                <Tabs defaultValue={TAB_KEY.Information} value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="">
                                        <TabsTrigger value={TAB_KEY.Information}>Thông tin chung</TabsTrigger>
                                        <TabsTrigger value={TAB_KEY.ConfirmProcess}>Quy trình duyệt</TabsTrigger>
                                        <TabsTrigger hidden={formMode !== FormMode.VIEW} value={TAB_KEY.History}>Lịch sử duyệt</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value={TAB_KEY.Information} className="space-y-6 pt-4">
                                        <GeneralInformationForm form={form} readOnly={formMode == FormMode.VIEW || loadingSave} />
                                        <FileAttachment form={form} formMode={formMode} />
                                    </TabsContent>

                                    <TabsContent value={TAB_KEY.ConfirmProcess} className="space-y-6 pt-4">
                                        <ConfirmProcessSettings
                                            form={form}
                                            readOnly={formMode == FormMode.VIEW || loadingSave}
                                            signerProcess={signerProcess}
                                            imageSignatures={imageSignatures}
                                            setImageSignatures={setImageSignatures}
                                        />
                                    </TabsContent>

                                    <TabsContent value={TAB_KEY.History} className="space-y-6 pt-4">
                                        <ConfirmProcessTracking processHistories={form.getValues("confirmProcess.processHistories")} />
                                    </TabsContent>
                                </Tabs>

                            </CardContent>
                        </Card >
                    </form>
                </Form>
            }

            {signerProcess != null &&
                <Fragment>
                    <RejectDialog
                        open={showRejectDialog}
                        onOpenChange={setShowRejectDialog}
                        isVetoRight={signerProcess.vetoRight}
                        processDetails={
                            form.getValues("confirmProcess.processDetails")
                                ?.filter(x => x.stepNumber < signerProcess.stepNumber)
                                .sort(x => x.stepNumber) || []
                        }
                        onConfirm={handleReject}
                    />
                    <ApprovalDialog
                        open={showApprovalDialog}
                        onOpenChange={setShowApprovalDialog}
                        processDetails={form.getValues("confirmProcess.processDetails") ?? []}
                        signerProcess={signerProcess}
                        currentStep={signerProcess.stepNumber}
                        onConfirm={handleApprove}
                    />
                </Fragment>
            }

            <ConfirmDialog
                open={openConfirmDialog}
                onOpenChange={setOpenConfirmDialog}
                handleConfirm={handleInitiateProcess}
                className='max-w-md'
                title={`Xác nhận trình ký văn bản này`}
                desc={
                    <>
                        Bạn đang xác nhận trình ký cho văn bản{' '}
                        <strong>{form.getValues("name")}</strong>. <br />
                        Quá trình này sẽ gửi văn bản đến các người dùng đã được chỉ định trong quy trình duyệt. <br />
                        Vui lòng xác nhận để tiếp tục.
                    </>
                }
                isLoading={loadingSave}
                classNameConfirmButton="bg-green-500"
                confirmText='Xác nhận' />
        </div >
    )
}
