/* 
  请求url配置
*/
// 引入请求方法
import { httpReq } from "./httpReq";
// 引入参数类型
import {
  connectSocket,
  userLogin,
  register,
  updateNameAndPassword,
  logicalDeleteUser,
  completelyDeleteUser,
  recoverUsers,
  createGroup,
  joinGroup,
  removeGroup,
  updateGroup,
  getListMembers,
  quitGroup,
} from "./params";
import SocketConnect from "./websocket";

class HttpUtil {
  // websocket连接模块
  connectSocket = (params:connectSocket) =>
    new SocketConnect(params.groupName,
      `groupName=${params.groupName}`, params.callBack
    );

  // session-controller模块
  getSessionInfo = () => httpReq("get", "/session/getSessionInfo");
  getVerifyCode = () => httpReq("get", "/session/getVerifyCode", null, "blob");
  logout = () => httpReq("delete", "/session/logout");
  userLogin = (params: userLogin) =>
    httpReq("post", "/session/userLogin", params);

  // user-controller模块
  register = (params: register) => httpReq("post", "/user/register", params);
  updateNameAndPassword = (params: updateNameAndPassword) =>
    httpReq("put", "/user/updateNameAndPassword", params);
  logicalDeleteUser = (params: logicalDeleteUser) =>
    httpReq("delete", `/user/logicalDeleteUser/${params}`);
  completelyDeleteUser = (params: completelyDeleteUser) =>
    httpReq("delete", `/user/completelyDeleteUser/${params}`);
  recoverUsers = (params: recoverUsers) =>
    httpReq("put", "/user/recover", params);

  // group-controller模块
  createGroup = (params: createGroup) =>
    httpReq("post", "/group/create", params);
  removeGroup = (params: removeGroup) =>
    httpReq("delete", `/group/remove${params}`);
  joinGroup = (params: joinGroup) => httpReq("post", "/group/join", params);
  getGroupList = () => httpReq("get", "/group/list");
  updateGroup = (params: updateGroup) =>
    httpReq("put", "/group/update", params);
  getListMembers = (params: getListMembers) =>
    httpReq("get", `/group/listMembers/${params.groupId}`);
  quitGroup = (params: quitGroup) =>
    httpReq("delete", `/group/quit/${params.userId}`);

  // admin-controller模块
  getAdminList = () => httpReq("get", "/admin/list");
}

export default new HttpUtil();
