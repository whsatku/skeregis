"use strict";

var isAnimating = false;
var cancelAnimate;
var confirmID;

function toStage(stage, forceDirAnim, noStar){
	if(isAnimating){
		return;
	}
	isAnimating = true;

	var to = $("#stage"+stage);
	var from = $(".stage.visible");
	var pixie = $("#pixie");

	var fromStage = getStageFromDiv(from);
	if(stage == fromStage){
		return;
	}

	if((forceDirAnim !== undefined && forceDirAnim == 2) || (fromStage < stage && forceDirAnim === undefined)){
		// move left
		to.css("left", window.innerWidth).animate({left: 0}, 1000).addClass("visible");
		if(noStar !== true){
			pixie.animate({"left": -window.innerWidth*1.25}, 1000);
		}
		from.animate({"left": -window.innerWidth}, 1000, function(){
			from.removeClass("visible");
			if(to.find("input").length > 0){
				to.find("input").get(0).focus();
			}
			isAnimating = false;
		});
		cancelAnimate = 1;
	}else{
		// move from right
		to.css("left", -window.innerWidth).animate({left: 0}, 1000).addClass("visible");
		if(noStar !== true){
			pixie.animate({"left": -window.innerWidth*0.75}, 1000);
		}
		from.animate({"left": window.innerWidth}, 1000, function(){
			from.removeClass("visible");
			if(to.find("input").length > 0){
				to.find("input").get(0).focus();
			}
			isAnimating = false;
		});
		cancelAnimate = 2;
	}
	if($("input:focus").length > 0){
		$("input:focus").get(0).blur();
	}
}

function getStage(){
	return getStageFromDiv($(".stage.visible"));
}

function getStageFromDiv(div){
	return $(div).attr("id").match(/[0-9]+$/)[0];
}

function reset(){
	if(getStage() == 1){
		return;
	}
	toStage(1, cancelAnimate, true);
	$("#pixie").animate({"left": -window.innerWidth}, 1000);
	$("form").each(function(ind, item){
		item.reset();
	});
	confirmID=undefined;
	$("#search").val("");
	search(null);
}

function search(kw){
	if(data === undefined){
		return;
	}
	var out = $("#searchres").empty();
	if(kw === null || kw === ""){
		return;
	}

	var found = 0;
	data.every(function(item){
		if((item.name + " " + item.lastname).indexOf(kw) != -1){
			addToSearch(item);
			found++;
			if(found > 6){
				return false;
			}
		}
		return true;
	});
	out.find("tr:first").addClass("highlight");
}

function addToSearch(item){
	var out = $("<tr>").data("id", item.id).data("name", item.name + " " + item.lastname);
	$("<td>").text(item.name).appendTo(out);
	$("<td>").text(item.lastname).appendTo(out);
	$("<td>").text(item.branch).appendTo(out);
	$("<td>").text(item.year).appendTo(out);
	$("#searchres").append(out);
}

function welcome(name, id){
	confirmID = id;
	$("#stage4 h3").text(name);
	toStage(4);
}

var data;

$.getJSON("server/register", function(d){
	data = d;
});

$(function(){
	$("body").keydown(function(e){
		if(e.which == 27){
			reset();
			e.preventDefault();
		}else if(getStage() == 1){
			if(e.which == 39){
				toStage(2);
			}else if(e.which == 37){
				toStage(3, 1);
			}
		}else if(getStage() == 2){
			if(e.which == 38){
				$("#stage2 .highlight").removeClass("highlight").prev().addClass("highlight");
				if($("#stage2 .highlight").length === 0){
					$("#stage2 td:first").addClass("highlight");
				}
			}else if(e.which == 40){
				$("#stage2 .highlight").removeClass("highlight").next().addClass("highlight");
				if($("#stage2 .highlight").length === 0){
					$("#stage2 td:last").addClass("highlight");
				}
			}else if(e.which == 13){
				var el = $("#stage2 .highlight");
				if(el.length === 0){
					return;
				}
				welcome(el.data("name"), el.data("id"));
			}
		}else if(getStage() == 4){
			if(!confirmID){
				return;
			}
			if(e.which == 13){
				$.post("server/register/"+confirmID, {arrived:true});
				reset();
			}
		}
	});
	$("a[href=\"Registration:SKE\"]").click(function(){
		toStage(2);
	});
	$("a[href=\"Registration:CPE\"]").click(function(){
		toStage(3, 1);
	});
	$("#stage3 form").submit(function(){
		var name = $(this).find("[name=name]").val() + " " + $(this).find("[name=lastname]").val();
		toStage(4);
		$("#stage4 h3").text(name);
		$.post("server/register", $(this).serialize(), function(item){
			welcome(name, item.id);
		});
		return false;
	});
	$("#search").on("input", function(){
		search(this.value);
	});
});