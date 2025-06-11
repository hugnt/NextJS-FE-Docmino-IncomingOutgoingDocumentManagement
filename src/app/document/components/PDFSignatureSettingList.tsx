import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DocumentFile } from '@/types/DocumentFile';
import { FilePen } from 'lucide-react';

interface PDFSignatureSettingListProps {
    pdfFiles: DocumentFile[];
    readOnly?: boolean;
    loading?: boolean;
    handleSetPDFSignature: (file: DocumentFile) => void;
}

export default function PDFSignatureSettingList(props: PDFSignatureSettingListProps) {
    const { pdfFiles, readOnly, loading = false, handleSetPDFSignature } = props;
    return (
        <div className="col-span-2 p-6 px-0 space-y-0 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between px-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Thiết lập chữ ký
                </h2>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
                        <TableCell className="w-[50px] text-center font-medium">No.</TableCell>
                        <TableHead className="font-medium">Tên tệp</TableHead>
                        <TableHead className="w-[100px] text-center font-medium">
                            {loading ? <span className="animate-pulse">Đang tải...</span> : "Thao tác"}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='border-b'>
                    {pdfFiles!.map((file, i) => (
                        <TableRow key={file.id} className="hover:bg-muted/10">
                            <TableCell className="text-center font-medium text-muted-foreground">{i + 1}</TableCell>
                            <TableCell>
                                <span className="text-sm truncate max-w-[200px]" title={file.fileName}>
                                    {file.fileName}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-1">
                                    <Button
                                        disabled={readOnly}
                                        onClick={() => handleSetPDFSignature(file)}
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-primary hover:text-primary/90 hover:bg-primary/10"
                                        title="Thiết lập chữ ký">
                                        <FilePen size={16} />
                                    </Button>

                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
