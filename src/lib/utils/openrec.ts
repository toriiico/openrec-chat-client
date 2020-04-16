export const updateGiftList = async () => {
  const res = await fetch("https://public.openrec.tv/external/api/v5/yell-products")
  return res.json()
}

export const getMovieId = async (channelId: string) => {
  const res = await fetch("https://public.openrec.tv/external/api/v5/movies?channel_id=" + channelId)
  return res.json()
}

// どんな値が入ってくるのか大体わかりやすくするためのもの
export type BooleanNumber = number
export type NumberString = string
export type FloatNumber = number
export type DateString = string
export type TimeString = string
export type UrlString = string
export type UrlAfterDirNameString = string
export type ColorCodeString = string

export type YellType = string | null
export type LastUpdatedAt = DateString | null

// 何が入ってくるか分からないもの
// デフォがnull
export type UnknownParam = any
// 数値が入ってくることは判明しているがboolとして扱ってそうだったり不定そうなもの
export type UnknownNumber = number
// 中身が不明
export type ThumbnailUrls = any[]

export type StampInfo = {
  stamp_id: number
  group_id: number
  image_url: UrlString
} | null
export type YellInfo = {
  yell_id: number
  name: string
  label: string
  image_url: UrlString
  image_url_small: UrlString
  animation_url: UrlString
  points: number
  yells: number
  ticker_seconds: number
} | null
export type ChannelInfo = {
  id: string
  openrec_user_id: number
  recxuser_id: number
  nickname: string
  introduction: string
  icon_image_url: UrlString
  l_icon_image_url: UrlString
  cover_image_url: UrlString
  l_cover_image_url: UrlString
  follows: number
  followers: number
  is_premium: boolean
  is_official: boolean
  is_fresh: boolean
  is_warned: boolean
  is_team: boolean
  is_league_yell: boolean
  is_live: boolean
  live_views: number
  last_updated_at: LastUpdatedAt
  user_status: string
  is_creator: boolean
  premium_start_at: UnknownParam
  premium_charge_type: UnknownParam
  premium_payment_status: UnknownParam
  email: UnknownParam
  twitter_screen_name: UnknownParam
} | null
export type CaptureInfo = {
  capture: {
    id: string
    movie_start_point: TimeString
    capture_point: TimeString
    title: string
    status: string
    is_public: boolean
    published_at: DateString
    is_ban: boolean
    is_hidden: boolean
    start_time: FloatNumber
    end_time: FloatNumber
    total_views: number
    created_at: DateString
    chat_from_at: DateString
    url: UrlAfterDirNameString
    thumbnail_url: UrlString
    thumbnail_urls: ThumbnailUrls
  }
  capture_channel: ChannelInfo
} | null
// NOTE: これよく分からん
export type ItemDataInfo = {} | null
export type BadgesInfo = {
  id: number
  image_url: UrlString
  label: string
  type: string
  subscription: {
    months: UnknownNumber
    tier: UnknownNumber
  }
}[]

export type OpenrecCommentResponse = {
  movie_id: number
  live_type: number
  onair_status: number
  user_id: number
  openrec_user_id: number
  user_name: string
  user_type: NumberString
  user_key: string
  user_identify_id: string
  user_rank: number
  chat_id: number
  item: number
  golds: number
  message: string
  cre_dt: DateString
  message_dt: DateString
  is_fresh: BooleanNumber
  is_warned: BooleanNumber
  is_moderator: BooleanNumber
  is_premium: BooleanNumber
  is_authenticated: BooleanNumber
  has_banned_word: BooleanNumber
  stamp: StampInfo
  quality_type: number
  user_icon: UrlString
  supporter_rank: number
  is_creaters: BooleanNumber
  is_premium_hidden: BooleanNumber
  user_color: ColorCodeString
  yell: YellInfo
  yell_type: YellType
  to_user: ChannelInfo
  capture: CaptureInfo
  item_data: ItemDataInfo
  display_dt: string
  del_flg: BooleanNumber
  badges: BadgesInfo
}

