(function($){
    if(!$.ds){
        $.ds = new Object();
    };
    
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
			var ignoreTimeUpdate = false;

			var playPauseBlock = $("<div></div>").addClass("ds_play_pause");
			var playButton = $("<div>Play</div>").addClass("ds_play");
			var pauseButton = $("<div>Pause</div>").addClass("ds_pause").hide();
			var totalTimeBlock = $("<div></div>").addClass("ds_total_time");
			var currentTimeBlock = $("<div></div>").addClass("ds_current_time");
			var slider = $("<div></div>").addClass('ds_slider').slider({
				animate: "fast", 
				range: "min",
				slide: function (){
					audio.currentTime = $(this).slider("value");
					ignoreTimeUpdate = true;
				},
				stop: function(){
					audio.currentTime = $(this).slider("value");
					ignoreTimeUpdate = false;
				}
			});

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

        	$(audio).on('loadedmetadata', function(){
				var totalTime = base.durationToTime(audio.duration);
				totalTimeBlock.html(totalTime);
				$(slider).slider("option", "max", audio.duration);
			});
			
			$(audio).on('timeupdate', function(){
				var currentTime = base.durationToTime(audio.currentTime);
				currentTimeBlock.html(currentTime);
	            if(!ignoreTimeUpdate){
					$(slider).slider("value", audio.currentTime);
				}
			});
			
			$(audio).on('ended', function(){
				audio.currentTime = 0;
				audio.pause();
			});
			
			playButton.on('click', function(){
				audio.play();
				playButton.hide();
				pauseButton.show();
			});
			
			pauseButton.on('click', function(){
				audio.pause();
				pauseButton.hide();
				playButton.show();
			});
			
			$(el).append(playPauseBlock.append(playButton).append(pauseButton));
			$(el).append(slider);
			$(el).append(totalTimeBlock);
			$(el).append(currentTimeBlock);
        };
        
		// seconds to '00:00:00' format
        base.durationToTime = function(seconds){
			var date = new Date(null);
			date.setSeconds(seconds);
			var time = date.toISOString().substr(11, 8);
			return time;	
        };
        
        base.init();
    };
    
    $.ds.audio.defaultOptions = {
    };
    
    $.fn.dsAudio = function(options){
        return this.each(function(){
            (new $.ds.audio(this, options));
        });
    };
	
})(jQuery);	
