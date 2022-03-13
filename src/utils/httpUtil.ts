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
  deleteAdmin,
  registerAdmin,
  /* 
  group-controller模块
  */
  createGroup,
  dismissGroup,
  joinGroup,
  kickUser,
  getGroupList,
  getMemberList,
  getMyPublicGroupList,
  adminCreatePublicGroup,
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
  completelyDeleteUser,
  getUserList,
  logicalDeleteUser,
  recoverUsers,
  registerUser,
  updateNameAndPassword,
} from "./params";
import SocketConnect from "./websocket";

class HttpUtil {
  /* 
    websocket连接模块
  */
  connectSocket = (params: connectSocket) =>
    new SocketConnect(
      params.groupName,
      `groupName=${params.groupName}`,
      params.scene,
      params.callBack
    );

  /* 
      admin-controller模块
  */
  // 注销管理员账号（管理员）
  deleteAdmin = (params: deleteAdmin) =>
    httpReq("delete", `/admin/delete/${params.adminId}`);
  // 获取管理员列表（管理员）
  getAdminList = () => httpReq("get", "/admin/list");
  // 管理员注册（管理员）
  registerAdmin = (params: registerAdmin) =>
    httpReq("post", "/admin/register", params);

  /* 
      group-controller模块
  */
  //  创建内部分组（用户）（管理员）
  createGroup = (params: createGroup) =>
    httpReq("post", "/group/create", params);
  // 解散分组（用户）
  dismissGroup = (params: dismissGroup) =>
    httpReq("delete", `/group/dismiss/${params.groupId}`);
  // 加入分组（用户）
  joinGroup = (params: joinGroup) => httpReq("post", "/group/join", params);
  // 踢出分组内的成员（用户）
  kickUser = (params: kickUser) =>
    httpReq("delete", `/group/kick/${params.userId}`);
  // 根据管理员id获取分组列表（用户）（管理员）
  getGroupList = (params: getGroupList) =>
    httpReq("get", `/group/list/${params.adminId}`);
  // 获取指定组的成员列表（用户）（管理员）
  getMemberList = (params: getMemberList) =>
    httpReq("get", `/group/listMembers/${params.groupId}`);
  // 获取外部创建的公共分组列表（管理员）
  getOtherPublicGroupList = () => httpReq("get", `/group/public`);
  // 根据管理员id获取他创建的公共分组列表
  getMyPublicGroupList = (params: getMyPublicGroupList) =>
    httpReq("get", `/group/public/${params.adminId}`);
  //管理员创建公共分组（管理员）
  adminCreatePublicGroup = (params: adminCreatePublicGroup) =>
    httpReq("post", `/group/public/create`, params);
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

  /* 
      user-controller模块
  */
  //  彻底删除用户（管理员）
  completelyDeleteUser = (params: completelyDeleteUser) =>
    httpReq("delete", `/user/completelyDeleteUser/${params}`);
  // 根据管理员id展示用户列表（管理员）
  getUserList = (params: getUserList) =>
    httpReq("delete", `/user/list/${params.adminId}`);
  // 逻辑删除用户（用户）（管理员）
  logicalDeleteUser = (params: logicalDeleteUser) =>
    httpReq("delete", `/user/logicalDeleteUser/${params}`);
  // 恢复被逻辑删除的用户（管理员）
  recoverUsers = (params: recoverUsers) =>
    httpReq("put", "/user/recover", params);
  // 注册新用户（用户）
  registerUser = (params: registerUser) =>
    httpReq("post", "/user/register", params);
  // 更改用户名，密码（用户）
  updateNameAndPassword = (params: updateNameAndPassword) =>
    httpReq("put", "/user/updateNameAndPassword", params);
}

export default new HttpUtil();
