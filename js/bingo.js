var bingo = function (size) {

	function gup(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null)
			return "";
		return results[1];
	}

	var LANG = gup('lang');
	if (LANG == '') LANG = 'name';
	var SEED = gup('seed');
	var MODE = gup('mode');
	var EXPLORATION = gup("exploration");

	if (SEED == "") return reseedPage(MODE);

	if (EXPLORATION) {
		$('#exploration-check').prop('checked', true);
	}

	var cardtype = "string";

	if (MODE == "short") { cardtype = "Short"; }
	else if (MODE == "long") { cardtype = "Long"; }
	else { cardtype = "Normal"; }

	if (typeof size == 'undefined') size = 5;

	Math.seedrandom(SEED); //sets up the RNG

	var results = $("#results");
	results.append("<p>HK Bingo JP <strong>v1</strong>&emsp;Seed: <strong>" +
		SEED + "</strong>&emsp;Card type: <strong>" + cardtype + "</strong></p>");

	if (!EXPLORATION) {
		$('.popout').click(function () {
			var mode = null;
			var line = $(this).attr('id');
			var name = $(this).html();
			var items = [];
			var cells = $('#bingo .' + line);
			for (var i = 0; i < 5; i++) {
				items.push(encodeURIComponent($(cells[i]).html()));
			}
			window.open('bingo-popout.html#' + name + '=' + items.join(';;;'), "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=220, height=460");
		}
		);
	}

	$("#selected td").toggle(
		function () { $(this).addClass("greensquare"); },
		function () { $(this).addClass("redsquare").removeClass("greensquare"); },
		function () { $(this).removeClass("redsquare"); }
	);

	$("#bingo tr").on('click', 'td:not(.popout):not(.hidden)',
		function () {
			if ($(this).hasClass('greensquare')) {
				$(this).addClass('redsquare').removeClass('greensquare');
			} else if ($(this).hasClass('redsquare')) {
				$(this).removeClass('redsquare')
			} else {
				$(this).addClass('greensquare');
				var slot = parseInt($(this).attr('id').slice(4));
				// maybe unhide more goals
				// dividable by 5? nothing to the right
				if (slot % 5 != 0) {
					$('#slot' + (slot + 1)).removeClass('hidden');
				}
				// nothing to the left
				if (slot % 5 != 1) {
					$('#slot' + (slot - 1)).removeClass('hidden');
				}
				// top down doesn't matter
				$('#slot' + (slot + 5)).removeClass('hidden');
				$('#slot' + (slot - 5)).removeClass('hidden');
			}
		}
	);

	$("#row1").hover(function () { $(".row1").addClass("hover"); }, function () { $(".row1").removeClass("hover"); });
	$("#row2").hover(function () { $(".row2").addClass("hover"); }, function () { $(".row2").removeClass("hover"); });
	$("#row3").hover(function () { $(".row3").addClass("hover"); }, function () { $(".row3").removeClass("hover"); });
	$("#row4").hover(function () { $(".row4").addClass("hover"); }, function () { $(".row4").removeClass("hover"); });
	$("#row5").hover(function () { $(".row5").addClass("hover"); }, function () { $(".row5").removeClass("hover"); });

	$("#col1").hover(function () { $(".col1").addClass("hover"); }, function () { $(".col1").removeClass("hover"); });
	$("#col2").hover(function () { $(".col2").addClass("hover"); }, function () { $(".col2").removeClass("hover"); });
	$("#col3").hover(function () { $(".col3").addClass("hover"); }, function () { $(".col3").removeClass("hover"); });
	$("#col4").hover(function () { $(".col4").addClass("hover"); }, function () { $(".col4").removeClass("hover"); });
	$("#col5").hover(function () { $(".col5").addClass("hover"); }, function () { $(".col5").removeClass("hover"); });

	$("#tlbr").hover(function () { $(".tlbr").addClass("hover"); }, function () { $(".tlbr").removeClass("hover"); });
	$("#bltr").hover(function () { $(".bltr").addClass("hover"); }, function () { $(".bltr").removeClass("hover"); });

	var mode = "";
	if (MODE == "short") { mode = "json_event"; }
	else { mode = "json"; }

	var request = new XMLHttpRequest;
	request.open("GET", "https://bingomake-hkjp.herokuapp.com/" + mode + "?seed=" + SEED, true);
	request.responseType = "text";
	request.onload = function () {
		var bingoBoard = JSON.parse(this.response);

		//populate the actual table on the page
		for (i = 1; i <= 25; i++) {
			$('#slot' + i).append(bingoBoard[i - 1].name);
			if (EXPLORATION && i != 7 && i != 19) {
				$('#slot' + i).addClass('hidden');
			}
			//$('#slot'+i).append("<br/>" + bingoBoard[i].types.toString());
			//$('#slot'+i).append("<br/>" + bingoBoard[i].synergy);

			if (EXPLORATION) {
				$('#bingosync-goals').text("Explorationモードが有効のため非表示です");
			} else {
				// populate the bingosync-goals
				// useful to use a test board for bingosync
				var bingosync_goals = JSON.stringify(bingoBoard);
				$('#bingosync-goals').text(bingosync_goals);
			}
		}
	};
	request.send();

	return true;
}; // setup

function reseedPage(mode) {
	var MAX_SEED = 999999999; //1 million cards
	var qSeed = "?seed=" + Math.ceil(MAX_SEED * Math.random());
	var qMode = (mode == "short" || mode == "long") ? "&mode=" + mode : "";
	var qEx = $('#exploration-check').is(':checked') ? '&exploration=1' : '';
	window.location = qSeed + qMode + qEx;
	return false;
}

// Backwards Compatability 
var srl = { bingo: bingo };

$(function () { srl.bingo(5); });