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
export interface deleteAdmin {
  adminId: string;
}

export interface registerAdmin {
  adminName: string;
  password: string;
}

/* 
  group-controller
*/
export interface createGroup {
  groupName: string;
  creatorId: number; // 创建者的userId
  adminId: number;
  maxCount: number;
}

export interface dismissGroup {
  groupId: string;
}

export interface joinGroup {
  groupId: string;
  userId: string;
}

export interface kickUser {
  userId: string;
}

export interface getGroupList {
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
export type completelyDeleteUser = {
  userId: string;
};

export type getUserList = {
  adminId: string;
};

export type logicalDeleteUser = {
  userId: string;
};

export type recoverUsers = string[];

export interface registerUser {
  userName: string;
  password: string;
  adminId: string;
}

export interface updateNameAndPassword {
  password: string;
  userName: string;
  userId: string;
}



