import {
    addWithAdminGroupListAC,
    deleteWithAdminGroupListAC,
    updateMyGroupAC,
    addMemberListAC,
    deleteMemberListAC,
    getMemberListAC,
    getWithoutAdminGroupListAC,
    deleteWithoutAdminGroupListAC,
    addAdminListAC,
    deleteAdminListAC,
    changeAdminListAC,
    getUserInfoAC,
    addWithAdminUserListAC,
    addWithoutAdminUserListAC,
    deleteWithoutAdminUserListAC,
    changeWithAdminUserListAC,
    updateMyAdminAC,
    setIsChoiceAdminVisibleAC,
    changeWithAdminGroupListAC
} from "../redux/actionCreators";
import { message as Message } from "antd";
import { store } from "../redux/store";
import httpUtil from "./httpUtil";

export default class SocketConnect {
    // 在SocketConnect类上存储自己的实例
    static socketConnects = new Map()
    // 获取实例
    static getConnectInstance(name) {
        return SocketConnect.socketConnects.get(name)
    }

    constructor(name, groupName, scene, callBack = () => { }) {
        const { admin } = store.getState().userInfo
        const adminId = admin?.adminId
        // ws://47.108.139.22:8888/websocket?groupName=Xxx&adminId=X&scene=scene
        this.url = `ws://47.108.139.22:8888/websocket?groupName=${groupName}&adminId=${adminId}&scene=${scene}`;
        this.ws = null;  // websocket对象
        this.status = null; // websocket状态
        this.name = name // websocket名字
        this.scene = scene // websocket场景
        this.callBack = callBack // 连接websocket后的回调函数
        this.init();
    }
    init() {
        //判断当前浏览器支持不支持WebSocket
        if ('WebSocket' in window) {
            if (!this.ws) {
                // 如果已有groupName相同的实例，就无需创建
                if (!SocketConnect.socketConnects.has(`${this.name}-${this.scene}`)) {
                    // 没有，创建
                    this.connect();
                } else {
                    // 有，返回
                    const that = SocketConnect.socketConnects.get(`${this.name}-${this.scene}`)
                    this.ws = that.ws
                    this.status = that.status
                    this.callBack()
                }
            }
            return
        } else {
            alert("该浏览器不支持WebSocket, 请切换浏览器或升级后再试");
            return;
        }
    }

