/////////////////////////////////////////////////////////
////////////            宣言                  ///////////
////////////////////////////////////////////////////////

let ws, socket, onairTitle, onairChannel, giftList;
let handshakeLoop, getMovieIdLoop;

/////////////////////////////////////////////////////////
////////////            function             ////////////
////////////////////////////////////////////////////////

let startConnect = () => {
    if(demoMode) return;
    noticeDraw('放送が始まるのを待機しています...', 'viewerOnly');

    getMovieId().done((json) => {
        let onairId;
        json.forEach((val) => {
            if(val.onair_status == 1) {
                onairId = val.movie_id;
                onairTitle = val.title;
                onairChannel = val.channel.name;
            }
        });
        if(onairId) {
            wsConnect(onairId);

        } else {
            console.log('getMovieId success(not onair)');
            getMovieIdLoop = setTimeout(startConnect, 7000);
        }
    }).fail(() => { console.log('getMovieId failed'); });
}

let getMovieId = () => {
    let url = 'https://public.openrec.tv/external/api/v5/movies?channel_id='+channelId;
    return $.ajax({ url: url, type: 'GET' });
}

let updateGiftList = () => {
    getGiftList().done((res) => {
        giftList = res;
        console.log('Gift List Loaded.');
    }).fail((res) => { console.log('getGiftList failed'); });
}

let getGiftList = () => {
    let url = 'https://public.openrec.tv/external/api/v5/yell-products';
    return $.ajax({ url: url, type: 'GET' });
}

let randText = (type, len) => {
    let p = 36;

    if(type == 'Int') p = 10;
    if(!len) len = 10;

    return Math.random().toString(p).slice(0-len);
}

let chatTest = (name, text, stamp, yell) => {
    if(!name) name = 'TESTER';
    if(!text) text = 'TEST';
    if(!stamp) stamp = null;
    else {
        stamp = {
            "stamp_id": stamp,
            "group_id": 0,
            "image_url": "https://dqd0jw5gvbchn.cloudfront.net/stamp/15/128/8198d84b09dc00b8afb770941efe8dfd8b3e47d3.png"
        }
    }
    if(!yell) yell = null;
    else {
        yell = {
            yell_id: yell,
            name: "01_winterfood",
            label: "[公開]_02_winterfood",
            image_url: "",
            image_url_small: "",
            animation_url: "",
            points: 200,
            yells: 160,
            ticker_seconds: 10,
        }
    }

    let provJson = {
        "movie_id": 1623780,
        "live_type": 1,
        "onair_status": 1,
        "user_id": 60404115,
        "openrec_user_id": 509107,
        "user_name": name,
        "user_type": "2",
        "user_key": "",
        "user_identify_id": "",
        "user_rank": 0,
        "chat_id": 335388228,
        "item": 0,
        "golds": 0,
        "message": text,
        "cre_dt": "2020-03-25 18:46:54",
        "message_dt": "2020-03-25 18:46:54",
        "is_fresh": 1,
        "is_warned": 0,
        "is_moderator": 0,
        "is_premium": 1,
        "is_authenticated": 1,
        "has_banned_word": 0,
        "stamp": stamp,
        "quality_type": 2,
        "user_icon": "https://dqd0jw5gvbchn.cloudfront.net/tv/v8.11.0/static/images/favicons/favicon.ico",
        "supporter_rank": 0,
        "is_creaters": 0,
        "is_premium_hidden": 0,
        "user_color": "#"+Math.floor(Math.random() * 0xFFFFFF).toString(16),
        "yell": yell,
        "yell_type": null,
        "to_user": null,
        "capture": null,
        "item_data": null,
        "display_dt": "0秒前",
        "del_flg": 0,
        "badges": []
    }

    let messageJson = new Comment(provJson);
    messageJson.push();
}

let demoTexts = ["こんにちは","こんばんは","こんにちわ～","おじゃまします","やっほー","こんばんわ","今日は何のゲーム？","888888","うまい！","調子いいですね","今日は早いですね","めっちゃ早口だw","wwww","わろた","草","さすがに草","面白いですね","初見","初見です","やあやあ","はじめまして","おー","なるほど","これはすごい","ぬるぽ","テスト","コメント流れてる","てすとてすと","ツイッターもフォローしました","チャンネル登録しました","おばんどす","どうもありがとうございました。","おつかれさまです","おつかれさまでした","おつかれした"];
let demoNames = ["えま","しおり","りお","はな","ほのか","あかり","ゆい","はるか","めい","りこ","みお","さき","かのん","かんな","あやか","かほ","さな","あんな","さえ","みのり","いちか","ゆう","さくら","なお","ゆうな","りん","ひな","あいり","なつき","かえで","ひかり","みゆ","さら","すみれ","ゆり","みさき","ひまり","みつき","かりん","なな","ももか","ふうか","ゆいか","ゆな","りな","りの","れいな","みれい","せな","まお","みう","ゆいな","ちひろ","つむぎ","ななみ","かな","はづき","みく","こはる","ひなこ","すず","えな","すずか","りおな","ゆうか","うた","かすみ","まい","まな","りんか","あん","なぎさ","ひより","りりか","あやね","ありさ","ことは","さやか","しほ","ちさ","りさ","りほ","いろは","みこと","ゆめ","あやの","さほ","みおり","あかね","さや","ともか","のぞみ","ゆき","れな","ちさと","あやな","まゆ","みづき","るな","わかな"];

