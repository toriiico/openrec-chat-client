import React, { FC, Props, useState, useEffect, useRef } from "react"
import { RouteComponentProps } from "react-router"

import "./index.css"

import { WebSocketManager, CommentObserver } from "../../../../lib/utils"
import {
  getMovieId,
  OpenrecCommentResponse,
  resNormalCommentSample,
  resStampSample,
  resYellSample,
  resCaptureSample,
} from "../../../../lib/utils/openrec"

// TODO: クエリパラメータを手動更新したら良い感じに再設定できるかどうか
//       Xsplit上で行うとどういう挙動になるか確認（要点はリロードかかるのかどうか）
// TODO: コメントが一定数以上の数になったら削除できるように（パラメータで上限指定可能に）
// TODO: Top画面からパラメータ指定するように（下記のデフォルト値などもTop画面依存とする）

// 配信者がオフラインだった場合に配信されているか再確認する間隔
const RETRY_CHECK_ONAIR_MILLISEC = 10000
// 自動スクロール判定の高さ。自動スクロール中に指定数値ピクセル分過去にスクロールすると自動スクロールが無効化されます。（表現難しい。。。）
// スクロール判定間隔が短いと無効化が難しくなります。テキストやスタンプサイズにも影響されます。
const DEFAULT_AUTO_SCROLL_START_MARGIN = 1000
// スクロール判定間隔。少ないほど頻繁にスクロール実行確認および実行を行います。間隔を短くするほどパフォーマンスに影響します。
const DEFAULT_AUTO_SCROLL_INTERVAL = 500
const DEFAULT_TEXT_SIZE = 14
const DEFAULT_STAMP_SIZE = 100
const DEFAULT_YELL_SIZE = 100
const DEFAULT_CAPTURE_SIZE = 100

type MainProps = Props<{}> & RouteComponentProps<any>

// コメントによって内容が結構変わったりするので、
type ForOnairComment = Partial<OpenrecCommentResponse>
type ForOnairComments = Array<ForOnairComment>

