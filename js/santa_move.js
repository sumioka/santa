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

function movePlane() {
    for (var direction in keys) {
        if (!keys.hasOwnProperty(direction)) continue;
        if (direction == 37) {
            obj.animate({left: "-=5"}, 0);
            // $("#plane").animate({left: "-=5"}, 0);
        }
        if (direction == 38) {
            obj.animate({top: "-=5"}, 0);  
        }
        if (direction == 39) {
            obj.animate({left: "+=5"}, 0);  
        }
        if (direction == 40) {
            obj.animate({top: "+=5"}, 0);  
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