    connect() {
        this.ws = new WebSocket(this.url);
        SocketConnect.socketConnects.set(`${this.name}-${this.scene}`, this)
        this.ws.onopen = e => {
            // 连接ws成功回调
            console.log(SocketConnect.socketConnects);
            this.status = 'open';
            console.log(`${this.name}-${this.scene}连接成功`)
            // 连接成功执行回调函数
            if (this.callBack) {
                this.callBack()
            }
        }
        // 监听服务器端返回的信息
        this.ws.onmessage = e => {
            const { type, data, message } = JSON.parse(e.data)
            const { user, group, admin } = store.getState().userInfo

            console.log(`${this.name}-${this.scene}`, type, data, message)
            // 创建分组
            if (type === 1) {
                if (!user) {
                    store.dispatch(addWithAdminGroupListAC(data))
                    store.dispatch(changeWithAdminUserListAC({ showStatus: 0, userId: data.creatorId, groupName: data.groupName }))
                } else {
                    // type为1有新分组被创建，更新分组列表
                    store.dispatch(addWithAdminGroupListAC(data))
                    if (data.creatorId === user.userId) {
                        store.dispatch(updateMyGroupAC(data))
                    }
                }
            }
            // 管理员删除自己管理的分组
            if (type === 2) {
                if (user) {
                    if (group.groupId == data.groupId) {
                        httpUtil.deleteMyGroup()
                            .then(() => {
                                store.dispatch(updateMyGroupAC(null));
                                Message.warn("管理员删除分组")
                                setTimeout(() => {
                                    window.location.href = "/user/hall"
                                }, 500);
                            })
                    }
                    store.dispatch(deleteWithAdminGroupListAC(data))
                } else {
                    store.dispatch(deleteWithoutAdminGroupListAC(data))
                }
            }
            // 加入分组
            if (type === 3) {
                const { groupId } = data
                if (user) {
                    if (data.userId === user.userId) {
                        store.dispatch(getMemberListAC(groupId))
                    } else {
                        store.dispatch(addMemberListAC(data))
                    }
                } else {
                    // 管理员这边更新该用户的分组名
                    store.dispatch(changeWithAdminUserListAC({ ...data, showStatus: 0 }))
                }
            }

            // 退出分组
            if (type === 4) {
                if (user) {
                    store.dispatch(deleteMemberListAC(data))
                    if (user.userId == data.userId) {
                        window.location.href = "/user/hall"
                        store.dispatch(updateMyGroupAC(null));
                    }
                } else {
                    // 管理员这边清除该用户的分组名
                    store.dispatch(changeWithAdminUserListAC({ ...data, groupName: "", showStatus: 0 }))
                }
            }

            // 有人被踢出分组
            if (type === 5) {
                if (user) {
                    // 从分组列表中删除该成员
                    store.dispatch(deleteMemberListAC({ userId: data }))
                    if (user.userId === data) {
                        httpUtil.deleteMyGroup()
                            .then(res => {
                                Message.error("您被踢出房间")
                                setTimeout(() => {
                                    window.location.href = "/user/hall"
                                    // 更新本地缓存（修改自己的group信息）
                                    store.dispatch(updateMyGroupAC(res.data.group))
                                }, 100)
                            })
                    }
                } else {
                    store.dispatch(changeWithAdminUserListAC({ userId: data, groupName: "", showStatus: 0 }))
                }
            }

            // 解散分组
            if (type === 6) {
                if (!user) {
                    store.dispatch(deleteWithAdminGroupListAC(data))
                    store.dispatch(changeWithAdminUserListAC({ showStatus: 0, userId: data.creatorId, groupName: "" }))
                } else {
                    // 自己不是房主，并且自己是该祖成员时
                    if (group?.groupId === data.groupId) {
                        httpUtil.deleteMyGroup()
                            .then(res => {
                                // 给房间成员提示房间解散
                                user.userId !== data.creatorId && Message.error("房间已被解散")
                                setTimeout(() => {
                                    window.location.href = "/user/hall"
                                    // 更新本地缓存（修改自己的group信息）
                                    store.dispatch(updateMyGroupAC(res.data.group))
                                }, 100)
                            })
                    } else {
                        // 有分组被解散，更新分组列表
                        store.dispatch(deleteWithAdminGroupListAC(data))
                    }
                }
            }

            // 白板,聊天
            if (type === 10 || type === 11 || type === 9) {
                this.callBack(e)
            }

            // 管理员放弃私有分组中分组的管理
            if (type === 12) {
                if (!user) {
                    store.dispatch(getWithoutAdminGroupListAC())
                } else {
                    // 在大厅里面去掉被放弃的分组
                    store.dispatch(deleteWithAdminGroupListAC({ groupId: data }))
                    // 如果用户自己在被放弃的分组里面，删除用户的管理员信息
                    if (data == group?.groupId) {
                        httpUtil.deleteMyAdmin()
                            .then(() => {
                                store.dispatch(getUserInfoAC())
                            })
                    }
                }
            }

            // 管理员选择未指定管理员的私有分组进行管理
            if (type === 13) {
                if (!user) {
                    store.dispatch(deleteWithoutAdminGroupListAC(data))
                } else {
                    // 用户所在分组被纳入管理，更新用户的管理员信息
                    httpUtil.updateMyAdmin({ ...data.admin })
                        .then(() => {
                            store.dispatch(updateMyAdminAC(data.admin))
                        })
                }
            }

            // 管理员放弃管理（未有分组的）用户
            if (type === 14) {
                if (!user) {
                    if (data.users) {
                        for (let user of data.users) {
                            user.groupName = data.groupName
                            store.dispatch(addWithoutAdminUserListAC(user))
                        }
                    } else {
                        store.dispatch(addWithoutAdminUserListAC(data))
                    }
                } else {
                    if (user.userId === data.userId) {
                        httpUtil.deleteMyAdmin()
                            .then(() => {
                                store.dispatch(getUserInfoAC())
                            })
                    }
                }
            }

            // 管理员纳入管理（未有分组的）用户
            if (type === 15) {
                if (!user) {
                    if (data.length) {
                        for (let user of data) {
                            store.dispatch(deleteWithoutAdminUserListAC(user))
                        }
                    } else {
                        store.dispatch(deleteWithoutAdminUserListAC(data))
                    }
                } else {
                    if (user.userId === data?.user?.userId) {
                        httpUtil.updateMyAdmin({ ...data.admin })
                            .then(() => {
                                store.dispatch(updateMyAdminAC(data.admin))
                                store.dispatch(setIsChoiceAdminVisibleAC(false))
                            })
                    }
                }

            }

            // 管理员删除未指定管理员的用户
            if (type === 16) {
                if (!user) {
                    store.dispatch(addWithoutAdminUserListAC(data))
                } else {
                    if (user.userId === data.userId) {
                        httpUtil.logout()
                        window.location.href = '/'
                    }
                }
            }

            // 管理员恢复被删除的未指定管理员的用户
            if (type === 17) {
                if (!user) {
                    store.dispatch(addWithoutAdminUserListAC(data))
                }
            }


            // 新增管理员
            if (type === 19) {
                store.dispatch(addAdminListAC(data))
            }

            // 注销（删除）管理员
            if (type === 20) {
                store.dispatch(deleteAdminListAC({ adminId: data }))
            }

            // 管理员修改密码
            if (type === 21) {
                store.dispatch(changeAdminListAC(data))
            }

            // 新用户注册
            if (type === 22) {
                if (!user) {
                    store.dispatch(addWithAdminUserListAC(data))
                }
            }

            // 用户修改密码
            if (type === 23) {
                if (!user) {
                    // 更改管理员私有分组中创建人姓名
                    store.dispatch(changeWithAdminGroupListAC(data))
                    // 更改管理员成员列表中中成员姓名
                    store.dispatch(changeWithAdminUserListAC(data))
                }
            }

            // 用户选择管理员
            if (type === 24) {
                if (!user) {
                    // 组长选择管理员
                    if (data?.group) {
                        store.dispatch(addWithAdminUserListAC({ ...data.user, groupName: data.group.groupName }))
                        store.dispatch(addWithAdminGroupListAC({ ...data.group, creatorName: data.user.userName }))
                        store.dispatch(deleteWithoutAdminGroupListAC({ ...data.group, creatorName: data.user.userName }))
                    } else {
                        // 用户选择管理员
                        store.dispatch(addWithAdminUserListAC(data))
                        store.dispatch(deleteWithoutAdminUserListAC(data))
                    }
                }
            }
        }
        // ws关闭回调
        this.ws.onclose = e => {
            this.closeHandle(e); // 判断是否关闭
        }
        // ws出错回调
        this.ws.onerror = (e = 'err') => {
            this.closeHandle(e); // 判断是否关闭
        }
    }
    // 发送信息给服务器
    sendHandle(data) {
        console.log(`发送消息给服务器:`, data)
        this.ws.send(data);
    }
    // 手动关闭WebSocket
    closeMyself(name) {
        this.status = 'close';
        SocketConnect.socketConnects.delete(name)
        this.ws.close();
    }
    closeHandle(e = 'err') {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== 'close') {
            console.log(`${this.name}-${this.scene} 断开重连`)
            Message.warn(`${this.name}-${this.scene} 异常断开`)
            // this.connect(); // 重连
        } else {
            console.log(`${this.name}手动关闭`)
        }
    }

}
