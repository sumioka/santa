//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////


// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/proj");
// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
  console.log("connect");
  document.getElementById("connectId").innerHTML =
    "あなたの接続ID::" + socket.io.engine.id;

});

// メッセージを受けたとき
socket.on('message', function(msg) {
   // メッセージを画面に表示する
   document.getElementById("receiveMsg").innerHTML = msg.value;
   if(msg.value){
      try{
         var msgObj = JSON.parse(msg.value);
         switch(msgObj.method){
            case "santa_move":
               var direction = msgObj.options["direction"];
               var color = msgObj.options["color"];
               if(direction == "left")
                 _communication_keys[color][k_left] = true;
               if(direction == "right")
                 _communication_keys[color][k_right] = true;
               if(direction == "up")
                 _communication_keys[color][k_up] = true;
               if(direction == "down")
                 _communication_keys[color][k_down] = true;
               break
            case "init":
               init();
               break;
            case "pre":
               pre();
               break;
            case "title":
               title();
               break;
            case "rule":
               rule();
               break;
            case "ouen":
               ouen();
               break;
            case "readyGo":
               readyGo();
               break;
            case "end":
            default:
         }
      } catch (error){
         document.getElementById("errorMsg").innerHTML = error;
      }
   }
});

// メッセージを送る
function SendMsg(target,msg) {
     socket.emit(target, { value: msg });
}
// 切断する
function DisConnect() {
  var msg = JSON.stringify({method:disconnect, options:{termId:socket.io.engine.id}});
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