export type OpenrecCaptureResponse = Omit<OpenrecCommentResponse, "item" | "golds" | "message_dt" | "quality_type">

// 配信情報サンプル
// NOTE: 配信リストを取得したときのデータ
export const resMovieSample = {
  id: "1o8q65kp1rk",
  movie_id: 1653756,
  title: "アップデートきたああああああああああ",
  introduction: "https://www.youtube.com/channel/UCIcxUw7gEn5CGxARi5zdICQ",
  is_live: true,
  onair_status: 1,
  movie_type: "8",
  upload_status: "SK",
  monetize_status: 1,
  thumbnail_url:
    "https://hayabusa.io/openrec-image/thumbnails/16538/1653756/origin/10/captured_9472.w350.ttl3600.jpeg?format=jpg&progressive=true",
  l_thumbnail_url:
    "https://hayabusa.io/openrec-image/thumbnails/16538/1653756/origin/10/captured_9472.w960.ttl3600.jpeg?format=jpg&progressive=true",
  s_thumbnail_url:
    "https://hayabusa.io/openrec-image/thumbnails/16538/1653756/origin/10/captured_9472.w350.ttl3600.jpeg?format=jpg&progressive=true",
  l_sprite_image_url: "https://dqd0jw5gvbchn.cloudfront.net/thumbnails/16538/1653756/sprite/10_1_160x90_6x1.jpg",
  s_sprite_image_url: "https://dqd0jw5gvbchn.cloudfront.net/thumbnails/16538/1653756/sprite/10_1_80x45_6x1.jpg",
  sprite_intervals: [10],
  sprite_image: {
    url: "https://dqd0jw5gvbchn.cloudfront.net/thumbnails/16538/1653756/sprite/",
    interval: 10,
    width: 160,
    height: 90,
    cols: 6,
    rows: 15,
    start_page: 1,
    ext: "jpg",
  },
  cover_image_url: null,
  is_cover_image_icon: false,
  live_views: 573,
  total_views: 2840,
  total_yells: 320,
  is_mobile: false,
  is_low_latency: true,
  is_dvr: true,
  is_capture: true,
  is_fixed_phrase: true,
  enabled_ad: true,
  enabled_yell: true,
  enabled_owner_yell: true,
  enabled_cast_yell: false,
  ad: null,
  created_at: "2020-04-14T16:15:26+09:00",
  published_at: "2020-04-16T03:27:01+09:00",
  started_at: "2020-04-16T03:27:01+09:00",
  ended_at: "2020-04-15T16:15:26+09:00",
  will_start_at: null,
  will_end_at: null,
  start_time: 0,
  play_time: 0,
  is_banned: false,
  ban_type: 0,
  orientation: 0,
  device_type: 0,
  broadcast_type: "normal",
  width: null,
  height: null,
  connect_count: 0,
  play_list_id: 0,
  league_id: null,
  tags: [],
  media: {
    url: "https://station316.openrec.tv/live1/ngrp:9e89d2a38ec1df78b226249d20047e19e14d631230_all/playlist.m3u8",
    url_source: null,
    url_public:
      "https://station316.openrec.tv/live1/ngrp:9e89d2a38ec1df78b226249d20047e19e14d631230_public/playlist.m3u8",
    url_trailer: null,
    url_dvr: "https://d3cfw2mckicdfw.cloudfront.net/9e89d2a38ec1df78b226249d20047e19e14d631230/playlist.m3u8",
    url_dvr_audio: "https://d3cfw2mckicdfw.cloudfront.net/9e89d2a38ec1df78b226249d20047e19e14d631230/aac.m3u8",
    url_audio:
      "https://station316.openrec.tv/live1/ngrp:9e89d2a38ec1df78b226249d20047e19e14d631230_audio/playlist.m3u8",
    url_low_latency:
      "https://station-proxy.openrec.tv/a/1/live1/9e89d2a38ec1df78b226249d20047e19e14d631230/playlist.m3u8",
    url_ull: "https://d3cfw2mckicdfw.cloudfront.net/9e89d2a38ec1df78b226249d20047e19e14d631230/playlist-ull.m3u8",
  },
  subs_trial_media: {
    url: null,
    url_low_latency: null,
    url_ull: null,
    url_dvr: null,
    url_audio: null,
    url_dvr_audio: null,
  },
  channel: {
    id: "oekaki",
    recxuser_id: 24500354,
    openrec_user_id: 188312,
    name: "おおえのたかゆき",
    nickname: "おおえのたかゆき",
    introduction: "youtube↵https://www.youtube.com/channel/UCIcxUw7gEn5CGxARi5zdICQ",
    icon_image_url: "https://hayabusa.io/openrec-image/user/245004/24500354.w90.ttl3600.v1566882412.png?format=png",
    l_icon_image_url: "https://hayabusa.io/openrec-image/user/245004/24500354.w320.ttl3600.v1566882412.png?format=png",
    cover_image_url:
      "https://hayabusa.io/openrec-image/user_background/245004/24500354.w210.ttl3600.v1494213775.png?format=png",
    l_cover_image_url:
      "https://hayabusa.io/openrec-image/user_background/245004/24500354.ttl3600.v1494213775.png?format=png",
    movies: 1325,
    views: 14917340,
    follows: 0,
    followers: 20027,
    is_premium: true,
    is_official: true,
    is_fresh: false,
    is_warned: false,
    is_league_yell: false,
    is_team: false,
    is_live: false,
    live_views: 0,
    user_status: null,
    is_creator: false,
    chat_rule: "",
    last_updated_at: "2020-04-16T03:27:01+09:00",
    twitter_screen_name: null,
    ga_tracking_id: null,
    blacklist: [],
    games: null,
    onair_broadcast_movies: null,
  },
  subs_channel: null,
  chat_setting: {
    name_color: "#f4a341",
    is_premium_hidden: true,
    limited_continuous_chat: false,
    continuous_chat_threshold: 0,
    limited_unfollower_chat: false,
    unfollower_chat_threshold: 0,
    limited_fresh_user_chat: false,
    fresh_user_chat_threshold: 0,
    limited_temporary_blacklist: false,
    temporary_blacklist_threshold: 0,
    limited_warned_user_chat: false,
    chat_rule: "",
  },
  game: {
    id: "splatoon2",
    game_id: 1424,
    title: "Splatoon2（スプラトゥーン2）",
    introduction:
      "2017年夏発売。↵↵4対4のナワバリバトルの基本はそのままに、バトルの舞台は変化し、ファッションやブキも進化。スペシャルウェポンも一新。↵↵今作でも発売後のアップデートやゲーム内イベントの開催を予定。↵↵インターネットでフレンドや見知らぬ人と対戦できることはもちろん、本体を持ち寄って仲間と顔を合わせての対戦も可能。↵↵https://www.nintendo.co.jp/software/switch/splatoon2/↵↵(C)2017 Nintendo",
    title_image_url:
      "https://hayabusa.io/openrec-image/game_title/15/1424.w150.ttl3600.jpg?format=jpg&progressive=true",
    cover_image_url:
      "https://hayabusa.io/openrec-image/game_cover/15/1424.w845.ttl3600.jpg?format=jpg&progressive=true",
    app_store_url: "",
    play_store_url: "",
    schema_url: "",
    package_name: "",
    license_status: 0,
    notice_message: "",
    monetize_status: 1,
    cero_rating: 0,
    is_portrait: false,
    released_at: null,
    maker: null,
    platform_mobile: "",
    platform_pc: "",
    platform_console: "Switch",
    platform_arcade: "",
    is_platform_mobile: false,
    is_platform_pc: false,
    is_platform_console: true,
    is_platform_arcade: false,
    stats: {
      live_views: null,
      movie_count: null,
      total_views: null,
      creator_count: null,
      last_update_at: null,
    },
  },
  next: null,
  casts: [],
  popularity: 573,
  is_live_viewers: true,
  public_type: "all",
  chat_public_type: "all",
  archive_public_type: "all",
  poll: null,
  poll_use_target: null,
  view_history: {
    views_at: null,
    play_position: 0,
  },
}

