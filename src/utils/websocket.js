import { updateGroupListAC, updateMyGroupAC, addMemberListAC, deleteMemberListAC, getMemberListAC } from "../redux/actionCreators";
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

    constructor(name, urlKey, scene, callBack = () => { }) {
        const { admin: { adminId } } = store.getState().userInfo
        // ws://localhost:8888/websocket?groupName=Xxx&adminId=X
        this.url = `ws://47.108.139.22:8888/websocket?${urlKey}&adminId=${adminId}&scene=${scene}`;
        this.ws = null;  // websocket对象
        this.status = null; // websocket状态
        this.name = name // websocket名字
        this.callBack = callBack // 连接websocket后的回调函数
        this.init();
    }
    init() {
        //判断当前浏览器支持不支持WebSocket
        if ('WebSocket' in window) {
            if (!this.ws) {
                // 如果已有groupName相同的实例，就无需创建
                if (!SocketConnect.socketConnects.has(this.name)) {
                    // 没有，创建
                    this.connect();
                } else {
                    // 有，返回
                    const that = SocketConnect.socketConnects.get(this.name)
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
        SocketConnect.socketConnects.set(this.name, this)
        this.ws.onopen = e => {
            // 连接ws成功回调
            console.log(SocketConnect.socketConnects);
            this.status = 'open';
            console.log(`${this.name}连接成功`)
            // 连接成功执行回调函数
            if (this.callBack) {
                this.callBack()
            }
        }
        // 监听服务器端返回的信息
        this.ws.onmessage = e => {
            const { type, data, message } = JSON.parse(e.data)
            console.log(this.name, type, data, message)
            // 创建分组
            if (type === 1) {
                // type为1有新分组被创建，更新分组列表
                store.dispatch(updateGroupListAC(data))
                store.dispatch(updateMyGroupAC(data))
            }
            // 加入分组
            if (type === 3) {
                const { groupId } = data
                const { user: { userId } } = store.getState().userInfo
                if (data.userId === userId) {
                    store.dispatch(getMemberListAC(groupId))
                } else {
                    store.dispatch(addMemberListAC(data))
                }
            }

            // 退出分组
            if (type === 4) {
                store.dispatch(deleteMemberListAC(data))
            }

            // 有人被踢出分组
            if (type === 5) {
                // 从分组列表中删除该成员
                store.dispatch(deleteMemberListAC({ userId: data }))
                const { user: { userId } } = store.getState().userInfo
                if (userId === data) {
                    httpUtil.deleteMyGroup()
                        .then(res => {
                            Message.error("您被踢出房间")
                            setTimeout(() => {
                                window.location.replace("/user/hall")
                                // 更新本地缓存（修改自己的group信息）
                                store.dispatch(updateMyGroupAC(res.data.group))
                            }, 100)
                        })
                }
            }

            // 白板,聊天
            if (type === 10 || type === 9) {
                this.callBack(e)
            }

        }
        // ws关闭回调
        this.ws.onclose = e => {
            SocketConnect.socketConnects.delete(this.name)
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
    closeMyself() {
        this.status = 'close';
        this.ws.close();
    }
    closeHandle(e = 'err') {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== 'close') {
            console.log(`${this.name}断开重连`, e)
            this.connect(); // 重连
        } else {
            console.log(`${this.name}手动关闭`)
        }
    }

}
