import React, { FC, Props, useState, useEffect, useRef } from "react"
import { RouteComponentProps } from "react-router"

import "./index.css"

// TODO: 一旦
import { WebSocketManager, CommentObserver } from "../../../../lib/utils"
import {
  getMovieId,
  OpenrecCommentResponse,
  resNormalCommentSample,
  resStampSample,
  resYellSample,
  resCaptureSample,
} from "../../../../lib/utils/openrec"
import { stampSize } from "../../../../lib/configs"

const RETRY_CHECK_ONAIR_MILLISEC = 10000
const DEFAULT_AUTO_SCROLL_START_MARGIN = 200
const MIN_AUTO_SCROLL_START_MARGIN = 10

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
  const [autoScrollStartMargin, setAutoScrollStartMargin] = useState<number>(
    queryParams.get("autoScrollStartMargin") && queryParams.get("autoScrollStartMargin") !== ""
      ? Number(queryParams.get("autoScrollStartMargin"))
      : DEFAULT_AUTO_SCROLL_START_MARGIN
  )

  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null)
  const [commentObserver] = useState<CommentObserver>(new CommentObserver())
  const [onairInfo, setOnairInfo] = useState<{ id: string; title: string; channel: string } | null>(null)
  const [comments, setComments] = useState<ForOnairComments>([])
  const [latestComment, setLatestComment] = useState<ForOnairComment>({})

  const onairObserverTimerRef = useRef<NodeJS.Timeout>()
  const commentObserverTimerRef = useRef<NodeJS.Timeout>()
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // 準備
    if (autoScrollStartMargin <= MIN_AUTO_SCROLL_START_MARGIN) {
      setAutoScrollStartMargin(DEFAULT_AUTO_SCROLL_START_MARGIN)
    }

    // デモ開始
    if (demoMode) {
      const comment = { message: "デモ配信スタート" }
      setComments((prevState) => [comment])
      setComments((prevState) => [resNormalCommentSample, resStampSample, resYellSample, resCaptureSample])
    } else {
      // 本番通信
      const comment = { message: "配信開始を待っています..." }
      setComments((prevState) => [comment])
      onairObserver()
    }

    return () => {
      wsManager?.disconnect()
    }
  }, [])

  /**
   * 配信状況管理
   */
  useEffect(() => {
    if (onairInfo !== null) {
      setWsManager(new WebSocketManager(onairInfo.id, commentObserver))

      commentObserverTimerRef.current = setInterval(() => {
        const comments = commentObserver.readers
        // console.log("observer")
        // console.log(comments)
        setComments((prevState) => JSON.parse(JSON.stringify(comments)))
        setLatestComment(comments[comments.length - 1])
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
    if (!comments[comments.length - 1]?.chat_id || !latestComment?.chat_id) return
    if (comments[comments.length - 1].chat_id === latestComment.chat_id) return

    const nowBottom = window.innerHeight + window.scrollY
    const contentBottom = scrollTargetRef.current?.scrollHeight

    if (!contentBottom) return

    if (nowBottom >= contentBottom - autoScrollStartMargin) {
      console.log("スクロール！")
      scrollTargetRef.current?.scrollIntoView(false)
    } else {
      console.info("オートスクロール無効中")
    }
  }, [comments])

  /**
   * 配信情報の取得処理
   */
  const onairObserver = () => {
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
          // console.log("取得できたね")
          // console.log(data)
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
      <div className="chatArea" ref={scrollTargetRef}>
        <Comments comments={comments} />
      </div>
    </>
  )
}

const Comments: FC<{ comments: ForOnairComments }> = (props) => {
  const { comments } = props
  return (
    <>
      {comments.map((v, i) => (
        <div key={`comment-${v.chat_id}`} className="comment-row">
          <div className="comment-wrapper">
            <Comment comment={v} />
          </div>
        </div>
      ))}
    </>
  )
}

const Comment: FC<{ comment: ForOnairComment }> = (props) => {
  const { comment } = props

  if (comment.stamp) {
    return (
      <div>
        <img src={comment.stamp.image_url} className="stamp" style={{ width: stampSize }} />
      </div>
    )
  }

  if (comment.capture) {
    return (
      <div>
        <img src={comment.capture.capture.thumbnail_url} className="capture" />
        <span>{comment.message}</span>
        <span>{comment.capture.capture.title}</span>
      </div>
    )
  }

  if (comment.yell) {
    return (
      <div>
        <div>{comment.message}</div>
        <img src={comment.yell.image_url} className="yell" />
        <span>{comment.yell.yells}</span>
      </div>
    )
  }

  return <div>{comment.message}</div>
}

export default Component
