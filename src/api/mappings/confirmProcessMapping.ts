import { ApproveDocumentRequest } from "@/types/ConfirmProcess";

export function createApprovalFormData(request: ApproveDocumentRequest): FormData {
    const formData = new FormData();

    if (request.digitalSignaturePassword) {
        formData.append('DigitalSignaturePassword', request.digitalSignaturePassword);
    }
    if (request.comment) {
        formData.append('Comment', request.comment);
    }
    if (request.imageSignatures) {
        request.imageSignatures.forEach((signature, index) => {
            formData.append(`ImageSignatures[${index}].FileId`, signature?.fileId??"");
            if (signature.image) {
                formData.append(`ImageSignatures[${index}].Image`, signature.image);
            }
        });
    }

    return formData;
}