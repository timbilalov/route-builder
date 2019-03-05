const dom = require('../utils/DOM');
const env = require('../utils/ENV');

// NOTE:
// https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// https://github.com/googlearchive/webplatform-samples/tree/master/webspeechdemo
function VoiceInput() {
	this.$inputs = dom.$body.find('.inputs input');

	var final_transcript = '';
	var recognizing = false;
	var ignore_onend;
	var recognition;
	var self = this;
	var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	// var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

	if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
		console.warn(`Speech recognition isn't supported in your browser`);
		env.isMobile && alert(`Speech recognition isn't supported in your browser`);
		return;
	} else {
		recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'ru-RU';

		recognition.onstart = function() {
			recognizing = true;
			console.log('recognition onstart');
		};

		recognition.onerror = function(event) {
			console.log('recognition onerror: ' + event.error);
			env.isMobile && alert('recognition onerror: ' + event.error);
			ignore_onend = true;
		};

		recognition.onend = function() {
			recognizing = false;
			if (ignore_onend) {
				return;
			}
			console.log('recognition onend');
		};

		recognition.onresult = function(event) {
			var interim_transcript = '';
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				final_transcript = '';
				if (event.results[i].isFinal) {
					final_transcript += event.results[i][0].transcript;
					final_transcript = capitalize(final_transcript);
					self.$inputs
						.filter((index, elem) => !elem.value)
						.first()
						.val(linebreak(final_transcript))
						.trigger('change');
				} else {
					interim_transcript += event.results[i][0].transcript;
				}
			}
			console.log(linebreak(interim_transcript));
		};
	}

	var two_line = /\n\n/g;
	var one_line = /\n/g;
	function linebreak(s) {
		return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	}

	var first_char = /\S/;
	function capitalize(s) {
		return s.replace(first_char, function(m) {
			return m.toUpperCase();
		});
	}

	function startListening() {
		if (recognizing) {
			recognition.stop();
			return;
		}
		console.log('startListening');
		final_transcript = '';
		recognition.start();
		ignore_onend = false;
	}

	function stopListening() {
		if (!recognizing) {
			return;
		}
		console.log('stopListening');
		recognition.stop();
	}

	dom.$body.on('click', '[data-start-voice-listening]', startListening);
	dom.$body.on('click', '[data-stop-voice-listening]', stopListening);
}

VoiceInput.prototype = {};

const instance = new VoiceInput();
module.exports = instance;
