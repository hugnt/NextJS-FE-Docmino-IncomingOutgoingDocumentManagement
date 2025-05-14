export enum Role {
    Admin = 0,
    Staff = 1
}

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


export type User = {
    id: string;
    fullname: string;
    username: string;
    email: string;
    role: Role;
};

export type UserRequest = RegisterRequest & {
    id?: string,
    role: Role;
    isCheckPassword?: boolean
};

export const defaultUserRequest: UserRequest = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    role: Role.Staff,
    password: '',
    passwordRetype: '',
    isCheckPassword: true
};

export const defaultUser: User = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    role: Role.Staff,
};

export const testAdminUser: User = {
    id: '0',
    fullname: 'Test User',
    username: 'testuser',
    email: 'test@gmail.com',
    role: Role.Admin,
};
export const testStaffUser: User = {
    id: '0',
    fullname: 'Test User',
    username: 'testuser',
    email: 'test@gmail.com',
    role: Role.Staff,
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
