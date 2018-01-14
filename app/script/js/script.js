$("td").dblclick(function() {
	$(this).children("input").show().focus();
	$(this).children("div").hide();
});

$("input.input").focusout( function() {
	$(this).hide();
	$(this).siblings("div").show();
});
