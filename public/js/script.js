var socket = io();
var prevText = '';
setInterval(function(){
	var text = document.getElementById('text-box').value;
	console.log('Text is ' + text);
	if(text != prevText) {
		console.log('Mesage Emitted');
		socket.emit('message', text);
		prevText = text;
	}
}, 100);

socket.on('change', function(data) {
	console.log('Received Text is ' + data);
	document.getElementById('text-box').value = data;
})