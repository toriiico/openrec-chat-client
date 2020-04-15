export class WebSocketManager {
  private readonly id: string
  private readonly uri: string
  private instance: WebSocket
  private handshakeLoop?: NodeJS.Timeout
  private commentObserver: CommentObserver

  constructor(id: string, commentObserver: CommentObserver) {
    this.id = id
    this.uri = "wss://chat.openrec.tv/socket.io/?movieId=" + this.id + "&EIO=3&transport=websocket"
    this.instance = new WebSocket(this.uri)
    this.commentObserver = commentObserver
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
          let messageJson = new CommentDeliver(json.data, this.commentObserver)
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

type OpenrecCommentResponse = {}
const resNormalCommentSample = {
  movie_id: 1655382,
  live_type: 1,
  onair_status: 1,
  user_id: 5049010,
  openrec_user_id: 50990,
  user_name: "カオスソルジャッ",
  user_type: "2",
  user_key: "hannma",
  user_identify_id: "R_v9xetQpSgNS",
  user_rank: 0,
  chat_id: 341360867,
  item: 0,
  golds: 0,
  message: "画質よき",
  cre_dt: "2020-04-15 19:18:42",
  message_dt: "2020-04-15 19:18:42",
  is_fresh: 0,
  is_warned: 0,
  is_moderator: 0,
  is_premium: 1,
  is_authenticated: 1,
  has_banned_word: 0,
  stamp: null,
  quality_type: 2,
  user_icon: "https://www.openrec.tv/images/v4/default/profile.png",
  supporter_rank: 0,
  is_creaters: 0,
  is_premium_hidden: 0,
  user_color: "#e200ff",
  yell: null,
  yell_type: null,
  to_user: null,
  capture: null,
  item_data: null,
  display_dt: "0秒前",
  del_flg: 0,
  badges: [],
}

const resStampSample = {
  movie_id: 1655382,
  live_type: 1,
  onair_status: 1,
  user_id: 132399086,
  openrec_user_id: 1026680,
  user_name: "ゆめかわ",
  user_type: "2",
  user_key: "momijiiii",
  user_identify_id: "o4Il6AvpofE8v",
  user_rank: 0,
  chat_id: 341361476,
  item: 0,
  golds: 0,
  message: "",
  cre_dt: "2020-04-15 19:22:52",
  message_dt: "2020-04-15 19:22:52",
  is_fresh: 0,
  is_warned: 0,
  is_moderator: 0,
  is_premium: 1,
  is_authenticated: 1,
  has_banned_word: 0,
  stamp: {
    stamp_id: 380,
    group_id: 15,
    image_url: "https://dqd0jw5gvbchn.cloudfront.net/stamp/15/128/4532998fa45a5b73e8928cb6ac82f651a9b951ff.png",
  },
  quality_type: 2,
  user_icon: "https://openrec-appdata.s3.amazonaws.com/user/1323991/132399086.png?1577618658",
  supporter_rank: 0,
  is_creaters: 0,
  is_premium_hidden: 0,
  user_color: "#eaff00",
  yell: null,
  yell_type: null,
  to_user: null,
  capture: null,
  item_data: null,
  display_dt: "0秒前",
  del_flg: 0,
  badges: [],
}

const resCaptureSample = {
  movie_id: 1655382,
  live_type: 1,
  onair_status: 1,
  user_id: 22399237,
  openrec_user_id: 163096,
  user_name: "ソて〜",
  user_type: "2",
  user_key: "sophia_N",
  user_identify_id: "Ys_3rqAdzf3JM",
  user_rank: 0,
  chat_id: 341361614,
  message: "キャプチャを公開しました。",
  cre_dt: "2020-04-15 19:23:43",
  is_fresh: 0,
  is_warned: 0,
  is_moderator: 0,
  is_premium: 0,
  is_authenticated: 1,
  has_banned_word: 0,
  stamp: null,
  user_icon: "https://openrec-appdata.s3.amazonaws.com/user/223993/22399237.png?1472296057",
  supporter_rank: 0,
  is_creaters: 0,
  is_premium_hidden: 0,
  user_color: "#B6FF59",
  yell: null,
  yell_type: null,
  to_user: null,
  capture: {
    capture: {
      id: "kvn4kp83qe6",
      movie_start_point: "01:56:39",
      capture_point: "01:57:24",
      title: "※ボトルから持ち換えて１試合目です",
      status: "finish",
      is_public: true,
      published_at: "2020-04-15T19:23:43+09:00",
      is_ban: false,
      is_hidden: false,
      start_time: 48.58306270627064,
      end_time: 121.483,
      total_views: 0,
      created_at: "2020-04-15T19:22:48+09:00",
      chat_from_at: "2020-04-15T19:20:48+09:00",
      url: "/external/api/v5/captures/kvn4kp83qe6/playlist.m3u8",
      thumbnail_url:
        "https://hayabusa.io/openrec-image/thumbnails/capture/1655382-015724/capture_2.w350.ttl3600.jpg?format=jpg&progressive=true",
      thumbnail_urls: [],
    },
    capture_channel: {
      id: "sophia_N",
      openrec_user_id: 163096,
      recxuser_id: 22399237,
      nickname: "ソて〜",
      introduction: "",
      icon_image_url: "https://hayabusa.io/openrec-image/user/223993/22399237.w90.ttl3600.v1472296057.png?format=png",
      l_icon_image_url:
        "https://hayabusa.io/openrec-image/user/223993/22399237.w320.ttl3600.v1472296057.png?format=png",
      cover_image_url: "",
      l_cover_image_url: "",
      follows: 50,
      followers: 12,
      is_premium: false,
      is_official: false,
      is_fresh: false,
      is_warned: false,
      is_team: false,
      is_league_yell: false,
      is_live: false,
      live_views: 0,
      last_updated_at: null,
      user_status: "bang",
      is_creator: false,
      premium_start_at: null,
      premium_charge_type: null,
      premium_payment_status: null,
      email: null,
      twitter_screen_name: null,
    },
  },
  item_data: null,
  display_dt: "0秒前",
  del_flg: 0,
  badges: [],
}

const resAuthorCommentSample = {
  movie_id: 1655382,
  live_type: 1,
  onair_status: 1,
  user_id: 420271639,
  openrec_user_id: 1931071,
  user_name: "ちょこぺろ",
  user_type: "1",
  user_key: "rrchoco",
  user_identify_id: "oBVDx625kAp",
  user_rank: 0,
  chat_id: 341361970,
  item: 0,
  golds: 0,
  message: "どうやって勝つの！",
  cre_dt: "2020-04-15 19:26:01",
  message_dt: "2020-04-15 19:26:01",
  is_fresh: 0,
  is_warned: 0,
  is_moderator: 0,
  is_premium: 1,
  is_authenticated: 1,
  has_banned_word: 0,
  stamp: null,
  quality_type: 2,
  user_icon: "https://openrec-appdata.s3.amazonaws.com/user/4202717/420271639.png?1586744809",
  supporter_rank: 0,
  is_creaters: 1,
  is_premium_hidden: 0,
  user_color: "#2468DF",
  yell: null,
  yell_type: null,
  to_user: null,
  capture: null,
  item_data: null,
  display_dt: "0秒前",
  del_flg: 0,
  badges: [],
}

export class CommentDeliver {
  private user_name: string
  private user_identify_id: string
  private message: string
  private message_dt: string
  private is_fresh: string
  private is_warned: string
  private is_moderator: string
  private user_type: string
  private is_premium: string
  private is_official: string
  private is_authenticated: string
  private user_icon: string
  private user_color: string
  private stamp: any
  private yell: any
  private yell_type: string
  private observer: CommentObserver

  constructor(json: any, observer: CommentObserver) {
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
    this.observer = observer
  }

  push() {
    let svgUrlBase = "https://dqd0jw5gvbchn.cloudfront.net/tv/v8.11.0/static/svg/commons"
    if (this.user_type == "1") this.user_name += '<img src="' + svgUrlBase + '/official.svg" class="mark">'
    if (this.is_premium) this.user_name += '<img src="' + svgUrlBase + '/premium.svg" class="mark">'
    if (this.is_moderator) this.user_name += '<img src="' + svgUrlBase + '/moderator.svg" class="mark">'
    if (this.is_fresh) this.user_name += '<img src="' + svgUrlBase + '/begginer.svg" class="mark">'
    if (this.is_warned) this.user_name += '<img src="' + svgUrlBase + '/warned.svg" class="mark">'

    console.log(this.message)

    this.observer.on({
      message: this.message,
    })

    // if (this.yell) giftDraw(this.yell.yell_id, 1, this.user_name, this.message)
    // else chatDraw(this.message, this.user_name, this.user_icon, this.user_color, this.stamp)

    return
  }
}

export class CommentObserver {
  private _readers: any[]

  constructor() {
    this._readers = []
  }

  on(reader: any) {
    this._readers.push(reader)
  }

  off(reader: any) {
    this._readers.splice(this._readers.indexOf(reader), 1)
  }

  get readers() {
    return this._readers
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
