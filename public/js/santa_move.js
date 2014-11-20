var obj_santa;
var obj_window;
var obj_tonakai;
var obj_animebox;
var WIDTH;
var HEIGHT;
var DEBUG_LEVEL = 0;
var GOAL_LINE = 150;
var game_timer;
var window_timer;
var santaCanMove = false;
var GAMETIME_DEFAULT = 30;
var gametime = GAMETIME_DEFAULT;
var gameTimer = null;
var STATE_MOVING = 0;
var STATE_HITTED = 1;
var STATE_GOAL = 2;
var STATE_WAIT = 3;

var STATE_CLOSED = 4;
var STATE_OPENED = 5;

function moveleft(){
    console.log(obj);
    // console.log(obj.position().left);
    $(obj).animate({"left":obj.position().left + 20});
    // obj.position().left += 5;
}


var _communication_keys = {red:{},blu:{},gre:{},yel:{}};


var keys = {};
var k_left = 37;
var k_up = 38;
var k_right = 39;
var k_down = 40;
var santa_dir = {red:1,blu:1,gre:1,yel:1};
var santa_pos = {red:undefined, blu:undefined, gre:undefined, yel:undefined};
var tonakai_counter = 1;
// var santaL_src = "image/santa_pack/red_l.png";
// var santaR_src = "image/santa_pack/red_r.png";
// var tonakaiL_src = "image/santa_pack/blue_l.png";
var tonakai_src = "image/tonakai/tonakai";
var move_threshold = 5;
var move_tonakai_threshold = 12;
function change_image_src(obj_img, id){
    // 連番の画像ソースについて数字部分をidに変更
    cur_image_src = obj_img.attr("src");
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var new_src = cur_image_src.substring(0, num_start) + id + cur_image_src.substring(num_end);
    obj_img.attr({
        src: new_src
    });
    // console.log(res);
}
function next_image_src(cur_image_src, num_image){
    // 1.png, 2.png, ..., 10.pngの順番で次の画像パスを返す
    // console.log("cur_image_src=" + cur_image_src);
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var next_num = (Number(cur_image_src.substring(num_start, num_end)) + 1) % num_image;
    next_num = Math.max(1, next_num);
    // console.log("num_start=" + num_start + " num_end=" + num_end);
    console.log("next_num="+next_num);
    var res = cur_image_src.substring(0, num_start) + next_num + cur_image_src.substring(num_end);
    // console.log(res);
    return res;
}

function debug(){
    if (DEBUG_LEVEL == 0) return;
    for (var color in obj_santa){
        // santa_pos[color] = $("<p>");
        santa_pos[color].css("top", obj_santa[color].css("top"));
        santa_pos[color].css("left", obj_santa[color].css("left"));
        var str = color +
            " top:" + obj_santa[color].css("top") +
            " left:" + obj_santa[color].css("left");
        santa_pos[color].text(str);
        // console.log(santa_pos[color]);
        // alert("");
    }
}

function santamove(color){
    // 動きカウンタがしきい値以上ならば次の画像に差し替え
    // console.log("src="+obj_santa[color].attr("src"));
    if (santa_dir[color] > move_threshold){
        obj_santa[color].attr({
            src: next_image_src(obj_santa[color].attr("src"), 10)
        });
        santa_dir[color] = 1;
    }else{
        santa_dir[color] += 1;
    }
}

function santa_warp(color){
    // サンタをワープさせる
    // 1. ロープで上方画面外へ
    // 2. 上方画面外からそりへ
}

function santa_goal_anime(color){
    // console.log("santa_goal_anime:" + obj_santa[color].image_id);
     if (obj_santa[color].image_id >= 12){
        obj_santa[color].image_id = 1;
        santa_goal2(color);
    } else {
        change_image_src(obj_santa[color], obj_santa[color].image_id);
        obj_santa[color].image_id++;
        setTimeout(function(){santa_goal_anime(color);}, 100);
        // setTimeout("santa_goal_anime("+color+")", 100);
    }
}

function santa_goal1(color){
    // 状態変更(操作不可に)
    // よじのぼり
    // そりへ座る
    // 状態変更(手を触れるように)
    obj_santa[color].state = STATE_WAIT;
    obj_santa[color].attr({src:"image/up" + obj_santa[color].id +"/1.png"});
    console.log("santa_goal1");
    santa_goal_anime(color);
    setTieout(santa_goal_anime(color), 0)
    // anime
}

function santa_goal2(color){
    // アニメーションを挟むためゴール処理を２つに分ける
    obj_santa[color].state = STATE_GOAL;
    obj_santa[color].attr({src:"image/santa" + obj_santa[color].id + "/1.png"});
    console.log("image/santa" + obj_santa[color].id + "/1.png");
}

