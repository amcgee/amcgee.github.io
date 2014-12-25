$('img').each(function() {
	$(this).addClass( $(this).attr('title'));
  $(this).attr( 'title', $(this).attr('alt') );
});