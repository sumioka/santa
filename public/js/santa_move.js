var obj_santa;
var obj_window;
var obj_tonakai;
var obj_animebox;
var obj_bgm;
var WIDTH;
var HEIGHT;
var DEBUG_LEVEL = 0;
var GOAL_LINE = 150;
var game_timer;
var window_timer;
var GAMETIME_DEFAULT = 30;
var gametime = GAMETIME_DEFAULT;
var gameTimer = null;
var STATE_INIT = 0;
var STATE_MOVING = 1;
var STATE_HITTED = 2;
var STATE_GOAL = 3;
var STATE_WAIT = 4;

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

function goalAnimation(){

    obj_bgm.pause();

    // とりあえずはゴールの表示だけ
    var goal_text = $("<img>").attr("src", "image/goal/goal.png");
    goal_text.appendTo(obj_animebox);
    clearInterval(game_timer);

    // ゴールに到達した時の処理

    // 一番のサンタがよじ登る

    // 他のサンタはロープを使ってワープする

    // そりに乗る

    // そりが動く

    // 終わりナレーション
    obj_bgm = new Audio("image/sound/fin.mp3");
    obj_bgm.load();
    obj_bgm.play();

    $("#anime_box").animate({top:"1080px"}, 1500);

    var now = new Date().getTime();
    $("#screen_fin1").attr('src', 'image/fin1/fin1.gif?' + now);
    $("#screen_fin1").show();

    setTimeout(function(){
      $("#screen_fin1").hide();
      $("#screen_fin2").show();
      $("#merryxmas").fadeIn("slow");
    },5500);

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
        if (toppos <= GOAL_LINE){
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
    obj_bgm.pause();
    warp();
}

function warp(){
    for(var color in obj_santa){
        if((obj_santa[color].state == STATE_MOVING) || (obj_santa[color].state == STATE_HITTED)){
            obj_santa[color].state = STATE_WAIT;
            obj_santa[color].warp = 2;
            var top = parseInt(obj_santa[color].css("top"));
            obj_santa[color].hide();
            obj_santa[color].attr("src","image/warp" + obj_santa[color].id + "/1.png");
            obj_santa[color].css("top", top - 900);
//            obj_santa[color].show();
        }
    }
    setTimeout(function(){warpAnimation1()},100);
}

function warpAnimation1(){
    // 本当はwarpに書くべきだが、なぜか上に書くとゴミが写るのでここで記述
    for(var color in obj_santa){
        obj_santa[color].show();
    }
    $("#santa_rope").show();
    setTimeout(function(){rope1(1)},100);

}

// 1 2 3 4 5
function rope1(ropeIdx){
    $("#santa_rope").attr("src","image/rope/" + ropeIdx + ".png");
    if(ropeIdx < 5){
        ropeIdx ++;
        setTimeout(function(){rope1(ropeIdx)},100);
    } else {
        setTimeout(function(){rope2(0)},100);
    }
}

// 6 7 6 7 6 7 8 9
function rope2(idx){
    if(idx % 2 == 0){
        $("#santa_rope").attr("src","image/rope/6.png");
    } else {
        $("#santa_rope").attr("src","image/rope/7.png");
    }
    if(idx < 7){
        idx ++;
        setTimeout(function(){rope2(idx)},200);
    } else {
        setTimeout(function(){
            $("#santa_rope").attr("src","image/rope/8.png");
            setTimeout(function(){
                $("#santa_rope").attr("src","image/rope/9.png");
                setTimeout(function(){rope3(0)},100);
                for(var color in obj_santa){
                    console.log(color);
                    setTimeout("warpAnimation2(\"" + color + "\")",800);
                }
            })
        })
    }
}

// rope: (10 11) x 6 (santa:1~12と同時)
function rope3(idx){
    if(idx % 2 == 0){
        $("#santa_rope").attr("src","image/rope/10.png");
    } else {
        $("#santa_rope").attr("src","image/rope/11.png");
    }
    if(idx < 12){
        idx ++;
        setTimeout(function(){rope3(idx)},100);
    } else {
        setTimeout(function(){rope4(0)},100);
    }

}

// santa: 1 ~ 12
function warpAnimation2(color){
    console.log(color);
    obj_santa[color].attr("src","image/warp" + obj_santa[color].id + "/" + obj_santa[color].warp + ".png");
    obj_santa[color].warp = obj_santa[color].warp + 1;
    if(obj_santa[color].warp < 12){
        setTimeout(function(){warpAnimation2(color)},100);
    } else {
        setTimeout(function(){
            obj_santa[color].animate({top:-1440},2000);
            setTimeout(function(){warpAnimation3(color)},100);
        },400);
    }
}

// rope: (12 13) x 10 (santa:12の引き上げと同時 santa.animate 2000)
function rope4(idx){
    if(idx % 2 == 0){
        $("#santa_rope").attr("src","image/rope/12.png");
    } else {
        $("#santa_rope").attr("src","image/rope/13.png");
    }
    if(idx < 20){
        idx ++;
        setTimeout(function(){rope4(idx)},100);
    } else {
        // 10 9 8 3 2 1
        setTimeout(function(){rope5(0)},100);
    }

}

// rope: 10 9 8 3 2 1
function rope5(idx){
    if(idx == 0){
        $("#santa_rope").attr("src","image/rope/10.png");
    } else if (idx == 1){
        $("#santa_rope").attr("src","image/rope/9.png");
    } else if (idx == 2){
        $("#santa_rope").attr("src","image/rope/8.png");
    } else if (idx == 3){
        $("#santa_rope").attr("src","image/rope/3.png");
    } else if (idx == 4){
        $("#santa_rope").attr("src","image/rope/2.png");
    } else {
        $("#santa_rope").attr("src","image/rope/1.png");
        setTimeout(function(){warpAnimation3()},100);
        return;
    }

    idx++;
    setTimeout(function(){rope5(idx)},100);
}

// 上からサンタが落ちてくる
function warpAnimation3(){
    ending();
}


function ending(){

}
///////////////////////////////////////////////////////////////////////
// signaling
///////////////////////////////////////////////////////////////////////
function init(){
    reset_santa_pos();
    reset_window_pos();

    for(var color in obj_santa){
        obj_santa[color].attr("src","image/santa" + obj_santa[color].id + "/1.png");
        obj_santa[color].state = STATE_INIT;
    }

    initGameTimer();

    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();

    // エンディング画面を消す
    $("#screen_fin2").hide();
    $("#merryxmas").hide();
    $("#anime_box").css("top", "0px");

}

// プレ用
function pre(){
    $("#screen_pre").show();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();
};

// タイトル用
function title(){
    $("#screen_pre").hide();
    $("#screen_title").show();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();
};

// ルール説明用
function rule(){
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").show();
    $("#screen_ouen").hide();
};

// フロンタ応援用
function ouen(){
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").show();
};


function readyGo(){

    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();

    // よーい
    $("#screen_yoi").show();

    // どん!
    setTimeout("go()",3000);


}

// よーいどん用
function go(){
    startGameTimer();
    for(var color in obj_santa){
        obj_santa[color].state = STATE_MOVING;
    }
    $("#screen_yoi").hide();
    $("#screen_don").show();
    $("#screen_don").fadeOut(3000);

    //bgm開始
    obj_bgm = new Audio("image/sound/bgm.mp3");
    obj_bgm.loop = "true";
    obj_bgm.load();
    obj_bgm.play();
}

function end(){

}
