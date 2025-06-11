"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ImageSignature, ProcessSignDetail } from "@/types/ConfirmProcess"
import type { DocumentFile } from "@/types/DocumentFile"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Upload, CheckCircle, AlertCircle, RotateCcw, Save } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { useAuthContext } from "@/context/authContext"
import SignatureCanvas from "./SignatureCanvas"
import { Badge } from "@/components/ui/badge"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PDFSigningDetailsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file?: DocumentFile
    onSave: (imageSignature?: ImageSignature, isReset?: boolean) => void
    imageSignature?: ImageSignature,
    signerSettings?: ProcessSignDetail
}

export default function PDFSigningDetails({
    open,
    onOpenChange,
    file,
    onSave = () => { },
    imageSignature,
    signerSettings,
}: PDFSigningDetailsProps) {
    const { user } = useAuthContext()
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [selectedSignatureFile, setSelectedSignatureFile] = useState<File | null>(null)
    const [selectedSignatureUrl, setSelectedSignatureUrl] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("preset")
    const [signatureFile, setSignatureFile] = useState<File | null>(null)
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!open) {
            setPageNumber(1)
            setScale(1.0)
            return
        }
        const imageSignatureFile = imageSignature?.image
        if (imageSignatureFile) {
            setSelectedSignatureFile(imageSignatureFile)
            const url = URL.createObjectURL(imageSignatureFile)
            setSelectedSignatureUrl(url)
        }
    }, [imageSignature, open])

    const fileUrl = useMemo(() => {
        if (file?.fileUrl) {
            return file.fileUrl
        } else if (file?.file) {
            return file.file
        }
        // Fallback to a sample PDF for testing
        return "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
    }, [file])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setPageNumber(1)
    }

    const handlePresetSignatureSelect = async () => {
        if (!user?.imageSignature) return

        try {
            const response = await fetch(user.imageSignature)
            const blob = await response.blob()
            const file = new File([blob], "user-signature.png", {
                type: blob.type || "image/png",
            })
            setSelectedSignatureFile(file)
            setSelectedSignatureUrl(user.imageSignature)
        } catch (error) {
            console.error("Error loading user signature:", error)
            // Fallback: just use the URL directly
            setSelectedSignatureUrl(user.imageSignature)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check if file is an image
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng tải lên file hình ảnh")
            return
        }

        setSelectedSignatureFile(file)
        const url = URL.createObjectURL(file)
        setSelectedSignatureUrl(url)
    }

    const handleSignatureFromCanvas = (file: File | null) => {
        setSignatureFile(file)
        if (file) {
            const url = URL.createObjectURL(file)
            setSignatureUrl(url)
        } else {
            setSignatureUrl(null)
        }
    }

    const applySignature = () => {
        let signatureFileToApply: File | null = null

        if (activeTab === "preset" && selectedSignatureFile) {
            signatureFileToApply = selectedSignatureFile
        } else if (activeTab === "draw" && signatureFile) {
            signatureFileToApply = signatureFile
        } else if (activeTab === "upload" && selectedSignatureFile) {
            signatureFileToApply = selectedSignatureFile
        }

        if (signatureFileToApply && signerSettings) {
            const imageSignature: ImageSignature = {
                fileId: file?.id || "",
                image: signatureFileToApply,
                isVerify: true,
            }
            onSave(imageSignature)
        }
        else {
            onSave({
                fileId: file?.id || "",
                image: null,
                isVerify: false,
            }, true)
        }
    }

    const resetSignature = () => {
        setSelectedSignatureFile(null)
        setSelectedSignatureUrl(null)
        setSignatureFile(null)
        setSignatureUrl(null)
        onSave(
            {
                fileId: file?.id || "",
                image: null,
                isVerify: false,
            },
            true,
        )
    }


    // Get current signature URL for display
    const getCurrentSignatureUrl = () => {
        if (activeTab === "draw") {
            return signatureUrl
        }
        return selectedSignatureUrl
    }

    const currentSignatureUrl = getCurrentSignatureUrl()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="[&>button]:hidden sm:max-w-[1000px] p-0 border-0 h-[85vh] overflow-hidden rounded-lg shadow-lg flex flex-col"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="py-2 px-4 bg-primary border-0 rounded-t-lg flex flex-row items-center justify-between shrink-0">
                    <div>
                        <DialogTitle className="text-white font-medium m-0 flex items-center gap-2">
                            <span>Xác nhận chữ kí cho văn bản</span>
                            {fileUrl && (
                                <>
                                    <Separator orientation="vertical" className="h-4 bg-white/30" />
                                    <span className="text-xs font-normal opacity-90 truncate max-w-[300px]">
                                        {typeof fileUrl === "string" ? fileUrl.split("/").pop() : file instanceof File ? file.name : ""}
                                    </span>
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="flex flex-col flex-1 bg-neutral-100 overflow-hidden">
                    {/* Navigation bar */}
                    <div className="sticky flex items-center justify-between p-2 w-full border-b mb-1 bg-white shadow-sm shrink-0 z-10">
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
                                disabled={pageNumber <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages || 1))}
                                disabled={numPages ? pageNumber >= numPages : true}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium px-2">
                                Trang <span className="font-semibold">{pageNumber}</span> / <span>{numPages || "-"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <div className="text-xs font-medium px-2 w-16 text-center">{Math.round(scale * 100)}%</div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.0))}
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="px-3 flex-1 overflow-hidden">
                        <div id="selectorContainer" className="relative flex gap-3 h-full overflow-auto">
                            <div className={cn("flex-1", "w-[calc(100%-20rem)]")}>
                                <div className=" bg-white rounded-md shadow-sm p-1 min-h-[500px] flex items-center justify-center">
                                    <div className="overflow-hidden relative rounded-md w-full h-full flex items-center justify-center">
                                        <Document
                                            file={fileUrl}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            loading={<div className="p-8 text-center text-neutral-500 animate-pulse">Đang tải PDF...</div>}
                                            error={
                                                <div className="p-8 text-center text-red-500">
                                                    Không thể tải file PDF. Vui lòng kiểm tra lại đường dẫn.
                                                </div>
                                            }
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                className="mx-auto dropzone"
                                                renderAnnotationLayer={false}
                                                renderTextLayer={false}
                                                scale={scale}
                                            />
                                        </Document>
                                        {signerSettings && (
                                            <div
                                                className={cn(
                                                    "bg-transparent border-2 border-green-200 absolute flex items-center justify-center",
                                                    signerSettings.signPage === pageNumber ? "flex" : "hidden",
                                                )}
                                                style={{
                                                    left: signerSettings.posX,
                                                    top: signerSettings.posY,
                                                    width: signerSettings.signZoneWidth,
                                                    height: signerSettings.signZoneHeight,
                                                }}
                                            >
                                                {currentSignatureUrl ? (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={currentSignatureUrl || "/placeholder.svg"}
                                                            alt="Selected signature"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-green-600 ">Vị trí chữ ký</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-10"></div>
                            </div>

                            <div className="bg-white rounded-md shadow-sm w-80 border flex flex-col top-3 self-start sticky">
                                <div className="border-b p-3 bg-neutral-50 z-10 sticky">
                                    <h3 className="font-medium text-sm text-neutral-800 mb-1">Chọn chữ kí</h3>
                                    <p className="text-xs text-neutral-600 italic">
                                        Chữ ký sẽ được áp dụng vào vị trí đã chọn trên tài liệu.
                                    </p>
                                </div>
                                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                                    <Tabs defaultValue="preset" className="w-full" onValueChange={setActiveTab}>
                                        <TabsList className="grid grid-cols-3 mb-4">
                                            <TabsTrigger value="preset">Chữ ký có sẵn</TabsTrigger>
                                            <TabsTrigger value="draw">Ký tay</TabsTrigger>
                                            <TabsTrigger value="upload">Tải lên</TabsTrigger>
                                        </TabsList>

                                        {/* Tab 1: Preset signatures - Only one signature */}
                                        <TabsContent value="preset" className="space-y-4">
                                            <div className="space-y-3">
                                                {user?.imageSignature ? (
                                                    <div
                                                        className={cn(
                                                            "border rounded-md p-3 cursor-pointer hover:border-primary transition-colors",
                                                            selectedSignatureFile ? "border-primary bg-primary/5" : "border-gray-200",
                                                        )}
                                                        onClick={handlePresetSignatureSelect}
                                                    >
                                                        <div className="h-24 flex items-center justify-center bg-gray-50 rounded relative">
                                                            <Image
                                                                src={user.imageSignature || "/placeholder.svg"}
                                                                alt="Chữ ký mặc định"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-center mt-2 text-gray-600 font-medium">Chữ ký mặc định</p>
                                                    </div>
                                                ) : (
                                                    <div className="border rounded-md p-3 border-gray-200">
                                                        <div className="h-24 flex items-center justify-center bg-gray-50 rounded">
                                                            <span className="text-sm text-gray-400">Chưa có chữ ký mặc định</span>
                                                        </div>
                                                        <p className="text-xs text-center mt-2 text-gray-400">Vui lòng vẽ hoặc tải lên chữ ký</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        {/* Tab 2: Draw signature */}
                                        <TabsContent value="draw" className="space-y-4">
                                            <SignatureCanvas onSignatureChange={handleSignatureFromCanvas} width={280} height={150} />
                                        </TabsContent>

                                        {/* Tab 3: Upload signature */}
                                        <TabsContent value="upload" className="space-y-4">
                                            <div className="border rounded-md p-4 text-center">
                                                {selectedSignatureUrl && activeTab === "upload" ? (
                                                    <div className="space-y-3">
                                                        <div className="h-32 flex items-center justify-center bg-gray-50 rounded relative">
                                                            <Image
                                                                src={selectedSignatureUrl || "/placeholder.svg"}
                                                                alt="Uploaded signature"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedSignatureFile(null)
                                                                setSelectedSignatureUrl(null)
                                                            }}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="h-32 flex flex-col items-center justify-center bg-gray-50 rounded border border-dashed">
                                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                            <p className="text-sm text-gray-600">Kéo thả hoặc nhấp để tải lên</p>
                                                            <p className="text-xs text-gray-400">PNG, JPG (tối đa 2MB)</p>
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                accept="image/*"
                                                                onChange={handleFileUpload}
                                                            />
                                                            <Button variant="outline" size="sm" className="w-full">
                                                                Chọn file
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t bg-gradient-to-r from-gray-50 to-white">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                {/* Verification Status */}
                                <div className="flex items-center gap-3">
                                    {imageSignature?.isVerify ? (
                                        <Badge
                                            variant="default"
                                            className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1.5" />
                                            Chữ ký đã được xác thực
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                            <AlertCircle className="w-3 h-3 mr-1.5" />
                                            Chữ ký chưa được xác thực
                                        </Badge>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetSignature}
                                        className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Làm mới
                                    </Button>

                                    <Button
                                        size="sm"
                                        onClick={applySignature}
                                        disabled={!(selectedSignatureFile || signatureFile)}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Xác nhận chữ ký
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onOpenChange(false)}
                                        className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Đóng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
