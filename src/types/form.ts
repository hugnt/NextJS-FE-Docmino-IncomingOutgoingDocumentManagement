
export enum FormMode {
    NO_ACTION = "",
    VIEW = "Details",
    ADD = "Create",
    EDIT = "Update",
    REDIRECT = "Redirect"
}

export type FormSetting = {
    mode: FormMode,
    open: boolean
}

export const formSettingDefault: FormSetting = {
    mode: FormMode.NO_ACTION,
    open: false
};


export interface ConfirmDialogState<T_id = string> {
    open: boolean;
    id: T_id;
    name: string
}

export const confirmDialogStateDefault: ConfirmDialogState<string> = {
    open: false,
    id: '',
    name: ''
};

export const confirmDialogStateDefaultInt: ConfirmDialogState<number> = {
    open: false,
    id: 0,
    name: ''
};

