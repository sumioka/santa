var DEBUG_LEVEL = 1; // 0: release, 1:debug
var SERVER = "http://localhost:3000";
//var SERVER = "http://santajection.herokuapp.com";
var SANTA_RED_GADGET = "red";
var SANTA_BLUE_GADGET = "blue";
var SANTA_GREEN_GADGET = "green";
var SANTA_YELLOW_GADGET = "yellow";

// 色ごとのガジェットを決めるマップ
var colorToGadgetMap = {"red":["30","41"],"blu":["36","37"],"gre":["31","32"],"yel":["29","40"]};


function gadgetToColor(gadegetNum){
	for (var tmp_color in colorToGadgetMap){
		for(var idx in colorToGadgetMap[tmp_color]){
			if(colorToGadgetMap[tmp_color][idx] == gadegetNum){
				return tmp_color;
			}	
		}
	}
	return null;
}

function gadgetToColorIdx(gadegetNum){
	for (var tmp_color in colorToGadgetMap){
		for(var idx in colorToGadgetMap[tmp_color]){
			if(colorToGadgetMap[tmp_color][idx] == gadegetNum){
				return tmp_color + idx;
			}	
		}
	}
	return null;
}

function gadgetToColorAndIdx(gadegetNum){
	for (var tmp_color in colorToGadgetMap){
		for(var idx in colorToGadgetMap[tmp_color]){
			if(colorToGadgetMap[tmp_color][idx] == gadegetNum){
				return {color:tmp_color,index:idx};
			}	
		}
	}
	return null;
}
