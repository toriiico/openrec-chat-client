import React, { FC, Props, useState, useEffect, useRef } from "react"
import { RouteComponentProps } from "react-router"

// なぜかファイル読み込みエラー
// import giftAudio from "../../../../lib/assets/gift.mp3"

import "./index.css"

// TODO: Audioをstateで持つ？

// TODO: 一旦
import { WebSocketManager, CommentDeliver, removeHtml } from "../../../../lib/utils"
import { demoModeStart, chatTest } from "../../../../lib/utils/demo"
import { currentVer } from "../../../../lib/configs"
import { updateGiftList, getMovieId } from "../../../../lib/utils/openrec"

const channelId = "Tori_baado"
const demoMode = false

/////////////////////////////////////////////////////////
////////////            宣言                  ///////////
////////////////////////////////////////////////////////

// const notificationArea = $(".notificationArea")
let mainLoop
let renderText = []

/////////////////////////////////////////////////////////
////////////            function             ////////////
////////////////////////////////////////////////////////

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

// let checkFunc = () => {
//   if (renderText.length) {
//     let feedAreaDisplay = notificationArea.css("display")
//     if (feedAreaDisplay == "none") {
//       requestTextillate(renderText[0])
//       renderText.splice(0, 1)
//     }
//   }
// }

// let versionDisplay = () => {
//   $(".versionArea").text(currentVer)
//   setTimeout(() => {
//     $(".versionArea").fadeOut(1000)
//   }, 2000)
// }

/////////////////////////////////////////////////////////
////////////            メイン処理            ////////////
////////////////////////////////////////////////////////

// $(document).ready(function () {
//   mainLoop = setInterval(checkFunc, 1000)
//   startConnect()
//   versionDisplay()
// })

type MainProps = Props<{}> & RouteComponentProps<any>

const Component: FC<MainProps> = (props) => {
  const { location } = props

  const queryParams = new URLSearchParams(location.search)

  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null)
  const [onairInfo, setOnairInfo] = useState<{ id: string; title: string; channel: string } | null>(null)
  const [giftList, setGiftList] = useState<Array<any> | null>(null)
  const [notice, setNotice] = useState("")
  const onairObserverTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // get gift list
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
      setNotice("放送が始まるのを待機しています...")
      onairObserver()
    }

    return () => {
      wsManager?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (onairInfo !== null) {
      setWsManager(new WebSocketManager(onairInfo.id))
    }
  }, [onairInfo])

  useEffect(() => {
    if (wsManager) {
      console.log("セツゾク")
      wsManager.connect()
    }
  }, [wsManager])

  const onairObserver = () => {
    getMovieId(channelId)
      .then((data) => {
        const nowOnair = data.find((val: any) => val.onair_status === 1)

        if (nowOnair) {
          setOnairInfo({
            id: nowOnair.movie_id,
            title: nowOnair.title,
            channel: nowOnair.channel.name,
          })
          console.log("取得できたね")
          console.log(data)
        } else {
          console.log("getMovieId success(not onair)")
          // onairじゃなかったら定期的に取得
          onairObserverTimerRef.current = setTimeout(onairObserver, 7000)
        }
      })
      .catch((err) => {
        throw new Error("Failed get movie id.")
      })
  }

  return (
    <>
      <div className="chatArea"></div>
      <div className="giftArea"></div>
      <div className="notificationArea">{notice}</div>
      <div className="versionArea">Loading...</div>
      {/* <audio id='soundGift' preload="auto" src="assets/gift.mp3?200327" itemType="audio/mp3"></audio> */}
    </>
  )
}

export default Component
