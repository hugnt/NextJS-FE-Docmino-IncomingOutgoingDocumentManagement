export enum GroupRole {
    Member = 0,
    Leader = 1
}

export type MemberInfo = {
    userId: string;
    groupRole: GroupRole;
    fullname: string;
    departmentName: string;
};

export type Group = {
    id: string;
    name: string;
    members?: MemberInfo[];
};

export type GroupRequest = {
    id: string;
    name: string;
    members?: MemberInfo[];
};

export const defaultGroup: Group = {
    id: "",
    name: "",
    members: [],
};

export const getLeaders = (members: MemberInfo[] = []): MemberInfo[] => {
  return members.filter((member) => member.groupRole === GroupRole.Leader)
}

export const getRegularMembers = (members: MemberInfo[] = []): MemberInfo[] => {
  return members.filter((member) => member.groupRole === GroupRole.Member)
}