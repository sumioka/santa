var DEBUG_LEVEL = 0;
var frame_to_change_img = 5; // santaの昇り降り画像の切り替えフレーム数(2の場合2frame毎に画像を差し替え)
var move_per_frame = 2; // 1フレームごとの移動ピクセル数
var msec_window_interval = 6300; // トナカイが出てくる感覚(msec)
var DIST_WINDOW_SANTA = 100; // サンタと窓がこのピクセル以下の時窓のトナカイが動き出す

var SANTA_MARGIN = 80; // 各サンタのマージン


var obj_santa;
var obj_window;
var obj_name;
var obj_tonakai;
var obj_sori;
var obj_animebox;
var obj_up;
var intro_santa;
var intro_name;
var WIDTH;
var HEIGHT;
var GOAL_LINE = 150;
var game_timer;
var window_timer;
var intro_santa_timer;
var GAMETIME_DEFAULT = 30;
var gametime = GAMETIME_DEFAULT;
var gameTimer = null;
var STATE_INIT = 0;
var STATE_MOVING = 1;
var STATE_HITTED = 2;
var STATE_GOAL = 3;
var STATE_WAIT = 4;

var STATE_CLOSED_NOT_MOVE = 5; // 窓は閉まっていてアニメーションも動いていない
var STATE_CLOSED_AND_MOVE = 6; // 窓は閉まっていてアニメーションは動いている
var STATE_OPENED = 7; // 窓は相手なくアニメーションも動いていない
var STATE_CLOSED_AND_FINISHED = 8; // 窓は一回相手もうずっと閉まっている状態

var obj_bgm;
var bgm_hit = new Audio("image/sound/tonakai_hit.mp3");
var bgm_goal = new Audio("image/sound/goal.mp3");
var bgm_yojinobori = new Audio("image/sound/sound02.mp3");
bgm_hit.load();
bgm_goal.load();
bgm_yojinobori.load();

function moveleft(){
    console.log(obj);
    // console.log(obj.position().left);
    $(obj).animate({"left":obj.position().left + 20});
    // obj.position().left += 5;
}


var _communication_keys = {red:{},blu:{},yel:{},gre:{}};

var keys = {};
var k_left = 37;
var k_up = 38;
var k_right = 39;
var k_down = 40;
var santa_dir = {red:1,blu:1,yel:1,gre:1};
var color_id = {red:1,blu:2,yel:3,gre:4};
var santa_pos = {red:undefined, blu:undefined, yel:undefined, gre:undefined};
var santa_speed = {};
var santa_lock = {red:false, blu:false, gre:false, yel:false};

// var santaL_src = "image/santa_pack/red_l.png";
// var santaR_src = "image/santa_pack/red_r.png";
// var tonakaiL_src = "image/santa_pack/blue_l.png";
var tonakai_src = "image/tonakai/tonakai";


var cache_images = {};
function new_image(src){
    var res = $("<img>").attr("src", src);
    res.css("position", "absolute");
    res.css("left", "0px");
    res.css("top", "0px");
    res.css("z-index", "5000");
    // res.appendTo($("#anime_box"));
    res.hide();
    return res;
}
function load_images(){
    var img_dir = "image/";
    for (var color in color_id){
        var i = color_id[color];
    // for (var i = 1; i <= 4; i++){
        // introduction
        if (i == 4){
            for (var j = 1; j <= 18; j++){
                var src = img_dir + "introduction/introduction"+i+"/" +j +".png";
                cache_images[i+src] = new_image(src);
                cache_images[i+src].css("z-index", 150000);
            }
        }else{
            for (var j = 1; j <= 4; j++){
                var src = img_dir + "introduction/introduction"+i+"/" +j +".png";
                cache_images[i+src] = new_image(src);
                cache_images[i+src].css("z-index", 150000);
            }
        }
        // window
        for (var j = 1; j <= 26; j++){
            var src = img_dir + "window/" +j +".png";
            cache_images[i+src] = new_image(src);
        }

        // santa 本体
        for (var j = 1; j <= 10; j++){
            var src = img_dir + "santa" + i + "/"+ j +".png";
            cache_images[i+src] = new_image(src);
            cache_images[i+src].appendTo($("santa_"+color));
        }

        // santa hit
        for (var j = 1; j <= 2; j++){
            var src = img_dir + "down" + i + "/"+ j +".png";
            cache_images[i+src] = new_image(src);
            cache_images[i+src].appendTo($("santa_"+color));
        }

        // santa goal
        for (var j = 1; j <= 7; j++){
            var src = img_dir + "goal" + i + "/"+ j +".png";
            cache_images[i+src] = new_image(src);
            cache_images[i+src].appendTo($("santa_"+color));
        }
        // santa warp
        for (var j = 1; j <= 11; j++){
            var src = img_dir + "warp" + i + "/"+ j +".png";
            cache_images[i+src] = new_image(src);
            cache_images[i+src].appendTo($("santa_"+color));
        }
    }
    // sleigh
    for (var j = 1; j <= 8; j++){
        var src = img_dir + "sleigh1/"+ j +".png";
        cache_images[i+src] = new_image(src);
    }
    // sleigh
    for (var j = 1; j <= 13; j++){
        var src = img_dir + "rope/"+ j +".png";
        cache_images[i+src] = new_image(src);
    }
    // num timer
    for (var j = 0; j <= 30; j++){
        var src = img_dir + "num/"+ j +".png";
        cache_images[i+src] = new_image(src);
    }

    //　共通設定 
//     for (var key in cache_images){
// //        position:absolute;left:0px;top:16px;z-index:5000;
//         }
}


