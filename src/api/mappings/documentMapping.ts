import { ExternalDocumentDetail } from "@/types/ExternalDocument";
import { InternalDocumentDetail } from "@/types/InternalDocument";

export function createDocumentFormData(
  documentRequest: ExternalDocumentDetail
): FormData {
  const formData = new FormData();

  const docWithoutFile = {
    ...documentRequest,
    documentFiles:
      documentRequest.documentFiles?.map((df) => ({
        id: !df.isNewFile ? df.id : null,
        fileName: df.fileName,
        fileType: df.fileType,
        fileUrl: df.fileUrl,
        fileSize: df.fileSize,
        fileEncoding: df.fileEncoding,
        description: df.description,
      })) ?? [],
  };

  formData.append("documentRequest", JSON.stringify(docWithoutFile));

  documentRequest.documentFiles?.forEach((df) => {
    if (df.file) {
      formData.append("fileRequests", df.file);
    }
  });

  return formData;
}

export function createInternalDocumentFormData(
  documentRequest: InternalDocumentDetail
): FormData {
  const formData = new FormData();

  const docWithoutFile = {
    ...documentRequest,
    documentFiles:
      documentRequest.documentFiles?.map((df) => ({
        id: !df.isNewFile ? df.id : null,
        fileName: df.fileName,
        fileType: df.fileType,
        fileUrl: df.fileUrl,
        fileSize: df.fileSize,
        fileEncoding: df.fileEncoding,
        description: df.description,
      })) ?? [],
  };

  formData.append("documentRequest", JSON.stringify(docWithoutFile));

  documentRequest.documentFiles?.forEach((df) => {
    if (df.file) {
      formData.append("fileRequests", df.file);
    }
  });

  return formData;
}

