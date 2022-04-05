/* 
  请求参数类型配置
*/

/* 
  webscoket
*/
export interface connectSocket {
  groupName: string;
  scene: string;
  callBack?: (...any: any[]) => void;
}

/* 
  admin-controller
*/
export interface choiceAdmin {
  adminId: string;
}

export interface deleteAdmin {
  adminId: string;
}

export interface registerAdmin {
  adminName: string;
  password: string;
}

export interface updateAdminNameAndPassword {
  password: string;
  adminName: string;
  adminId: string;
}

/* 
  group-controller
*/
export interface adminCreateGroup {
  adminCreated: Boolean;
  adminId: string;
  creatorId: string | null;
  groupName: string;
  maxCount: number;
}

export type choiceManagePrivateGroup = number;

export interface createGroup {
  adminCreated: Boolean;
  groupName: string;
  creatorId: number; // 创建者的userId
  adminId: number;
  maxCount: number;
}

export interface dismissGroup {
  groupId: string;
}

export interface giveUpManage {
  groupId: string;
}

export interface joinGroup {
  groupId: string;
  userId: string;
}

export interface kickUser {
  userId: string;
}

export interface getGroupListWithAdmin {
  adminId: string;
}

export interface getMemberList {
  groupId: string;
}

export interface getMyPublicGroupList {
  adminId: string;
}

export interface adminCreatePublicGroup {
  adminId: number;
  groupName: string;
  maxCount: number;
}

export interface dismissPublicGroup {
  groupId: string;
}

export interface quitGroup {
  userId: string;
}

export type removeGroup = number;

export interface updateGroup {
  groupId: string;
  groupName: string;
  creatorId: string;
  adminId: string;
  maxCount: number;
}

/* 
  session-controller
*/
export interface adminLogin {
  password: string;
  serverCode: string;
  loginName: string;
}

export interface userLogin {
  password: string;
  serverCode: string;
  loginName: string;
}

/* 
  user-controller
*/
export interface choiceUserToManage {
  groupId: string;
  userId: string;
}

export interface completelyDeleteUser {
  userId: string;
}

export interface giveUpManageUser {
  userId: string;
  groupId: string;
}

export interface getUserListWithAdmin {
  adminId: string;
}

export interface getUserListWithoutAdmin {}

export interface logicalDeleteUser {
  userId: string;
}

export interface recoverUser {
  userId: string;
}

export interface registerUser {
  userName: string;
  password: string;
  adminId: string;
}

export interface updateUserNameAndPassword {
  password: string;
  userName: string;
  userId: string;
}
