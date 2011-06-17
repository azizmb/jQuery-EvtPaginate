jQuery Event-driven pagination plugin
=================

A stripped-back jQuery plugin that makes it possible to paginate pretty much any group of objects on a page, using custom events as the interaction API.

It **does** make the element it was called on respond to a set of custom DOM events that can be used to control the pagination, display page counts, refresh the list contents and so on.

License
-------

http://unlicense.org/ - i.e. do what you want with it :-)

Usage
-----

This plugin needs to be called on a DOM element that contains the set of child elements that you wish to paginate - for instance on a DIV that wraps a number of IMG elements, or on a UL that wraps a number of LIs.

**Example markup:**

    <ul id="wrapper"> 
    	<li>one</li>
    	<li>two</li> 
    	<li>three</li> 
    	<li>four</li> 
    	<li>five</li> 
    	<li>six</li> 
    	<li>seven</li> 
    	<li>eight</li> 
    	<li>nine</li> 
    	<li>ten</li> 
    </ul>

**Example JS:**

    $(function(){
    	$('#wrapper').evtpaginate({perPage:3});
    });
    
Once this is done, you paginated list of elements will now respond to custom DOM events that can be triggered on the parent element. Some custom events will also be triggered by the plugin at certain times - more details below.

**The parent element will respond to the following events:**

*   **next.evtpaginate** - go to the next page `$('wrapper').trigger('next.evtpaginate');`

*   **prev.evtpaginate** - go to the previous page `$('wrapper').trigger('prev.evtpaginate');`

*   **first.evtpaginate** - go to the first page `$('wrapper').trigger('first.evtpaginate');`

*   **last.evtpaginate** - go to the last page `$('wrapper').trigger('last.evtpaginate');`

*   **show.evtpaginate** - go to the specified page `$('wrapper').trigger('show.evtpaginate', 2 );`

*   **refresh.evtpaginate** - refresh the pagination (call after adding or removing items from the list, or to change the plugin's settings) `$('wrapper').trigger('refresh.evtpaginate', {perPage:4} );`

**This plugin will trigger the following events:**

*   **initialized.evtpaginate** - triggered once the plugin setup is completed
*   **started.evtpaginate** - triggered just before a pagination event takes place (i.e. before it moves to a new page)
*   **finished.evtpaginate** - triggered once a pagination event finishes (i.e. after it has moved to a new page)

Note these events are all namespaced under the 'evtpaginate' namespace.

Check out demo.html to see a few basic examples of the plugin in action.
