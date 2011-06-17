// JQuery event-driven pagination plugin that also generates the 
// html for navigation.

// The event pagination was taken from the plugin written by 
// Mark Perkins, mark@allmarkedup.com 
// https://github.com/allmarkedup/jQuery-EvtPaginate

// The navigation html generation was borrowed from
// http://th3silverlining.com/2010/04/15/pajination-a-jquery-pagination-plugin/

var $page_container;
var $nav_panels;

;(function($) {
	
	var defaults = {
		perPage : 5, // number of items per page
		startPage : 1, // page to begin on - NOT zero indexed
		atEnd : 'stop', // loop / stop
		show_navigation: false, // generate and display navigation
        nav_label_last: "Last", // Label for Last link
        nav_label_first: "First", // Label for First link
        nav_label_prev: "Previous", // Label for Previous link
        nav_label_next: "Next", // Label for Next link
        nav_panel_id: ".page_navigation", // selector for navigation container
        seperator: "", // seperator to use between navigation labels
	};
	
	$.fn.evtpaginate = function( options )
	{
		return this.each(function(){


			var opts = $.extend(true, {}, defaults, options); // set options
			var wrap = opts.wrapper = $(this);
			
			var nav_panels = opts.nav_panels = opts.wrapper.next(opts.nav_panel_id);
			
			wrap.bind( 'show.evtpaginate', function( e, pageNum ){ show( opts, pageNum-1 ); });
			wrap.bind( 'next.evtpaginate', function(){ next( opts ); });
			wrap.bind( 'prev.evtpaginate', function(){ prev( opts ); });
			wrap.bind( 'first.evtpaginate', function(){ show( opts, 0 ); });
			wrap.bind( 'last.evtpaginate', function(){ show( opts, opts.totalPages-1 ); });
			wrap.bind( 'refresh.evtpaginate', function( e, newopts ){ refresh( opts, newopts ); });

			setUp( opts );
		});
	};
	
	function setUp( opts )
	{
		opts.perPage		=	parseInt(opts.perPage);
		opts.items 			=	opts.wrapper.children();
		opts.totalItems		=	opts.items.size();
		opts.totalPages		=	Math.ceil( opts.totalItems / opts.perPage );
		opts.currentPage	=	parseInt(opts.startPage) - 1;
		opts.first 			=	isFirstPage( opts, opts.currentPage );
		opts.last 			=	isLastPage( opts, opts.currentPage );
		opts.pages			=	[];
		
		if ( opts.currentPage > opts.totalPages-1 ) opts.currentPage = opts.totalPages-1;

		opts.items.hide();	
			
		for ( var i = 0; i < opts.totalPages; i++ )
		{
			var startItem = i*opts.perPage;
			opts.pages[i] = opts.items.slice( startItem, (startItem + opts.perPage) );
		}

		if (opts.show_navigation == true)
		{
			var navigation_html = '<ul class="navigation"';
			navigation_html += '<li><a class="first_link" href="#">'+ opts.nav_label_first +'</a></li>';
			navigation_html += '<li><a class="previous_link" href="#">'+ opts.nav_label_prev + opts.seperator +'</a></li>'; //+ less;
			var current_link = 0;
			while(opts.totalPages > current_link){
				navigation_html += '<li><a class="page_link" href="#" longdesc="' + current_link +'">'+ (current_link + 1) + opts.seperator +'</a></li>';
				current_link++;
			}
			navigation_html += '<li><a class="next_link" href="#">'+ opts.nav_label_next + '</a></li>';
			navigation_html += '<li><a class="last_link" href="#">'+ opts.nav_label_last +'</a></li>';
			navigation_html += '</ul>';

			var nav_panels = opts.nav_panels = opts.wrapper.next(opts.nav_panel_id);
			nav_panels.append(navigation_html).each(function(){
				$(this).find('.page_link:first').addClass('first');
				$(this).find('.page_link:last').addClass('last');
			});
			
			nav_panels.find('.previous_link').next().next().addClass('active_page');

			nav_panels.children('.page_link').hide(); // Hide all the page links

			// And only show the number we should be seeing
			nav_panels.each(function(){
				$(this).children('.page_link').slice(0, 3).show();
			});
			
			$('.first_link').click(function(){
				opts.wrapper.trigger('first.evtpaginate');
				return false;
			});

			$('.last_link').click(function(){
				opts.wrapper.trigger('last.evtpaginate');
				return false;
			});

			$('.previous_link').click(function(){
				opts.wrapper.trigger('prev.evtpaginate');
				return false;
			});

			$('.next_link').click(function(){
				opts.wrapper.trigger('next.evtpaginate');
				return false;
			});

			$('.page_link').click(function(){
				var page_no = parseInt($(this).text());
				opts.wrapper.trigger('show.evtpaginate', page_no );
				return false;
			});
		}
        show( opts, opts.currentPage );

		opts.wrapper.trigger( 'initialized.evtpaginate', [opts.currentPage+1, opts.totalPages] );
	}
	
	function refresh( opts, newopts )
	{
		if ( newopts !== undefined ) $.extend(true, opts, newopts); // update options
		opts.startPage = parseInt(opts.currentPage)+1;
		setUp( opts );
	}
	
	function next( opts )
	{
		switch( opts.atEnd )
		{
			case 'loop': show( opts, (opts.last ? 0 : opts.currentPage + 1) ); break;
			default: show( opts, (opts.last ? opts.totalPages - 1 : opts.currentPage + 1) ); break; // stop when getting to last page 
		}
	}
	
	function prev( opts )
	{
		switch( opts.atEnd )
		{
			case 'loop': show( opts, (opts.first ? opts.totalPages - 1 : opts.currentPage - 1) ); break;
			default: show( opts, (opts.first ? 0 : opts.currentPage - 1) ); break; // stop when getting to first page 
		}
	}
	
	function show( opts, pageNum )
	{
        if ( pageNum > opts.totalPages-1 ) pageNum = opts.totalPages-1;
				
		if ( ! opts.pages[opts.currentPage].is(':animated') )
		{
			opts.wrapper.trigger( 'started.evtpaginate', opts.currentPage+1 );
			
			$.fn.evtpaginate.swapPages( opts, pageNum, function(){
				
				opts.currentPage = pageNum;
				opts.first = isFirstPage( opts, opts.currentPage ) ? true : false;
				opts.last = isLastPage( opts, opts.currentPage ) ? true : false;
				
				opts.wrapper.trigger( 'finished.evtpaginate', [opts.currentPage+1, opts.first, opts.last] );
                opts.nav_panels.children().find("[longdesc="+pageNum+"]").parent().addClass('current').siblings(".current").removeClass("current");

                if (opts.first){
                   opts.nav_panels.children().find(".first_link, .previous_link").parent().addClass('selected');
                } else {
                   opts.nav_panels.children().find(".first_link, .previous_link").parent().removeClass('selected');
                }

                if (opts.last){
                   opts.nav_panels.children().find(".next_link, .last_link").parent().addClass('selected');
                } else {
                   opts.nav_panels.children().find(".next_link, .last_link").parent().removeClass('selected');
                }

			});
		}
	}
	
	// public, can override this if neccessary
	$.fn.evtpaginate.swapPages = function( opts, pageNum, onFinish )
	{
		opts.pages[opts.currentPage].hide();
		opts.pages[pageNum].show();
		onFinish();
	};
	
	// utility functions
	function isFirstPage( opts, internalPageNum ) { return ( internalPageNum === 0 ); }
	function isLastPage( opts, internalPageNum ) { return ( internalPageNum === opts.totalPages-1 ); }
	
})(jQuery);
