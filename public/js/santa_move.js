var obj_santa;
var obj_tonakai;
var obj_animebox;
var WIDTH;
var HEIGHT;
var DEBUG_LEVEL = 0;
var GOAL_LINE = 150;
var game_timer;
var santaCanMove = false;
var GAMETIME_DEFAULT = 30;
var gametime = GAMETIME_DEFAULT;
var gameTimer = null;

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
function next_santa_image_src(cur_image_src){
    // 1.png, 2.png, ..., 10.pngの順番で次の画像パスを返す
    console.log("cur_image_src=" + cur_image_src);
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var next_num = (Number(cur_image_src.substring(num_start, num_end)) + 1) % 10 + 1;
    console.log("num_start=" + num_start + " num_end=" + num_end);
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
    console.log("src="+obj_santa[color].attr("src"));
    if (santa_dir[color] > move_threshold){
        obj_santa[color].attr({
            src: next_santa_image_src(obj_santa[color].attr("src"))
        });
        santa_dir[color] = 1;
    }else{
        santa_dir[color] += 1;
    }
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
    // とりあえずはゴールの表示だけ
    var goal_text = $("<img>").attr("src", "image/goal/goal.png");
    goal_text.appendTo(obj_animebox);
    clearInterval(game_timer);

    // ゴールに到達した時の処理

    // 一番のサンタがよじ登る

    // 他のサンタはロープを使ってワープする

    // そりに乗る

    // そりが動く

    // 終わりナレーション？
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
        if (px2int(obj_santa[color].css("top")) <= GOAL_LINE){
            goalAnimation();
            // alert();
        }

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

function movestart(debug){
    DEBUG_LEVEL = debug;
    obj_santa = {
        red : $("#santa_red"),
        blu : $("#santa_blu"),
        gre : $("#santa_gre"),
        yel : $("#santa_yel")
    };
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

    santaCanMove = false;
    initGameTimer();
}

function readyGo(){
    // 3 , 2 , 1 


    // Go!
    startGameTimer();
    santaCanMove = true;
}

function end(){

}
