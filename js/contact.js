$(function() {
	var link = $('a[href="mailto:"]');
	var el = link.find('my-email').first();
	var user = el.attr('data-user');
	var domain = el.attr('data-domain');
	link.click( function(e) {
	    $(this).attr('href', 'mailto:' + user + '@' + domain );
	} );
})