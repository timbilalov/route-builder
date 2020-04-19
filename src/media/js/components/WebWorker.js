import worker from '/worker';
import { USE_JSON_FOR_WEBWORKER_DATA } from '../utils/constants';

const WORKER_MAX_TIMEOUT = 15000;
const workerInstance = worker();

class WebWorker {
	isStarted = false;

	start() {
		if (this.isStarted) {
			return;
		}
		this.isStarted = true;

		// console.log('start');
		this.worker = workerInstance;

		// this.worker.onmessage = event => {
		// 	console.log('bla1');
		// 	// const t1 = performance.now();
		// 	// console.log('calculate 3');
		// 	// if (this.timeout) {
		// 	// 	clearTimeout(this.timeout);
		// 	// }
		// 	// const t2 = performance.now();
		// 	// resolve(event.data);
		// 	// const t3 = performance.now();
		// 	// console.log('hggg', t2 - t1, t3 - t2, event.data);
		// };
	}

	stop() {
		if (!this.isStarted) {
			return;
		}
		this.isStarted = false;

		// console.log('stop');

		this.worker.terminate();
		delete this.worker;
	}

	async calculate(options) {
		const tt1 = performance.now();
		// console.log('calculate 1');
		this.start();
		const promise = new Promise(resolve => {
			// console.log('calculate 2');
			// console.time('onmessage')
			this.worker.onmessage = event => {
				// console.timeEnd('onmessage')
				const t1 = performance.now();
				// console.log('calculate 3');
				if (this.timeout) {
					clearTimeout(this.timeout);
				}
				const t2 = performance.now();
				const data = USE_JSON_FOR_WEBWORKER_DATA ? JSON.parse(event.data) : event.data;
				// resolve(event.data);
				resolve(data);
				// resolve([])
				const t3 = performance.now();
				// console.log('hggg', t2 - t1, t3 - t2, event.data);
				// console.log('hggg', t2 - t1, t3 - t2);
			};

			// console.log('calculate 4');
			this.worker.postMessage(options);
			// console.log('calculate 5');

			this.timeout = setTimeout(() => {
				// console.log('calculate 6');
				resolve();
			}, WORKER_MAX_TIMEOUT);
		});
		// console.log('calculate 7');
		const tt2= performance.now();
		const result = await promise;
		const tt3= performance.now();
		// console.log('calculate 8', tt2 - tt1, tt3 - tt2, result);
		// console.log('calculate 8', tt2 - tt1, tt3 - tt2);
		// this.stop();
		return result;
	}
}

export default new WebWorker();
