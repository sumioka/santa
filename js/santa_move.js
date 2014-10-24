var obj;
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
var santaL_src = "image/santa_pack/red_l.png";
var santaR_src = "image/santa_pack/red_r.png";
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
    obj = $("#nicoid");
    $(document).keydown(function(e) {
        keys[e.keyCode] = true;

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });    });
    setInterval(movePlane, 20);
}
