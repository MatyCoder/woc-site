
var WhatsNewCarousel = function( config ) {
	var This = function() {
		// Public Vars -----------------------------------------[MN]
		var currentIndex	= 0;
		var slides			= [];
		var slideTimer		= null;
		var transitioning	= false;
		// -----------------------------------------------------[MN]

		// Public Vars -----------------------------------------[MN]
		This._config = {
			pauseDuration		: 5000,
			transitionDuration	: 1000,
			rssURL				: false,
			selectors			: {
				carouselContainer	: '.whatsNewCarousel',
				nextButton			: '.whatsNewCarousel_nextButton',
				prevButton			: '.whatsNewCarousel_prevButton',
				pageBullet			: '.whatsNewCarousel_pageBullet'
			}
		};
		//------------------------------------------------------[MN]

		// Public Functions ------------------------------------[MN]
		This.init = function() {
			jq( This._config.selectors.carouselContainer ).html( slides.join( '' ) );
			currentIndex = 0;

			jq( '.whatsNewSlide' ).each( function() {
				jq( this ).click( function() { window.location = jq( this ).children( '.whatsNewLink' ).val(); } );
			} );
			jq( This._config.selectors.nextButton ).click( This.next );
			jq( This._config.selectors.prevButton ).click( This.previous );
			jq( This._config.selectors.pageBullet +'[rel='+ currentIndex +']' ).addClass( 'selected' );
			if( slides.length > 1 ) {
				This.start();
			}
		};

		This.followCurrentSlide = function() {
			jq( '.whatsNewSlide[rel='+ currentIndex +']' ).click();
			return false;
		}

		This.clearTimer = function() {
			clearTimeout( slideTimer );
		};

		This.loadNextSlide = function() {
			This.start();
		};

		This.next = function() {
			This.transition();
		};

		This.onRSSLoad = function( data, status ) {
			if( status != 'success' ) {
				return false;
			}

			jq( data ).find( 'item' ).each( function( i ) {
				var HTML = '<div class="whatsNewSlide" rel="'+ i +'" style="display: '+ ( i == 0 ? 'block' : 'none' ) +'; z-index: 0;">';
						HTML += '<input type="hidden" class="whatsNewLink" name="blogLink['+ i +']" value="'+ jq( this ).children( 'link' ).text() +'" />';
						HTML += '<h3>'+ jq( this ).children( 'title' ).text() +'</h3>';
						HTML += '<div class="whatsNewPreview">'+ jq( this ).children( '*[type=html]' ).text() +'</div>';
					HTML += '</div>';
				
				slides.push( HTML );
			} );

			This.init();
		};

		This.pause = function() {
			This.clearTimer();
		};

		This.previous = function() {
			This.transition( currentIndex == 0 ? slides.length - 1 : currentIndex - 1 );
		};

		This.setTimer = function() {
			slideTimer = setTimeout( This.transition, This._config.pauseDuration, false );
		};

		This.start = function() {
			This.setTimer();
		};

		This.transition = function () {
			if( transitioning ) {
				return false;
			}

			This.clearTimer();
			transitioning	= true;

			var newIndex		= arguments[0] != undefined && arguments[0] !== false ? arguments[0] : ( currentIndex == slides.length - 1 ? 0 : currentIndex + 1 );
			var currentSlide	= jq( This._config.selectors.carouselContainer ).find( '.whatsNewSlide[rel='+ currentIndex +']' );
			var newSlide		= jq( This._config.selectors.carouselContainer ).find( '.whatsNewSlide[rel='+ newIndex +']' );

			jq( This._config.selectors.pageBullet ).removeClass( 'selected' );
			jq( This._config.selectors.pageBullet +'[rel='+ newIndex +']' ).addClass( 'selected' );

			currentSlide.fadeOut( This._config.transitionDuration );
			newSlide.css( 'z-index', 1 ).siblings().css( 'z-index', 0 );
			newSlide.fadeIn( This._config.transitionDuration, function() {
				currentIndex	= newIndex;
				transitioning	= false;
				This.setTimer();
			} );
		};
		//------------------------------------------------------[MN]

		// Constructor -----------------------------------------[MN]
		( function() {
			This._config	= jq.extend( This._config, config );

			jq.get( This._config.rssURL, {}, This.onRSSLoad, 'xml' );
		} ) ();
		//------------------------------------------------------[MN]

		return This;
	};
	return This();
};