import lz from 'lz-string';

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

	export(namesArray) {
		const values = {};

		for (const name of namesArray) {
			const savedValue = this.getItem(name);

			if (!savedValue) {
				continue;
			}

			values[name] = savedValue;
		}

		let encoded = JSON.stringify(values);
		encoded = lz.compressToEncodedURIComponent(encoded);

		return encoded;
	}

	import(encodedString) {
		let decoded;
		let hasError = false;

		try {
			decoded = lz.decompressFromEncodedURIComponent(encodedString);
			decoded = JSON.parse(decoded);
		} catch (error) {
			hasError = true;
		}

		if (hasError || !decoded) {
			console.warn(`Wrong string to import from`);
			return;
		}

		for (const name in decoded) {
			const value = decoded[name];
			this.setItem(name, value);
		}

		return decoded;
	}
}

export default new LocalStorage();
