import worker from '/worker';
import { USE_JSON_FOR_WEBWORKER_DATA } from '../utils/constants';

const WORKER_MAX_TIMEOUT = 15000;

class WebWorker {
	isStarted = false;

	start() {
		if (this.isStarted) {
			return;
		}
		this.isStarted = true;

		this.worker = worker();
	}

	stop() {
		if (!this.isStarted) {
			return;
		}
		this.isStarted = false;

		this.worker.terminate();
		delete this.worker;
	}

	async calculate(options) {
		this.start();

		const promise = new Promise(resolve => {
			this.worker.onmessage = event => {
				if (this.timeout) {
					clearTimeout(this.timeout);
				}

				const data = USE_JSON_FOR_WEBWORKER_DATA ? JSON.parse(event.data) : event.data;
				resolve(data);
			};

			this.worker.postMessage(options);

			this.timeout = setTimeout(() => {
				resolve();
			}, WORKER_MAX_TIMEOUT);
		});

		const result = await promise;

		this.stop();
		return result;
	}
}

export default new WebWorker();
