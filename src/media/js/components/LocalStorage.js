const STORAGE_KEY = 'route-builder-state';
const DEFAULT_ERROR_MESSAGE = 'Error with localStorage';

class LocalStorage {
	getState() {
		let state = null;
		try {
			state = JSON.parse(localStorage.getItem(STORAGE_KEY));
		} catch (error) {
			console.error(`${DEFAULT_ERROR_MESSAGE}:`, error);
		}
		return state;
	}

	setState(state) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (error) {
			console.error(`${DEFAULT_ERROR_MESSAGE}:`, error);
		}
	}
}

export default new LocalStorage();
