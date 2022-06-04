var bingo = function (size) {

	if (typeof size == 'undefined') size = 5;

	function gup(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null)
			return "";
		return results[1];
	}

	var SEED = gup('seed');
	var TYPE = gup('type');
	var SIZE = gup('size') ? gup('size') : size;
	var EXPLORATION = gup("exploration");

	if (SIZE == 3) {
		$('#size3').prop('checked', true);
	} else if (SIZE == 4) {
		$('#size4').prop('checked', true);
	}

	if (EXPLORATION) {
		$('#exploration-check').prop('checked', true);
	}

	if (SEED == "") return reseedPage(TYPE);

	var cardtype = "string";

	if (TYPE == "short") { cardtype = "Short"; }
	else if (TYPE == "long") { cardtype = "Long"; }
	else { cardtype = "Normal"; }

	Math.seedrandom(SEED); //sets up the RNG

	var results = $("#results");
	results.append("<p>HK Bingo JP <strong>v1</strong>&emsp;Seed: <strong>" +
		SEED + "</strong>&emsp;Card type: <strong>" + cardtype + "</strong></p>");

	if (!EXPLORATION) {
		$('.popout').click(function () {
			var type = null;
			var line = $(this).attr('id');
			var name = $(this).html();
			var items = [];
			var cells = $('#bingo .' + line);
			for (var i = 0; i < SIZE; i++) {
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

	if (SIZE == 4) {
		$("#row5").hide();
		$("#col5").hide();
		$("#slot5").hide();
		$("#slot10").hide();
		$("#slot15").hide();
		$("#slot20").hide();
		$("#slot21").hide();
		$("#slot22").hide();
		$("#slot23").hide();
		$("#slot24").hide();
		$("#slot25").hide();
		$("#slot5").removeClass("bltr");
		$("#slot9").removeClass("bltr");
		$("#slot13").removeClass("bltr");
		$("#slot17").removeClass("bltr");
		$("#slot21").removeClass("bltr");
		$("#slot4").addClass("bltr");
		$("#slot8").addClass("bltr");
		$("#slot12").addClass("bltr");
		$("#slot16").addClass("bltr");
	} else if (SIZE == 3) {
		$("#row4").hide();
		$("#row5").hide();
		$("#col4").hide();
		$("#col5").hide();
		$("#slot4").hide();
		$("#slot5").hide();
		$("#slot9").hide();
		$("#slot10").hide();
		$("#slot14").hide();
		$("#slot15").hide();
		$("#slot16").hide();
		$("#slot17").hide();
		$("#slot18").hide();
		$("#slot19").hide();
		$("#slot20").hide();
		$("#slot21").hide();
		$("#slot22").hide();
		$("#slot23").hide();
		$("#slot24").hide();
		$("#slot25").hide();
		$("#slot5").removeClass("bltr");
		$("#slot9").removeClass("bltr");
		$("#slot13").removeClass("bltr");
		$("#slot17").removeClass("bltr");
		$("#slot21").removeClass("bltr");
		$("#slot3").addClass("bltr");
		$("#slot7").addClass("bltr");
		$("#slot11").addClass("bltr");
	}

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

	var resType = "";
	if (TYPE == "short") { resType = "json_event"; }
	else { resType = "json"; }

	var request = new XMLHttpRequest;
	request.open("GET", "https://bingomake-hkjp.herokuapp.com/" + resType + "?seed=" + SEED, true);
	request.responseType = "text";
	request.onload = function () {
		var bingoBoard = JSON.parse(this.response);

		//populate the actual table on the page
		for (i = 1; i <= 25; i++) {
			$('#slot' + i).append(bingoBoard[i - 1].name);
			if (SIZE == 3) {
				if (EXPLORATION && i != 1 && i != 13) {
					$('#slot' + i).addClass('hidden');
				}
			} else if (SIZE == 4) {
				if (EXPLORATION && i != 7 && i != 13) {
					$('#slot' + i).addClass('hidden');
				}
			} else {
				if (EXPLORATION && i != 7 && i != 19) {
					$('#slot' + i).addClass('hidden');
				}
			}
			//$('#slot'+i).append("<br/>" + bingoBoard[i].types.toString());
			//$('#slot'+i).append("<br/>" + bingoBoard[i].synergy);
		}

		var bingosync_goals = JSON.stringify(bingoBoard);
		if (EXPLORATION) {
			$('#bingosync-goals').text("Explorationモードが有効のため非表示です。Copyは可能です。");
			$('#bingosync-goals-hidden').text(bingosync_goals);
		} else {
			// populate the bingosync-goals
			// useful to use a test board for bingosync
			$('#bingosync-goals').text(bingosync_goals);
			$('#bingosync-goals-hidden').text(bingosync_goals);
		}
	};
	request.send();

	return true;
}; // setup

function reseedPage(type) {
	var MAX_SEED = 999999999; //1 million cards
	var qSeed = "?seed=" + Math.ceil(MAX_SEED * Math.random());
	var qType = (type == "short" || type == "long") ? "&type=" + type : "";
	var qSize = $('#size3').is(':checked') ? "&size=3" : $('#size4').is(':checked') ? "&size=4" : "";
	var qEx = $('#exploration-check').is(':checked') ? '&exploration=1' : '';
	window.location = qSeed + qType + qSize + qEx;
	return false;
}

function copyJson() {
	var json = $('#bingosync-goals-hidden').text();

	if (navigator.clipboard) {
		navigator.clipboard.writeText(json).then(() => {
			$('#copyButton').text("✔");
			$('#copyButton').css("pointer-events","none")
			$('#copyButton').css("cursor","default")
			setTimeout(function () {
				$('#copyButton').text("Copy")
				$('#copyButton').css("pointer-events","")
				$('#copyButton').css("cursor","pointer")
			}, 1500);
		})
	} else {
		window.clipboardData.setData("Text", str);
	}
}

// Backwards Compatability 
var srl = { bingo: bingo };

$(function () { srl.bingo(5); });