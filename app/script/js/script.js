$(document).on('dblclick', "td", function() {
	$(this).children("input").show().focus();
	$(this).children("div").hide();
});

$(document).on('focusout', "input.input", function() {
	$(this).hide();
	$(this).siblings("div").show();
});
