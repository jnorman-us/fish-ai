export default class Normalizer {
	constructor(min, max, circular) {
		this.min = min;
		this.max = max;
		this.circular = circular;
	}

	normalize(value) {
		var normalized = (value - this.min) / (this.max - this.min);

		if(!this.circular) {
			normalized = Math.max(0, Math.min(1, normalized));
		}
		else {
			while(normalized < 0)
				normalized += 1;
			while(normalized > 1)
				normalized -= 1;
		}
		return normalized;
	}

	expand(value) {
		var expanded = value * (this.max - this.min) + this.min;

		if(!this.circular) {
			expanded = Math.max(this.min, Math.min(this.max, expanded));
		} else {

		}
		return expanded;
	}
}