function santa_hitstop(color){
    // トナカイとぶつかった時のモーション
    // 操作不可
	  var pos_top = px2int(obj_santa[color].css("top"));
    obj_santa[color].animate({top: pos_top + 200}, 300);
    var prev_src = obj_santa[color].attr("src");
    var id = obj_santa[color].id;
    // console.log(id);
    var down_src = "image/down" + id + "/down" + id + ".gif";
    obj_santa[color].attr({src:down_src});
    // setTimeout('function(){obj_santa['+color+'].attr({src:'+prev_src+'});obj_santa['+color+'].state='+STATE_MOVING+';};', 3000);
    setTimeout(function(){obj_santa[color].attr({src:prev_src});obj_santa[color].state=STATE_MOVING;}, 3000);
}

function moveTonakai(){
    if (tonakai_counter < move_tonakai_threshold){
        obj_tonakai.attr({
            src: tonakai_src + tonakai_counter + ".png"
        });
    }else{
        tonakai_counter = 0;
    }
    tonakai_counter++;
}

function px2int(pxstr){
    return Number(pxstr.substr(0, pxstr.length-2));
}

function goalAnimation(color){
    // とりあえずはゴールの表示だけ
    console.log("goalAnimation");
    var goal_text = $("<img>").attr("src", "image/goal/goal.png");
    goal_text.appendTo(obj_animebox);
    santa_goal1(color);
    // clearInterval(game_timer);

    // ゴールに到達した時の処理

    // 一番のサンタがよじ登る

    // 他のサンタはロープを使ってワープする

    // そりに乗る

    // そりが動く

    // 終わりナレーション？
}

function moveWindowColor(color){
    // console.log("movewindow color:"+color + obj_window[color].image_id);
    if (obj_window[color].image_id >= 26){
        obj_window[color].image_id = 1;
        change_image_src(obj_window[color], obj_window[color].image_id);
        obj_window[color].state = STATE_CLOSED;
    }else{
        obj_window[color].image_id += 1;
        if (obj_window[color].image_id  >= 20){
            // 窓が開いた
            obj_window[color].state = STATE_OPENED;
        }
        change_image_src(obj_window[color], obj_window[color].image_id);
        setTimeout(function(){moveWindowColor(color);}, 150);
    }
}

function moveWindow(){
    // ランダムでウインドウを動かす
    var id = getRandomInt(0, 3);
    var color = Object.keys(obj_window)[id];
    console.log("moveWindow:" + color);
    obj_window[color].id = 1;
    moveWindowColor(color);
}

function movePlane() {
    debug();
    var move_keys = _communication_keys;
    for(var direction in keys){
        if (!keys.hasOwnProperty(direction)) continue;
        move_keys.red[direction] = true;
    }
    _communication_keys = {red:{},blu:{},gre:{},yel:{}};
    for(var color in obj_santa){
        var toppos = px2int(obj_santa[color].css("top"));
        var windowpos = px2int(obj_window[color].css("top"));
        if (toppos <= GOAL_LINE && obj_santa[color].state == STATE_MOVING){
            goalAnimation(color);
            // alert();
        }
        if (obj_santa[color].state == STATE_MOVING &&
            obj_window[color].state == STATE_OPENED &&
            windowpos + 100 <= toppos && toppos <= windowpos + 250){
            // トナカイとぶつかった
            obj_santa[color].state = STATE_HITTED;
            santa_hitstop(color);
        }

        if (obj_santa[color].state == STATE_MOVING){

            for (var direction in move_keys[color]) {
	              var pos_left = px2int(obj_santa[color].css("left"));
	              var pos_top = px2int(obj_santa[color].css("top"));
                if (!move_keys[color].hasOwnProperty(direction)) continue;
                if (direction == k_left) {
	                  pos_left = Math.max(0, pos_left - 5);
                    obj_santa[color].animate({left: ""+pos_left}, 0);
                    santamove(color);
                }
                if (direction == k_up) {
                    pos_top = Math.max(0, pos_top - 5);
                    obj_santa[color].animate({top: pos_top}, 0);
                    santamove(color);
                }
                if (direction == k_right) {
	                  pos_left = Math.min(WIDTH - px2int(obj_santa[color].css("width")), pos_left + 5);
                    obj_santa[color].animate({left: pos_left}, 0);
                    santamove(color);
                }
                if (direction == k_down) {
	                  pos_top = Math.min(HEIGHT - px2int(obj_santa[color].css("height")), pos_top + 5);
                    obj_santa[color].animate({top: pos_top}, 0);
                    santamove(color);
                }
            }
        }
    }
}

function move_list(move_list){
    console.log("move_list:" + move_list);
    for (var i = 0; i < move_list.length; i++){
        var duration = move_list[i]['duration'];
        if (duration == undefined){
            duration = 400;
        }
        obj_santa[red].animate({
            left: "+="+move_list[i]['left'],
            top: "+="+move_list[i]['top']
        }, duration);
    }
}

