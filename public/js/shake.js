// var DEBUG_LEVEL = 3;
var color;
// var santa_keys;

var shakeCounted = 0;
var shakeSended = 0;
var isGaming = false;
var movePerShake = 2; // 指定回数振る毎にサンタを動かすメッセージを送る


// 端末の角度が変わった時
function init_event() {
  window.addEventListener('devicemotion', function (e) {
    return furu(e);
  }, true);

}

// 端末を振ったときの挙動
function furu(e) {
    var x = e.accelerationIncludingGravity.x; // X方向の加速度
    var y = e.accelerationIncludingGravity.y; // Y方向の加速度
    var z = e.accelerationIncludingGravity.z; // Z方向の加速度

    // 加速度が一定以上のとき
    if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
      shakeCounted ++;
    }
 }

function checkShake(){
  if(shakeCounted - shakeSended > movePerShake){
    // SendMsg("santa", {method:"santa_move", options:{color:color, direction:"up", times: shakeCounted - shakeSended}});
    shakeSended = shakeCounted;
    // var santa_keys = {red:undefined, blu:undefined, yel:undefined, gre:undefined};
    // santa_keys[color] = true;
    var santa_keys = {};
    santa_keys[color] = true;
    SendMsg("santa", {method:"santa_move", options:{santa_keys:santa_keys, shakeCount:shakeCounted}});
    console.log(santa_keys);
    $("#debug_box").text("debug: color=" + color);
  }
  // SendMsg("santa", {method:"santa_move", options:{color:"red", direction:"up"}});
  setTimeout("checkShake()",50);  
}

function setSanta(col){
  color = col;
  $("#debug_box").text("debug: color " + col + " was selected");
  $("input[name='santa']").val([col]);
  //$("input[name='santa']:checked")[0].value;
}




// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/mobile");
// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
  console.log("connect");
});
// メッセージを受けたとき
socket.on('message', function(msg) {
   // メッセージを画面に表示する
   document.getElementById("receiveMsg").innerHTML = msg.value;
   if(msg.value){
      try{
         var msgObj = JSON.parse(msg.value);
         switch(msgObj.method){
            case "init":
               init_screen();
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




///////////////////////////////////////////////////////////////////////
// signaling
///////////////////////////////////////////////////////////////////////
function init_screen(){
    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").css("display", "none");
    $("#screen_title").css("display", "none");
    $("#screen_rule").css("display", "none");
    $("#screen_select").show();
    $("#screen_fure").hide();
}

// プレ用
function pre(){
    $("#screen_pre").css("display", "inline");
    $("#screen_title").css("display", "none");
    $("#screen_rule").css("display", "none");
    $("#screen_select").hide();
    $("#screen_fure").hide();
};

// タイトル用
function title(){
    $("#screen_pre").css("display", "none");
    $("#screen_title").css("display", "inline");
    $("#screen_rule").css("display", "none");
    $("#screen_select").hide();
    $("#screen_fure").hide();
};

// ルール説明用
function rule(){
    $("#screen_pre").css("display", "none");
    $("#screen_title").css("display", "none");
    $("#screen_rule").css("display", "inline");
    $("#screen_select").hide();
    $("#screen_fure").hide();
};


function readyGo(){
    // よーい
    $("#screen_yoi").show();

    // どん!
    setTimeout("gameStart()",3000);
}

// よーいどん用
function gameStart(){

    $("#screen_yoi").hide();
    $("#screen_don").show();
    $("#screen_don").fadeOut(3000);
    // 振れ!
    setTimeout("fureView()",3000);
}

function fureView(){
    $("#screen_fure").show();
}



$(function(){
    // function init(){
    setSanta("red");
    console.log("あなたの接続ID::" + socket.io.engine.id);

    // $("#connectId").text("fuga");
    init_event();
    init_screen();
    $("#connectId").text("あなたの接続ID::" + socket.io.engine.id);
    // document.getElementById("connectId").innerHTML = "あなたの接続ID::" + socket.io.engine.id;

    if(DEBUG_LEVEL == 0){
        $("#connectId").hide();
        $("#receiveMsg").hide();
        $("#errorMsg").hide();
    }

    setTimeout("checkShake()",100);
    // }
});


function end(){

}
