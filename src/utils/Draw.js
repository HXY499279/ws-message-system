export default class Draw {
  constructor(canvas, userId) {
    this.canvas = canvas
    this.cxt = this.canvas.getContext('2d')
    this.stage_info = this.canvas.getBoundingClientRect()
    this.userId = userId
    this.path = {
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0
    }
  }

  init(ws, btn) {
    this.canvas.onmousedown = (e) => {
      this.drawBegin(e || window.event, ws)
    }
    this.canvas.onmouseup = () => {
      this.drawEnd()
      const sendData = { type: 10, data: null, message: 'stop' }
      ws.send(JSON.stringify(sendData))
    }
    this.clearCanvas(ws, btn)
  }
  drawBegin(e, ws) {
    window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
    this.cxt.strokeStyle = "#000"
    this.cxt.beginPath()
    this.cxt.moveTo(
      e.clientX - this.stage_info.left,
      e.clientY - this.stage_info.top
    )

    this.path.beginX = e.clientX - this.stage_info.left
    this.path.beginY = e.clientY - this.stage_info.top
    document.onmousemove = (e) => {
      this.drawing(e || window.event, ws)
    }
    // document.onmouseup = this.drawEnd
  }
  drawing(e, ws) {
    this.cxt.lineTo(
      e.clientX - this.stage_info.left,
      e.clientY - this.stage_info.top
    )

    this.path.endX = e.clientX - this.stage_info.left
    this.path.endY = e.clientY - this.stage_info.top

    const sendData = { type: 10, data: [this.path.beginX, this.path.beginY, this.path.endX, this.path.endY], message: "", userId: this.userId }
    ws.send(JSON.stringify(sendData))

    this.cxt.stroke()
  }
  drawEnd() {
    document.onmousemove = document.onmouseup = null
  }
  clearCanvas(ws, btn) {
    btn && (btn.onclick = () => {
      this.cxt.clearRect(0, 0, 500, 500)

      const sendData = { type: 10, data: null, message: 'clear' }
      ws.send(JSON.stringify(sendData))

    })
  }
}