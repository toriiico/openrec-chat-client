import React, { FC, Props, useState, useEffect } from "react"

import { baseUrl, currentVer } from "../../../../lib/configs"
import "./index.css"

type FormValues = {
  channelId: string
  chatInUserName: boolean
  chatColorMode: boolean
  chatSize: string
  stampSize: string
  chatSpeed: string
  chatLengthMax: string
  giftNoticeMode: boolean
  giftNoticeFeederMode: boolean
  giftSpeed: string
  giftNoticeSound: boolean
  demoMode: boolean
}

const defaultFormValues: FormValues = {
  channelId: "",
  chatInUserName: false,
  chatColorMode: false,
  chatSize: "60",
  stampSize: "128",
  chatSpeed: "7000",
  chatLengthMax: "30",
  giftNoticeMode: true,
  giftNoticeFeederMode: true,
  giftSpeed: "5000",
  giftNoticeSound: false,
  demoMode: false,
}

const generateOutputUrl = (values: FormValues, preview?: boolean) => {
  let paramText = "?channelId=" + values.channelId
  if (values.chatInUserName) paramText += "&chatInUserName=" + values.chatInUserName
  if (values.chatColorMode) paramText += "&chatColorMode=" + values.chatColorMode
  if (values.chatSize) paramText += "&chatSize=" + values.chatSize
  if (values.stampSize) paramText += "&stampSize=" + values.stampSize
  if (values.chatSpeed) paramText += "&chatSpeed=" + values.chatSpeed
  if (values.chatLengthMax) paramText += "&chatLengthMax=" + values.chatLengthMax
  if (values.giftNoticeMode) paramText += "&giftNoticeMode=" + values.giftNoticeMode
  if (values.giftNoticeFeederMode) paramText += "&giftNoticeFeederMode=" + values.giftNoticeFeederMode
  if (values.giftSpeed) paramText += "&giftSpeed=" + values.giftSpeed
  if (values.giftNoticeSound) paramText += "&giftNoticeSound=" + values.giftNoticeSound
  const d = new Date()
  const t = Math.floor(d.getTime() / 1000)
  paramText += "&t=" + t
  paramText += "&v=" + currentVer.replace(/[^0-9]/g, "")

  if (preview) {
    return baseUrl + paramText + "&demoMode=true&rnd=" + Math.random()
  }

  if (values.demoMode) paramText += "&demoMode=" + values.demoMode
  return baseUrl + paramText
}

type MainProps = Props<{}>

