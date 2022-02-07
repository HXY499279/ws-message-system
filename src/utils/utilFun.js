import httpUtil from "./httpUtil";
/* 
  获取用户的个人信息，所属分组信息，管理员信息，并将其存入sessionStorage中，
  再次调用该方法可用于更新
*/
export const UTIL_getUserInfo = () => {
  httpUtil.getSessionInfo().then((res) => {
    const {
      data: { user, group, admin },
    } = res;
    // 将用户信息，管理员信息，所属分组信息存入sessionStorage中
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("group", JSON.stringify(group));
    sessionStorage.setItem("admin", JSON.stringify(admin));
  });
}