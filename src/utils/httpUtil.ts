/* 
  请求url配置
*/
// 引入请求方法
import { httpReq } from "./httpReq";
// 引入参数类型
import {
  /* 
    websocket连接模块
  */
  connectSocket,
  /* 
      admin-controller模块
  */
  choiceAdmin,
  deleteAdmin,
  registerAdmin,
  updateAdminNameAndPassword,
  /* 
  group-controller模块
  */
  adminCreateGroup,
  choiceManagePrivateGroup,
  createGroup,
  dismissGroup,
  giveUpManage,
  joinGroup,
  kickUser,
  getGroupListWithAdmin,
  getMemberList,
  getMyPublicGroupList,
  adminCreatePublicGroup,
  dismissPublicGroup,
  quitGroup,
  removeGroup,
  updateGroup,
  /* 
     session-controller模块
  */
  adminLogin,
  userLogin,
  /* 
     user-controller模块
  */
  choiceUserToManage,
  completelyDeleteUser,
  giveUpManageUser,
  getUserListWithAdmin,
  getUserListWithoutAdmin,
  logicalDeleteUser,
  recoverUser,
  registerUser,
  updateUserNameAndPassword,
} from "./params";
import SocketConnect from "./websocket";

class HttpUtil {
  /* 
    websocket连接模块
  */
  connectSocket = (params: connectSocket) =>
    new SocketConnect(
      params.groupName,
      params.groupName,
      params.scene,
      params.callBack
    );

  /* 
      admin-controller模块
  */
  // 选择管理员（用户）
  choiceAdmin = (params: choiceAdmin) =>
    httpReq("post", `/admin/choice/${params.adminId}`);
  // 注销管理员账号（管理员）
  deleteAdmin = (params: deleteAdmin) =>
    httpReq("delete", `/admin/delete/${params.adminId}`);
  // 获取管理员列表（管理员）
  getAdminList = () => httpReq("get", "/admin/list");
  // 管理员注册（管理员）
  registerAdmin = (params: registerAdmin) =>
    httpReq("post", "/admin/register", params);
  // 更改管理员的用户名与密码（管理员）
  updateAdminNameAndPassword = (params: updateAdminNameAndPassword) =>
    httpReq("put", "/admin/updateNameAndPassword", params);

  /* 
      group-controller模块
  */
  //  创建内部分组（用户）（管理员）
  adminCreateGroup = (params: adminCreateGroup) =>
    httpReq("post", "/group/adminCreate", params);
  // 选择一个私有分组进行管理(管理员)
  choiceManagePrivateGroup = (params: choiceManagePrivateGroup) =>
    httpReq("post", `/group/choiceManagePrivateGroup/${params}`);
  //  创建内部分组（用户）（管理员）
  createGroup = (params: createGroup) =>
    httpReq("post", "/group/create", params);
  // 解散分组（用户）
  dismissGroup = (params: dismissGroup) =>
    httpReq("delete", `/group/dismiss/${params.groupId}`);
  // 管理员放弃管理私有分组(管理员)
  giveUpManagePrivateGroup = (params: giveUpManage) =>
    httpReq("delete", `/group/giveUpManage/${params.groupId}`);
  // 加入分组（用户）
  joinGroup = (params: joinGroup) => httpReq("post", "/group/join", params);
  // 踢出分组内的成员（用户）
  kickUser = (params: kickUser) =>
    httpReq("delete", `/group/kick/${params.userId}`);
  // 根据管理员id获取分组列表（用户）（管理员）
  getGroupListWithAdmin = (params: getGroupListWithAdmin) =>
    httpReq("get", `/group/list/${params.adminId}`);
  // 获取未指定管理员的私有分组列表（管理员）
  getGroupListWithoutAdmin = () => httpReq("get", `/group/list/withoutAdmin`);
  // 获取指定组的成员列表（用户）（管理员）
  getMemberList = (params: getMemberList) =>
    httpReq("get", `/group/listMembers/${params.groupId}`);
  // 获取外部创建的公共分组列表（管理员）
  getOutsidePublicGroupList = () => httpReq("get", `/group/public/outside`);
  // 根据管理员id获取他创建的公共分组列表
  getMyPublicGroupList = (params: getMyPublicGroupList) =>
    httpReq("get", `/group/public/${params.adminId}`);
  //管理员创建公共分组（管理员）
  adminCreatePublicGroup = (params: adminCreatePublicGroup) =>
    httpReq("post", `/group/public/create`, params);
  // 解散公共分组（管理员）（外部调用）
  dismissPublicGroup = (params: dismissPublicGroup) =>
    httpReq("delete", `/group/public/dismiss/${params.groupId}`);
  // 退出分组（用户）
  quitGroup = (params: quitGroup) =>
    httpReq("delete", `/group/quit/${params.userId}`);
  //  删除分组（用户）（管理员）
  removeGroup = (params: removeGroup) =>
    httpReq("delete", `/group/remove/${params}`);
  //  修改分组信息（用户）（管理员）
  updateGroup = (params: updateGroup) =>
    httpReq("put", "/group/update", params);

  /* 
      session-controller模块
  */
  //  管理员登陆（管理员）
  adminLogin = (params: adminLogin) =>
    httpReq("post", "/session/adminLogin", params);
  // 获取当前会话的信息（用户）（管理员）
  getSessionInfo = () => httpReq("get", "/session/getSessionInfo");
  // 生成验证码（用户）（管理员）
  getVerifyCode = () => httpReq("get", "/session/getVerifyCode", null, "blob");
  // 移除sessionInfo中的分组信息（用户）
  deleteMyGroup = () => httpReq("delete", "/session/group");
  // 登出，销毁当前会话（用户）（管理员）
  logout = () => httpReq("delete", "/session/logout");
  // 用户登录（用户）
  userLogin = (params: userLogin) =>
    httpReq("post", "/session/userLogin", params);
  // 移除管理员信息
  deleteMyAdmin = () => httpReq("delete", "/session/admin");


  /* 
      user-controller模块
  */
  // 管理员选择一个未指定管理员的用户进行管理(管理员)
  choiceUserToManage = (params: choiceUserToManage) =>
    httpReq("post", "/user/choiceUserToManage", params);
  // 彻底删除用户（管理员）
  completelyDeleteUser = (params: completelyDeleteUser) =>
    httpReq("delete", `/user/completelyDeleteUser/${params.userId}`);
  // 管理员放弃管理用户(管理员)
  giveUpManageUser = (params: giveUpManageUser) =>
    httpReq("delete", `/user/giveUpManage/${params.userId}&${params.groupId}`);
  // 根据管理员id展示用户列表（管理员）
  getUserListWithAdmin = (params: getUserListWithAdmin) =>
    httpReq("get", `/user/list/${params.adminId}`);
  // 展示未指定管理员的用户列表
  getUserListWithoutAdmin = () => httpReq("get", `/user/listWithoutAdmin`);
  // 逻辑删除用户（用户）（管理员）
  logicalDeleteUser = (params: logicalDeleteUser) =>
    httpReq("delete", `/user/logicalDeleteUser/${params.userId}`);
  // 恢复被逻辑删除的用户（管理员）
  recoverUser = (params: recoverUser) =>
    httpReq("put", `/user/recover/${params.userId}`);
  // 注册新用户（用户）
  registerUser = (params: registerUser) =>
    httpReq("post", "/user/register", params);
  // 更改用户名，密码（用户）
  updateUserNameAndPassword = (params: updateUserNameAndPassword) =>
    httpReq("put", "/user/updateNameAndPassword", params);
}

export default new HttpUtil();