const Component: FC<MainProps> = () => {
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues)
  const [outputUrl, setOutputUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (formValues.channelId === "") {
      setOutputUrl("チャンネルIDを入力するとURLが発行されます")
    } else {
      const newOutputUrl = generateOutputUrl(formValues)
      setOutputUrl(newOutputUrl)
      const newPreviewUrl = generateOutputUrl(formValues, true)
      setPreviewUrl(newPreviewUrl)
    }
  }, [formValues])

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    }
  }, [isCopied])

  const handleChange = (e: any) => {
    e.persist()

    const id = String(e.target.id).replace("inp-", "")

    setFormValues((state) => {
      return {
        ...state,
        [id]: e.target.value,
      }
    })
  }

  const handleChangeCheckBox = (e: any) => {
    e.persist()
    console.log(e.target.value)
    console.log(e.target.id)

    const id = String(e.target.id).replace("chk-", "")

    setFormValues((state) => {
      return {
        ...state,
        [id]: !state[id],
      }
    })
  }

  const copyText = (e: any) => {
    if (!formValues.channelId) return

    e.target.select()
    document.execCommand("Copy")
    setIsCopied(true)
  }

  return (
    <div className="root">
      <div id="title-area">
        <h1>OPENREC Chat Client - URL Generator</h1>
        <span>{currentVer}</span>
      </div>

      <div id="commentary-area">
        <h3>これは何か</h3>
        <p style={{ whiteSpace: "break-spaces" }}>
          {`
          OPENRECの放送画面に、コメントやエールの画面を流すことができるツールです。
          このツールは個人で開発しているものなので、ある日突然使えなくなる可能性があります。 詳しい使い方については
          `}
          <a href="https://tokaisodachi.com/archives/2295">こちらのページ</a>
          {`をご覧ください。
          「こういう機能を付けてほしい」という方は気軽に相談して下さい。
          `}
        </p>
        <h3>株式会社ドワンゴの特許について</h3>
        <p style={{ whiteSpace: "break-spaces" }}>
          {`
          株式会社ドワンゴの特許（特許第4695583、特許第4734471）は、
          「コメントを、コメント付与時間と動画再生時間を用いてシンクロさせ、動画上に表示させる」装置の特許です。
          一方で、このツールは「生配信のコメントをリアルタイムに表示する」だけのツールです。
          コメント付与時間も動画再生時間もプログラム上で利用していません。
          株式会社ドワンゴの特許侵害にはなっていませんので、ご安心してご利用ください。
          `}
        </p>
      </div>

      <div id="param-area">
        <p id="option-text">設定</p>
        <p className="param-text2">
          チャンネルID:{" "}
          <input
            type="text"
            placeholder="必須"
            value={formValues.channelId}
            className="inputBox"
            id="inp-channelId"
            onChange={handleChange}
          />
          ※https://www.openrec.tv/user/***** ←ここの部分
        </p>
        <label>
          <input
            id="chk-chatInUserName"
            className="chkbx"
            type="checkbox"
            checked={formValues.chatInUserName}
            onChange={handleChangeCheckBox}
          />
          <p className="chkbx-parts">流れるコメントに@名前を含める</p>
        </label>
        <label>
          <input
            id="chk-chatColorMode"
            className="chkbx"
            type="checkbox"
            checked={formValues.chatColorMode}
            onChange={handleChangeCheckBox}
          />
          <p className="chkbx-parts">流れるコメントの色をユーザが設定した色にする</p>
        </label>
        <p className="param-text2">
          流れるコメントの大きさ:{" "}
          <input
            type="text"
            placeholder=""
            className="inputBox"
            id="inp-chatSize"
            value={formValues.chatSize}
            onChange={handleChange}
          />
          px
        </p>
        <p className="param-text2">
          流れるスタンプの大きさ:{" "}
          <input
            type="text"
            placeholder=""
            className="inputBox"
            id="inp-stampSize"
            value={formValues.stampSize}
            onChange={handleChange}
          />
          px
        </p>
        <p className="param-text2">
          コメントが流れる速度:{" "}
          <input
            type="text"
            placeholder=""
            className="inputBox"
            id="inp-chatSpeed"
            value={formValues.chatSpeed}
            onChange={handleChange}
          />
          ※少ないほど早い
        </p>
        <p className="param-text2">
          コメントの最大表示文字数:{" "}
          <input
            type="text"
            placeholder=""
            className="inputBox"
            id="inp-chatLengthMax"
            value={formValues.chatLengthMax}
            onChange={handleChange}
          />
          ※超えた分は省略して表示
        </p>
        <label>
          <input
            id="chk-giftNoticeMode"
            className="chkbx"
            type="checkbox"
            checked={formValues.giftNoticeMode}
            onChange={handleChangeCheckBox}
          />
          <p className="chkbx-parts">エールがきたら画面上から降ってくる</p>
        </label>
        <label>
          <input
            id="chk-giftNoticeFeederMode"
            className="chkbx"
            type="checkbox"
            checked={formValues.giftNoticeFeederMode}
            onChange={handleChangeCheckBox}
          />
          <p className="chkbx-parts">エールがきたら画面下に詳細が流れる</p>
        </label>
        <p className="param-text2">
          エールが落ちる速度:{" "}
          <input
            type="text"
            placeholder=""
            className="inputBox"
            id="inp-giftSpeed"
            value={formValues.giftSpeed}
            onChange={handleChange}
          />
          ※少ないほど早い
        </p>
        <label>
          <input
            id="chk-giftNoticeSound"
            className="chkbx"
            type="checkbox"
            checked={formValues.giftNoticeSound}
            onChange={handleChangeCheckBox}
          />
          <p className="chkbx-parts">エールが来た時に音を鳴らす</p>
        </label>
        ※PREVIEWだとならないかも
        <label>
          <input
            id="chk-demoMode"
            className="chkbx"
            type="checkbox"
            checked={formValues.demoMode}
            onChange={handleChangeCheckBox}
          />
          <p className="chkbx-parts">デモモード</p>
        </label>
      </div>

      <span className="output-text">OUTPUT URL</span>
      <div id="output-area">
        <input
          type="text"
          placeholder=""
          value={outputUrl}
          className="outputBox"
          id="outputUrl"
          onFocus={copyText}
          readOnly
        />
      </div>
      <div id="copied-text" style={{ transition: "1s", opacity: isCopied ? 1 : 0 }}>
        コピーしました
      </div>

      <span className="preview-text">PREVIEW</span>
      <div id="iframe-area">
        <iframe
          title="preview"
          // src="./generator.html?channelId=a&chatSpeed=7000&chatLengthMax=30&giftNoticeMode=true&giftNoticeFeederMode=true&giftSpeed=5000&demoMode=true"
          src={previewUrl}
          frameBorder="1"
          width="1920"
          height="1080"
          id="previewFrame"
        ></iframe>
      </div>
    </div>
  )
}

export default Component
