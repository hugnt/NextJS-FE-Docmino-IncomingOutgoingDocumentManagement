
import { httpClient } from "@/lib/httpClient";
import { DataFilter } from "@/types/filter";
import { UpdatePasswordRequest, UserDetail, UserLookup, UserRight } from "@/types/User";

const userRequest = {
    updateImageSignature: (body: FormData) => httpClient.patch<string>('user/image-signature', body),
    updateDigitalCertificate: (body: FormData) => httpClient.patch<string>('user/digital-certificate', body),
    updateEmail: (email: string) => httpClient.patch("user/email", { email }),
    updatePassword: (body: UpdatePasswordRequest) => httpClient.patch("user/change-password", body),

    lookupApprover: () => httpClient.get<UserLookup[]>(`user/approver/look-up`),
    getByFilter: (filter?: DataFilter) => httpClient.get<UserDetail[]>('user', { params: filter }),
    getById: (id: string) => httpClient.get<UserDetail>(`user/${id}`),
    create: (body: UserDetail) => httpClient.post('user', body),
    update: (id: string, body: UserDetail) => httpClient.put(`/user/${id}`, body),
    delete: (id: string) => httpClient.delete(`user/${id}`),

    updateRights: (body: {userRights: UserRight[]}) => httpClient.patch(`/user/update-rights`, body),

};

export default userRequest;