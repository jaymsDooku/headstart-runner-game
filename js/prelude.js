var storyText = ["The planet is overheating due to global warming....",
"Scientists are trying to discover a <bold><green>new energy source</green></bold> called <bold style='color: #2c61aa;'>cold nuclear fusion</bold> to power our world and save the planet.",
"Nuclear fusion is what gives the sun its energy and it works by combing atoms together.",
"Atoms are the building blocks of the world and you are made up of around seven billion billion billion atoms.",
"Currently nuclear fusion is only possible at very high temperatures.",
"However scientists are working tirelessly to develop a way to fuse atoms at cold temperatures.",
"They need you to slow down the effects of global warming to buy them time as well as finding enough coins to fund their research.",
"Can you <bold style='color: darkblue;'>Save My World?</bold>"];
var timeoutInterval = 2000;

function addToPrelude(text, timeout) {
	setTimeout(function() {
		$("<p>" + text + "</p>").hide().appendTo(".prelude-container").fadeIn(800);
	}, timeout);
}

$(document).ready(function() {
	var timeout = 1000;
	for (i = 0; i < storyText.length; i++) {
		addToPrelude(storyText[i], timeout);
		timeout += timeoutInterval;
	}
	setTimeout(function() {
		$("<p style='font-family: Gaegu;'>Press 'Enter' to continue...</p>").hide().appendTo(".prelude-container").fadeIn(500);
	}, timeout);
	$(document).keydown(function(e) {
		if (e.which == 13) {
			e.preventDefault();
			setTimeout(function() {
				window.location.href = 'map.html';
			}, 10);
		}
	});
});