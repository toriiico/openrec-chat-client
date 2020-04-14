export class WebSocketManager {
  readonly id: string
  readonly uri: string
  instance: WebSocket
  handshakeLoop?: NodeJS.Timeout

  constructor(id: string) {
    this.id = id
    this.uri = "wss://chat.openrec.tv/socket.io/?movieId=" + this.id + "&EIO=3&transport=websocket"
    this.instance = new WebSocket(this.uri)
    console.log(this.instance)
  }

  connect() {
    this.instance.onopen = (e) => {
      this.onOpen(e)
    }
    this.instance.onclose = (e) => {
      this.onClose(e)
    }
    this.instance.onmessage = (e) => {
      this.onMessage(e)
    }
    this.instance.onerror = (e) => {
      this.onError(e)
    }
  }

  disconnect() {
    try {
      this.instance.close()
    } catch (e) {}
  }

  onOpen(e: Event) {
    console.log("CONNECTED")
    // noticeDraw("[接続] " + onairChannel + "/" + onairTitle, "open")
    this.handshakeLoop = setInterval(() => {
      // NOTE: 関数直入れはthis参照がおかしくなるので、関数内関数として定義する
      this.handshake()
    }, 25000)
  }

  onClose(e: CloseEvent) {
    console.log("DISCONNECTED")
    // noticeDraw("[切断] " + onairChannel + "/" + onairTitle, "close")
    if (this.handshakeLoop) clearInterval(this.handshakeLoop)
  }

  onMessage(e: MessageEvent) {
    let rawText, json, unescapeed

    try {
      if (e.data == "3") {
        // handshakeを送った時の反応
      } else if (e.data == "40") {
        // 通信開始時に送られてくる
      } else if (e.data.slice(0, 1) == "0") {
        // 通信開始時に送られてくるpingやtimeoutの秒数など
        rawText = e.data.slice(1)
        json = JSON.parse(rawText)
        console.log(json)
      } else {
        // message
        rawText = '"' + e.data.slice(14, -2) + '"'
        //unescapeed = rawText.replace(/\\"/g, '"');
        json = JSON.parse(rawText)
        json = JSON.parse(json)

        console.log(json)

        if (json.type == 0) {
          // コメント
          let messageJson = new CommentDeliver(json.data)
          messageJson.push()
        } else if (json.type == 1) {
          // 同時接続数と視聴数
        } else if (json.type == 3) {
          // 生放送が終了
          console.log("live end")
          this.disconnect()
        } else if (json.type == 10) {
          // 放送タイプ(public_type)
        } else {
          console.log(json.type, json.data)
        }
      }
    } catch (er) {
      if (e.data) console.log(e.data)
      else console.log(e)
      console.log(er)
    }
  }

  onError(e: Event) {
    console.log("ERROR:" + e)
    this.instance.close()
  }

  handshake() {
    this.instance.send("2")
    console.log("handshake")
  }
}

export class CommentDeliver {
  user_name: string
  user_identify_id: string
  message: string
  message_dt: string
  is_fresh: string
  is_warned: string
  is_moderator: string
  user_type: string
  is_premium: string
  is_official: string
  is_authenticated: string
  user_icon: string
  user_color: string
  stamp: any
  yell: any
  yell_type: string

  constructor(json: any) {
    this.user_name = removeHtml(json.user_name)
    this.user_identify_id = json.user_identify_id
    this.message = removeHtml(json.message)
    this.message_dt = json.message_dt
    this.is_fresh = json.is_fresh
    this.is_warned = json.is_warned
    this.is_moderator = json.is_moderator
    this.user_type = json.user_type
    this.is_premium = json.is_premium
    this.is_official = json.is_official
    this.is_authenticated = json.is_authenticated
    this.user_icon = json.user_icon
    this.user_color = json.user_color
    this.stamp = json.stamp
    this.yell = json.yell
    this.yell_type = json.yell_type
  }