function change_cache_image(obj, src){
    if (obj.img) obj.img.hide();
    obj.img = cache_images[src];
    obj.img.show();
}

function change_cache_next_image(obj, image_id){
    var cur_image_src = obj.img.attr("src");
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var new_src = cur_image_src.substring(0, num_start) + image_id + cur_image_src.substring(num_end);
    change_cache_image(obj, obj.id + new_src);
}

function change_image_src(obj_img, id){
    // 連番の画像ソースについて数字部分をidに変更
    // console.log("change_image_src:"+id);
    cur_image_src = obj_img.attr("src");
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var new_src = cur_image_src.substring(0, num_start) + id + cur_image_src.substring(num_end);
    // console.log("new_src:"+new_src);
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
    // console.log("next_num="+next_num);
    var res = cur_image_src.substring(0, num_start) + next_num + cur_image_src.substring(num_end);
    // console.log(res);
    return res;
}

function debug(){
    if (DEBUG_LEVEL == 0) return;
    for (var color in obj_santa){
        // santa_pos[color] = $("<p>");
        santa_pos[color].css("top", obj_santa[color].img.css("top"));
        santa_pos[color].css("left", obj_santa[color].img.css("left"));
        var str = color +
            " top:" + obj_santa[color].img.css("top") +
            " left:" + obj_santa[color].img.css("left");
        santa_pos[color].text(str);
        // console.log(santa_pos[color]);
        // alert("");
    }
}

