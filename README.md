##jQuery audio player plugin

###Integration

#####Add jquery library, jquery ui library scripts and ui styles.

```
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
```

#####Add plugin script and plugin styles

```
	<script src="dsAudio.js"></script>
	<link rel="stylesheet" href="custom.css">
```

#####Use plugin script code

```
	<script>
		$(document).ready(function(){	
			$('.player').dsAudio();
		});
	</script>
```

#####Finally add players blocks where you need

```
	<div class="player" src="audio1.mp3"></div>
	<br><br>
	<div class="player" src="audio2.mp3"></div>
```

### Resolve tablets draggable problem
Add script
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
```
