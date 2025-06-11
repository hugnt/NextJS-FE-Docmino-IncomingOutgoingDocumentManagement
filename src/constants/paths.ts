export const PATH = {
    NotFound: "*",
    UnAuthorize: "/un-authorize",
    Forbidden: "/forbidden",
    Login: '/login',
    Register: '/register',
    Dashboard: '/dashboard',
    Report: '/report',

    DocumentSign: '/document/sign',
    DocumentHistory: '/document/sign/history',
    DocumentExternalIncoming: '/document/external/incoming',
    DocumentExternalOutgoing: '/document/external/outgoing',
    DocumentInternalIncoming: '/document/internal/incoming',
    DocumentInternalOutgoing: '/document/internal/outgoing',

    SystemCategoryDocumentPeriod: '/system-category/document/storage-period',
    SystemCategoryDocumentRegister: '/system-category/document/register',
    SystemCategoryDocumentCategory: '/system-category/document/category',
    SystemCategoryDocumentField: '/system-category/document/fields',
    SystemCategoryDocumentOrganization: '/system-category/document/organization',

    SystemCategoryStorageDossier: '/system-category/storage/dossier',
    SystemCategoryStorageInventory: '/system-category/storage/inventory',
    SystemCategoryStorageSheft: '/system-category/storage/sheft',
    SystemCategoryStorageBox: '/system-category/storage/box',

    SystemCategoryDepartment: '/system-category/department',
    SystemCategoryPosition: '/system-category/position',
    SystemCategoryGroup: '/system-category/group',

    SystemCategorySettingConfigUser: '/settings/users',
    SystemCategorySettingConfigUserRight: '/settings/user-rights',
    SystemCategorySettingConfigConfirmProcess: '/settings/confirm-process',
};

export const PARAM = {
    SHEFT_ID: 'shelf_id',
    BOX_ID: 'box_id',
    INVENROTY_ID: 'inventory_id',
    DOCUMENT_ID: 'document_id',
    DOCUMENT_TYPE: 'document_type',
}