const Component: FC<MainProps> = (props) => {
  const { location } = props

  /**
   * クエリパラメータ管理
   */
  const queryParams = new URLSearchParams(location.search)
  const [channelId] = useState(queryParams.get("channelId"))
  const [demoMode] = useState<boolean>(queryParams.get("demoMode") === "on")
  // 0を許容したいのでやや冗長な書き方に
  const autoScrollStartMargin =
    queryParams.get("autoScrollStartMargin") && queryParams.get("autoScrollStartMargin") !== ""
      ? Number(queryParams.get("autoScrollStartMargin"))
      : DEFAULT_AUTO_SCROLL_START_MARGIN
  const autoScrollInterval = queryParams.get("autoScrollInterval")
    ? Number(queryParams.get("autoScrollInterval"))
    : DEFAULT_AUTO_SCROLL_INTERVAL

  const style = {
    textSize: queryParams.get("textSize") ? Number(queryParams.get("textSize")) : DEFAULT_TEXT_SIZE,
    stampSize: queryParams.get("stampSize") ? Number(queryParams.get("stampSize")) : DEFAULT_STAMP_SIZE,
    yellSize: queryParams.get("yellSize") ? Number(queryParams.get("yellSize")) : DEFAULT_YELL_SIZE,
    captureSize: queryParams.get("captureSize") ? Number(queryParams.get("captureSize")) : DEFAULT_CAPTURE_SIZE,
  }

  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null)
  const [commentObserver] = useState<CommentObserver>(new CommentObserver())
  const [onairInfo, setOnairInfo] = useState<{ id: string; title: string; channel: string } | null>(null)
  const [comments, setComments] = useState<ForOnairComments>([])

  const onairObserverTimerRef = useRef<NodeJS.Timeout>()
  const commentObserverTimerRef = useRef<NodeJS.Timeout>()
  const autoScrollTimerRef = useRef<NodeJS.Timeout>()
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  const nowBottom = window.innerHeight + window.scrollY
  const contentBottom = scrollTargetRef.current?.scrollHeight

  console.log(window.innerHeight, window.scrollY, nowBottom, contentBottom)

  useEffect(() => {
    // デモ開始
    if (demoMode) {
      const comment: ForOnairComment = {
        message: "デモ配信スタート（channelIdは無視されます）",
        chat_id: new Date().getTime(),
      }
      setComments([comment])

      setInterval(() => {
        setComments((prevState) => [...prevState, { ...resNormalCommentSample, chat_id: new Date().getTime() }])
        setComments((prevState) => [...prevState, { ...resStampSample, chat_id: new Date().getTime() }])
        setComments((prevState) => [...prevState, { ...resYellSample, chat_id: new Date().getTime() }])
        setComments((prevState) => [...prevState, { ...resCaptureSample, chat_id: new Date().getTime() }])
      }, 3000)
    } else {
      // 本番通信
      const comment = { message: "配信開始を待っています..." }
      setComments([comment])
      onairObserver()
    }

    return () => {
      wsManager?.disconnect()
    }
  }, [])

  /**
   * クエリイベント管理
   */
  useEffect(() => {
    if (channelId !== queryParams.get("channelId")) {
      window.location.reload()
    }
    if (demoMode !== (queryParams.get("demoMode") === "on")) {
      window.location.reload()
    }
  }, [location])

  /**
   * 配信状況管理
   */
  useEffect(() => {
    if (onairInfo !== null) {
      setWsManager(new WebSocketManager(onairInfo.id, commentObserver))

      commentObserverTimerRef.current = setInterval(() => {
        const comments = commentObserver.readers
        setComments(JSON.parse(JSON.stringify(comments)))
      }, 500)
    }
  }, [onairInfo])

  /**
   * WebSocket管理
   */
  useEffect(() => {
    if (wsManager) {
      wsManager.connect()
    }
  }, [wsManager])

  /**
   * スクロール管理
   */
  useEffect(() => {
    autoScrollTimerRef.current = setInterval(() => {
      const nowBottom = window.innerHeight + window.scrollY
      const contentBottom = scrollTargetRef.current?.scrollHeight

      if (!contentBottom) return

      if (autoScrollStartMargin === 0 || nowBottom >= contentBottom - autoScrollStartMargin) {
        console.log("スクロール")
        scrollTargetRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
      }
    }, autoScrollInterval)
  }, [])

  /**
   * 配信情報の取得処理
   */
  const onairObserver = (): void => {
    if (!channelId) return

    getMovieId(channelId)
      .then((data) => {
        console.log(data)

        const nowOnair = data.find((val: any) => val.onair_status === 1)

        if (nowOnair) {
          setOnairInfo({
            id: nowOnair.movie_id,
            title: nowOnair.title,
            channel: nowOnair.channel.name,
          })
        } else {
          console.log(`Not now onair. retry checking after ${RETRY_CHECK_ONAIR_MILLISEC}ms...`)
          // onairじゃなかったら定期的にオンラインかどうか確認
          onairObserverTimerRef.current = setTimeout(onairObserver, RETRY_CHECK_ONAIR_MILLISEC)
        }
      })
      .catch((err) => {
        throw new Error("Failed get movie id. Please check if it is a valid user ID.")
      })
  }

  if (!demoMode && !channelId) {
    return <div>チャンネルIDが指定されていません。</div>
  }

  return (
    <>
      <div className="chatArea-wrapper">
        <div className="chatArea" ref={scrollTargetRef}>
          <Comments comments={comments} style={style} />
        </div>
      </div>
    </>
  )
}

type CommentStyle = {
  textSize: number
  stampSize: number
  yellSize: number
  captureSize: number
}

const Comments: FC<{ comments: ForOnairComments; style: CommentStyle }> = (props) => {
  const { comments, style } = props
  return (
    <>
      {comments.map((v, i) => (
        <div key={`comment-${v.chat_id}`} className="comment-row">
          <div className="comment-wrapper" style={{ fontSize: style.textSize }}>
            <Comment comment={v} style={style} />
          </div>
        </div>
      ))}
    </>
  )
}

const Comment: FC<{ comment: ForOnairComment; style: CommentStyle }> = (props) => {
  const { comment, style } = props

  if (comment.stamp) {
    return (
      <div>
        <img
          src={comment.stamp.image_url}
          alt={comment.stamp.image_url}
          className="stamp"
          style={{ height: style.stampSize }}
        />
      </div>
    )
  }

  if (comment.capture) {
    return (
      <div>
        <img
          src={comment.capture.capture.thumbnail_url}
          alt={comment.capture.capture.thumbnail_url}
          className="capture"
          style={{ height: style.captureSize }}
        />
        <span>{comment.message}</span>
        <span>{comment.capture.capture.title}</span>
      </div>
    )
  }

  if (comment.yell) {
    return (
      <div>
        <div>{comment.message}</div>
        <img
          src={comment.yell.image_url}
          alt={comment.yell.image_url}
          className="yell"
          style={{ height: style.yellSize }}
        />
        <span>{comment.yell.yells}</span>
      </div>
    )
  }

  return <div>{comment.message}</div>
}

export default Component
