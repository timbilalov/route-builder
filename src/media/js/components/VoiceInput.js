import React from 'react';
import store from '../store';
import { addAddress } from '../store/actions';

const REPEAT_LISTENING_DELAY = 500;

// NOTE:
// https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// https://github.com/googlearchive/webplatform-samples/tree/master/webspeechdemo

class VoiceInput extends React.Component {
	state = {
		isRecognizing: false,
		isError: false,
	};

	startListeningTimeout = false;
	recognizedString = '';

	constructor() {
		super();

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			console.warn(`Speech recognition isn't supported in your browser`);
			// env.isMobile && alert(`Speech recognition isn't supported in your browser`);
			return;
		}

		const recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.lang = 'ru-RU';

		recognition.onstart = () => {
			this.setState({
				isRecognizing: true,
			});
		};

		recognition.onerror = event => {
			this.setState({
				isError: true,
			});
			console.warn('recognition onerror: ' + event.error);
		};

		recognition.onend = () => {
			this.setState({
				isRecognizing: false,
			});

			this.onResult(this.recognizedString);
			this.recognizedString = '';
		};

		recognition.onresult = event => {
			this.recognizedString = Array.from(event.results).slice(event.resultIndex).map(elem => elem[0] ? elem[0].transcript : '').join(' ');
		};

		this.recognition = recognition;
	}

	onResult(result = '') {
		if (!result) {
			return;
		}

		store.dispatch(addAddress(result));
		this.startListening(REPEAT_LISTENING_DELAY);
	}

	startListening(delay = 0) {
		const { isRecognizing } = this.state;

		if (isRecognizing) {
			return;
		}

		if (this.startListeningTimeout) {
			clearTimeout(this.startListeningTimeout);
		}

		this.startListeningTimeout = setTimeout(() => {
			this.recognition.start();
		}, delay);
	}

	stopListening() {
		const { isRecognizing } = this.state;

		if (!isRecognizing) {
			return;
		}

		if (this.startListeningTimeout) {
			clearTimeout(this.startListeningTimeout);
		}

		this.recognition.stop();
	}

	render() {
		const { isRecognizing } = this.state;

		return (
			<div>
				{isRecognizing ? 'VoiceInput here' : ''}
				<div>
					<button onClick={() => this.startListening()}>start</button>
					<button onClick={() => this.stopListening()}>stop</button>
				</div>
			</div>
		);
	}
}

export default VoiceInput;
