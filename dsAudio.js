/**
 * Audio player plugin
 * @author Dmitriy Sirenko dmitriy.sirenko@gmail.com
 */
(function($){
    if(!$.ds){
        $.ds = new Object();
    };

    var dsAudios = [];

    $.ds.audio = function(el, options){
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.$el.data("ds.audio", base);
        
		// main init function
        base.init = function(){
            base.options = $.extend({},$.ds.audio.defaultOptions, options);
            
			var audio = new Audio();
            audio.src = $(el).attr("src");
            audio.id = new Date().getTime();
            dsAudios.push(audio);
			var ignoreTimeUpdate = false;

            /**
             * Elements of control
             */

			playPauseBlock = $("<div></div>").addClass("ds_play_pause");
			audio.playButton = $("<div></div>").addClass("ds_play");
			audio.pauseButton = $("<div></div>").addClass("ds_pause").hide();
			var totalTimeBlock = $("<div></div>").addClass("ds_total_time");
			var currentTimeBlock = $("<div></div>").addClass("ds_current_time");
            var timeLineBlock = $("<div></div>").addClass("ds_timeline_block");
            var volumeBlock = $("<div></div>").addClass("ds_volume_block");
            var downloadButton = $("<a href='" + audio.src + "' download>&nbsp;</a>").addClass("ds_download");
            var loadProgressBar = $("<div></div>").addClass('ds_load_progress_bar');

            var timeLineSlider = $("<div></div>").addClass('ds_timeline_slider').slider({
				animate: "fast", 
				range: "min",
                min: 0,
                max: audio.duration,
                step: 1,
				slide: function (){
					audio.currentTime = $(this).slider("value");
					ignoreTimeUpdate = true;
				},
				stop: function(){
					audio.currentTime = $(this).slider("value");
					ignoreTimeUpdate = false;
				}
			});

            var volumeSlider = $("<div></div>").addClass('ds_volume_slider').slider({
                animate: "fast",
                range: "min",
                min: 0,
                max: 1,
                step: 0.01,
                value: base.options.volume,
                slide: function (){
                    audio.volume = $(this).slider("value");
                },
                stop: function(){
                    audio.volume = $(this).slider("value");
                }
            });

            audio.preload = base.options.preload;
            if (base.options.preload == 'none') {
                $(timeLineSlider).slider("disable");
            }
            

            /**
             * Event listeners
             */

            $(audio).on('error',  function() {
                if (audio.error.code == MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED){
                    var message = 'File not found!';
                } else {
                    var message = 'File playing error!';
                }
                console.log(audio.error);
                $(el).after("<div>" + message + "</div>").addClass("ds_error");
                $(el).remove();
            });

            $(audio).on('progress', function(){
                if(audio.buffered.length >= 1) {
                    var bufferedEnd = audio.buffered.end(audio.buffered.length - 1);

                    var duration = audio.duration;
                    if (duration > 0) {
                        var width = bufferedEnd / duration * 100;
                        $(loadProgressBar).width(width + "%");
                    }
                }
                //setTimeout(500);
            });

        	$(audio).on('loadedmetadata', function(){
				var totalTime = base.durationToTime(audio.duration);
				totalTimeBlock.html(totalTime);
				$(timeLineSlider).slider("option", "max", audio.duration);
                $(timeLineSlider).slider("enable");
                audio.volume = $(volumeSlider).slider("value");
			});

			$(audio).on('timeupdate', function(){
				var currentTime = base.durationToTime(audio.currentTime);
				currentTimeBlock.html(currentTime);
	            if(!ignoreTimeUpdate){
					$(timeLineSlider).slider("value", audio.currentTime);
				}
			});
			
			$(audio).on('ended', function(){
				audio.currentTime = 0;
				audio.pause();
                audio.pauseButton.hide();
                audio.playButton.show();
			});
			
			audio.playButton.on('click', function(){
				audio.play();
				audio.playButton.hide();
				audio.pauseButton.show();
                if (base.options.playAtOneTime === false) {
                    base.pauseOther(audio);
                }
			});
			
			audio.pauseButton.on('click', function(){
				audio.pause();
				audio.pauseButton.hide();
				audio.playButton.show();
			});

            // add elements to container
			$(el).append(playPauseBlock.append(audio.playButton).append(audio.pauseButton))
			.append(timeLineBlock.append(timeLineSlider.append(loadProgressBar)).append(totalTimeBlock).append(currentTimeBlock))
			.append(volumeBlock.append(volumeSlider))
            .append(downloadButton);
        };
        
		// seconds to '00:00:00' format
        base.durationToTime = function(seconds){
			var date = new Date(null);
			date.setSeconds(seconds);
			var time = date.toISOString().substr(11, 8);
			return time;	
        };

        base.pauseOther = function(audio){
            $.each(dsAudios, function(key, aud){
                if(audio.id != aud.id) {
                    aud.pause();
                    aud.playButton.show();
                    aud.pauseButton.hide();
                }
            });
        };

        base.init();
    };
    
	$.ds.audio.removeAll = function(){
        if (dsAudios.length > 0) {
            $.each(dsAudios, function (key, aud) {
                $(aud).off();
                aud.pause();
                aud = undefined;
            });
            dsAudios = [];
        }
    };
	
    $.ds.audio.defaultOptions = {
        'preload': 'none', // none, metadata, auto
        'playAtOneTime' : true,
        'volume': 0.3
    };
    
    $.fn.dsAudio = function(options){
        return this.each(function(){
            (new $.ds.audio(this, options));
        });
    };
	
})(jQuery);
