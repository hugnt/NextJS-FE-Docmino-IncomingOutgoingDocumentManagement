export enum Role {
    Admin = 1,
    ClericalAssistant = 2,
    Approver = 3,
}

export const AllRoles: Role[] = [
    Role.Admin,
    Role.ClericalAssistant,
    Role.Approver,
];


export type RegisterRequest = {
    fullname: string;
    email: string;
    username: string;
    password?: string;
    passwordRetype?: string,
    isCheckPassword?: boolean
};

export type LoginRequest = {
    username: string;
    password: string;
};

export type LogoutRequest = {
    refreshToken: string;
};


export type ExtendSessionRequest = {
    refreshToken: string;
};

export type UpdatePasswordRequest = {
    oldPassword: string;
    newPassword: string;
};

export type UserLookup = {
    id: string;
    name: string;
    departmentName?: string | null;
}

export type User = {
    id: string;
    fullname: string;
    username: string;
    email: string;
    roleId: Role;
    roleName: string;
    positionName?: string | null;
    departmentName?: string | null;
    digitalCertificate?: string;
    walletAddress?: string;
    imageSignature?: string;

    createIncomingDocumentRight: boolean;
    createOutgoingDocumentRight: boolean;
    createInternalDocumentRight: boolean;
    initialConfirmProcessRight: boolean;
    processManagerRight: boolean;
    storeDocumentRight: boolean;
    manageCategories: boolean;

    groups?: string[];
};

export type UserDetail = {
    id: string; // Guid => string
    username: string;
    fullname: string;
    email: string;
    roleId: number;
    roleName: string;
    positionId: number;
    positionName?: string | null;
    departmentName?: string | null;

    password?: string;

    createIncomingDocumentRight: boolean;
    createOutgoingDocumentRight: boolean;
    createInternalDocumentRight: boolean;
    initialConfirmProcessRight: boolean;
    processManagerRight: boolean;
    storeDocumentRight: boolean;
    manageCategories: boolean;
    isDeleted: boolean;
};

export type UserRight = {
    id: string; // Guid => string
    createIncomingDocumentRight: boolean;
    createOutgoingDocumentRight: boolean;
    createInternalDocumentRight: boolean;
    initialConfirmProcessRight: boolean;
    processManagerRight: boolean;
    storeDocumentRight: boolean;
    manageCategories: boolean;
};

export const defaultUserDetail: UserDetail = {
    id: '',
    username: '',
    fullname: '',
    email: '',
    roleId: Role.Approver,
    roleName: '',
    positionId: 0,
    positionName: null,
    departmentName: null,

    createIncomingDocumentRight: false,
    createOutgoingDocumentRight: false,
    createInternalDocumentRight: false,
    initialConfirmProcessRight: false,
    processManagerRight: false,
    storeDocumentRight: false,
    manageCategories: false,
    isDeleted: false
};

export type UserRequest = RegisterRequest & {
    id?: string,
    roleId: Role;
    isCheckPassword?: boolean
};

export const defaultUserRequest: UserRequest = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    roleId: Role.Approver,
    password: '',
    passwordRetype: '',
    isCheckPassword: true
};

export const defaultUser: User = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    roleName: 'Người duyệt & ký [test]',
    roleId: Role.Approver,
    createIncomingDocumentRight: false,
    createOutgoingDocumentRight: false,
    createInternalDocumentRight: false,
    initialConfirmProcessRight: false,
    processManagerRight: false,
    storeDocumentRight: false,
    manageCategories: false,
};

export const testAdminUser: User = {
    id: '0',
    fullname: 'Test User',
    username: 'testuser',
    email: 'test@gmail.com',
    roleName: 'Admin [test]',
    roleId: Role.Admin,
    createIncomingDocumentRight: true,
    createOutgoingDocumentRight: true,
    createInternalDocumentRight: true,
    initialConfirmProcessRight: true,
    processManagerRight: true,
    storeDocumentRight: true,
    manageCategories: true,
};
export const testStaffUser: User = {
    id: '0',
    fullname: 'Test User',
    username: 'testuser',
    email: 'test@gmail.com',
    roleName: 'Người duyệt & ký [test]',
    roleId: Role.Approver,
    createIncomingDocumentRight: false,
    createOutgoingDocumentRight: false,
    createInternalDocumentRight: false,
    initialConfirmProcessRight: false,
    processManagerRight: false,
    storeDocumentRight: false,
    manageCategories: false,
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
};

export type Token = {
    accessToken?: string;
    refreshToken?: string;
};

export type AuditLog = {
    userId?: string;
    fullname?: string;
    role?: Role;
    action?: string;
    entityName?: string;
    entityId?: string;
    oldValues?: string;
    newValues?: string;
    createdAt?: Date;
}
