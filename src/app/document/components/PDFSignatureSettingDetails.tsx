"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ProcessDetail, ProcessSignDetail } from "@/types/ConfirmProcess"
import { getReviewerTypeName, isUserCanAddSignature } from "@/types/Document"
import { DocumentFile } from "@/types/DocumentFile"
import interact from "interactjs"
import { ChevronLeft, ChevronRight, RotateCw, Save, X, ZoomIn, ZoomOut } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

type SignatureInfo = {
    processDetailId?: string
    stepNumber?: number
    reviewerName?: string
    type?: string
    page?: number
    translateX?: number
    translateY?: number,
    width?: number
    height?: number
    isSetup?: boolean,
    dx?: number
    dy?: number
}

interface PDFSignatureSettingDetailsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file?: DocumentFile
    onSave: (processDetails?: ProcessDetail[], isReset?: boolean) => void
    processDetails?: ProcessDetail[] | null,
}


export default function PDFSignatureSettingDetails({
    open,
    onOpenChange,
    file,
    onSave,
    processDetails,
}: PDFSignatureSettingDetailsProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)

    const signerInfors = useMemo(() => {
        if (processDetails && processDetails.length > 0) {
            const res: SignatureInfo[] = [];
           
            for (const process of processDetails) {
                if (!isUserCanAddSignature(process.signType)) {
                    continue;
                }
                
                const signature: SignatureInfo = {
                    processDetailId: process?.id ?? "",
                    stepNumber: process.stepNumber,
                    reviewerName: process.reviewerName,
                    type: getReviewerTypeName(process.reviewerType),
                    page: 1,
                    translateX: 0,
                    translateY: 0,
                    dx: 0,
                    dy: 0,
                    isSetup: false,
                }
                if (process.signDetails != undefined && processDetails != null && process.signDetails.length > 0) {
                    for (const signDetail of process.signDetails) {
                        if (signDetail.fileId === file?.id) {
                            signature.page = signDetail.signPage || 1;
                            signature.translateX = signDetail.translateX;
                            signature.translateY = signDetail.translateY;
                            signature.dx = signDetail.posX || 0;
                            signature.dy = signDetail.posY || 0;
                            signature.width = signDetail.signZoneWidth || 0;
                            signature.height = signDetail.signZoneHeight || 0;
                            signature.isSetup = true;
                        }
                    }
                }
                res.push(signature);
            }
            return res;
        }
        return [];
    }, [processDetails, file]);

    // Setup the interact.js
    useEffect(() => {
        if (!open){
            setPageNumber(1);
            setScale(1.0);
            return;
        };

        document.querySelectorAll('.can-drop').forEach((el) => {
            const pageAttr = el.getAttribute('data-page');
            if (pageAttr === pageNumber.toString()) {
                (el as HTMLElement).style.visibility = '';
            } else {
                (el as HTMLElement).style.visibility = 'hidden';
            }
        });

        // Setup dropzone (the PDF area)
        const dropzone = interact('.dropzone')
            .dropzone({
                accept: '.drag-drop',
                overlap: 1,
                ondropactivate: function (event) {
                    event.relatedTarget.classList.add('drop-active');
                },
                ondropdeactivate: function (event) {
                    event.relatedTarget.classList.remove('drop-active');
                    event.target.classList.remove('drop-target');
                },
                ondragenter: function (event) {
                    const dropzoneElement = event.target;
                    const draggableElement = event.relatedTarget;

                    dropzoneElement.classList.add('drop-target');
                    draggableElement.classList.add('can-drop');
                },
                ondragleave: function (event) {
                    console.log("Drop leave");
                    event.relatedTarget.classList.remove('can-drop');
                    event.target.classList.remove('drop-target');
                },
                ondrop: function (event) {
                    const target = event.target;
                    const dropzoneRect = target.getBoundingClientRect();
                    const elementRect = event.relatedTarget.getBoundingClientRect();

                    // Calculate position relative to the dropzone
                    let x = elementRect.left - dropzoneRect.left;
                    let y = elementRect.top - dropzoneRect.top;

                    const marginTop = parseFloat(event.relatedTarget.style.marginTop.replace("px", "")) || 0;
                    if (marginTop > 0) {
                        const currentTranslate = getTranslateXYFromString(event.relatedTarget.style.transform);
                        event.relatedTarget.style.marginTop = "0px";
                        const newX = currentTranslate.x;
                        const newY = currentTranslate.y + marginTop;
                        event.relatedTarget.style.transform = `translate(${newX}px, ${newY}px)`;
                        event.relatedTarget.setAttribute('data-x', newX)
                        event.relatedTarget.setAttribute('data-y', newY)
                    }
                    // Ensure the position is within bounds
                    x = Math.max(x, 0);
                    y = Math.max(y, 0);

                    event.relatedTarget.setAttribute('data-dx', x)
                    event.relatedTarget.setAttribute('data-dy', y)
                    event.relatedTarget.setAttribute('data-page', pageNumber.toString())
                    console.log(`Dropped at: ${x}, ${y} on page ${pageNumber}`);
                },

            });

        // Setup draggable signature elements
        const draggable = interact('.drag-drop')
            .draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: '#selectorContainer',
                        endOnly: true
                    })
                ],
                autoScroll: true,
                listeners: {
                    start: (event) => {
                        const target = event.target as HTMLElement;
                        target.classList.add('absolute');
                    },
                    move: (event) => {
                        const target = event.target as HTMLElement;
                        const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy;

                        // Update the element's position
                        target.style.transform = `translate(${x}px, ${y}px)`;

                        // Store the position
                        // target.style.marginTop = "0px";
                        target.setAttribute('data-x', x.toString());
                        target.setAttribute('data-y', y.toString());

                        //css
                        document.querySelectorAll('.dropzone').forEach((el) => {
                            (el as HTMLElement).style.border = "dashed 2px #29e";
                        });
                    },
                    end: (event) => {
                        const target = event.target as HTMLElement;
                        if (!target.classList.contains('can-drop')) {
                            // target.style.marginTop = "0px";
                            target.classList.remove('absolute');
                            target.style.transform = ``;
                            target.setAttribute('data-x', '0');
                            target.setAttribute('data-y', '0');
                            target.setAttribute('data-dx', '-1');
                            target.setAttribute('data-dy', '-1');

                        }
                    }
                }
            }).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move: (event) => {
                        const target = event.target as HTMLElement;
                        let x = (parseFloat(target.getAttribute('data-x') || '0') || 0);
                        let y = (parseFloat(target.getAttribute('data-y') || '0') || 0);

                        // Update the element's dimensions
                        target.style.width = `${event.rect.width}px`;
                        target.style.height = `${event.rect.height}px`;

                        // Update position if resizing from top or left
                        // Fix the deltaRect property access
                        const deltaRect = event.deltaRect || { left: 0, top: 0 };
                        x += deltaRect.left;
                        y += deltaRect.top;

                        target.style.transform = `translate(${x}px, ${y}px)`;

                        target.setAttribute('data-x', x.toString());
                        target.setAttribute('data-y', y.toString());
                    }
                },
                modifiers: [
                    interact.modifiers.restrictEdges({
                        outer: '#selectorContainer'
                    }),
                    interact.modifiers.restrictSize({
                        min: { width: 100, height: 50 }
                    })
                ],
                inertia: true
            })
            .on('dragend', function () {
                const dropzones = document.querySelectorAll('.dropzone');
                dropzones.forEach((el) => {
                    (el as HTMLElement).style.border = "dashed 2px transparent";
                });
                // (event.target as HTMLElement).style.border = "solid 2px #d4d4d7";
            });;

        // Clean up
        return () => {
            dropzone.unset();
            draggable.unset();
        };
    }, [open, pageNumber]);


    const fileUrl = useMemo(() => {
        if (file?.fileUrl) {
            return file.fileUrl;
        }
        else if (file?.file) {
            return file.file;
        }
        // Fallback to a sample PDF for testing
        return "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
    }, [file]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const handlePageChange = (pageNumber: number) => {

        setPageNumber(pageNumber);
    }

    const handleFinish = () => {
        const signatures = document.querySelectorAll('.drag-drop.can-drop');
        // if (signatures.length !== signerInfors.length) {
        //     toastClientError("Thiết lập chữ kí thất bại", "Vui lòng đặt đủ chữ ký cho các cấp duyệt.");
        //     return;
        // }
        const signatureData = Array.from(signatures).map(sig => {
            const element = sig as HTMLElement;
            return {
                id: element.id || "",
                dX: parseFloat(element.getAttribute('data-dx') || '0'),
                dY: parseFloat(element.getAttribute('data-dy') || '0'),
                translateX: parseFloat(element.getAttribute('data-x') || '0'),
                translateY: parseFloat(element.getAttribute('data-y') || '0'),
                pageNumber: parseInt(element.getAttribute('data-page') || '1'),
                stepNumber: parseInt(element.getAttribute('data-step') || '1'),
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        });

        const updatedData = processDetails?.map((process) => {
            const signature = signatureData.find(sig => sig.stepNumber === process.stepNumber);
            if (signature && isUserCanAddSignature(process.signType)) {
                const signDetails: ProcessSignDetail[] = [];
                const otherSignDetails: ProcessSignDetail[] = [];
                if (process.signDetails && process.signDetails.length > 0) {
                    for (const item of process.signDetails) {
                        if (item.fileId !== file?.id) {
                            otherSignDetails.push(item);
                        }
                    }
                }
                signDetails.push({
                    fileIndex: file?.fileIndex || 0,
                    fileId: file?.id || "",
                    posX: signature.dX,
                    posY: signature.dY,
                    signPage: signature.pageNumber,
                    translateX: signature.translateX,
                    translateY: signature.translateY,
                    signZoneWidth: signature.width,
                    signZoneHeight: signature.height
                });
                const res: ProcessDetail = {
                    ...process,
                    signDetails: [...otherSignDetails, ...signDetails],
                };
                return res;
            }
            return process;
        })

        console.log("signature data:", updatedData);
        onSave(updatedData);
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget as HTMLDivElement;
        const scrollTop = target.scrollTop;
        // Lấy tất cả các element drag-drop KHÔNG đang được kéo
        const elements = target.querySelectorAll<HTMLDivElement>('.drag-drop:not(.can-drop)');
        elements.forEach((el, idx) => {
            if (idx === 0) {
                el.style.marginTop = `${scrollTop}px`;
            } else {
                el.style.marginTop = `0px`;
            }
        });

        const elementsIn = target.querySelectorAll<HTMLDivElement>('.drag-drop.can-drop');
        elementsIn.forEach((el) => {
            el.style.marginTop = `${0}px`;
        });

    };

    const refreshPdfViewer = () => {
        const elementsIn = document.querySelectorAll<HTMLDivElement>('.drag-drop.can-drop');
        elementsIn.forEach((el) => {
            el.classList.remove('absolute');
            el.classList.remove('can-drop');
            el.style.transform = ``;
            el.setAttribute('data-x', '0');
            el.setAttribute('data-y', '0');
            el.setAttribute('data-dx', '-1');
            el.setAttribute('data-dy', '-1');
        });
        const updatedData = processDetails?.map((process) => {
            const otherSignDetails: ProcessSignDetail[] = [];
            if (process.signDetails && process.signDetails.length > 0) {
                for (const item of process.signDetails) {
                    if (item.fileId !== file?.id) {
                        otherSignDetails.push(item);
                    }
                }
            }
            onSave(processDetails);
            return {
                ...process,
                signDetails: otherSignDetails,
            };
        })
        onSave(updatedData, true);
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="[&>button]:hidden sm:max-w-[1000px] p-0 border-0 h-[85vh] overflow-hidden rounded-lg shadow-lg flex flex-col"
                onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="py-2 px-4 bg-primary border-0 rounded-t-lg flex flex-row items-center justify-between shrink-0">
                    <div>
                        <DialogTitle className="text-white font-medium m-0 flex items-center gap-2">
                            <span>Thiết lập trình kí văn bản</span>
                            {fileUrl && (
                                <>
                                    <Separator orientation="vertical" className="h-4 bg-white/30" />
                                    <span className="text-xs font-normal opacity-90 truncate max-w-[300px]">
                                        {typeof fileUrl === "string"
                                            ? fileUrl.split("/").pop()
                                            : file instanceof File
                                                ? file.name
                                                : ""}
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

                <div className="flex flex-col flex-1 bg-neutral-100 overflow-hidden" >
                    {/* Navigation bar */}
                    <div className="sticky flex items-center justify-between p-2 w-full border-b mb-1 bg-white shadow-sm shrink-0 z-10">
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePageChange(Math.max(pageNumber - 1, 1))}
                                disabled={pageNumber <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePageChange(Math.min(pageNumber + 1, numPages || 1))}
                                disabled={numPages ? pageNumber >= numPages : true}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium px-2">
                                Trang <span className="font-semibold">{pageNumber}</span> / <span>{numPages || "-"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <div className="text-xs font-medium px-2 w-16 text-center">{Math.round(scale * 100)}%</div>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.0))}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="px-3 flex-1 overflow-hidden">
                        <div id="selectorContainer"
                            className="relative flex gap-3 h-full overflow-auto" onScroll={handleScroll}>
                            <div className={cn("flex-1", "w-[calc(100%-20rem)]")}>
                                <div className=" bg-white rounded-md shadow-sm p-1 min-h-[500px] flex items-center justify-center">
                                    <div className="overflow-hidden relative rounded-md w-full h-full flex items-center justify-center">
                                        <Document
                                            file={fileUrl}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            loading={<div className="p-8 text-center text-neutral-500 animate-pulse">Đang tải PDF...</div>}
                                            error={<div className="p-8 text-center text-red-500">
                                                Không thể tải file PDF. Vui lòng kiểm tra lại đường dẫn.
                                            </div>}>
                                            <Page
                                                pageNumber={pageNumber}
                                                className="mx-auto dropzone"
                                                renderAnnotationLayer={false}
                                                renderTextLayer={false}
                                                scale={scale}
                                            />
                                        </Document>
                                    </div>
                                </div>
                                {/* Add extra space at the bottom to allow scrolling */}
                                <div className="h-10"></div>
                            </div>

                            <div className="bg-white rounded-md shadow-sm w-80 border flex flex-col top-3 self-start  min-h-[800px]">
                                <div className="border-b p-3 bg-neutral-50 sticky top-0 z-10">
                                    <h3 className="font-medium text-sm text-neutral-800 mb-1">Vị trí chữ ký</h3>
                                    <p className="text-xs text-neutral-600 italic">
                                        Kéo thả các ô theo thứ tự ứng với từng cấp duyệt
                                    </p>
                                </div>
                                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                                    {signerInfors.map((signer) => (
                                        <div key={`${signer.reviewerName}-${signer.stepNumber}-${signer.processDetailId}`}
                                            style={{ transform: `translate(${signer.translateX}px,${signer.translateY}px)`, width: signer.width, height: signer.height }}
                                            data-page={signer.page}
                                            data-dx={signer.dx}
                                            data-dy={signer.dy}
                                            data-x={signer.translateX}
                                            data-y={signer.translateY}
                                            data-step={signer.stepNumber}
                                            className={cn(`drag-drop bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 
                                                        p-3 py-1 rounded-md cursor-move shadow-sm hover:shadow transition-shadow duration-200`,
                                                        signer.isSetup ? "can-drop absolute" : "", signer.isSetup&&signer.page !== pageNumber ? "invisible" : "")}>
                                            <div className="space-y-1">
                                                <Badge variant="outline" className="text-[10px] h-5 bg-white/80 text-blue-700 font-normal">
                                                    {signer.type}
                                                </Badge>
                                                <h4 className="text-sm text-blue-800">[Cấp duyệt {signer.stepNumber}]</h4>
                                                <h4 className="font-medium text-xs text-blue-800">{signer.reviewerName}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t bg-neutral-50 text-xs text-neutral-500 sticky bottom-0 z-10">
                                    Đặt chữ ký vào vị trí phù hợp trên tài liệu
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="py-2 px-4 border-t bg-white shrink-0 mt-auto">
                        <div className="flex gap-2 justify-end">
                            <>
                                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleFinish()}>
                                    <Save className="h-4 w-4 mr-1.5" /> Hoàn thành
                                </Button>
                                <Button variant="outline" size="sm" onClick={refreshPdfViewer}>
                                    <RotateCw className="h-4 w-4 mr-1.5" /> Làm mới
                                </Button>
                            </>
                            <Button variant="destructive" className="text-white" size="sm" onClick={() => onOpenChange(false)}>
                                Đóng
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}


function getTranslateXYFromString(transform: string): { x: number, y: number } {
    const match = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(transform);
    if (match) {
        return {
            x: parseFloat(match[1]),
            y: parseFloat(match[2])
        };
    }
    return { x: 0, y: 0 };
}