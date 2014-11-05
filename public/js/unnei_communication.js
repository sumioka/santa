//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////


// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/unnei");
// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
  console.log("connect");
  document.getElementById("connectId").innerHTML = "あなたの接続ID::" + socket.io.engine.id;

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
               if(direction == "left")
                 keys[k_left] = true;
               if(direction == "right")
                 keys[k_right] = true;
               if(direction == "up")
                 keys[k_up] = true;
               if(direction == "down")
                 keys[k_down] = true;
               break;
            default:
         }
      } catch (error){
         document.getElementById("errorMsg").innerHTML = error;
      }
   }
});


// メッセージを送る
function SendMsg(target,msg) {
     socket.emit(target, { value: JSON.stringify(msg) });
}
// 切断する
function DisConnect() {
  var msg = JSON.stringify({method:disconnect, options:{termId:socket.io.engine.id}});
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

