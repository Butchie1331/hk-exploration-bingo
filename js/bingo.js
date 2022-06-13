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
	var CUSTOM = gup("custom");
	var TYPE = gup('type');
	var SIZE = gup('size') ? gup('size') : size;
	var EXPLORATION = gup("exploration");
	var START = gup("start");

	var slots = [];
	var defaultSlots = [];
	var tlbrSlots = [];
	var bltrSlots = [];

	if (SIZE == 3) {
		$('#size3').prop('checked', true);
		slots = [1, 2, 3, 6, 7, 8, 11, 12, 13];
		defaultSlots = [1, 13];
		tlbrSlots = [1, 7, 13];
		bltrSlots = [3, 7, 11];
	} else if (SIZE == 4) {
		$('#size4').prop('checked', true);
		slots = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19];
		defaultSlots = [7, 13];
		tlbrSlots = [1, 7, 13, 19];
		bltrSlots = [4, 8, 12, 16];
	} else {
		$('#size5').prop('checked', true);
		slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
		defaultSlots = [7, 19];
		tlbrSlots = [1, 7, 13, 19, 25];
		bltrSlots = [5, 9, 13, 17, 21];
	}

	var startSlots = [];
	startSlots = START.split(",").map((str) => parseInt(str));
	if ((START != "0") && !startSlots.some((num) => { return slots.includes(num); })) {
		startSlots = defaultSlots;
	}
	slots.forEach((slot) => {
		if (startSlots.includes(slot)) {
			$("#init-slot" + slot).text("●");
		}
	})

	if (EXPLORATION == "1") {
		$('#exploration-check').prop('checked', true);
		$("#exploration-init").show();
	}

	if (SEED == "") return reseedPage(TYPE);

	$("#seed").val(SEED);

	if (CUSTOM == "1") {
		$('#custom-seed').prop('checked', true);
		$('#seed').prop('disabled', false);
	} else {
		$('#seed').prop('disabled', true);
	}

	var cardtype = "string";

	if (TYPE == "short") { cardtype = "Short"; }
	else if (TYPE == "long") { cardtype = "Long"; }
	else { cardtype = "Normal"; }

	Math.seedrandom(SEED); //sets up the RNG

	var results = $("#results");
	results.append("<p>HK Bingo JP <strong>v1</strong>&emsp;Seed: <strong>" +
		SEED + "</strong>&emsp;Card type: <strong>" + cardtype + "</strong></p>");

	if (EXPLORATION != "1") {
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

	$("#exploration-init-table tr").on('click', 'td',
		function () {
			if ($(this).text() == "●") {
				$(this).text("");
			} else {
				$(this).text("●");
			}
		}
	);

	if (SIZE == 4) {
		$("#row5").hide();
		$("#col5").hide();
	} else if (SIZE == 3) {
		$("#row4").hide();
		$("#row5").hide();
		$("#col4").hide();
		$("#col5").hide();
	}
	for (i = 1; i <= 25; i++) {
		if (!slots.includes(i)) {
			$("#slot" + i).hide();
			$("#init-slot" + i).hide();
		}
		if (tlbrSlots.includes(i)) {
			$("#slot" + i).addClass("tlbr");
		}
		if (bltrSlots.includes(i)) {
			$("#slot" + i).addClass("bltr");
		}
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
	request.open("GET", "https://bingomake-hkjp.herokuapp.com/" + resType + "?seed=" + SEED + "&size=" + SIZE, true);
	request.responseType = "text";
	request.onload = function () {
		var bingoBoard = JSON.parse(this.response);

		//populate the actual table on the page
		for (i = 1; i <= 25; i++) {
			$('#slot' + i).append(bingoBoard[i - 1].name);
			if (EXPLORATION == "1" && !startSlots.includes(i)) {
				$('#slot' + i).addClass('hidden');
			}
			//$('#slot'+i).append("<br/>" + bingoBoard[i].types.toString());
			//$('#slot'+i).append("<br/>" + bingoBoard[i].synergy);
		}

		var bingosync_goals = JSON.stringify(bingoBoard);
		if (EXPLORATION == "1") {
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
	var qSeed = "";
	var qCustom = $('#custom-seed').is(':checked') ? "&custom=1" : "";
	var qType = (type == "short" || type == "long") ? "&type=" + type : "";
	var qSize = $('#size3').is(':checked') ? "&size=3" : $('#size4').is(':checked') ? "&size=4" : "";
	var qEx = $('#exploration-check').is(':checked') ? '&exploration=1' : '';
	var qStart = "";

	if ($("#random-seed").is(":checked")) {
		qSeed = "?seed=" + Math.ceil(MAX_SEED * Math.random());
	} else {
		s = $("#seed").val();
		qSeed = !isNaN(s) && (parseInt(s) >= 0 && parseInt(s) <= MAX_SEED) ? "?seed=" + s : "?seed=";
	}

	if (qEx != "") {
		var startSlots = [];
		for (i = 1; i <= 25; i++) {
			if ($("#init-slot" + i).text() == "●") {
				startSlots.push(i);
			}
		}
		if (startSlots.length) {
			qStart = "&start=" + startSlots.join(",");
		} else {
			qStart = "&start=0";
		}
	}

	window.location = qSeed + qCustom + qType + qSize + qEx + qStart;
	return false;
}

function changeSeedRadio(isCustom) {
	if (isCustom == "1") {
		$("#seed").prop("disabled", false);
	} else {
		$("#seed").prop("disabled", true);
	}
}

function changeSizeRadio(size) {
	var slots = [];
	var defaultSlots = [];

	if (size == 3) {
		slots = [1, 2, 3, 6, 7, 8, 11, 12, 13];
		defaultSlots = [1, 13];
	} else if (size == 4) {
		slots = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19];
		defaultSlots = [7, 13];
	} else {
		slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
		defaultSlots = [7, 19];
	}

	for (i = 1; i <= 25; i++) {
		if (slots.includes(i)) {
			$("#init-slot" + i).show();
		} else {
			$("#init-slot" + i).hide();
		}

		if (defaultSlots.includes(i)) {
			$("#init-slot" + i).text("●");
		} else {
			$("#init-slot" + i).text("");
		}
	}
}

function changeExCheck() {
	if ($('#exploration-check').is(':checked')) {
		$("#exploration-init").show();
	} else {
		$("#exploration-init").hide();
	}
}

function copyJson() {
	var json = $('#bingosync-goals-hidden').text();

	if (navigator.clipboard) {
		navigator.clipboard.writeText(json).then(() => {
			$('#copyButton').text("✓");
			$('#copyButton').css("pointer-events", "none")
			$('#copyButton').css("cursor", "default")
			setTimeout(function () {
				$('#copyButton').text("Copy")
				$('#copyButton').css("pointer-events", "")
				$('#copyButton').css("cursor", "pointer")
			}, 1500);
		})
	} else {
		window.clipboardData.setData("Text", str);
	}
}

// Backwards Compatability 
var srl = { bingo: bingo };

$(function () { srl.bingo(5); });