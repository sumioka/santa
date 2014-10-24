var obj;
var obj_tonakai;
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
var tonakai_dir = "right";
var santaL_src = "image/santa_pack/red_l.png";
var santaR_src = "image/santa_pack/red_r.png";
var tonakaiL_src = "image/santa_pack/blue_l.png";
var tonakaiR_src = "image/santa_pack/blue_r.png";
var move_threshold = 8;
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
    console.log(santa_dir);
}
function moveTonakai(){
    if (tonakai_dir == "right"){
        obj_tonakai.attr({
            src: tonakaiR_src
        });
        tonakai_dir = "left";
    }else{
        obj_tonakai.attr({
            src: tonakaiL_src
        });
        tonakai_dir = "right";
    }
}

function movePlane() {
    for (var direction in keys) {
        if (!keys.hasOwnProperty(direction)) continue;
        if (direction == k_left) {
            obj.animate({left: "-=5"}, 0);
            // $("#plane").animate({left: "-=5"}, 0);
        }
        if (direction == k_up) {
            obj.animate({top: "-=5"}, 0);
            santamove();
        }
        if (direction == k_right) {
            obj.animate({left: "+=5"}, 0);  
        }
        if (direction == k_down) {
            obj.animate({top: "+=5"}, 0);  
            santamove();
        }
    }
}
function movestart(){
    obj = $("#santa_red");
    obj_tonakai = $("#tonakai");
    $(document).keydown(function(e) {
        keys[e.keyCode] = true;

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });    });
    setInterval(movePlane, 20);
    setInterval(moveTonakai, 1000);
}