let demoModeStart = (is_yell) => {
    let demoYell = 0, demoStamp = 0;
    let demoText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
    let demoName = demoNames[Math.floor(Math.random() * demoNames.length)];
    let rnd = Math.floor(Math.random() * 100);
    if(rnd >= 98) demoYell = 179;
    else if(rnd >= 88) demoStamp = 1;
    if(is_yell) demoYell = 179;

    chatTest(demoName, demoText, demoStamp, demoYell);

    let rnd2 = Math.floor(Math.random() * 1000);
    setTimeout(demoModeStart, rnd2);
}

/////////////////////////////////////////////////////////
////////////            メイン処理            ////////////
////////////////////////////////////////////////////////

$(document).ready(function () {
    updateGiftList();
    if(demoMode) {
        setTimeout(demoModeStart, 1000);
        setTimeout(chatTest, 1000, 'じん', '応援してます！', false, 179); // デモ用に確定でエールを表示
        wsDisconnect();
    }
    $(window).on("beforeunload", (e) => { wsDisconnect() });
});

//////////////////////////////////////////////////////////////
////////////            WebSocketの処理            ////////////
//////////////////////////////////////////////////////////////

let wsConnect = (id) => {
    if(!id) return;
    let wsUri = 'wss://chat.openrec.tv/socket.io/?movieId='+id+'&EIO=3&transport=websocket';
    ws = new WebSocket(wsUri);

    ws.onopen = (e) => { onOpen(e) };
    ws.onclose = (e) => { onClose(e) };
    ws.onmessage = (e) => { onMessage(e) };
    ws.onerror = (e) => { onError(e) };
}

let wsDisconnect = () => {
    try { ws.close(); }
    catch(e) {}

    try { clearTimeout(getMovieIdLoop); }
    catch(e) {}
}

let onOpen = (e) => {
    console.log('CONNECTED');
    noticeDraw('[接続] '+onairChannel+'/'+onairTitle, 'open');
    handshakeLoop = setInterval(handshake, 25000)
}

let onClose = (e) => {
    console.log('DISCONNECTED');
    noticeDraw('[切断] '+onairChannel+'/'+onairTitle, 'close');
    clearInterval(handshakeLoop);
}

let onMessage = (e) => {
    let rawText, json, unescapeed;

    try {
        if(e.data == 3) {
            // handshakeを送った時の反応

        } else if(e.data == '40'){
            // 通信開始時に送られてくる

        } else if(e.data.slice(0,1) == '0'){
            // 通信開始時に送られてくるpingやtimeoutの秒数など
            rawText = e.data.slice(1);
            json = JSON.parse(rawText);
            console.log(json);

        } else {
            // message
            rawText = "\""+e.data.slice(14,-2)+"\"";
            //unescapeed = rawText.replace(/\\"/g, '"');
            json = JSON.parse(rawText);
            json = JSON.parse(json);

            console.log(json)

            if(json.type == 0){
                // コメント
                let messageJson = new Comment(json.data);
                messageJson.push();

            } else if (json.type == 1) {
                // 同時接続数と視聴数

            } else if (json.type == 3) {
                // 生放送が終了
                console.log('live end');
                wsDisconnect();

            } else if (json.type == 10) {
                // 放送タイプ(public_type)

            } else {
                console.log(json.type, json.data);
            }
        }

    } catch(er){
        if(e.data) console.log(e.data);
        else console.log(e);
        console.log(er);
    }
}

let onError = (e) => {
    console.log('ERROR:' + e.data);
    ws.close();
}

let handshake = () => {
    ws.send(2);
    console.log('handshake');
}

let removeHtml = (str) => {
    return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
}

/////////////////////////////////////////////////////
////////////            class            ////////////
/////////////////////////////////////////////////////

class Comment {
    constructor(json) {
      this.user_name = removeHtml(json.user_name);
      this.user_identify_id = json.user_identify_id;
      this.message = removeHtml(json.message);
      this.message_dt = json.message_dt;
      this.is_fresh = json.is_fresh;
      this.is_warned = json.is_warned;
      this.is_moderator = json.is_moderator;
      this.user_type = json.user_type;
      this.is_official = json.is_official;
      this.is_authenticated = json.is_authenticated;
      this.user_icon = json.user_icon;
      this.user_color = json.user_color;
      this.stamp = json.stamp;
      this.yell = json.yell;
      this.yell_type = json.yell_type;
    }

    push(){
        let svgUrlBase = 'https://dqd0jw5gvbchn.cloudfront.net/tv/v8.11.0/static/svg/commons';
        if(this.user_type == '1') this.user_name += '<img src="'+svgUrlBase+'/official.svg" class="mark">';
        if(this.is_premium) this.user_name += '<img src="'+svgUrlBase+'/premium.svg" class="mark">';
        if(this.is_moderator) this.user_name += '<img src="'+svgUrlBase+'/moderator.svg" class="mark">';
        if(this.is_fresh) this.user_name += '<img src="'+svgUrlBase+'/begginer.svg" class="mark">';
        if(this.is_warned) this.user_name += '<img src="'+svgUrlBase+'/warned.svg" class="mark">';

        if(this.yell) giftDraw(this.yell.yell_id, 1, this.user_name, this.message, this.stamp);
        else chatDraw(this.message, this.user_name, this.user_icon, this.user_color, this.stamp);

        return;
    }
}