function santamove(color){

    if(santa_lock[color]){
        santa_dir[color] += 1;
        return;
    }
    // 動きカウンタがしきい値以上ならば次の画像に差し替え
    // console.log("src="+obj_santa[color].attr("src"));
    if (santa_dir[color] > frame_to_change_img){
        santa_lock[color] = true;

        santa_speed[color] = 1;

        if(santa_dir[color] > frame_to_change_img * 2){
            santa_dir[color] -= frame_to_change_img * 2;
            santa_speed[color] = 2;
        } else {
            santa_dir[color] -= frame_to_change_img;
        }

        for(var idx = 1; idx < 5 * santa_speed[color]; idx++){
            setTimeout(function(){
                if(obj_santa[color].state == STATE_MOVING){
                    obj_santa[color].image_id = obj_santa[color].image_id % 10 + 1;
                    change_cache_next_image(obj_santa[color], obj_santa[color].image_id);
                    // obj_santa[color].attr({
                    //     src: next_image_src(obj_santa[color].attr("src"), 10)
                    // });
                }
            },100 / santa_speed[color] * idx);
        }
        setTimeout(function(){
            santa_lock[color] = false;
        },500);

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
    // サンタよじ登りアニメーション
    // console.log("santa_goal_anime:" + obj_santa[color].image_id);
     if (obj_santa[color].image_id >= 12){
        obj_santa[color].image_id = 0;
        santa_goal_sori_ride(color);
    } else {
        if (obj_santa[color].image_id % 3 == 0){
            bgm_yojinobori.play();
        }
        change_cache_next_image(obj_santa[color], obj_santa[color].image_id);
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
    var src = "image/up" + obj_santa[color].id +"/1.png";
    obj_santa[color].img = cache_images[obj_santa[color].id + src];
    // obj_santa[color].attr({src:"image/up" + obj_santa[color].id +"/1.png"});
    console.log("santa_goal1");
    santa_goal_anime(color);
    // anime
}

function santa_goal_sori_ride(color){
    // そりに乗るまではサンタはそりの前面にいるが
    // そりに乗る時はサンタはそりの背面にいるようにする
    obj_name[color].hide();
    obj_santa[color].img.css('z-index', Number($("#sori").css('z-index'))-1);
    console.log("color's z-index" + obj_santa[color].img.css('z-index'));
    // そりに乗る
    bgm_goal.play();
    if (obj_santa[color].image_id == 0){
        // 初期化処理
        obj_santa[color].img.css("left", 370 + 50 * obj_santa[color].id);
        obj_santa[color].img.css("bottom", 940);
        obj_santa[color].img.css("top", "auto");
        obj_santa[color].img.css("z-index", 1000);
        obj_santa[color].image_id = 1;
    }
     if (obj_santa[color].image_id > 7){
         obj_santa[color].state = STATE_GOAL;
         if (gameTimer){
             // 時間切れでなくそりに乗る時はゴールテキストを表示
             showGoalText(color);
             var all_player_goal = true;
             for(var color2 in obj_santa){
                 if (obj_santa[color2].state != STATE_GOAL) {
                     all_player_goal = false;
                 }
             }
             if (all_player_goal) {
                 // 全員がゴールしたなら
                 // 若干のタイムラグ後，タイムアップする
                 timeUp();
                 // setTimeout(function(){timeUp();}, 500);
             }
         }
        // obj_santa[color].image_id = 1;
        // santa_goal_end(color);
    } else {
        obj_santa[color].attr({
            src:"image/goal" + obj_santa[color].id + "/" + obj_santa[color].image_id + ".png"
            });
        // change_image_src(obj_santa[color], obj_santa[color].image_id);
        obj_santa[color].image_id++;
        setTimeout(function(){santa_goal_sori_ride(color);}, 100);
        // setTimeout("santa_goal_anime("+color+")", 100);
    }
}

function showGoalText(color){
    var goal_text = $("<img class='goal_text'>").attr("src", "image/goal/goal.png");
    goal_text.css("position", "absolute");
    var step = (WIDTH - SANTA_MARGIN) / 4;
    goal_text.appendTo(obj_animebox);
    goal_text.css("top", 200);
    console.log("color_id["+color+"]="+color_id[color] + " margin="+SANTA_MARGIN);
    console.log(color_id[color] * step);
    goal_text.css("left", 20 + SANTA_MARGIN + (color_id[color]-1) * step );
}

var hit_animation_num_iterate = 30;
function hit_animation(color, prev_src){
    if (!gameTimer) {
        // 時間切れの時には強制終了
        return;
    }
    if (obj_santa[color].image_id >= hit_animation_num_iterate){
        obj_santa[color].image_id = 1;
        obj_santa[color].attr({src:prev_src});
        obj_santa[color].state=STATE_MOVING;
    }else{
        // console.log(obj_santa[color]);
        change_cache_next_image(obj_santa[color], (obj_santa[color].image_id % 2)+1);
        obj_santa[color].image_id++;
        setTimeout(function(){hit_animation(color, prev_src);}, 100);
    }
}

function santa_hitstop(color){
    // トナカイとぶつかった時のモーション
    // 操作不可
	  var pos_top = px2int(obj_santa[color].img.css("top"));
    obj_santa[color].img.animate({top: pos_top + 200}, 300);
    set_name_pos(color);
    var prev_src = obj_santa[color].attr("src");
    var id = obj_santa[color].id;
    // console.log(id);
    // var down_src = "image/down" + id + "/down" + id + ".png";
    obj_santa[color].attr({src:"image/down" + id + "/1.png"});
    console.log(bgm_hit);
    bgm_hit.play();
    hit_animation(color, prev_src);
}


function px2int(pxstr){
    return Number(pxstr.substr(0, pxstr.length-2));
}

function goalAnimation(color){
    obj_name[color].hide();
    // とりあえずはゴールの表示だ
    // goal_text.appendTo($("#game_box"));
    santa_goal1(color);
    // clearInterval(game_timer);

    // ゴールに到達した時の処理

    // 一番のサンタがよじ登る

    // 他のサンタはロープを使ってワープする

    // そりに乗る

    // そりが動く

    // 終わりナレーション

}

var window_anime_step = [
    [2, 0.1], [3, 0.1], [4, 0.1], [5, 0.1], [6, 0.2], // 0.6
    [7, 0.1], [8, 0.1], [9, 0.1], [10, 1.0], // 1.3
    [11, 0.1], [12, 0.1], [13, 0.1], [6, 0.2], // 0.5
    [14, 0.1], [15, 0.1], [16, 0.1], [17, 0.2], // 0.5
    [18, 0.1], [19, 0.1], [20, 0.1], [21, 0.1], // 0.4
    [22, 0.1], [23, 0.1], [24, 0.1], [25, 1.0], // 1.3
    [24, 0.1], [23, 0.1], [22, 0.1], [21, 0.1], // 0.4
    [20, 0.1], [19, 0.1], [18, 0.1], [17, 0.1], // 0.4
    [15, 0.1], [14, 0.1], [26, 0.1], [6, 0.2], // 0.5
    [5, 0.1], [4, 0.1], [3, 0.1], [2, 0.1] // 0.4
]; // 全部で6.3sec

function moveWindowColor(color){
    // console.log("movewindow color:"+color + obj_window[color].image_id);
    if (obj_window[color].image_id >= window_anime_step.length){
        obj_window[color].image_id = 1;
        change_cache_next_image(obj_window[color], obj_window[color].image_id);
        obj_window[color].state = STATE_CLOSED_AND_FINISHED;
    }else {
        var image_id = window_anime_step[obj_window[color].image_id][0];
        var wait_time = window_anime_step[obj_window[color].image_id][1];
        if (image_id  >= 20 && image_id < 26){
            // 窓が開いた
            obj_window[color].state = STATE_OPENED;
            // for debug
            // obj_window[color].css("border-width", "10px");
            // obj_window[color].css("border-color", "#000000");
            // obj_window[color].css("border-style", "solid");
        }else {
            obj_window[color].state = STATE_CLOSED_AND_MOVE;
            // obj_window[color].css("border-width", "");
            // obj_window[color].css("border-color", "");
            // obj_window[color].css("border-style", "");
        }
        change_cache_next_image(obj_window[color], image_id);
        obj_window[color].image_id += 1;
        setTimeout(function(){moveWindowColor(color);}, wait_time*1000);
    }
}

function moveWindow(){
    // ランダムでウインドウを動かす
    var id = getRandomInt(0, 3);
    // id = 0 // for debug
    var color = Object.keys(obj_window)[id];
    if (obj_window[color].state == STATE_CLOSED_NOT_MOVE) {
        obj_window[color].id = 1;
        obj_window[color].state = STATE_CLOSED_AND_MOVE;
        moveWindowColor(color);
    } else{
    console.log("moveWindow:" + color + " was selected, but it still be running");
    }
}

function movePlane() {
    debug();
    if (!gameTimer){
        // タイマーが動いていない時は何もしない
        return;
    }
    var move_keys = _communication_keys;
    for(var direction in keys){
        if (!keys.hasOwnProperty(direction)) continue;
        move_keys.red[direction] = true;
    }
    _communication_keys = {red:{},blu:{},yel:{},gre:{}};
    for(var color in obj_santa){
        var toppos = px2int(obj_santa[color].img.css("top"));
        var windowpos = px2int(obj_window[color].css("top"));
        var window_bottom_pos = windowpos + px2int(obj_window[color].css("height"));

        // console.log(obj_window[color].state);
        // if (color == "red"){
        // console.log("toppos="+toppos + " windowpos="+windowpos);
        //     }
        if (obj_window[color].state != STATE_CLOSED_AND_FINISHED &&
            obj_window[color].state == STATE_CLOSED_NOT_MOVE &&
            Math.abs(toppos - window_bottom_pos) < DIST_WINDOW_SANTA) {
            // console.log("hoge");
            obj_window[color].id = 1;
            obj_window[color].state = STATE_CLOSED_AND_MOVE;
            moveWindowColor(color);
        }

        if (toppos <= GOAL_LINE && obj_santa[color].state == STATE_MOVING){
            goalAnimation(color);
            // alert();
        }
        if (obj_santa[color].state == STATE_MOVING &&
            obj_window[color].state == STATE_OPENED &&
            windowpos + 100 <= toppos && toppos <= windowpos + 250){
            // トナカイとぶつかった
            console.log("HITTED:" + obj_santa[color].state);
            obj_santa[color].state = STATE_HITTED;
            santa_hitstop(color);
        }

        if (obj_santa[color].state == STATE_MOVING){

            for (var direction in move_keys[color]) {
	              var pos_left = px2int(obj_santa[color].img.css("left"));
	              var pos_top = px2int(obj_santa[color].img.css("top"));
                if (!move_keys[color].hasOwnProperty(direction)) continue;
                if (direction == k_left) {
	                  // pos_left = Math.max(0, pos_left - move_per_frame);
                    obj_santa[color].img.animate({left: "-="+move_per_frame}, 0);
                    // obj_name[color].animate({left:"-="+move_per_frame}, 0);
                    santamove(color);
                }
                if (direction == k_up) {
                    // if ((pos_top - move_per_frame) > 0){
                    obj_santa[color].img.animate({top: "-="+move_per_frame}, 0);
                    // obj_name[color].animate({top:"-="+move_per_frame}, 0);
                    santamove(color);
                    // }
                }
                if (direction == k_right) {
	                  // pos_left = Math.min(WIDTH - px2int(obj_santa[color].img.css("width")), pos_left + move_per_frame);
                    obj_santa[color].img.animate({left: "+="+move_per_frame}, 0);
                    // obj_name[color].animate({left:"+="+move_per_frame}, 0);
                    santamove(color);
                }
                if (direction == k_down) {
	                  // pos_top = Math.min(HEIGHT - px2int(obj_santa[color].img.css("height")), pos_top + move_per_frame);
                    obj_santa[color].img.animate({top: "+="+move_per_frame}, 0);
                    // obj_name[color].animate({top:"+="+move_per_frame}, 0);
                    santamove(color);
                }
                if (px2int(obj_santa[color].img.css("top")) < 0) obj_santa[color].img.css("top", 0);
                if (px2int(obj_santa[color].img.css("left")) < 0) obj_santa[color].img.css("left", 0);
                // 下方向だけははみ出しても良いようにする？
                // if (px2int(obj_santa[color].img.css("top")) > HEIGHT - px2int(obj_santa[color].img.css("height"))) obj_santa[color].img.css("top", HEIGHT - px2int(obj_santa[color].img.css("height")));
                if (px2int(obj_santa[color].img.css("left")) > WIDTH - px2int(obj_santa[color].img.css("width"))) obj_santa[color].img.css("left", WIDTH - px2int(obj_santa[color].img.css("width")));

            }
        }
            if (obj_santa[color].state != STATE_WAIT){
                set_name_pos(color);
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

function set_name_pos(color){
    // console.log(obj_santa[color].img.css("left"));
    var left = px2int(obj_santa[color].css("left")) + px2int(obj_santa[color].css("width")) / 2 - px2int(obj_name[color].css("width")) / 2 - 10;
    // console.log(obj_santa[color].img.css("left"));
    var top = px2int(obj_santa[color].css("top")) + px2int(obj_santa[color].css("height")) + 30;

    // console.log(obj_name[color].css("left") + " " + left);
    obj_name[color].css("left", left);
    var name_height = px2int(obj_name[color].css("height"));
    if (top + name_height > HEIGHT){
        top = HEIGHT - name_height;
    }
    obj_name[color].css("top", top);
}

function reset_santa_pos(){
    // サンタの位置を初期値（中央に移動）
    // var MARGIN = 50;
    var step = (WIDTH - SANTA_MARGIN) / 4;
    // var top  = 700;
    var top  = 900;
    var left = SANTA_MARGIN;
    console.log("step" + step);
    for (var color in obj_santa){
        obj_santa[color].css("left", left);
        obj_santa[color].css("top", top);
        set_name_pos(color);
        left += step;
    }
}
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}
function reset_window_pos(){
    // サンタの位置を初期値（中央に移動）
    console.log("reset_window_pos");
    // var step = (WIDTH - 2 * MARGIN) / 4;
    var step = (WIDTH -  SANTA_MARGIN) / 4;
    var left = SANTA_MARGIN;
    for (var color in obj_window){
        // console.log("step" + step);
        obj_window[color].css("left", left);
        // obj_window[color].css("top", getRandomInt(GOAL_LINE + MARGIN * 2, 500));
        obj_window[color].css("top", getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500));
        left += step;
    }
}

function show_santa_stats(){
    for (var color in obj_santa){
        var top = obj_santa[color].img.css("top");
        var left = obj_santa[color].img.css("left");
        var width = obj_santa[color].img.css("width");
        var height = obj_santa[color].img.css("height");

        console.log("top=" + top + " left=" + left + " width=" + width + " height"+ height);
    }
}

function init(names){
    load_images();
    if(DEBUG_LEVEL == 0){
        $("#connectId").hide();
        $("#receiveMsg").hide();
        $("#errorMsg").hide();
    }

    // 各種オブジェクトの初期化
    if (!names){
        names = {
            red : $("#name_red").text(),
            blu : $("#name_blu").text(),
            yel : $("#name_yel").text(),
            gre : $("#name_gre").text()
        };
    }
    obj_santa = {
        red : $("#santa_red"),
        blu : $("#santa_blu"),
        yel : $("#santa_yel"),
        gre : $("#santa_gre")
    };
    // obj_santa = {
    //     red : Object(),
    //     blu : Object(),
    //     yel : Object(),
    //     gre : Object()
    // };
    // obj_santa["red"].img = $("#santa_red");
    // obj_santa["blu"].img = $("#santa_blu");
    // obj_santa["yel"].img = $("#santa_yel");
    // obj_santa["gre"].img = $("#santa_gre");
    //     blu : $("#santa_blu"),
    //     yel : $("#santa_yel"),
    //     gre : $("#santa_gre")
    // };
    obj_window = {
        red : $("#window_red"),
        blu : $("#window_blu"),
        yel : $("#window_yel"),
        gre : $("#window_gre")
    };
    obj_name = {
        red : $("#name_red"),
        blu : $("#name_blu"),
        yel : $("#name_yel"),
        gre : $("#name_gre")
    };

    
    obj_santa["red"].id = 1; // 個別画像フォルダを参照するためのid
    obj_santa["blu"].id = 2; // santa[id], down[id]等
    obj_santa["yel"].id = 3;
    obj_santa["gre"].id = 4;
    for (var color in obj_santa){
        var src = obj_santa[color].id + "image/santa"+obj_santa[color].id + "/1.png";
        change_cache_image(obj_santa[color], src);
        // obj_santa[color].img = cache_images[];
        // obj_santa[color].attr("src","image/santa" + obj_santa[color].id + "/1.png");
        obj_santa[color].state = STATE_INIT;
        obj_santa[color].image_id = 1; // 各種アニメーション用
        obj_santa[color].img.show();
    }

    // 画像の読み込みタイミングによって位置がずれるので少し待つ
    setTimeout(function(){
        for (var color in obj_window){
            // name
            obj_name[color].text(names[color]);
            obj_name[color].show();
            set_name_pos(color);

            // window
            obj_window[color].image_id = 1;
            obj_window[color].state = STATE_CLOSED_NOT_MOVE;
        }
    }, 50);


    intro_santa = $("#santa_intro");
    intro_name = $("#name_intro");
    // obj_tonakai = $("#tonakai");

    obj_sori = $("#sori");
    obj_animebox = $("#anime_box"); // ゲーム画面全体
    WIDTH = px2int(obj_animebox.css("width"));
    HEIGHT = px2int(obj_animebox.css("height"));

    if (DEBUG_LEVEL > 0){
        for (var color in obj_santa){
            santa_pos[color] = $("<p>");
            santa_pos[color].appendTo(obj_animebox);
        }
    }

    // 画面配置
    reset_screen();
    reset_santa_pos();
    reset_window_pos();
    toujou_end();

    $("#anime_box").css("top",0);
    // ソリ
    obj_sori.css("zoom", 1);
    obj_sori.css("left",150);
    obj_sori.css("top",0);
    obj_sori.attr("src","image/sleigh1/sleigh.png");
    obj_sori.removeClass("refrect");
    if(obj_bgm){
        obj_bgm.pause();
    }

    $(document).keydown(function(e) {
        keys[e.keyCode] = true;

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });
    });

    // timer
    initGameTimer();
    if (game_timer == undefined){
        game_timer = setInterval(movePlane, 20);
    }
    // moveWindow();
    // if (DEBUG_LEVEL > 0){
    //     window_timer = setInterval(moveWindow, 2300);
    // }
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
    if (!gameTimer){
        gameTimer = setInterval("timeSpend()",1000);
    }
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
    if (game_timer){
        clearInterval(game_timer);
        game_timer = null;
    }
    clearInterval(window_timer);
    window_timer = null;
    if(obj_bgm){
        obj_bgm.pause();
    }

    // ヒット時のアニメーションの完了を待ってワープモーションに移る
    setTimeout(function(){warp();}, 500);

}

function warp(){
    for(var color in obj_santa){
        // console.log("warp santa:" + color + " state is " + obj_santa[color].state);
        if((obj_santa[color].state == STATE_INIT) || (obj_santa[color].state == STATE_MOVING) || (obj_santa[color].state == STATE_HITTED)){
            // console.log("santa:" + color + " warps");
            obj_santa[color].state = STATE_WAIT;
            obj_santa[color].warp = 2;
            var top = parseInt(obj_santa[color].img.css("top"));
            obj_santa[color].hide();
            obj_santa[color].attr("src","image/warp" + obj_santa[color].id + "/1.png");
            obj_santa[color].img.css("top", top - 900);
//            obj_santa[color].show();
        }
    }
    setTimeout(function(){warpAnimation1();},100);
    console.log("warp");
}

function warpAnimation1(){
    // 本当はwarpに書くべきだが、なぜか上に書くとゴミが写るのでここで記述
    for(var color in obj_santa){
        if(obj_santa[color].state == STATE_WAIT){
            obj_santa[color].show();
        }
    }
    $("#santa_rope").show();
    setTimeout(function(){rope1(1);},100);

}

// 1 2 3 4 5
function rope1(ropeIdx){
    $("#santa_rope").attr("src","image/rope/" + ropeIdx + ".png");
    if(ropeIdx < 5){
        ropeIdx ++;
        setTimeout(function(){rope1(ropeIdx);},100);
    } else {
        setTimeout(function(){rope2(0);},100);
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
                    // console.log(color);
                    if(obj_santa[color].state == STATE_WAIT){
                        setTimeout("warpAnimation2(\"" + color + "\")",800);
                    }
                }
            });
        });
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
    // console.log(color);
    // console.log("ここがバグとみた！！color=" + color + " warp="+obj_santa[color].warp);
    obj_santa[color].attr("src","image/warp" + obj_santa[color].id + "/" + obj_santa[color].warp + ".png");
    obj_santa[color].warp = obj_santa[color].warp + 1;
    if(obj_santa[color].warp < 12){
        setTimeout(function(){warpAnimation2(color);},100);
    } else {
        setTimeout(function(){
            obj_bgm = new Audio("image/sound/warp.mp3");
            obj_bgm.load();
            obj_bgm.play();
            obj_santa[color].img.animate({top:-1440},2000);
            obj_name[color].animate({top:-1440},2800);
            setTimeout(function(){warpAnimation3(color);},2100);
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
        setTimeout(function(){warpAnimationEnd()},2000);
        return;
    }

    idx++;
    setTimeout(function(){rope5(idx)},100);
}

// 上からサンタが落ちてくる
function warpAnimation3(color){
    obj_santa[color].image_id = 0;
    santa_goal_sori_ride(color);
}

function warpAnimationEnd(){
    soriAnimationStart();
}
function soriAnimationStart(){
    console.log("sori move");
    obj_sori.image_id = 1;
    obj_sori.attr("src","image/sleigh1/1.png");
    //$("#sori").animate({left:-1080},2000,endAnimationBigSoriMove);
    //$("#santa_rope").animate({left:-1080},2000);

    $("#santa_rope").hide();
    for (var color in obj_santa){
        obj_santa[color].hide();
    }
    setTimeout("soriAnimation()",100);
}

function soriAnimation(){
    var idx = obj_sori.image_id;
    if(idx < 32){
        obj_sori.image_id++;
        var left = parseInt(obj_sori.css("left"));
        obj_sori.attr("src","image/sleigh1/" + (idx % 8 + 1)+ ".png");
        obj_sori.css("left", (left - idx * 2));
        setTimeout("soriAnimation()",100)
    } else {
        //obj_sori.animate({left:-1080},1000,soriAnimationBigSoriMove);
        setTimeout("soriAnimationBigSoriMove()",1000);
    }
}

function soriAnimationBigSoriMove(){
    console.log("soriAnimationBigSori");
    console.log(sori);
    obj_sori.addClass("refrect");
    obj_sori.css("zoom", 3);
//    sori.css("left", 1100);
    obj_sori.css("top", 100);
    obj_sori.animate({left:500,top:0},5000, xmas);
}



function xmas(){
    // 終わりナレーション
//    obj_bgm.pause();

    SendMsg("gadget", {method:"gStop", options:{}});

    obj_bgm = new Audio("image/sound/fin.mp3");
    obj_bgm.load();
    obj_bgm.play();
    $("#anime_box").animate({top:"1080px"}, 1500);

    $("#screen_fin2").show();

    setTimeout(function(){
      var now = (+ new Date());
      $("#screen_fin1").attr('src', 'image/fin1/fin.gif?' + now);
      $("#screen_fin1").fadeIn("slow");

      setTimeout(function(){
        $("#screen_fin1").fadeOut("1300");

        setTimeout(function(){
          $("#merryxmas").fadeIn("slow");
        },1000);
      },4900);
    },1000);

}

function reset_screen(){
    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();
    $("#screen_intro_bg").hide();
    toujou_end();

    // エンディング画面を消す
    $("#screen_fin2").hide();
    $("#merryxmas").hide();
    $(".goal_text").remove();
    // console.log("test");
};

// プレ用
function pre(){
    reset_screen();
    $("#screen_pre").show();
};

// タイトル用
function title(){
    reset_screen();
    $("#screen_title").show();
};

// ルール説明用
function rule(){
    reset_screen();
    $("#screen_rule").show();
};

// フロンタ応援用
function ouen(){
    reset_screen();
    $("#screen_ouen").show();
};

function stopintrotimer(){
    clearInterval(intro_santa_timer);
};

function toujou_end(){
    console.log("toujou_end");
    // clearInterval(intro_santa_timer);
    toujou_animation_moving = 0;
    intro_santa.hide();
    intro_name.hide();
    $("#screen_intro_bg").hide();
};

var first_animation = 0;
function toujou_start(color, name){
    console.log("toujou_start");
    console.log("toujou_animation_moving=" + toujou_animation_moving);

    if (toujou_animation_moving == 1){
        console.log(toujou_animation_moving);
        intro_santa.animate({left:"-=" + 600}, 1000, 'linear');
        intro_name.animate({left:"-=" + 1000}, 1100, 'linear');
        setTimeout(function(){toujou_animation_moving = 0; toujou_start(color, name);}, 1200);
        return;
    }else {
        reset_screen();
        $("#screen_intro_bg").show();
        toujou(color_id[color], name);
        if (toujou_animation_moving == 0){
            toujou_animation_moving = 1;
            if (first_animation == 0){
                toujou_animation();
                first_animation = 1;
            }
        }
        // intro_santa.css("left", 1100);
        intro_santa.animate({left:"+=" + 500}, 0);
        intro_santa.animate({left:"-=" + 500}, 1000, 'linear');
        intro_name.animate({left:"+=" + 700}, 0);
        intro_name.animate({left:"-=" + 700}, 1000, 'linear');
    }
    // intro_santa.animate({left:intro_santa.left_pos}, 1000);
};

function toujouall(){
    $("#screen_intro_bg").show();
    // return;
    intro_santa = $("#santa_intro");
    // console.log(intro_santa);
    toujou(1);
    toujou_animation_moving = 1;
    // intro_santa.id = 1;
    toujou_animation();
    // intro_santa_timer = setInterval(function(){toujou_animation();}, 100);
    // setTimeout(function(){toujou_end();},30000);

    // for (var color in obj_santa){
    //     toujou(color);
    //     break;
    // }
    // $("#screen_intro_bg").hide();
};

var toujou_anime_step = [
     // dummy
    [],
    // red
    [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1]],
    // blu
    [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1],
     [5, 0.1], [6, 0.1], [7, 0.1], [8, 0.1]],
    // yel
    [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1]],
    // gre
    [[1, 0.2], [2, 0.2], [3, 0.2], [4, 0.2],
     [5, 0.2], [6, 0.2], [7, 0.2], [8, 0.2],
     [9, 0.1], [10, 0.1], [11, 0.1],
     [12, 0.5],
     [13, 0.1], [14, 0.1], [15, 0.1],[16, 0.1],
     [17, 1.0],
     [16, 0.1], [15, 0.1], [14, 0.1],[13, 0.1],
     [12, 0.5],
     [18, 0.1]]
];
var toujou_animation_num_iterate = 30;
var toujou_animation_moving = 0;
function toujou_animation(){
    if (toujou_animation_moving > 0){
        // console.log("toujou_animation");
    // console.log("img.id:"+intro_santa.image_id);
    // console.log(intro_santa);
    // console.log("toujou_animation:" + intro_santa.attr("src"));
    // if (intro_santa.image_id >= toujou_animation_num_iterate){
    //     intro_santa.image_id = 1;
    //     // intro_santa.attr({src:prev_src});
    //     // intro_santa.state=STATE_MOVING;
    // }else{
        // console.log(intro_santa);
        var anime_idx = intro_santa.image_id % toujou_anime_step[intro_santa.id].length;
        // console.log("anime_idx"+anime_idx);
        var next_img_id = toujou_anime_step[intro_santa.id][anime_idx][0];
        var next_img_wait = toujou_anime_step[intro_santa.id][anime_idx][1];
        // console.log("santa id=" + intro_santa.id + " next_img_id="+next_img_id + " wait=" + next_img_wait);
        change_image_src(intro_santa, next_img_id);
        intro_santa.image_id++;
        setTimeout(function(){toujou_animation();}, next_img_wait * 1000);
    }
    // }
    // console.log("hogetoujou_animation:" + intro_santa.attr("src"));
}

