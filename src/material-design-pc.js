/*
---------------------------------
Material Design (PC)
Versão ALPHA
Desenvolvido por Jefferson Dantas
Baseado em Google Material Design
---------------------------------

* Requer jQuery e legitRipple
*/

var width, scroll = 0, widthScroll;

$(document).ready(function(){
	$('.menu').after('<div class="menuFade" onclick="closeMenu()"><\/div>');
	$('.menu a, .menu button').click(function(){
		closeMenu();
	});
	$('.snackBar .function button, .snackBar .function a, .button, .topbar .text-button').ripple();
	$('.topbar button:not(.text-button), .topbar a:not(.text-button)').ripple({maxDiameter: "100%"});

	$('.topbar:not(.indented)').each(function(){
		$(this).parent().css('padding-top','64px');
	});

	// $('.scrShadow, .content').niceScroll();
	// $('.nicescroll-cursors').width($(this).width() - 4);

	$('.progressCircle').html('<svg class="progressCircle-circle" viewBox="22 22 44 44">\n<circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>\n</svg>');

	function scrShadow(element) {
		var removeclasses = $(element).removeClass('boxShadowInsetLeft boxShadowInsetRight boxShadowInsetLeftRight');

		if(width + 1 >= widthScroll) {
		} else if(scroll <= 0) {
			removeclasses.addClass('boxShadowInsetRight');
		} else if(scroll > 0 && scroll + width < widthScroll - 1) {
			removeclasses.addClass('boxShadowInsetLeftRight');
		} else if(scroll + width >= widthScroll - 1) {
			removeclasses.addClass('boxShadowInsetLeft');
		}
	}

	$('.scrShadow').each(function(){
		width = $(this).innerWidth();
		scroll = $(this).scrollLeft();
		widthScroll = $(this).prop('scrollWidth');
		scrShadow(this);
		$(this).scroll(function(){
			width = $(this).innerWidth();
			scroll = $(this).scrollLeft();
			widthScroll = $(this).prop('scrollWidth');
			scrShadow(this);
		});
	});
	// Se existe topbar no-indented add margin to parent!
});

function showTopbar(element) {
	$('.topbar' + element).removeClass('indented');
}
function hideTopbar(element) {
	$('.topbar' + element).addClass('indented');
}

// Mostrar e ocultar sombra de elementos
function showShadow(element) {
	$(element).removeClass('no-shadow');
}
function hideShadow(element) {
	$(element).addClass('no-shadow');
}

var snackbarTimer;
function snackBar(element) {
	clearTimeout(snackbarTimer);
	closeSnackBar();
	openSnackBar(element);
	snackBarTimer = setTimeout(function() {
		closeSnackBar(element)
	}, 8000);
}
function openSnackBar(element) {
	$(element).css('transform','translateY(0%)');
}
function closeSnackBar() {
	$('.snackbar').css('transform','translateY(calc(100% + 10px))');
}

// Abrir e fechar menu de opções
function openMenu(element) {
	$(element).css('transform','scale(1)');
	$(element + '+ .menuFade').show();
}
function closeMenu() {
	$('.menu').css('transform','scale(0)');
	$('.menuFade').hide();
}

$(document).contextmenu(function(e) {
	el = '.fm';
	docWidth = $(window).outerWidth(true);
	docHeight = $(window).outerHeight(true);
	elWidth = $(el).outerWidth(true);
	elHeight = $(el).outerHeight(true);
	xPos = e.pageX;
	yPos = e.pageY;
	
	if (xPos - $(document).scrollLeft() + elWidth > docWidth) {
		$(el).css('left', xPos - elWidth);
	} else {
		$(el).css('left', xPos);
	}
	
	if (yPos - $(document).scrollTop() + elHeight > docHeight) {
		$(el).css('top', yPos - elHeight);
	} else {
		$(el).css('top', yPos);
	}
	
	openMenu(el);
	return false;
});