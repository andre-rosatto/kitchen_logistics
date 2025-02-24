export class Converter {
	static strToFloat(value: string, minValue: number = 1): number {
		let formattedValue = value.trim();
		formattedValue = formattedValue.replace(/[\,]+/g, '.');
		formattedValue = formattedValue.replace(/[^(0-9\.)]+/g, '');
		if (formattedValue.length === 0) {
			formattedValue = minValue.toString();
		}
		let result = parseFloat(formattedValue);
		return result;
	}

	static strToInt(value: string, minValue: number = 1): number {
		return Math.floor(Converter.strToFloat(value, minValue));
	}
}