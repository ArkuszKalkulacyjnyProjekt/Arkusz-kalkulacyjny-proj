$(document).on('dblclick', "td", function() {
	$(this).children("input").show().focus();
	$(this).children("div").hide();
});

$(document).on('blur', "input.input", function() {
	$(this).hide();
	$(this).siblings("div").show();
});