function move_from_textarea(str){
    console.log(str);
    move_list(eval(str));
}

function reset_santa_pos(){
    // サンタの位置を初期値（中央に移動）
    var MARGIN = 50;
    var step = (WIDTH - 2 * MARGIN) / 4;
    var top  = 800;
    var left = MARGIN;
    console.log("step" + step);
    for (var color in obj_santa){
        obj_santa[color].css("left", left);
        obj_santa[color].css("top", top);
        left += step;
    }
}
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}
function reset_window_pos(){
    // サンタの位置を初期値（中央に移動）
    var MARGIN = 50;
    var step = (WIDTH - 2 * MARGIN) / 4;
    var left = MARGIN;
    for (var color in obj_window){
        console.log("step" + step);
        obj_window[color].css("left", left);
        obj_window[color].css("top", getRandomInt(GOAL_LINE + MARGIN * 2, 500));
        left += step;
    }
}

function movestart(debug){
    DEBUG_LEVEL = debug;
    obj_santa = {
        red : $("#santa_red"),
        blu : $("#santa_blu"),
        gre : $("#santa_gre"),
        yel : $("#santa_yel")
    };
    obj_window = {
        red : $("#window_red"),
        blu : $("#window_blu"),
        gre : $("#window_gre"),
        yel : $("#window_yel")
    };
    obj_santa["red"].id = 1; // 個別画像フォルダを参照するためのid
    obj_santa["blu"].id = 2; // santa[id], down[id]等
    obj_santa["yel"].id = 3;
    obj_santa["gre"].id = 4;
    for (var color in obj_santa){
        obj_santa[color].state = STATE_MOVING;
        obj_santa[color].image_id = 1; // 各種アニメーション用
    }
    for (var color in obj_window){
        obj_window[color].image_id = 1;
        obj_window[color].state = STATE_CLOSED;
    }
    // obj_tonakai = $("#tonakai");
    obj_animebox = $("#anime_box"); // ゲーム画面全体
    WIDTH = px2int(obj_animebox.css("width"));
    HEIGHT = px2int(obj_animebox.css("height"));

    if (DEBUG_LEVEL > 0){
        for (var color in obj_santa){
            santa_pos[color] = $("<p>");
            santa_pos[color].appendTo(obj_animebox);
        }
    }
    reset_santa_pos();
    reset_window_pos();

	// for(var tmp_color in obj_santa){
	//     reset_santa_pos(tmp_color);
	//     console.log("width=" + WIDTH + " height=" + HEIGHT);
	//     console.log(obj_santa[tmp_color].css("left") + " " + obj_santa[tmp_color].css("top"));
	//     console.log($("body").css("height"));
	// }

    $(document).keydown(function(e) {
        keys[e.keyCode] = true;

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });
    });
    game_timer = setInterval(movePlane, 20);
    // moveWindow();
    window_timer = setInterval(moveWindow, 5000);
    // setInterval(moveTonakai, 500);
}

///////////////////////////////////////////////////////////////////////
// GameTimer
///////////////////////////////////////////////////////////////////////
function initGameTimer(){
    if(gameTimer){
        clearInterval(gameTimer);
        gameTimer = null;
    }
    gametime = GAMETIME_DEFAULT;
    $("#gameTimer").attr("src","image/num/30.png");
}

function startGameTimer(){
    gameTimer = setInterval("timeSpend()",1000);
}

function timeSpend(){
    gametime--;
    $("#gameTimer").attr("src","image/num/" + gametime + ".png");
    if(gametime < 1){
        timeUp();
    }
}

function timeUp(){
    if(gameTimer){
        clearInterval(gameTimer);
        gameTimer = null;
    }

}

///////////////////////////////////////////////////////////////////////
// signaling
///////////////////////////////////////////////////////////////////////
function init(){
    reset_santa_pos();
    reset_window_pos();

    santaCanMove = false;
    initGameTimer();

    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").css("display", "none");
    $("#screen_title").css("display", "none");
    $("#screen_rule").css("display", "none");


}

// プレ用
function pre(){
    $("#screen_pre").css("display", "inline");
    $("#screen_title").css("display", "none");
    $("#screen_rule").css("display", "none");
};

// タイトル用
function title(){
    $("#screen_pre").css("display", "none");
    $("#screen_title").css("display", "inline");
    $("#screen_rule").css("display", "none");
};

// ルール説明用
function rule(){
    $("#screen_pre").css("display", "none");
    $("#screen_title").css("display", "none");
    $("#screen_rule").css("display", "inline");
};


function readyGo(){
    // よーい
    $("#screen_yoi").show();

    // どん!
    setTimeout("go()",3000);
}

// よーいどん用
{
    function go(){
        startGameTimer();
        santaCanMove = true;
        $("#screen_yoi").hide();
        $("#screen_don").show();
        $("#screen_don").fadeOut(3000);
    }
}

function end(){

}
