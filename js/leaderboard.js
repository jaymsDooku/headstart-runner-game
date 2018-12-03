function stringToNumberArray(strArray) {
	var result = [];
	for (i = 0; i < strArray.length; i++) {
		result.push(Number(strArray[i]));
	}
	return result;
}

var level = "Littered Grassland";
var selected = null;
var gamemode = 0;

function onGamemodeClick() {
	$(".leaderboard-view").html("");
	var leaderboards = JSON.parse(localStorage.getItem("leaderboards"));
	if (leaderboards == null) {
		$("<please>Go play the game!</please>").hide().appendTo(".leaderboard-view").fadeIn(500);
		return;
	}
	var gmLB = leaderboards[gamemode];
	if (!gmLB) {
		$("<please>Go play the game!</please>").hide().appendTo(".leaderboard-view").fadeIn(500);
		return;
	}
	var scores = gmLB[level];
	if (!scores) {
		$("<please>Go play the game!</please>").hide().appendTo(".leaderboard-view").fadeIn(500);
		return;
	}
	var scoreNumbers = stringToNumberArray(scores);
	var sortedScores = scoreNumbers.sort();
	
	var statSuffix = "seconds";
	var htmlBuilder = "<h2 style=color:";
	if (level == "Littered Grassland") {
		htmlBuilder += "#29a329;"
	} else if (level == "Nuclear Factory") {
		htmlBuilder += "#527a7a";
		statSuffix = "coins";
		sortedScores = sortedScores.reverse();
	} else if (level == "Meteor Mayhem") {
		htmlBuilder += "#b30000";
		statSuffix = "coins";
		sortedScores = sortedScores.reverse();
	} else if (level == "Diver Dodger") {
		htmlBuilder += "#3385ff";
		statSuffix = "bottles";
		sortedScores = sortedScores.reverse();
	}
	htmlBuilder += ">" + level + "</h2><ul>";
	
	for (i = 0; i < sortedScores.length; i++) {
		var score = sortedScores[i];
		htmlBuilder += "<li>" 
		htmlBuilder += "<rank " 
		htmlBuilder += "class='rank" + (i+1) + "'>"
		+ (i+1) + "</rank>";
		htmlBuilder += " - <stat>" + score + " " + statSuffix + "</stat>"; 
	}
	
	htmlBuilder += "</ul>";
	$(htmlBuilder).hide().appendTo(".leaderboard-view").fadeIn(1500);
}

function setSelected(el) {
	if (selected != null) {
		$(selected).removeClass("leaderboard-selected");
	}
	selected = el;
	$(el).addClass("leaderboard-selected");
}

function setLevel(lvl) {
	if (selected == null) {
		return;
	}
	level = lvl;
	onGamemodeClick();
}

$(document).ready(function() {
		$(".lr-levels").hide();
		$(".jp-levels").hide();
		$("#lr").click(function() {
			if (selected == this) {
				return;
			}
			gamemode = 0;
			if (level != "Littered Grassland" && level != "Nuclear Factory") {
				level = "Littered Grassland";
			}
			onGamemodeClick();
			$(".jp-levels").fadeOut(1000, function() {
				$(".lr-levels").fadeIn(1000);
			});
			setSelected(this);
		});
		$("#jp").click(function() {
			if (selected == this) {
				return;
			}
			gamemode = 1;
			if (level != "Meteor Mayhem" && level != "Diver Dodger") {
				level = "Meteor Mayhem";
			}
			onGamemodeClick();
			$(".lr-levels").fadeOut(1000, function() {
				$(".jp-levels").fadeIn(1000);
			});
			setSelected(this);
		});
		$("#grassland").click(function() {
			setLevel("Littered Grassland");
		});
		$("#factory").click(function() {
			setLevel("Nuclear Factory");
		});
		$("#meteormayhem").click(function() {
			setLevel("Meteor Mayhem");
		});
		$("#diverdodger").click(function() {
			setLevel("Diver Dodger");
		});
});