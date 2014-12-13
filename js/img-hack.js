$('img').each(function() {
	if ( !$(this).attr('title') || $(this).attr('title').length === 0 )
    $(this).attr( 'title', $(this).attr('alt') );
});