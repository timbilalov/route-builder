const ITEMS_PREFIX = 'route-builder-';
const DEFAULT_ERROR_MESSAGE = 'Error with localStorage';

class LocalStorage {
	getItem(name, needToParseJSON = true) {
		const key = ITEMS_PREFIX + name;
		let value;

		try {
			value = localStorage.getItem(key);
			if (needToParseJSON) {
				value = JSON.parse(value);
			}
		} catch (error) {
			console.error(`${DEFAULT_ERROR_MESSAGE}:`, error);
		}

		return value;
	}

	setItem(name, value, needToStringify = true) {
		const key = ITEMS_PREFIX + name;
		const valueToSet = needToStringify ? JSON.stringify(value) : value;
		let isSuccess = false;

		try {
			localStorage.setItem(key, valueToSet);
			isSuccess = true;
		} catch (error) {
			console.error(`${DEFAULT_ERROR_MESSAGE}:`, error);
		}

		return isSuccess;
	}
}

export default new LocalStorage();
