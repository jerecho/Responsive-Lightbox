/*!
 * jquery.lightbox.js
 * https://github.com/duncanmcdougall/Responsive-Lightbox
 * Copyright 2013 Duncan McDougall and other contributors; Licensed MIT
 */
(function ($) {

	'use strict';

	$.fn.lightbox = function (options) {
	    var plugin = {

	        items: [],
	        lightbox: null,
	        image: null,
			// margin of the image to the window
	        margin: 50,
	        current: null,
	        locked: false,
			
			init: function (items) {
	            plugin.items = items;

	            if (!plugin.lightbox) {
	                $('body').append('\
					  <div id="lightbox" style="display:none;">\
					  <a href="#" class="close-lightbox">Close</a>\
					  <div class="lightbox-nav">\
						 <a href="#" class="lightbox-previous">previous</a>\
						 <a href="#" class="lightbox-next">next</a>\
					  </div>\
					  </div>\
					  ');

	                plugin.lightbox = $("#lightbox");
	            }

	            if (plugin.items.length > 1) {
	                $('.lightbox-next', plugin.lightbox).show();
	                $('.lightbox-previous', plugin.lightbox).show();
	            } else {
	                $('.lightbox-next', plugin.lightbox).hide();
	                $('.lightbox-previous', plugin.lightbox).hide();
	            }

	            plugin.bindEvents();

	        },

	        loadImage: function () {
	            $("body").addClass("blurred");
	            $("img", plugin.lightbox).remove();
	            plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

	            var img = $('<img src="' + $(plugin.current).attr('href') + '" draggable="false">');

	            $(img).load(function () {
	                $('.lightbox-loading').remove();
	                plugin.lightbox.append(img);
	                plugin.image = $("img", plugin.lightbox);
	                plugin.image.hide();
	                plugin.resizeImage();

	            });
	        },

	        resizeImage: function () {
	            var resizeRatio, wHeight, wWidth, iHeight, iWidth;
	            wHeight = $(window).height() - plugin.margin;
	            wWidth = $(window).outerWidth(true) - plugin.margin;
	            plugin.image.width('');
	            plugin.image.height('');
	            iHeight = plugin.image.height();
	            iWidth = plugin.image.width();
	            if (iWidth > wWidth) {
	                resizeRatio = wWidth / iWidth;
	                iWidth = wWidth;
	                iHeight = Math.round(iHeight * resizeRatio);
	            }
	            if (iHeight > wHeight) {
	                resizeRatio = wHeight / iHeight;
	                iHeight = wHeight;
	                iWidth = Math.round(iWidth * resizeRatio);
	            }

	            plugin.image.width(iWidth).height(iHeight);
	            plugin.image.css({
	                'top': ($(window).height() - plugin.image.outerHeight()) / 2 + 'px',
	                'left': ($(window).width() - plugin.image.outerWidth()) / 2 + 'px'
	            });
	            plugin.image.show();
	            plugin.locked = false;
	        },

	        getCurrentIndex: function () {
	            return $.inArray(plugin.current, plugin.items);
	        },

	        next: function () {
	            if (plugin.locked) {
	                return false;
	            }
	            plugin.locked = true;
	            if (plugin.getCurrentIndex() >= plugin.items.length - 1) {
	                plugin.items[0].click();
	            } else {
	                plugin.items[plugin.getCurrentIndex() + 1].click();
	            }
	        },

	        previous: function () {
	            if (plugin.locked) {
	                return false;
	            }
	            plugin.locked = true;
	            if (plugin.getCurrentIndex() <= 0) {
	                plugin.items[plugin.items.length - 1].click();
	            } else {
	                plugin.items[plugin.getCurrentIndex() - 1].click();
	            }
	        },

	        bindEvents: function () {
	            $(plugin.items).click(function (e) {
	                var self = $(this)[0];
	                e.preventDefault();
	                plugin.current = self;
	                plugin.loadImage();

	                // Bind Keyboard Shortcuts
	                $(document).on('keydown', function (e) {
	                    // Close lightbox with ESC
	                    if (e.keyCode === 27) {
	                        plugin.close();
	                    }
	                    // Go to next image pressing the right key
	                    if (e.keyCode === 39) {
	                        plugin.next();
	                    }

	                    // Go to previous image pressing the left key
	                    if (e.keyCode === 37) {
	                        plugin.previous();
	                    }
	                });
	            });

	            // Add click state on overlay background only
	            plugin.lightbox.on('click', function (e) {
	                if (this === e.target) {
	                    plugin.close();
	                }
	            });

	            // Previous click
	            $(plugin.lightbox).on('click', '.lightbox-previous', function () {
	                plugin.previous();
	                return false;
	            });

	            // Next click
	            $(plugin.lightbox).on('click', '.lightbox-next', function () {
	                plugin.next();
	                return false;
	            });

	            // Close click
	            $(plugin.lightbox).on('click', '.close-lightbox', function () {
	                plugin.close();
	                return false;
	            });

	            $(window).resize(function () {
	                if (!plugin.image) {
	                    return;
	                }
	                plugin.resizeImage();
	            });
	        },

	        close: function () {
	            $(document).off('keydown'); // Unbind all key events each time the lightbox is closed
	            $('#lightbox').fadeOut('fast', function () {
	                //$(this).remove();
	            });
	            $('body').removeClass('blurred');
	        }
		};
			
		$.extend(plugin, options);

		plugin.init(this);
	};

})(jQuery);