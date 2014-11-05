var obj;
var obj_tonakai;
var WIDTH;
var HEIGHT;
function moveleft(){
    console.log(obj);
    // console.log(obj.position().left);
    $(obj).animate({"left":obj.position().left + 20});
    // obj.position().left += 5;
}




var keys = {};
var k_left = 37;
var k_up = 38;
var k_right = 39;
var k_down = 40;
var santa_dir = 1;
var tonakai_counter = 1;
var santaL_src = "image/santa_pack/red_l.png";
var santaR_src = "image/santa_pack/red_r.png";
// var tonakaiL_src = "image/santa_pack/blue_l.png";
var tonakai_src = "image/tonakai/tonakai";
var move_threshold = 8;
var move_tonakai_threshold = 12;

function santamove(){
    if (santa_dir > 0){
        obj.attr({
        src: santaL_src
        });
        santa_dir++;
    }else if (santa_dir < 0){
        obj.attr({
        src: santaR_src
        });
        santa_dir--;
    }
    if (santa_dir > move_threshold){
        santa_dir = -1;
    }else if (santa_dir < - move_threshold){
        santa_dir = 1;
    }
    // console.log(santa_dir);
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
    for (var direction in keys) {
        if (!keys.hasOwnProperty(direction)) continue;

        var pos_left = px2int(obj.css("left"));
        var pos_top = px2int(obj.css("top"));

        if (direction == k_left) {
            pos_left = Math.max(0, pos_left - 5);
            obj.animate({left: ""+pos_left}, 0);
        }
        if (direction == k_up) {
            pos_top = Math.max(0, pos_top - 5);
            obj.animate({top: pos_top}, 0);
            santamove();
        }
        if (direction == k_right) {
            pos_left = Math.min(WIDTH - px2int(obj.css("width")), pos_left + 5);
            obj.animate({left: pos_left}, 0);
        }
        if (direction == k_down) {
            pos_top = Math.min(HEIGHT - px2int(obj.css("height")), pos_top + 5);
            // console.log("HEIGHT=" + HEIGHT + " pos_top=" + pos_top);
            obj.animate({top: pos_top}, 0);  
            santamove();
        }
    }
}

function move_list(move_list){
    console.log("move_list:" + move_list);
    for (var i = 0; i < move_list.length; i++){
        obj.animate({
            left: move_list[i]['left'],
            top: move_list[i]['top']
        }, 500);
    }
}

function move_from_textarea(str){
    console.log(str);
    move_list(eval(str));
}

function movestart(){
    obj = $("#santa_red");
    obj_tonakai = $("#tonakai");
    WIDTH = px2int($("#anime_box").css("width"));
    HEIGHT = px2int($("#anime_box").css("height"));

    obj.css("left", WIDTH / 2 - px2int(obj.css("width"))/2);
    obj.css("top", HEIGHT / 2- px2int(obj.css("height"))/2);

    console.log("width=" + WIDTH + " height=" + HEIGHT);
    console.log(obj.css("left") + " " + obj.css("top"));
    console.log($("body").css("height"));
    $(document).keydown(function(e) {
        keys[e.keyCode] = true;

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });    });
    setInterval(movePlane, 20);
    setInterval(moveTonakai, 500);
}
