import React from 'react';
import store from '../store';
import { addAddress } from '../store/actions';
import SvgIcon from './SvgIcon';

const REPEAT_LISTENING_DELAY = 500;

// NOTE:
// https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// https://github.com/googlearchive/webplatform-samples/tree/master/webspeechdemo

class VoiceInput extends React.Component {
	state = {
		isRecording: false,
		isError: false,
	};

	startListeningTimeout = false;
	recognizedString = '';

	constructor() {
		super();

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			console.warn(`Speech recognition isn't supported in your browser`);
			return;
		}

		const recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.lang = 'ru-RU';

		recognition.onstart = () => {
			this.setState({
				isRecording: true,
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
				isRecording: false,
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
		const { isRecording } = this.state;

		if (isRecording) {
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
		const { isRecording } = this.state;

		if (!isRecording) {
			return;
		}

		if (this.startListeningTimeout) {
			clearTimeout(this.startListeningTimeout);
		}

		this.recognition.stop();
	}

	render() {
		const { isRecording } = this.state;

		return (
			<div className="voice-input">
				<span
					className={`voice-input__record-icon ${isRecording ? '_animating' : ''}`}
					onClick={() => isRecording ? this.stopListening() : this.startListening()}
				>
					<SvgIcon name="voice-record" />
				</span>
			</div>
		);
	}
}

export default VoiceInput;
