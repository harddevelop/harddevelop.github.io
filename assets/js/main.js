/*
	Future Imperfect by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$menu = $('#menu'),
			$sidebar = $('#sidebar'),
			$main = $('#main');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// IE<=9: Reverse order of main and sidebar.
			if (skel.vars.IEVersion <= 9)
				$main.insertAfter($sidebar);

		// Menu.
			$menu
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Search (header).
			var $search = $('#search'),
				$search_input = $search.find('input');

			$body
				.on('click', '[href="#search"]', function(event) {

					event.preventDefault();

					// Not visible?
						if (!$search.hasClass('visible')) {

							// Reset form.
								$search[0].reset();

							// Show.
								$search.addClass('visible');

							// Focus input.
								$search_input.focus();

						}

				});

			$search_input
				.on('keydown', function(event) {

					if (event.keyCode == 27)
						$search_input.blur();

				})
				.on('blur', function() {
					window.setTimeout(function() {
						$search.removeClass('visible');
					}, 100);
				});

		// Intro.
			var $intro = $('#intro');

			// Move to main on <=large, back to sidebar on >large.
				skel
					.on('+large', function() {
						$intro.prependTo($main);
					})
					.on('-large', function() {
						$intro.prependTo($sidebar);
					});

	});

})(jQuery);

function processResponse(obj){
	//alert(obj.feed.author[0].name.$t);
	for (var i = 0, len = obj.feed.entry.length; i < len; i++) {
		proccessJsonEntry(obj.feed.entry[i]);
	}
	$(".logo")/*.addClass("fadeOut")*/.delay(3000).remove();
	//now show each elements one by one
	//using css3 instead of jquery because css3 apparently on mobiles
	//platforms uses hardware acceleration and jquery not at all :'(
	var i=0;
	var lis = $(".update-box");
	var interval = setInterval(function() {
	    lis.slice(i,i+1).removeClass("update-box").addClass("update-box2");
		//.css("margin-top","500px")
		//.animate({'margin-top': '5px', "display":"block"});
	    console.log(lis.slice(i,i+1));
	    i += 1;
	}, 200);
}

function proccessJsonEntry(entry){
	/*alert("id: "+entry.id.$t);
	alert("published: "+entry.published.$t);
	alert("updated: "+entry.updated.$t);
	alert("title: "+entry.title.$t);
	alert("content: "+entry.content.$t);
	alert("link: "+entry.link.$t);*/
	var html = "<article class='post'><header>";
	html += "<div class='title'><h2>"+entry.title.$t+"</h2></div>";
	var date = entry.published.$t;
	var newDate = date.substring(0,date.indexOf('T'));
	html += "<div class='meta'><time class='published' date='"+newDate+"'>"+newDate+"</time></div></header>";
	html += "<p>"+proccessedContent(entry.content.$t)+"</p>";
 	html += "<footer></footer></article>";
	$("div#main").append(html);
}

function correctWidth(newElement){
	var maxWidthParent = $("body").css("width");
	if(maxWidthParent.indexOf("px")>-1){
		maxWidthParent = maxWidthParent.substring(0,maxWidthParent.length-2);
	}
	newElement.css("max-width",maxWidthParent-80);
}

function proccessedContent(content){
	var contentElement = $("<div>"+content+"</div>");
	contentElement.find("pre").each(function(){
		var newElement = $("<div class='content-block correctedWidth'></div>");
		correctWidth(newElement);
		newElement.append($(this).text());
		$(this).replaceWith(newElement);
	});
	contentElement.find("code").each(function(){
		var newElement = $("<div class='content-block correctedWidth'></div>");
		correctWidth(newElement);
		newElement.append($(this).text());
		$(this).replaceWith(newElement);
	});
	contentElement.find("blockquote").each(function(){
		var newElement = $("<div class='content-block correctedWidth'></div>");
		newElement.append($(this).text());
		correctWidth(newElement);
		$(this).replaceWith(newElement);
	});
	contentElement.find("a").each(function(){
		href = $(this).attr("href")
		value = href.replace("www.harddevelop.com","blog.harddevelop.com")
		$(this).attr("href",value)
	});
	return contentElement.html();
}

function processPetition(url){
	$.ajax({
	   type: 'GET',
	    url: url,
	    async: false,
	    contentType: "application/json",
	    dataType: 'jsonp',
	    timeout: 5000,
	    success: function(json) {
		processResponse(json);
	    },
	    error: function (xOptions, textStatus) {
		myApp.alert("Error: "+textStatus);
	    }
	});
}

$(window).ready(function(){
	var chkReadyState = setInterval(function() {
	    if (document.readyState == "complete") {
		// clear the interval
		clearInterval(chkReadyState);
		var url = "https://www.blogger.com/feeds/3274373248279408623/posts/default?alt=json-in-script&max-results=999";
		processPetition(url);
	    }
	}, 100);

});