var intro_santa_wh = [
    [],
    [530*1.5, 400*1.5],
    [530*1.5, 400*1.5],
    [530*1.5, 400*1.5],
    [450*1.5, 530*1.5]
    ];
var intro_santa_pos = [
    [],
    [50, 150],
    [50, 150],
    [50, 150],
    [100, 100]
    ];
function toujou(id, name){
    console.log("toujou " + id);
    // if (id <= 4){
    intro_name.text(name);
    intro_santa.id = id;
    intro_santa.attr("src", "image/introduction/introduction" + id + "/1.png");
    intro_santa.show();
    intro_santa.image_id = 1;
    intro_name.show();
    console.log("height:" + intro_santa.css("height") + " width"+intro_santa.css("width"));
    var toujou_top_pos = HEIGHT / 2 - intro_santa_wh[intro_santa.id][0] / 2;
    var toujou_left_pos = WIDTH / 2 - intro_santa_wh[intro_santa.id][1] / 2;
    intro_santa.top_pos = toujou_top_pos;
    intro_santa.left_pos = toujou_left_pos;
    console.log("top:" + toujou_top_pos + " left:"+toujou_left_pos);
    intro_santa.css("top", toujou_top_pos);
    intro_santa.css("left", toujou_left_pos);
    intro_santa.css("top", intro_santa_pos[intro_santa.id][0]);
    intro_santa.css("left", intro_santa_pos[intro_santa.id][1]);

    intro_name.css("top", intro_santa_pos[intro_santa.id][0] + intro_santa_wh[intro_santa.id][0]);
    console.log([intro_santa_pos[intro_santa.id][1], intro_santa_wh[intro_santa.id][1], intro_name.css("width")]);
    intro_name.css("left", intro_santa_pos[intro_santa.id][1] + intro_santa_wh[intro_santa.id][1]/2 - px2int(intro_name.css("width")) /2 + 50);

}


function readyGo(){

    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();

    // よーい
    $("#screen_yoi").show();

    // どん!
    setTimeout("readyGo2()",3000);
    // window_timer = setInterval(moveWindow, msec_window_interval);
}

// よーいどん用
function readyGo2(){
    startGameTimer();
    for(var color in obj_santa){
        obj_santa[color].state = STATE_MOVING;
    }
    $("#screen_yoi").hide();
    $("#screen_don").show();
    $("#screen_don").fadeOut(3000);
    //bgm開始
    // if (!obj_bgm){
    if (obj_bgm){obj_bgm.pause();}
    obj_bgm = new Audio("image/sound/bgm.mp3");
    // }
    obj_bgm.loop = "true";
    obj_bgm.load();
    obj_bgm.pause();
    obj_bgm.play();
}

function end(){

}
