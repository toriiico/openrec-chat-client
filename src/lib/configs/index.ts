export const getParam = (name: string, url?: string): string => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  let results = regex.exec(url)
  if (!results || !results[2]) return ""
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

export const currentVer = "v1.0.7"

// チャット生成先URL
export const baseUrl = process.env.REACT_APP_BASE_URL

// OPENRECのチャンネルID(https://www.openrec.tv/user/*****)
export const channelId = getParam("channelId") || ""

// 流れるコメントに@名前を含める(含める場合はtrue)
export const chatInUserName = getParam("chatInUserName") || false

// 流れるコメントの色をユーザが設定した色にするか
export const chatColorMode = getParam("chatColorMode") || false

// コメントが流れる速度（少ないほど早い）
export const chatSpeed = parseInt(getParam("chatSpeed")) || 7000

// 流れるコメントの最大表示文字数
export const chatLengthMax = parseInt(getParam("chatLengthMax")) || 30

// 流れるスタンプの大きさ
export const stampSize = parseInt(getParam("stampSize")) || 128

// 流れるコメントの大きさ
export const chatSize = parseInt(getParam("chatSize")) || 60

// ギフトを上から落とすかどうか
export const giftNoticeMode = getParam("giftNoticeMode") || false

// ギフトが来た時に画面下に通知をだすかどうか
export const giftNoticeFeederMode = getParam("giftNoticeFeederMode") || false

// ギフトが落ちる速度（少ないほど早い）
export const giftSpeed = parseInt(getParam("giftSpeed")) || 5000

// ギフトが来た時にサウンドを再生していいか
export const giftNoticeSound = getParam("giftNoticeSound") || false

// ビュワーでユーザーのアイコンを表示するかどうか
export const userIcon = getParam("userIcon") || true

// コメントがこれ以上溜まり過ぎた時に重くならないように自動で削除
export const viewerMaxLine = parseInt(getParam("viewerMaxLine")) || 1000

// デモモード
export const demoMode = getParam("demoMode") || false
