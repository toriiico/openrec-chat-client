import React, { FC, Props, useState, useEffect, useRef } from "react"
import { RouteComponentProps } from "react-router"

// なぜかファイル読み込みエラー
// import giftAudio from "../../../../lib/assets/gift.mp3"

import "./index.css"

// TODO: Audioをstateで持つ？

// TODO: 一旦
import { WebSocketManager, CommentDeliver, removeHtml, CommentObserver } from "../../../../lib/utils"
import { demoModeStart, chatTest } from "../../../../lib/utils/demo"
import { updateGiftList, getMovieId, OpenrecCommentResponse } from "../../../../lib/utils/openrec"
import { stampSize } from "../../../../lib/configs"

// let noticeDraw = (text: string, type: string) => {
//   if (type == "viewerOnly") return
//   else renderText.unshift({ text: text, type: type })
// }

// let requestTextillate = (d) => {
//   notificationArea.css("left", "110%")
//   notificationArea.text(removeHtml(d.text))
//   notificationArea.css("display", "block")
//   let goalLeft = 20

//   notificationArea.animate({ left: goalLeft }, 1000, "swing", function () {
//     notificationArea.animate({ left: goalLeft }, 3000, "swing", function () {
//       notificationArea.fadeOut(200)
//     })
//   })
// }

type MainProps = Props<{}> & RouteComponentProps<any>

// コメントによって内容が結構変わったりするので、
type ForOnairComment = Partial<OpenrecCommentResponse>
type ForOnairComments = Array<ForOnairComment>

const Component: FC<MainProps> = (props) => {
  const { location } = props

  const [queryParams] = useState(new URLSearchParams(location.search))
  const [channelId] = useState(queryParams.get("channelId"))
  const [demoMode] = useState(queryParams.get("demoMode"))

  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null)
  const [commentObserver, setCommentObserver] = useState<CommentObserver>(new CommentObserver())
  const [onairInfo, setOnairInfo] = useState<{ id: string; title: string; channel: string } | null>(null)
  const [giftList, setGiftList] = useState<Array<any> | null>(null)
  const [comments, setComments] = useState<ForOnairComments>([])
  const [latestComment, setLatestComment] = useState<ForOnairComment>({})

  const onairObserverTimerRef = useRef<NodeJS.Timeout>()
  const commentObserverTimerRef = useRef<NodeJS.Timeout>()
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // ギフト情報取得
    // if (giftList === null) {
    //   updateGiftList().then((data) => {
    //     setGiftList(data)
    //   })
    // }

    // デモ開始
    if (demoMode) {
      setTimeout(demoModeStart, 1000)
      setTimeout(chatTest, 1000, "じん", "応援してます！", 0, 179) // デモ用に確定でエールを表示
    } else {
      // 本番通信
      const forOnair = { message: "放送が始まるのを待機しています..." }
      setComments((prevState) => [...prevState, forOnair])
      onairObserver()
    }

    return () => {
      wsManager?.disconnect()
    }
  }, [])

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

  useEffect(() => {
    if (wsManager) {
      wsManager.connect()
    }
  }, [wsManager])

  useEffect(() => {
    if (!comments[comments.length - 1]?.chat_id || !latestComment?.chat_id) return
    if (comments[comments.length - 1].chat_id === latestComment.chat_id) return

    const nowBottom = window.innerHeight + window.scrollY
    const contentBottom = scrollTargetRef.current?.scrollHeight

    if (!contentBottom) return

    const AUTO_SCROLL_START_MARGIN = 60

    if (nowBottom >= contentBottom - AUTO_SCROLL_START_MARGIN) {
      console.log("スクロール！")
      scrollTargetRef.current?.scrollIntoView(false)
    } else {
      console.info("オートスクロール無効中")
    }
  }, [comments])

  // 配信情報を取得
  const onairObserver = () => {
    if (!channelId) return

    getMovieId(channelId)
      .then((data) => {
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
          console.log("getMovieId success(not onair)")
          // onairじゃなかったら定期的にオンラインかどうか確認
          onairObserverTimerRef.current = setTimeout(onairObserver, 10000)
        }
      })
      .catch((err) => {
        throw new Error("Failed get movie id. Please check if it is a valid user ID.")
      })
  }

  if (!channelId) {
    return <div>チャンネルIDが指定されていません。</div>
  }

  return (
    <>
      <div className="chatArea" ref={scrollTargetRef}>
        <Comments comments={comments} />
      </div>
      <div className="giftArea"></div>
      {/* <audio id='soundGift' preload="auto" src="assets/gift.mp3?200327" itemType="audio/mp3"></audio> */}
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

  if (comment.yell) {
    return (
      <div>
        <img src={comment.yell.image_url} className="yell" />
        <span>{comment.message}</span>
      </div>
    )
  }

  return <div>{comment.message}</div>
}

export default Component
