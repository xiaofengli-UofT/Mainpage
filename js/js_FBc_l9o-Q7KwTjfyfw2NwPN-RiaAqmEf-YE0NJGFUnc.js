(function($) {

//create singleton to namespace js
if (!projectlight) {
  var projectlight = {};
}

//set up initial page variables - cached Jquery variables
projectlight.init = function(){
	
	//temporary debugging element to allow developer to see exact screen width during development
	$("body").append("<p style='color:red;z-index:100;position:absolute;top:5px;left:5px' id='pagewidth'></p>")
	
	//caching variables to refer to DOM elements in code
	projectlight.$window = $(window);
	projectlight.$wrap = $(".fdem-wrap");
	projectlight.$rows = $(".fdem-row");

	//header items
	projectlight.$globalHdrCtrl = $("#global-header-controls");
	projectlight.$siteSearchBtn = $("#site-search-btn");
	projectlight.$quicklinks = $(".fdem-quicklinks");

	//navigation items
	projectlight.$globalNavOuter = $(".fdem-global-navigation-outer");
	projectlight.$globalNavLI = $(".fdem-global-navigation li");
	
	//instantiate footer columns on page load
	projectlight.$localFooter = $('.fdem-local-footer');
	projectlight.$globalFooter = $('.fdem-global-footer');

	projectlight.$localFooterColumns = projectlight.$localFooter.find('.fdem-column3');
	projectlight.$globalFooterColumns = projectlight.$globalFooter.find('.fdem-column3');
		
	//set namespaced variable to determine layout of menu
	//using modernizr to detect if media query is valid and has been triggered
	if(Modernizr.mq('only screen and (max-width: 767px)')){
		projectlight.mobileLayout  = true;
		
		//call function to remove uniform column height in footers for mobile layout
		projectlight.removeGlobalNavigationColumnHeight();
		projectlight.removeNavigationColumnHeight();
		projectlight.removeSectionListChildrenColumnHeight();
		projectlight.removeContentColumnHeight();
		projectlight.removeFooterColumnsHeight();
	
	}else{
		projectlight.mobileLayout  = false;	
		
		//call function to create uniform column height in footers for desktop/tablet users
		projectlight.setGlobalNavigationColumnHeight();
		projectlight.setNavigationColumnHeight();
		projectlight.setSectionListChildrenColumnHeight();
		projectlight.setContentColumnHeight();
		projectlight.setFooterColumnsHeight();
	}
	
	//if media queries are not supported set a fixed width container to prevent fluid layout breaking in IE and other browsers which do no support MQ
	if(!Modernizr.mq('only all')){ 
		projectlight.$wrap.addClass("fdem-fixed-container");
	}

	//dynamically append Global navigation controls for javascript
	projectlight.$globalHdrCtrl.prepend('<a href="" class="fdem-open-menu ir" id="open-menu">View menu</a>');
	projectlight.$siteSearchBtn.prepend('<a href="#" class="fdem-icon-search-btn ir" id="open-search">Search</a>');
	projectlight.$quicklinks.prepend('<a href="#" class="fdem-open-quicklinks clearfix"><span class="fdem-quicklinks-txt">Quick links</span><span class="fdem-icon-dropdown ir"></span></a>')
	projectlight.$globalNavOuter.append('<a href="#" class="fdem-close-menu" >Close</a>')
	
	//cache variables for DOM elements
	projectlight.$searchDrawer = $('.fdem-search-drawer')
	projectlight.$navigationDrawer = $('.fdem-global-navigation-drawer')
	
	//INSTANTIATE QUICKLINKS DROP DOWN MENU
	// header quicklinks
	projectlight.$quicklinks.find('ul').hide();
	
	//get fdem-quicklinks-list from page and clone into new container underneath the button inside quicklinks container
	$('.fdem-quicklinks-list').clone().appendTo(projectlight.$quicklinks).addClass("column12 clearfix");
	
	$(".fdem-open-quicklinks").bind('click', function(e){
		//shut other open panels nav and search
		projectlight.$searchDrawer.removeClass("fdem-search-open");
		projectlight.$navigationDrawer.removeClass("fdem-navigation-open");
		projectlight.$globalNavOuter.removeClass("fdem-drawer-open");
		//deselect any previously clicked links
		projectlight.$globalNavLI.removeClass("fdem-selected");
		
		projectlight.$quicklinks.toggleClass("fdem-quicklinks-open");
		e.preventDefault();
	})
	
	
	//open search bound click event to open search bar drawer in page
	$("#open-search").bind('click', function(e){
		//shut other open panels nav and quicklinks
		projectlight.$navigationDrawer.removeClass("fdem-navigation-open");
		projectlight.$globalNavOuter.removeClass("fdem-drawer-open");
		projectlight.$quicklinks.removeClass("fdem-quicklinks-open");
		$("body").removeClass("fdem-navigation-open");
		projectlight.localNav.hideMenu();
		//deselect any previously clicked links
		projectlight.$globalNavLI.removeClass("fdem-selected");
		
		projectlight.$searchDrawer.toggleClass("fdem-search-open");
		e.preventDefault();
	})
	
	//ensure drop down closes if you click outside of it. Binding click event to entire page
	$('html').bind('click', function(e){
		if(!$(e.target).hasClass("fdem-open-quicklinks") && !$(e.target).hasClass("fdem-icon-dropdown") && !$(e.target).hasClass("fdem-quicklinks-txt")){
			projectlight.$quicklinks.removeClass("fdem-quicklinks-open");
		}
	})
	
	//Bound click event to global nav button for mobile users to allow them to open the navigation in side drawer
	$("#open-menu").bind('click', function(e){
		//shut other open panels search and quicklinks
		projectlight.$searchDrawer.removeClass("fdem-search-open");
		projectlight.$quicklinks.removeClass("fdem-quicklinks-open");
		projectlight.localNav.hideMenu();
		//close main navigation drawer 
		projectlight.$globalNavOuter.removeClass("fdem-drawer-open");
		//deselect any previously clicked links
		projectlight.$globalNavLI.removeClass("fdem-selected");
		
		$("body").toggleClass("fdem-navigation-open"); //added class to body instead so whole page can be moved to the right
		e.preventDefault();
	})
	
	$(".fdem-close-menu").bind('click', function(e){
		//close main navigation drawer 
		$(e.target).parent().removeClass("fdem-drawer-open");
		//remove selected class from nav item clicked
		$(".fdem-global-navigation li").removeClass("fdem-selected")
		e.preventDefault();
		
	})
	
	
	//bound click event to primary navigation items for desktop view to allow users to browse the navigation in a megadropdown
	//the fdem-no-drawer items are links that click straight through to a page instead of opening a mega dropdown
	$(".fdem-global-navigation a").not(".fdem-no-drawer").bind('click', function(e){
		var linkClicked = $(e.target);
		linkClicked.parent().addClass("fdem-selected");
		var $drawer = $(linkClicked.attr('href'));
		
		//shut other open panels search and quicklinks
		projectlight.$searchDrawer.removeClass("fdem-search-open");
		projectlight.$quicklinks.removeClass("fdem-quicklinks-open");

		//if the navigation is open, and the drawer showing is the same as the link clicked then close drawer and close navigation container
		if($drawer.hasClass("fdem-drawer-open")){
			projectlight.$globalNavLI.removeClass("fdem-selected");
			projectlight.$navigationDrawer.removeClass("fdem-navigation-open");
			projectlight.$globalNavOuter.removeClass("fdem-drawer-open");
		}else{
			//else show close existing drawer and show new drawer, keep open navigation container
			
			//close any other drawers that are open
			projectlight.$globalNavOuter.not($drawer).removeClass("fdem-drawer-open");
			//deselect any previously clicked links
			projectlight.$globalNavLI.not(linkClicked.parent()).removeClass("fdem-selected");
			
			//toggle the open drawer class
			projectlight.$navigationDrawer.addClass("fdem-navigation-open");
			$drawer.toggleClass("fdem-drawer-open");
		}		

		e.preventDefault();
	})
	
	//Show page elements which have been hidden to handle FOUC
	projectlight.$globalHdrCtrl.show();

	//fake last psuedo class to help layout in IE8. This removes the double borders from nested LI
	//which was visually confusing
	$(".fdem-section-list-children ul").each(function(){
		$(this).find("li").last().addClass("fdem-last")
	})
	
}


projectlight.setGlobalNavigationColumnHeight = function(){
	//for each section, get children, measure height of each, set height of each child
	$(".fdem-global-navigation-outer").each(function(){
		var $childrenOfList = $(this).find(".fdem-global-navigation-container");
		var maxColumnHeight = Math.max($childrenOfList.eq(0).height(), $childrenOfList.eq(1).height(), $childrenOfList.eq(2).height());
		
		//why is the col height 0 here?
		// console.log(maxColumnHeight)
		//hardcoded to 300 for time being
		$childrenOfList.css({'min-height':300} )
	})
}

projectlight.removeGlobalNavigationColumnHeight = function(){
	$('.fdem-global-navigation-container').removeAttr("style");
}

projectlight.setSectionListChildrenColumnHeight = function(){
	//for each section list, get section-list-children, measure height of each, set height of each child
	$(".fdem-section-list-row").each(function(){
		var $childrenOfList = $(this).find(".fdem-section-list-children");
		var maxColumnHeight = Math.max($childrenOfList.eq(0).height(), $childrenOfList.eq(1).height(), $childrenOfList.eq(2).height());
		$childrenOfList.css({'min-height':maxColumnHeight} )
	})
}

projectlight.removeSectionListChildrenColumnHeight = function(){
	$('.fdem-section-list-children').removeAttr("style");
}

projectlight.setNavigationColumnHeight = function(){
	//reset all values to begin with to ensure layout is changing on ipad orientation change
	$('.fdem-global-navigation li a').removeAttr("style");

	var maxColumnHeight = Math.max($('.fdem-global-navigation li a').eq(0).height(), $('.fdem-global-navigation li a').eq(1).height(), $('.fdem-global-navigation li a').eq(2).height());
	$('.fdem-global-navigation li a').css({'min-height':maxColumnHeight} )
};

//force main content column min-height to the same height as the navigation column	
projectlight.setContentColumnHeight = function(){
	
	//reset before adding further height
	$('.fdem-tertiary-navigation, .fdem-secondary-content, .fdem-main-content').removeAttr("style");

	var secondaryContentRecessedHeight = 0;

	if($('.fdem-secondary-content').hasClass("fdem-recessed-secondary-content")) {
		secondaryContentRecessedHeight = ($('.fdem-secondary-content').parent().width() / 100) * 36.6;
	}

	var maxColumnHeight = Math.max($('.fdem-secondary-content').height() - secondaryContentRecessedHeight, $('.fdem-tertiary-navigation').height(), $(".fdem-main-content").height());

	if($('.fdem-tertiary-navigation').length > 0){
		$('.fdem-tertiary-navigation, .fdem-secondary-content, .fdem-main-content').css({'min-height':maxColumnHeight+50} )
		//uneven height distribution on nav and sec columns
	}else{
		$('.fdem-tertiary-navigation, .fdem-secondary-content, .fdem-main-content').css({'min-height':maxColumnHeight} )
		$('.fdem-secondary-content').css({'min-height':maxColumnHeight +50} 	)
	}


	if($('.fdem-secondary-content').hasClass("fdem-recessed-secondary-content")){
		$('.fdem-secondary-content').css({'min-height':maxColumnHeight + secondaryContentRecessedHeight } 	)
	}
	
	
	$('.fdem-secondary-content').show();
};

projectlight.removeNavigationColumnHeight = function(){
	//had to remove style attribute, as setting height back to auto would not work
	$('.fdem-global-navigation li a').removeAttr("style");
};

projectlight.removeContentColumnHeight = function(){
	//had to remove style attribute, as setting height back to auto would not work
	$('.fdem-tertiary-navigation, .fdem-secondary-content, .fdem-main-content').removeAttr("style");
	$('.fdem-secondary-content, .fdem-main-content').show();
};

projectlight.setFooterColumnsHeight = function(){
	var highestglobalFooter = Math.max(projectlight.$globalFooterColumns.eq(0).height(), projectlight.$globalFooterColumns.eq(1).height(),projectlight.$globalFooterColumns.eq(2).height(),projectlight.$globalFooterColumns.eq(3).height())
	var highestLocalFooter = Math.max(projectlight.$localFooterColumns.eq(0).height(), projectlight.$localFooterColumns.eq(1).height(),projectlight.$localFooterColumns.eq(2).height(),projectlight.$localFooterColumns.eq(3).height())
	
	projectlight.$localFooterColumns.height(highestLocalFooter);
	projectlight.$globalFooterColumns.height(highestglobalFooter);
};

projectlight.removeFooterColumnsHeight = function(){
	projectlight.$localFooter.height("auto");
	projectlight.$localFooterColumns.height("auto");
	projectlight.$globalFooterColumns.height("auto");
};			




projectlight.initTables = function(){
	/* FULLY EXPANDED RESPONSIVE TABLE SOLUTION */
	//responsive table solution
	var $tableContainer = $(".fdem-responsive-table");
	
	//cycle through all responsive tables on page to instantiate open link
	$tableContainer.each(function (i) {
		var $table = $(this).find("table");
		var summary = "";
		
		//hide table
		$table.hide(); //might have to use positioning to prevent it being hidden from screen readers
		
		//suck out caption and summary to display above link
		var openTable = "<div class='fdem-open-responsive-table'><a href='#' class='fdem-open-responsive-table-link'>Click to open table " + $table.find("caption").text() + "</a>"+ summary + "</div>"

		//insert button to open table in page
		$(this).prepend(openTable);
		
		//create collapse button and hide until table is opened
		$(this).find('.fdem-open-responsive-table').append("<a href='#' class='fdem-collapse-table'>Collapse table</a>");
		
		$('.fdem-collapse-table').hide();
		
		//collapse table and restore open link to user
		$(this).find('.fdem-collapse-table').bind("click", function(e){
			var $tableContainer = $(e.target).parent().parent();
			$tableContainer.removeClass("fdem-expanded-table");
			$table.removeClass("fdem-full-width-table").hide();
			//show appropriate open link
			$(e.target).parent().find('.fdem-open-responsive-table-link').show();
			//hide collapse link 
			$(e.target).hide();
			e.preventDefault();
		})
		

		//open table on bind click event
		$(this).find(".fdem-open-responsive-table-link").bind("click", function(e){
			$(e.target).parent().parent().addClass("fdem-expanded-table");
			$table.addClass("fdem-full-width-table");
			$table.show();
			//show appropriate close link
			$(e.target).parent().find('.fdem-collapse-table').show();
			//hide open link 
			$(e.target).hide();
			e.preventDefault();	
		});
		
	})

	/* VERTICAL STACKING TABLE */
	var $verticalTable = $(".fdem-vertical-stacking-table");
	
	//cycle through every vertical table on the page and insert table headers into table cells for mobile layout 
	$verticalTable.each(function (i) {
		//for vertical stacking tables need to read the text value of each TH in turn and assign to the headers array
		var $tableHeaders = $(this).find('thead').find("th");
		
		var headerTextArray = [];
		//insert th value into every data set row in order
		//each loop to push into data array
		$tableHeaders.each(function (i) {
			headerTextArray.push($(this).text());
		});
		
		//for every row, insert into td append before text in td insert span to handle styling of header and data
		var $verticalTableRows = $(this).find("tr");
		
		$verticalTableRows.each(function (i) {
			//need to find all children of the table rows, (and not just table data cells)
			var $tableCells = $(this).children();
			$tableCells.each(function (i) {
				if(headerTextArray[i]) {
					$(this).prepend("<span class='fdem-table-heading'>"+headerTextArray[i]+"</span>")
				}
			})

		})
		
	})
	
}	

/** LOCAL NAVIGATION CONTROLS **/
//this controls both the dropdowns and graphical style of the desktop navigation and the sliding panels of the mobile navigation
projectlight.localNav=(function(){
	var $openMenu,$navigation,$navContainer,$topUL,$topListItems,$allListItems,$links,$secondLevelListitems,$allMenuLists,n,$allNavLinks,menuPosition=0,m;
	return{
		init:function(u){
			$navigation = $(".fdem-local-navigation");
			
			//only run if there is navigation available in the page 
			if($navigation.length > 0){
				//need to remove btn from IE7 and IE8 - feature detection for media queries
				if(Modernizr.mq('only all')){
					$navigation.prepend('<p class="fdem-closed fdem-menu-btn" id="menu-btn"><a href="#"><span>Menu</span> <span class="fdem-menu-btn-arrow"></span></a></p>')	
					$openMenu = $("#menu-btn a");

					//bind click event to button to open menu for mobile
					$openMenu.click(function(){
						var $linkClicked = $(this);

						//close main nav drawer or search panel if open
						$("body").removeClass("fdem-navigation-open");
						projectlight.$searchDrawer.removeClass("fdem-search-open");

						if($linkClicked.parent().hasClass("fdem-closed")){
							displayMenu("show")
						}else{
							displayMenu("hide")
						}
						return false
					});
				}
				//call function to instantiate children and title structure
				setupNavigation();
			}
		},
		hideMenu:function(){
			$openMenu = $("#menu-btn a");
			$navContainer = $(".fdem-local-navigation-container");
			$openMenu.parent().removeClass("fdem-open").addClass("fdem-closed");
			$navContainer.css({left:-9999});
		},
		resetLocalNavigation:function(){
			//remove all sub classes
			$navContainer = $(".fdem-local-navigation-container"),
			$allListItems = $navContainer.find("li");
			$allListItems.removeClass("fdem-sub");
		
			//reset sub classes onto correct items
			if(projectlight.mobileLayout){
				$allListItems.has('ul').addClass("fdem-sub");
			}else{
				$allListItems.not($allListItems.find("li")).has('ul').addClass("fdem-sub");
			}
		}
	};
	function setupNavigation(){
		
		$navContainer = $navigation.children(".fdem-local-navigation-container"),
		$topUL = $navContainer.children("ul");
		$topListItems = $topUL.children("li");
		$allListItems = $topUL.find("li");
		
		$secondLevelListitems = $topListItems.children("li");
		$allMenuLists = $topListItems.find("ul");
		$dropdownListItems = $topListItems.find("li");
		$allNavLinks = $allMenuLists.find("a");
		
		$currentPageListitem = $navigation.find(".fdem-current-page");
		currentSectionNo = 0;
		
		m=$topUL.height();
		
		//need to dynamically append sub class to elements that have children
		$allListItems.has('ul').addClass("fdem-sub")
		
		//this needs to be added to browsers with media queries only to prevent IE7 adding gap above items with children in desktop layout
		//for all the list items that have children append forward indicator arrow
		if(Modernizr.mq('only all')){
			$('.fdem-sub').children("a").css({"position":"relative"}).append("<span class='fdem-menu-indicator fdem-fwd-btn'></span>")
		}
		//dynamically mark top level list items
		$topListItems.addClass("fdem-top")
		

		//for each list item with a class of sub, clone the link and prepend it to the top of the nested UL beneath
		//this will act as the overview link in the top level and the UL title in the mobile navigation
		
		//for each UL walk up the DOM to find the title of the UL in the section above, prepend this link as the back button to the section before for
		//the mobile navigation
		$navigation.find(".fdem-sub").each(function(){
			var $childUl = $(this).children("ul");
				$childUl.prepend('<li class="fdem-title"><a href="'+ $(this).children("a").attr('href') +'">'+$(this).children("a").text()+'</a></li>');	
			if($(this).hasClass('fdem-top')){
				$childUl.prepend('<li class="fdem-back-link"><a href="#"><span class="fdem-back-btn fdem-menu-indicator"></span>Back to section home</a></li>');
			}else{
				
				$childUl.prepend('<li class="fdem-back-link"><a href="#"><span class="fdem-back-btn fdem-menu-indicator"></span>'+ $(this).parent().children(".fdem-title").children("a").html()  +'</a></li>');
			}	

		})
		
	
		//reset menu structure after title links have been appended to ensure they are always created for full mobile structure
		//desktop menu only needs to go one level deep
		$allListItems.removeClass("fdem-sub");
		if(projectlight.mobileLayout){
			$allListItems.has('ul').addClass("fdem-sub");
		}else{
			$allListItems.not($allListItems.find("li")).has('ul').addClass("fdem-sub");
		}
		
		//declare array of links after title link has been created
		$links = $topListItems.find("a");

		//set current class to first level navigation so mobile menu can always open at least
		//one level of menu. This style makes the UL visible
		$topUL.addClass("fdem-current");
		

	//hover classes not required for mobile and tablet layouts
	//hover event should only trigger from top level items not children of top level
	$topListItems.hover(
			function(){
			if(!projectlight.mobileLayout){ 
				$(this).addClass("fdem-hover")
			}
		},function(){
			if(!projectlight.mobileLayout){
				$(this).removeClass("fdem-hover")
			}
		});
	
		
		//Bound click event for all links inside the local navigation. 
		//handles moving forwards and backwards through pages or opening dropdown menu
		$links.click(function(e){
			var $linkClicked = $(this),
			$listItemClicked = $linkClicked.parent();
			
			if($listItemClicked.hasClass("fdem-title") && Modernizr.mq('only screen and (max-width: 767px)')){
				e.preventDefault();	
			}else{
				if($listItemClicked.hasClass("fdem-sub")){
					//slide mobile or tablet menu forward 
					if(projectlight.mobileLayout){
						slideMenu("forward");
						$listItemClicked.addClass("fdem-current")
					}else{
						if($listItemClicked.hasClass("fdem-top") && $linkClicked.hasClass("fdem-clicked")){
							//toggle open navigation if top level without sub level link clicked
							closeSubNavigation();
						}else{
							//display sub menu for the desktop view for the item clicked
							showSubNavigation($linkClicked, e)
						}
					}
				e.preventDefault();	
				}else{
					if($listItemClicked.hasClass("fdem-back-link")){
						slideMenu("back");
						$linkClicked.parent().parent().parent().addClass("fdem-previous");
						$linkClicked.parent().parent().addClass("fdem-previous");
						return false
					}
				}
			}
			
		});
		
		//ensure dropdown or sliding panels are set to the correct width if the page changes and also on first load
		$(window).resize(function(){
			setMenuWidth();
		});
		if(projectlight.mobileLayout){
			setMenuWidth();
		}
	}
	
	//sets the width of the sub menus, for either the desktop dropdown, 
	//or to ensure the mobile sliding panels stretch to fill the whole screen
	function setMenuWidth(){
		
		var widthOfMenu = 480;

		if(Modernizr.mq('only screen and (max-width: 767px)')){	
			widthOfMenu = $(window).width()

			$topUL.width(widthOfMenu);
			$allMenuLists.width(widthOfMenu).css("left",widthOfMenu);
			if($openMenu.parent().hasClass("fdem-open")){
				$navContainer.css("left",-(menuPosition*widthOfMenu))
			}
			//should be adding mobile state to dom elem
			$navContainer.addClass("fdem-mobile");
		}else{
			
			//this resets the mobile structure by removing all the unwanted classes 
			//so the show/hide will work for the desktop dropdown menu
			if($navContainer.hasClass("fdem-mobile")){
				$openMenu.parent().removeClass("fdem-open").addClass("fdem-closed");
				$navContainer.find(".fdem-current").removeClass("fdem-current");
				$navContainer.attr("style","").removeAttr("style");
				$topUL.attr("style","").removeAttr("style");
				$allMenuLists.attr("style","").removeAttr("style")
			}
		}
	}
	//shows the desktop dropdown menus by positioning them on or off screen
	function displayMenu(actionSent){
		if(actionSent == "show"){

			//Walk up through DOM to determine nested level
			var $currentUL = $currentPageListitem.parent();
			currentSectionNo = 0;
			if($currentPageListitem.length > 0){
				if($currentPageListitem.parent().length > 0){
					//do while this is UL
					while ($currentUL[0].tagName === "UL")
					{
						$currentUL.addClass("fdem-current")// this displays hidden nav sections
						if($currentUL.parent()[0].tagName === "LI" ){
							$currentUL.parent().addClass("fdem-current") //need to add current to full path, UL and LI 	
						}
						$currentUL = $currentUL.parent().parent();
						currentSectionNo ++;
					}
					//set current menu position depending on which nested level the active page is on		
					menuPosition = currentSectionNo-1;
					$navContainer.children("ul").removeClass("fdem-current")
				}
			}else{
				menuPosition = 0
			}

			//get current menu width
			if(Modernizr.mq('only screen and (min-width: 768px)')){
				widthOfMenu=480;
			}else{
				widthOfMenu=$(window).width();
			}

			//set left position depending which level to open menu at
			$navContainer.css({left:-(menuPosition*widthOfMenu)});
		
			$openMenu.parent().removeClass("fdem-closed").addClass("fdem-open");
		}else{
			if(actionSent == "hide"){
				$openMenu.parent().removeClass("fdem-open").addClass("fdem-closed");
				$navContainer.css({left:-9999});
				
				//need to force top container to go away. Ghost block seemed to be staying on screen even
				//though CSS should have removed it, this hack forces it to be hidden then removes the display
				//style to allow it to be controlled by the CSS again
				$navContainer.find(".fdem-current").removeClass("fdem-current").hide();
				$navContainer.find(':hidden').css("display", "")
				
				//reset menu back to opening position
				menuPosition = currentSectionNo-1;
			}
		}
	}
	//shows the sliding menus for the mobile navigation
	function slideMenu(directionToSlide){
		var widthOfMenu,
		currentLeftPos=$navContainer.css("left");
		currentLeftPos=parseInt(currentLeftPos.replace("px",""));
		
		if(Modernizr.mq('only screen and (min-width: 768px)')){
			widthOfMenu=480;
		}else{
			widthOfMenu=$(window).width()
		}			
		
		if(directionToSlide === "forward"){
			menuPosition++;
			$navContainer.stop().animate({left:currentLeftPos-widthOfMenu},300,function(){})
		}else{
			if(directionToSlide === "back"){
				menuPosition--;
				$navContainer.stop().animate({left:currentLeftPos+widthOfMenu},300,function(){
					$navContainer.find(".fdem-previous").removeClass("fdem-previous").removeClass("fdem-current");
				})
			}
		}
	}
	// controls multiple levels of dropdown navigation depending on hover and clicked classes being set
	// nb: we have altered from the original code by only allowing users to open one level of
	// dropdown menu in the desktop view
	function showSubNavigation(linkClicked, event){
		var $linkClicked = $(linkClicked),
		$listItemClicked = $linkClicked.parent(),
		$ListItemSiblings = $listItemClicked.siblings(),
		y;
		
		if($linkClicked.hasClass("fdem-clicked")){
			$listItemClicked.removeClass("fdem-hover");
			$linkClicked.removeClass("fdem-clicked");
			
			//list items beneath current with hover set
			y = $listItemClicked.find(".fdem-hover");
			$clickedChildren = x.find(".clicked");
			y.removeClass("fdem-hover");
			$clickedChildren.removeClass("fdem-clicked")
		}else{
			$listItemClicked.addClass("fdem-hover");
			$linkClicked.addClass("fdem-clicked");
			
			//for each of the list items siblings remove hover and clicked classes
			$ListItemSiblings.each(function(){
				var $sibling = $(this);
				if($sibling.children("a").hasClass("fdem-clicked")){
					y = $sibling.find(".fdem-hover");
					$clickedChildren = $sibling.find(".fdem-clicked");
					$sibling.removeClass("fdem-hover");
					y.removeClass("fdem-hover");
					$clickedChildren.removeClass("fdem-clicked")
				}
			})
		}
		event.preventDefault();
	}
	
	//close button resets all open classes and returns the navigation back to a full closed state		
	function closeSubNavigation(){
		var $hoveredListItems  =$topUL.find(".fdem-hover"),
		$linksClicked = $topUL.find(".fdem-clicked");
	
		$hoveredListItems.removeClass("fdem-hover");
		$linksClicked.removeClass("fdem-clicked");
		$secondLevelListitems.css("left",-9999)
	}

})(); //end of nav - self calling function


//carousel instantiation
projectlight.createCarousel = function(){
	var carousel = {};

	// set up initial carousel values and autoplay, hide other slides
	carousel.init = function(){
		this.carouselContainer = $(".fdem-carousel").first();
		this.slides = this.carouselContainer.find("ul.fdem-slides");
		this.currentSlide = 1;
		this.maxSlides = this.slides.children().length;
		this.animating = false;
		this.endPos = 0;
		
		// need to determine width of carousel, container and slide item depending on screen size
		this.carouselWidth = this.carouselContainer.width();

		// need to dynamically set width of slides Ul (length of all slides plus the cloned item) and left position (length off each side * currentSlide)
		if (this.maxSlides > 1) {
			this.slides.css({'width': (this.carouselWidth*(this.maxSlides+2))+this.carouselWidth+'px', 'left': '-' + (this.carouselWidth * this.currentSlide)+'px'});
		}	
		
	
		// calculate lookup position table
		this.lookupPos = [];

		for(var cc = 0; cc < this.maxSlides; cc++){
			this.lookupPos.push(-cc * parseInt(this.carouselContainer.innerWidth(), 10));
		}

		if (this.maxSlides > 1) {
			this.carouselContainer.removeClass('fdem-banner')
			//create next and back buttons for carousel
			this.createCarouselControls();

			//append pagination indicator
			this.createPaginationIndicator();
			
			// Clone first and last slides and append it to the slideshow to mimic infinite carousel functionality
			var clonedFirstSlide = this.slides.children('li:first-child').clone();
			this.slides.append(clonedFirstSlide);
			var clonedLastSlide = this.slides.children('li:nth-child('+this.maxSlides+')').clone();
			this.slides.prepend(clonedLastSlide);	
			
			this.slide = this.slides.find("li")

			// click event on carousel direction controls
			this.carouselControls.bind('click', this.activateDirectionButtons)
	
			//set width of each slide to ensure image is scaling to match fluid grid
			this.slides.children().css({width:this.carouselWidth})
			
			projectlight.resetCarousel();

			this.autoPlaying = true;
                        $('.fdem-play').addClass('fdem-pause').removeClass('fdem-play');
			this.startAutoPlay();
			
			
			
		}else{
			this.carouselContainer.addClass('fdem-banner')
		}
		
		this.carouselContainer.find("li").show();
		
		//instantiate caption and content text variables for handling truncation across all slides and cloned slides 
		//has to happen after cloning so all slides are properly controlled by the truncation during resize event
		projectlight.$slideCaption = $(".fdem-slide-caption-txt");
		projectlight.$carouselContent = $(".fdem-carousel-content p");

		projectlight.carouselContentItems = [];
		projectlight.slideCaptionItems = [];
		
		//store array of original strings to replace when at full size
		projectlight.$slideCaption.each(function(){
			projectlight.slideCaptionItems.push($(this).text())
		})

		projectlight.$carouselContent.each(function(){
			projectlight.carouselContentItems.push($(this).text())
		})

		//truncate homepage carousel content if page is thinner than tablet view but not on mobile view
		if(Modernizr.mq('only screen and (min-width: 768px) and (max-width: 1000px)')){	
			projectlight.$slideCaption.each(function(){
        if($.trim($(this).text()).length>51) {
					$(this).text($.trim($(this).text()).substring(0, 50).split(" ").slice(0, -1).join(" ") + "...")
				}
			})

			projectlight.$carouselContent.each(function(){
				if($.trim($(this).text()).length>36) {
					$(this).text($.trim($(this).text()).substring(0, 35).split(" ").slice(0, -1).join(" ") + "...")
				}
			})

		}
	}

	carousel.createPaginationIndicator = function(){
		carousel.slides.children().each(function(i){
			var slideNo = i+1
			$(this).find(".fdem-slide-caption").append("<span class='fdem-carousel-pagination'>"+ slideNo + " of " + carousel.maxSlides + "</span>")
		})
	}
	
	//append control buttons unobtrusively if there is more than one slide in carousel
	carousel.createCarouselControls = function(){
		
		var carouselControls = document.createElement('ul');
		carouselControls.className = 'fdem-unstyled-list clearfix fdem-carousel-controls';
		carouselControls.id = 'carousel-controls';
	
		var previouslistItem = document.createElement('li');
		previouslistItem.className = "fdem-previous-li";
		var previouslink = document.createElement('a');
		var previousArrowSpan = document.createElement('span');
		previousArrowSpan.className = "fdem-arrow-span";
		previouslink.className = "ir fdem-carousel-control-btn fdem-previous";
		var previouslinkText = document.createTextNode('previous slide');
		previouslink.setAttribute('href', '#');
		previouslink.appendChild(previousArrowSpan);
		previouslink.appendChild(previouslinkText);
		previouslistItem.appendChild(previouslink);
		carouselControls.appendChild(previouslistItem);
	
		var pauselistItem = document.createElement('li');
		pauselistItem.className = "fdem-pause-li";
		var pauselink = document.createElement('a');
		var pauseArrowSpan = document.createElement('span');
		pauseArrowSpan.className = "fdem-arrow-span";
		pauselink.className = "ir fdem-carousel-control-btn fdem-pause";
		var pauselinkText = document.createTextNode('pause slides');
		pauselink.setAttribute('href', '#');
		pauselink.appendChild(pauseArrowSpan);
		pauselink.appendChild(pauselinkText);
		pauselistItem.appendChild(pauselink);
		carouselControls.appendChild(pauselistItem);

		var nextlistItem = document.createElement('li');
		nextlistItem.className = "fdem-next-li";
		var nextlink = document.createElement('a');
		var nextArrowSpan = document.createElement('span');
		nextArrowSpan.className = "fdem-arrow-span";
		nextlink.className = "ir fdem-carousel-control-btn fdem-next";
		var nextlinkText = document.createTextNode('next slide');
		nextlink.setAttribute('href', '#');
		nextlink.appendChild(nextArrowSpan);
		nextlink.appendChild(nextlinkText);
		nextlistItem.appendChild(nextlink);
		carouselControls.appendChild(nextlistItem);

		this.carouselContainer.append(carouselControls);
		this.carouselControls = $('#carousel-controls a');
		this.prev = this.carouselControls.eq(0);
		this.next = this.carouselControls.eq(1);
		
	};

	//bound click event for carousel navigation controls
	carousel.activateDirectionButtons = function(e){
		carousel.stopAutoPlay();
		var buttonClicked;
		if(e.target.tagName === "SPAN"){
			buttonClicked = $(e.target.parentNode);
		}else{
			buttonClicked = $(e.target.parentNode).find("a");
		}

		// detect which button has been clicked from event delegation + call animate slides and pass direction val
		if(buttonClicked.hasClass('fdem-previous')){
			carousel.animateSlides('left');
                        $('.fdem-pause').addClass('fdem-play').removeClass('fdem-pause');
		}
		else if(buttonClicked.hasClass('fdem-next')){
			carousel.animateSlides('right');
                       $('.fdem-pause').addClass('fdem-play').removeClass('fdem-pause');
		}
		else if(buttonClicked.hasClass('fdem-pause')){
                        buttonClicked.removeClass('fdem-pause');
                        buttonClicked.addClass('fdem-play');
		}
		else if(buttonClicked.hasClass('fdem-play')){
                        buttonClicked.removeClass('fdem-play');
                        buttonClicked.addClass('fdem-pause');
                        carousel.autoPlaying = true;
                        carousel.startAutoPlay(1000);
		}
		e.preventDefault();
	};


	//autoplay function sets time out which is called repeatedly from the animation completed call back
	carousel.startAutoPlay = function(ticks){
            if(ticks === undefined) {
                ticks = 5000;
            }
		this.slides.queue(function() {
			carousel.timer = window.setTimeout(function() {
				carousel.animateSlides('right');
			}, ticks);
		})
		carousel.slides.dequeue();
	};

	// stops play for reset purposes
	carousel.stopAutoPlay = function(){
		this.autoPlaying = false;
		window.clearTimeout(this.timer);
		this.slides.queue("fx", []);
	};

	//controls the slide number of the current slide, distance to scroll and animation function with callback
	carousel.animateSlides = function(directionToScroll){
		// check to see if gallery is not currently being animated
		if(this.slides.filter(':animated').length === 0){
			var endPos = 0;
			// get current left position of slides and remove measurement notation
			var startPos = parseInt(this.slides.css('left'));


			if(directionToScroll !== undefined){
				if(directionToScroll === 'left'){
					if(carousel.currentSlide <= 1){
						carousel.currentSlide = carousel.maxSlides;
					}else{
						carousel.currentSlide = carousel.currentSlide - 1;
					}
					endPos = startPos + carousel.carouselContainer.innerWidth();
				}else{
					if(carousel.currentSlide >= carousel.maxSlides){
						carousel.currentSlide = 1;
						endPos = 0;
					}else{
						carousel.currentSlide = carousel.currentSlide + 1;
					}
					endPos = startPos - carousel.carouselContainer.innerWidth();
				}
			}

			this.slides.animate({left: endPos}, 2500, function(){
				//after carousel has finished moving 
				if(carousel.currentSlide === carousel.maxSlides){	
					carousel.slides.css({left:(-carousel.maxSlides * carousel.carouselContainer.innerWidth())+'px'});
				}else if(carousel.currentSlide === 1){
					//set the position of the slides to be back to the beginning
					carousel.slides.css({left: -carousel.carouselContainer.innerWidth()+'px'});

				}

				if(carousel.autoPlaying === true){
					carousel.startAutoPlay();
				}
			});
		}
	}
	
	
	
	// Reset carousel
	projectlight.resetCarousel = function(){

		carousel.stopAutoPlay();

		// need to determine width of carousel, container and slide item depending on screen size
		carousel.carouselWidth = carousel.carouselContainer.width();
		
		// reset width and position of slides when page is changed
		// need to dynamically set width of slides Ul (length of all slides plus the cloned item) and left position (length off each side * currentSlide)
		if (carousel.maxSlides > 1) {
			carousel.slides.css({'width': (carousel.carouselWidth*(carousel.maxSlides+2))+carousel.carouselWidth+'px', 'left': '-' + (carousel.carouselWidth * carousel.currentSlide)+'px'});
		}	

		// reset width and position of slides when page is changed
		carousel.slides.children().css({width:carousel.carouselWidth})
	
		// calculate lookup position table
		carousel.lookupPos = [];

		for(var cc = 0; cc < carousel.maxSlides; cc++){
			carousel.lookupPos.push(-cc * parseInt(carousel.carouselContainer.innerWidth(), 10));
		}

		//carousel.updateControlActivation();
		// carousel.startAutoPlay();

                // Project light doesn't resart the carousel aftr a resize event - see commented out code above.
                // Therefore we need to ensure we have a play rather than a pause button.
                $('.fdem-pause').addClass('fdem-play').removeClass('fdem-pause');

	}
	

	// dont seem to be used
	//projectlight.stopCarousel = function(){
	//	carousel.stopAutoPlay();
	//};

	//projectlight.startCarousel = function(){
	//	carousel.stopAutoPlay();
	//	carousel.startAutoPlay();
	//};
	
	
	carousel.init();
	
}

//only mark external links inside of the main content area as denoted by the fdem-skipTo ID
//removed deprecated call to browser.msie and associated logic 
projectlight.markExternalLinks = function(){
	$('#content a').not(".fdem-carousel a").filter(function(){
		return this.hostname && !this.hostname.match(/cam.ac.uk/gi);
	}).addClass("fdem-external").attr({
		"title": $(this).attr("title")+" (Link to an external website)"
	})
}

//DOM ready 
$(function() {

	//instantiate all the DOM elements which require javascript rendering
	projectlight.init();
	projectlight.initTables();
	projectlight.localNav.init();
	projectlight.markExternalLinks();
	
	//remove click event from local nav children selected items
	
	$(".fdem-vertical-breadcrumb-children .fdem-selected a").bind("click", function(e){
		e.preventDefault()
	})

	//instantiate calendar
	if(document.getElementById('calendar')){
		$("#calendar").Zebra_DatePicker({
		    always_visible: $('.calendar-container'),
			format: 'dd mm yyyy',
			direction: true,
			always_show_clear:false,
			disabled_dates: ['15 09 2012']
		});
	}
	
	//Change event for mobile navigation list selector
	if(document.getElementById('navigation-select')){
		$("#navigation-select").bind("change", function(e){
			window.location = $(this).val()
		})
	}
	
	
	$(".fdem-notifications-panel").each(function(){
		var $thisElem = $(this);
		$thisElem.append("<a href='#' class='ir fdem-close-panel'>Close panel</a>");
		$thisElem.find('.fdem-close-panel').bind("click", function(e){
			$(e.target).parent().remove();
			e.preventDefault();
		})
	})
	
	
	//bound click events for twitter bootstrap pills and tab elements
	$('#navTabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	})
	
	$('#navPills a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	})
	
	$('#searchTabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	})
	
	
	
	//instantiate height of buttons for mobile users, on carousel object
	if($(".fdem-carousel").length){
		projectlight.createCarousel();
    //wait for DOM ready to resize buttons for mobile (actually need to wait for page load) TPD
		if(Modernizr.mq('only screen and (max-width: 767px)')){
			$(window).load( function(){
          var height = $(".image-container").height();
			    $(".fdem-carousel-controls, .fdem-carousel-controls a.fdem-previous, .fdem-carousel-controls a.fdem-next").height(height);
			});
		}else{
			$(".fdem-carousel-controls, .fdem-carousel-controls a").attr("style", "");
		}
	}


	//resize event handles changing flag layout to determine if user mode is mobile or not 
	//If the mode has changed the re-rendering or reset functions will be called to change the page layout
	projectlight.$window.resize(function() {
		
		if($(".fdem-carousel").length){
			projectlight.resetCarousel();

			//truncate homepage carousel content if page is thinner
			if(Modernizr.mq('only screen and (min-width: 768px) and (max-width: 1000px)')){	
				
				//carousel height is remaining as if text isn't being truncated

				projectlight.$slideCaption.each(function(i){
						if(($.trim(projectlight.slideCaptionItems[i]).length>51)) {
							$(this).text($.trim(projectlight.slideCaptionItems[i]).substring(0, 50).split(" ").slice(0, -1).join(" ") + "...")
						}
					})
					
					projectlight.$carouselContent.each(function(i){
						if(($.trim(projectlight.slideCaptionItems[i]).length>36)) {
							$(this).text($.trim(projectlight.carouselContentItems[i]).substring(0, 35).split(" ").slice(0, -1).join(" ") + "...")
						}
					})
			}else{
				
				projectlight.$slideCaption.each(function(i){
					$(this).text(projectlight.slideCaptionItems[i]);
				})
			
				projectlight.$carouselContent.each(function(i){
					$(this).text(projectlight.carouselContentItems[i]);
				})
			}
			
		}
		
		//commented out debugging to help developers see page width during development
		//$("#pagewidth").html($(window).width());
		

		//check size of columns on resize event and remove incase of mobile layout
		if(Modernizr.mq('only all')){
			//if mobile layout is triggered in media queries
			if(Modernizr.mq('only screen and (max-width: 767px)')){
				//if layout moves from desktop to mobile layout
				if(!projectlight.mobileLayout){
					//set current state flag
					projectlight.mobileLayout  = true;
					//reset main nav to un-open state
					projectlight.$navigationDrawer.removeClass("fdem-navigation-open");
					projectlight.$globalNavOuter.removeClass("fdem-drawer-open");
					projectlight.$searchDrawer.removeClass("fdem-search-open");
					//deselect any previously clicked links
					projectlight.$globalNavLI.removeClass("fdem-selected");
				
					//reset nav menus
					projectlight.localNav.resetLocalNavigation();
					projectlight.localNav.hideMenu();
				}
			
				// if media queries are supported then remove columns on mobile layout
				projectlight.removeGlobalNavigationColumnHeight();
				projectlight.removeNavigationColumnHeight();
				projectlight.removeContentColumnHeight();
				projectlight.removeSectionListChildrenColumnHeight();
				projectlight.removeFooterColumnsHeight();
				
				//set height of carousel buttons
				$(".fdem-carousel-controls, .fdem-carousel-controls a.fdem-previous, .fdem-carousel-controls a.fdem-next").height($(".image-container").height());

				projectlight.mobileLayout  = true;
			}else{ //desktop layout code 
				//if page width moves from mobile layout to desktop
				if(projectlight.mobileLayout){
					//set current state flag
					projectlight.mobileLayout  = false;

					//reset nav menus
					//hide dropdowns if open
					projectlight.localNav.resetLocalNavigation();
					projectlight.localNav.hideMenu();
					//close global nav drawer
					$("body").removeClass("fdem-navigation-open");
				}
				projectlight.setGlobalNavigationColumnHeight();
				projectlight.setNavigationColumnHeight();
				projectlight.setContentColumnHeight();
				projectlight.setSectionListChildrenColumnHeight();
				projectlight.setFooterColumnsHeight();
				
				//remove fixed height on carousel buttons
				//set height of carousel buttons
				$(".fdem-carousel-controls, .fdem-carousel-controls a").attr("style", "");
				
				projectlight.mobileLayout  = false;
			}
		}
	})
	

	
})

})(jQuery);






;
/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
*/
(function(w){
	
	// This fix addresses an iOS bug, so return early if the UA claims it's something else.
	var ua = navigator.userAgent;
	if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
		return;
	}

    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
		x, y, z, aig;

    if( !meta ){ return; }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }
	
    function checkTilt( e ){
		aig = e.accelerationIncludingGravity;
		x = Math.abs( aig.x );
		y = Math.abs( aig.y );
		z = Math.abs( aig.z );
				
		// If portrait orientation and in one of the danger zones
        if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
			if( enabled ){
				disableZoom();
			}        	
        }
		else if( !enabled ){
			restoreZoom();
        }
    }
	
	w.addEventListener( "orientationchange", restoreZoom, false );
	w.addEventListener( "devicemotion", checkTilt, false );

})( this );
;
/*!
 * Modernizr v2.6.1
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.6.1',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body ? body : document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = "";
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      !body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   daneden.me/2011/12/putting-up-with-androids-bullshit/
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#modernizr:after{content:"',smile,'";visibility:hidden}'].join(''), function( node ) {
          bool = node.offsetHeight >= 1;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: sruFaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /*! HTML5 Shiv v3.6 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */
    ;(function(window, document) {
    /*jshint evil:true */
      /** Preset options */
      var options = window.html5 || {};

      /** Used to skip problem elements */
      var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

      /** Not all elements can be cloned in IE (this list can be shortend) **/
      var saveClones = /^<|^(?:a|b|button|code|div|fieldset|form|h1|h2|h3|h4|h5|h6|i|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul)$/i;

      /** Detect whether the browser supports default html5 styles */
      var supportsHtml5Styles;

      /** Name of the expando, to work with multiple documents or to re-shiv one document */
      var expando = '_html5shiv';

      /** The id for the the documents expando */
      var expanID = 0;

      /** Cached data for each document */
      var expandoData = {};

      /** Detect whether the browser supports unknown elements */
      var supportsUnknownElements;

      (function() {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
        } catch(e) {
          supportsHtml5Styles = true;
          supportsUnknownElements = true;
        }

      }());

      /*--------------------------------------------------------------------------*/

      /**
       * Creates a style sheet with the given CSS text and adds it to the document.
       * @private
       * @param {Document} ownerDocument The document.
       * @param {String} cssText The CSS text.
       * @returns {StyleSheet} The style element.
       */
      function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
      }

      /**
       * Returns the value of `html5.elements` as an array.
       * @private
       * @returns {Array} An array of shived element node names.
       */
      function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
      }

        /**
       * Returns the data associated to the given document
       * @private
       * @param {Document} ownerDocument The document.
       * @returns {Object} An object of data.
       */
      function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
      }

      /**
       * returns a shived element for the given nodeName and document
       * @memberOf html5
       * @param {String} nodeName name of the element
       * @param {Document} ownerDocument The context document.
       * @returns {Object} The shived element.
       */
      function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }

        // Avoid adding some elements to fragments in IE < 9 because
        // * Attributes like `name` or `type` cannot be set/changed once an element
        //   is inserted into a document/fragment
        // * Link elements with `src` attributes that are inaccessible, as with
        //   a 403 response, will cause the tab/window to crash
        // * Script elements appended to fragments will execute when their `src`
        //   or `text` property is set
        return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
      }

      /**
       * returns a shived DocumentFragment for the given document
       * @memberOf html5
       * @param {Document} ownerDocument The context document.
       * @returns {Object} The shived DocumentFragment.
       */
      function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
            i = 0,
            elems = getElements(),
            l = elems.length;
        for(;i<l;i++){
            clone.createElement(elems[i]);
        }
        return clone;
      }

      /**
       * Shivs the `createElement` and `createDocumentFragment` methods of the document.
       * @private
       * @param {Document|DocumentFragment} ownerDocument The document.
       * @param {Object} data of the document.
       */
      function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
          //abort shiv
          if (!html5.shivMethods) {
              return data.createElem(nodeName);
          }
          return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
          'var n=f.cloneNode(),c=n.createElement;' +
          'h.shivMethods&&(' +
            // unroll the `createElement` calls
            getElements().join().replace(/\w+/g, function(nodeName) {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
          ');return n}'
        )(html5, data.frag);
      }

      /*--------------------------------------------------------------------------*/

      /**
       * Shivs the given document.
       * @memberOf html5
       * @param {Document} ownerDocument The document to shiv.
       * @returns {Document} The shived document.
       */
      function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
          data.hasCSS = !!addStyleSheet(ownerDocument,
            // corrects block display not defined in IE6/7/8/9
            'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
            // adds styling not present in IE6/7/8/9
            'mark{background:#FF0;color:#000}'
          );
        }
        if (!supportsUnknownElements) {
          shivMethods(ownerDocument, data);
        }
        return ownerDocument;
      }

      /*--------------------------------------------------------------------------*/

      /**
       * The `html5` object is exposed so that more elements can be shived and
       * existing shiving can be detected on iframes.
       * @type Object
       * @example
       *
       * // options can be changed before the script is included
       * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
       */
      var html5 = {

        /**
         * An array or space separated string of node names of the elements to shiv.
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

        /**
         * A flag to indicate that the HTML5 style sheet should be inserted.
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': (options.shivCSS !== false),

        /**
         * Is equal to true if a browser supports creating unknown/HTML5 elements
         * @memberOf html5
         * @type boolean
         */
        'supportsUnknownElements': supportsUnknownElements,

        /**
         * A flag to indicate that the document's `createElement` and `createDocumentFragment`
         * methods should be overwritten.
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': (options.shivMethods !== false),

        /**
         * A string to describe the type of `html5` object ("default" or "default print").
         * @memberOf html5
         * @type String
         */
        'type': 'default',

        // shivs the document according to the specified `html5` object options
        'shivDocument': shivDocument,

        //creates a shived element
        createElement: createElement,

        //creates a shived documentFragment
        createDocumentFragment: createDocumentFragment
      };

      /*--------------------------------------------------------------------------*/

      // expose html5
      window.html5 = html5;

      // shiv the document
      shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);
