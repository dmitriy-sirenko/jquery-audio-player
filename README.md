##jQuery audio player plugin

###Integration

#####Include jquery library, jquery ui library and ui styles.

```
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
```

#####Include plugin script and plugin styles

```
	<script src="dsAudio.js"></script>
	<link rel="stylesheet" href="custom.css">
```

#####Next step use plugin script code

```
	<script>
		$(document).ready(function(){	
			$('.player').dsAudio();
		});
	</script>
```

#####And finally add player block on your page

```
	<div class="player" src="audio1.mp3"></div>
	<br><br>
	<div class="player" src="audio2.mp3"></div>
```
