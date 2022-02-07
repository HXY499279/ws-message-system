/* 
  请求参数类型配置
*/

/* 
  webscoket
*/
export interface connectSocket {
  groupName: string;
  adminId: string | number;
  callBack?: () => void;
}

/* 
  session-controller
*/
export interface userLogin {
  password: string;
  serverCode: string;
  userName: string;
}

/* 
  user-controller
*/
export interface register {
  userName: string;
  password: string;
  adminId: string;
}
export interface updateNameAndPassword {
  password: string;
  userName: string;
  userId: string;
}
export type recoverUsers = string[];

export type logicalDeleteUser = number;

export type completelyDeleteUser = number;

/* 
  group-controller
*/
export interface createGroup {
  groupName: string;
  creatorId: number; // 创建者的userId
  adminId: number;
  maxCount: number;
}

export interface joinGroup {
  groupId: string;
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

export interface getListMembers {
  groupId: string;
}

export interface quitGroup {
  userId: string;
}
/* 
  admin-controller
*/
export interface getAdminList {}