;
(function ($) {

    var columns = 12;

    if ($('.fdem-tertiary-navigation').length > 0) {
        columns = columns - 3;
    }
    if ($('.fdem-main-content-sub-column').length > 0) {
        columns = columns - 3;
    }
    if ($('.fdem-secondary-content').length > 0) {
        columns = columns - 3;
    }

    var imageWidth = 6;

    if (columns == 12) {
        imageWidth = 3;
    } else if (columns >= 9) {
        imageWidth = 4;
    }

    var textWidth = 12 - imageWidth;

    Drupal.behaviors.cambridgeTheme = {
        attach: function (context, settings) {
            // Tweak the proportions of teaser image to teaser text. This should be moved to the templating layer instead.
            $('.fdem-horizontal-teaser-img', context).parent('.fdem-column6').removeClass('fdem-column6').addClass('fdem-column' + imageWidth);
            $('.fdem-horizontal-teaser-txt', context).parent('.fdem-column6').removeClass('fdem-column6').addClass('fdem-column' + textWidth);

            // Add classes to tables that are missing them and remove potentially style-breaking attributes. This should be moved to the templating layer instead.
            $('.fdem-content .field table:not(.fdem-table):not(.fdem-table-custom)', context).addClass('fdem-table fdem-table-bordered fdem-table-striped fdem-vertical-stacking-table').attr('border', 0).attr('cellpadding', 0).attr('cellspacing', 0).attr('style', null);
        }
    };

})(jQuery);
;