  push() {
    let svgUrlBase = "https://dqd0jw5gvbchn.cloudfront.net/tv/v8.11.0/static/svg/commons"
    if (this.user_type == "1") this.user_name += '<img src="' + svgUrlBase + '/official.svg" class="mark">'
    if (this.is_premium) this.user_name += '<img src="' + svgUrlBase + '/premium.svg" class="mark">'
    if (this.is_moderator) this.user_name += '<img src="' + svgUrlBase + '/moderator.svg" class="mark">'
    if (this.is_fresh) this.user_name += '<img src="' + svgUrlBase + '/begginer.svg" class="mark">'
    if (this.is_warned) this.user_name += '<img src="' + svgUrlBase + '/warned.svg" class="mark">'

    console.log(this.message)

    // if (this.yell) giftDraw(this.yell.yell_id, 1, this.user_name, this.message)
    // else chatDraw(this.message, this.user_name, this.user_icon, this.user_color, this.stamp)

    return
  }
}

// const giftDraw = (giftId: number, count: number, senderName: string, message: string) => {
//   let giftName = "unknown gift name"
//   let giftPrice = 0
//   let giftUrl = "https://"
//   let giftCategory = 1
//   if (!message) message = ""
//   if (!count) count = 1

//   giftList.forEach((val) => {
//     if (giftId == val.id) {
//       giftName = val.name
//       giftPrice = val.yells
//       giftUrl = val.image_url
//       giftPoint = val.points
//     }
//   })

//   if (giftNoticeFeederMode)
//     renderText.unshift({ text: senderName + ": " + message + "(" + giftPrice + "yell)", type: "gift" })
//   if (!giftNoticeMode) return
//   if (giftNoticeSound)
//     $("#soundGift").get(0).play()
//     //if(giftCategory == 3) count *= 15;
//   ;[...Array(count)].map(() => {
//     // 指定回数繰り返し
//     let randId = "gift" + randText("Int", 8)
//     let randWidth = Math.random() * 1000 + 0
//     let randHeight = Math.random() * 500 + 1280
//     let giftSpeedFix = giftSpeed + Math.random() * 250

//     let insertTag =
//       '<img src="' +
//       giftUrl +
//       '" id="' +
//       randId +
//       '" class="gift" style="bottom: ' +
//       randHeight +
//       "px; left: " +
//       randWidth +
//       'px;">'
//     $(".giftArea").append(insertTag)

//     $("#" + randId).css("display", "block")
//     $("#" + randId).animate({ bottom: -20 }, giftSpeedFix, "swing", function () {
//       $("#" + randId).animate({ bottom: -20 }, 4000, "swing", function () {
//         $("#" + randId).fadeOut(500, function () {
//           $("#" + randId).remove()
//         })
//       })
//     })
//   })
// }

// export const chatDraw = (text: string, name: string, iconUrl: string, color: string, stamp: any) => {
//   let colorText = ""
//   if (chatColorMode) colorText = "color: " + color + " !important;"

//   let randId = "chat" + randText("Int", 8)
//   let randHeight = Math.random() * 1000

//   if (stamp) text = '<img src="' + stamp.image_url + '" class="stamp" style="width: ' + stampSize + 'px;">'
//   else {
//     if (text.length >= chatLengthMax) text = text.substr(0, chatLengthMax - 2) + "..."
//   }

//   if (chatInUserName) text = text + "@" + name
//   let insertTag =
//     '<div id="' +
//     randId +
//     '" class="chat" style="display: none; left: 1920px; top: ' +
//     randHeight +
//     "px; font-size: " +
//     chatSize +
//     "px;" +
//     colorText +
//     '">' +
//     text +
//     "</div>"
//   $(".chatArea").append(insertTag)

//   $("#" + randId).css("display", "block")
//   let tagWidth = parseInt($("#" + randId).css("width"))
//   let goalTime = chatSpeed / 1.8 // 過去のVerとの互換の調整
//   $("#" + randId).animate({ left: -tagWidth }, goalTime, "linear", function () {
//     $("#" + randId).remove()
//   })
// }

export const removeHtml = (str: string) => {
  return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
}

export const randText = (type: string, len: number) => {
  let p = 36

  if (type == "Int") p = 10
  if (!len) len = 10

  return Math.random()
    .toString(p)
    .slice(0 - len)
}