// コメントサンプル
// NOTE: badgeは特殊なものがある場合のみ追加される（サブスクマークなど）
export const resNormalCommentSample: OpenrecCommentResponse = {
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

export const resStampSample: OpenrecCommentResponse = {
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

export const resCaptureSample: OpenrecCaptureResponse = {
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

export const resAuthorCommentSample: OpenrecCommentResponse = {
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

export const resYellSample: OpenrecCommentResponse = {
  movie_id: 1655697,
  live_type: 1,
  onair_status: 1,
  user_id: 413052603,
  openrec_user_id: 1910999,
  user_name: "ごっしぃ",
  user_type: "2",
  user_key: "Goshi1015",
  user_identify_id: "7BbnzP96gBW",
  user_rank: 0,
  chat_id: 341378135,
  item: 0,
  golds: 0,
  message: "緑のうさぎ風いいんすか!?が聞きたくて笑",
  cre_dt: "2020-04-15 20:35:58",
  message_dt: "2020-04-15 20:35:41",
  is_fresh: 0,
  is_warned: 0,
  is_moderator: 0,
  is_premium: 0,
  is_authenticated: 1,
  has_banned_word: 0,
  stamp: null,
  quality_type: 1,
  user_icon: "https://openrec-appdata.s3.amazonaws.com/user/4130527/413052603.png?1581725208",
  supporter_rank: 0,
  is_creaters: 0,
  is_premium_hidden: 0,
  user_color: "#94FF0D",
  yell: {
    yell_id: 171,
    name: "01_winterfood",
    label: "[公開]_02_winterfood",
    image_url: "https://dqd0jw5gvbchn.cloudfront.net/yell/171/eb06122f3a2e297895078dd1639e09c59ed8797b.gif",
    image_url_small: "",
    animation_url: "",
    points: 200,
    yells: 160,
    ticker_seconds: 10,
  },
  yell_type: "channel",
  to_user: {
    id: "tototArisakaaa",
    openrec_user_id: 9150,
    recxuser_id: 375495,
    nickname: "ありさか",
    introduction:
      "YoutubeとOPENRECで時間不定期で配信してます↵ ↵【所属チーム】↵Crazy Raccoon↵↵お仕事依頼はこちらにご連絡ください↵crazyraccoon1205@gmail.com↵↵twitter↵https://twitter.com/ArisakaaaT↵amazon欲しいもの↵http://amzn.asia/fHD8uqD ↵youtube↵https://www.youtube.com/channel/UCLLuaTElO1eRGOo2qc_Rdsw?view_as=subscriber↵",
    icon_image_url: "https://hayabusa.io/openrec-image/user/3755/375495.w90.ttl3600.v1518946365.png?format=png",
    l_icon_image_url: "https://hayabusa.io/openrec-image/user/3755/375495.w320.ttl3600.v1518946365.png?format=png",
    cover_image_url:
      "https://hayabusa.io/openrec-image/user_background/3755/375495_cover.w210.ttl3600.v1586456686.png?format=png",
    l_cover_image_url:
      "https://hayabusa.io/openrec-image/user_background/3755/375495_cover.ttl3600.v1586456686.png?format=png",
    follows: 23,
    followers: 25955,
    is_premium: true,
    is_official: true,
    is_fresh: false,
    is_warned: false,
    is_team: false,
    is_league_yell: false,
    is_live: false,
    live_views: 0,
    last_updated_at: "2020-04-15T20:21:11+09:00",
    user_status: "publish",
    is_creator: true,
    premium_start_at: null,
    premium_charge_type: null,
    premium_payment_status: null,
    email: null,
    twitter_screen_name: null,
  },
  capture: null,
  item_data: null,
  display_dt: "0秒前",
  del_flg: 0,
  badges: [
    {
      id: 82,
      image_url: "https://dqd0jw5gvbchn.cloudfront.net/badge/subscription/16/20_1_20200413150408.png",
      label: "ありさかのサブスク",
      type: "subscription",
      subscription: {
        months: 1,
        tier: 0,
      },
    },
  ],
}
