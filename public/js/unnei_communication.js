//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////
var keys = {};
var k_left = 37;
var k_up = 38;
var k_right = 39;
var k_down = 40;

var santa = "red";

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

function controller(){
    // var move_keys = _communication_keys;
    // for(var direction in keys){
    //     if (!keys.hasOwnProperty(direction)) continue;
    //     move_keys.red[direction] = true;
    // }
    // console.log(keys);

    for (var direction in keys){
        if (direction == k_left){
		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"left"}});
        }
        if (direction == k_up){
		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"up"}});
        }
        if (direction == k_right){
		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"right"}});
        }
		if (direction == k_down){
		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"down"}});
        }
    }

}


//    $(document).keydown(function(e) {
//    		santa = $("input[name='santa']:checked")[0].value;

//    		if(santa == "non"){
//    			return;
//    		}

// 		switch(e.keyCode){
// 			case k_left:
// 		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"left"}});
// 				break;
// 			case k_up:
// 		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"up"}});
// 		        break;
// 			case k_right:
// 		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"right"}});
// 				break;
// 			case k_down:
// 		        SendMsg("message", {method:"santa_move", options:{color:santa, direction:"down"}});
// 				break;
// 		}

//    });

function init(){
    console.log();
	SendMsg("message", {method:"init",
                      options:{},
                      names:{"red":$("#name_red").val(),
                             "blu":$("#name_blu").val(),
                             "gre":$("#name_gre").val(),
                             "yel":$("#name_yel").val()}});
}

function preBtn(){
	SendMsg("message", {method:"pre", options:{}});
}

function titleBtn(){
	SendMsg("message", {method:"title", options:{}});
}

function ruleBtn(){
	SendMsg("message", {method:"rule", options:{}});
}

function ouenBtn(){
	SendMsg("message", {method:"ouen", options:{}});
}

function readyGo(){
	SendMsg("message", {method:"readyGo", options:{}});
}

function timeUp(){
	SendMsg("message", {method:"timeUp", options:{}});
}

// メッセージを送る
function SendMsg(target,msg) {
     socket.emit(target, { value: JSON.stringify(msg) });
}
// 切断する
function DisConnect() {
  var msg = JSON.stringify({method:disconnect, options:{termId:socket.io.engine.id}});
  // メッセージを発射する
  socket.volatile.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

$(
    function(){
        $(document).keydown(function(e) {
            keys[e.keyCode] = true;

            $(document).keyup(function(e) {
                delete keys[e.keyCode];
            });
   	        santa = $("input[name='santa']:checked")[0].value;

   	        if(santa == "non"){
   			        return;
   	        }
        });
        setInterval(controller, 20);
    }
);
