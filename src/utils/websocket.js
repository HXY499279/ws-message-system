import { updateGroupListAC, updateMyGroupAC } from "../redux/actionCreators";
import { useDispatch } from "../redux/hooks";
import { store } from "../redux/store";


export default class SocketConnect {

    constructor(name, urlKey, callBack) {
        // ws://localhost:8888/websocket?groupName=Xxx&adminId=X
        this.url = "ws://47.108.139.22:8888/websocket?" + urlKey;
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
                this.connect();
            }
            return
        } else {
            alert("该浏览器不支持WebSocket, 请切换浏览器或升级后再试");
            return;
        }
    }

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = e => {
            // 连接ws成功回调
            this.status = 'open';
            console.log(`${this.name}连接成功`)
            // 连接成功执行回调函数
            if(this.callBack){
                this.callBack()
            }
        }
        // 监听服务器端返回的信息
        this.ws.onmessage = e => {
            const { type, data, message } = JSON.parse(e.data)
            console.log(type, data, message)
            // 创建分组
            if (type === 1) {
                // type为1有新分组被创建，更新分组列表
                store.dispatch(updateGroupListAC(data))
            }
            // 加入分组
            if (type === 3) {
                store.dispatch(updateMyGroupAC(data))
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
        return this.ws.send(data);
    }
    // 手动关闭WebSocket
    closeMyself() {
        this.status = 'close';
        return this.ws.close();
    }
    closeHandle(e = 'err') {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== 'close') {
            console.log(`断开,重连websocket`, e)
            this.connect(); // 重连
        } else {
            console.log(`websocket手动关闭`)
        }
    }
}

