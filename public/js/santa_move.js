var obj_santa;
var obj_tonakai;
var WIDTH;
var HEIGHT;
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
var tonakai_counter = 1;
var santaL_src = "image/santa_pack/red_l.png";
var santaR_src = "image/santa_pack/red_r.png";
// var tonakaiL_src = "image/santa_pack/blue_l.png";
var tonakai_src = "image/tonakai/tonakai";
var move_threshold = 8;
var move_tonakai_threshold = 12;
function santamove(color){
    if (santa_dir[color] > 0){
        obj_santa[color].attr({
        src: santaL_src
        });
        santa_dir[color]++;
    }else if (santa_dir[color] < 0){
        obj_santa[color].attr({
        src: santaR_src
        });
        santa_dir[color]--;
    }
    if (santa_dir[color] > move_threshold){
        santa_dir[color] = -1;
    }else if (santa_dir[color] < - move_threshold){
        santa_dir[color] = 1;
    }
    console.log(santa_dir[color]);

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

function movePlane() {
    var move_keys = _communication_keys;
    for(var direction in keys){
        if (!keys.hasOwnProperty(direction)) continue;
        move_keys.red[direction] = true;
    }
    _communication_keys = {red:{},blu:{},gre:{},yel:{}};
    for(var color in obj_santa){
        for (var direction in move_keys[color]) {
	        var pos_left = px2int(obj_santa[color].css("left"));
	        var pos_top = px2int(obj_santa[color].css("top"));
            if (!move_keys[color].hasOwnProperty(direction)) continue;
            if (direction == k_left) {
	            pos_left = Math.max(0, pos_left - 5);
                obj_santa[color].animate({left: ""+pos_left}, 0);
            }
            if (direction == k_up) {
                pos_top = Math.max(0, pos_top - 5);
                obj_santa[color].animate({top: pos_top}, 0);
                santamove(color);
            }
            if (direction == k_right) {
	            pos_left = Math.min(WIDTH - px2int(obj_santa[color].css("width")), pos_left + 5);
                obj_santa[color].animate({left: pos_left}, 0);  
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
        obj.animate({
            left: "+="+move_list[i]['left'],
            top: "+="+move_list[i]['top']
        }, duration);
    }
}

function move_from_textarea(str){
    console.log(str);
    move_list(eval(str));
}

function reset_santa_pos(color){
    // サンタの位置を初期値（中央に移動）
    obj_santa[color].css("left", WIDTH / 2 - px2int(obj_santa[color].css("width"))/2);
    obj_santa[color].css("top", HEIGHT / 2- px2int(obj_santa[color].css("height"))/2);
}


// depricated
function movestart(){
    obj_santa = {
        red : $("#santa_red"),
        blu : $("#santa_blu"),
        gre : $("#santa_gre"),
        yel : $("#santa_yel")
    }
    obj_tonakai = $("#tonakai");
    WIDTH = px2int($("#anime_box").css("width"));
    HEIGHT = px2int($("#anime_box").css("height"));

	for(var tmp_color in obj_santa){
	    reset_santa_pos(tmp_color);
	    console.log("width=" + WIDTH + " height=" + HEIGHT);
	    console.log(obj_santa[tmp_color].css("left") + " " + obj_santa[tmp_color].css("top"));
	    console.log($("body").css("height"));
	}

    $(document).keydown(function(e) {
        keys[e.keyCode] = true;

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });
    });
    setInterval(movePlane, 20);
    setInterval(moveTonakai, 500);
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

    for(var tmp_color in obj_santa){
        reset_santa_pos(tmp_color);
    }

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