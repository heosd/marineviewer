class ColorPicker extends HTMLCanvasElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const me = this;
		this.createColorPicker(this.width, this.height);

		this.bindBtn = this.onClick.bind(this);
		this.addEventListener('click', this.bindBtn);
		this.bindDown = () => me.addEventListener('mousemove', me.bindBtn);
		this.bindUp = () => me.removeEventListener('mousemove', me.bindBtn);

		this.addEventListener('mousedown', this.bindDown);
		this.addEventListener('mouseup', this.bindUp);

	}

	disconnectedCallback() {
		this.removeEventListener('click', this.bindBtn);
		this.removeEventListener('mousedown', this.bindDown);
		this.removeEventListener('mouseup', this.bindUp);
	}

	static get observedAttributes() {
		return ['width', 'height'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (-1 !== ['width', 'height'].indexOf(name)) {
			this.createColorPicker(this.width, this.height);
		}
	}

	createColorPicker(w, h) {
		const ctx = this.getContext('2d', { willReadFrequently: true });

		const g1 = ctx.createLinearGradient(0, 0, w, 0);
		const c1 = ["#FF0000", "#FF00FF", "#0000FF", "#00FFFF", "#00FF00", "#FFFF00", "#FF0000"];
		c1.forEach((c, i) => g1.addColorStop(i / (c1.length - 1), c));

		const g2 = ctx.createLinearGradient(0, 0, 0, h);
		g2.addColorStop(0, "#FFFFFFFF");
		g2.addColorStop(0.5, "#FFFFFF00");
		g2.addColorStop(0.5, "#00000000");
		g2.addColorStop(1, "#000000FF");

		ctx.fillStyle = g1;
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = g2;
		ctx.fillRect(0, 0, w, h);
	}

	static toHex(value) {
		return value.toString(16).padStart(2, '0');
	}

	static DataToResult(data) {
		const rgb = { r: data[0], g: data[1], b: data[2] };
		const hex = `#${ColorPicker.toHex(rgb.r)}${ColorPicker.toHex(rgb.g)}${ColorPicker.toHex(rgb.b)}`;
		const rgbs = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

		return {
			rgb: rgb,
			hex: hex,
			rgbs: rgbs,
		}
	}

	// https://css-tricks.com/converting-color-spaces-in-javascript/
	static RGB2HSL(r, g, b) {
		const vr = r / 255;
		const vg = g / 255;
		const vb = b / 255;

		const cmax = Math.max(vr, vg, vb);
		const cmin = Math.min(vr, vg, vb);
		const d = cmax - cmin;

		let h, s, l;

		if (d == 0) {
			h = 0;
		} else if (cmax == r) {
			h = ((g - b) / d) % 6;
		} else if (cmax == g) {
			h = (b - r) / d + 2;
		} else {
			h = (r - g) / d + 4;
		}
		h = Math.round(h / 60);

		if (h < 0) {
			h += 360;
		}

		l = (cmax + cmin) / 2;

		s = d == 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return {h: h, s: s, l: l};
	}

	static HEX2RGB(hex) {
		if(6 !== hex.length && 7 !== hex.length) {
			return undefined;
		}

		const m = hex.match(/#?(.{2})(.{2})(.{2})/);
		if(!m) {
			return undefined;
		}

		const rgb = [m[1], m[2], m[3]].map(d => parseInt(d, 16));
		return {
			r: rgb[0],
			g: rgb[1],
			b: rgb[2]
		}
	}

	onClick(e) {
		const ctx = this.getContext('2d', { willReadFrequently: true });
		const data = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;

		const detail = ColorPicker.DataToResult(data);

		this.dispatchEvent(new CustomEvent('color', { detail: detail }));
	}
}

customElements.define('color-picker', ColorPicker, { extends: 'canvas' });

class GradientGenerator extends HTMLCanvasElement {
	constructor() {
		super();

		this.colors = ['#0000FF', '#FF0000'];
	}

	connectedCallback() {
		this.redraw();
	}

	static get observedAttributes() {
		return ['data-colors'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if ('data-colors' === name) {
			let str = newValue;
			str = str.replace(/'/g, '"');
			this.colors = JSON.parse(str);
			this.redraw();
		}
	}

	setColors(list) {
		this.setAttribute('data-colors', JSON.stringify(list));
	}

	redraw() {
		const ctx = this.getContext('2d', { willReadFrequently: true });

		const w = this.width;
		const h = this.height;
		const g1 = ctx.createLinearGradient(0, 0, w, 0);
		const clen = this.colors.length;
		this.colors.forEach((c, i) => g1.addColorStop(i / (clen - 1), c));

		ctx.fillStyle = g1;
		ctx.fillRect(0, 0, w, h);

		// -- grab all gradient values
		const gradientColor = ctx.getImageData(0, 0, w, 1);
		this.gradientColorData = gradientColor;
	}

	drawGradient(numbers = 5) {
		const ctx = this.getContext('2d', { willReadFrequently: true });
		const w = this.width;
		const h = this.height;

		const scaleLinear = function (domain, range) {
			return (v) => {
				return range[0] + (range[1] - range[0]) * ((v - domain[0]) / (domain[1] - domain[0]));
			}
		};

		const listX = [];
		const scaleX = scaleLinear([0, numbers - 1], [0, w - 1]);
		const scaleXDraw = scaleLinear([0, numbers], [0, w - 1]);
		for (let i = 0; i < numbers; i++) {
			listX.push(Math.floor(scaleX(i)));
		}

		let xw = w;
		if (2 <= listX.length) {
			xw = listX[1] - listX[0];
		}

		const result = [];
		for (let i = 0; i < listX.length; i++) {
			const xColor = listX[i];
			const x = Math.floor(scaleXDraw(i));

			const data = this.getGradientColorAt(xColor);
			const r = ColorPicker.DataToResult(data);
			result.push(r);
			ctx.fillStyle = r.hex;
			ctx.fillRect(x, 0, xw + 10, h); // give margin to xw, or you can just use whole width
		}

		return result;
	}

	getGradientColorAt(x = 0) {
		const idx = x * 4;
		const r = this.gradientColorData.data.slice(idx, idx + 4);
		return r;
	}
}

customElements.define('gradient-generator', GradientGenerator, { extends: 'canvas' });

/*
color picker
document.getElementById('cp').addEventListener('color', (c) => {
	console.log(c.detail);
});

first and last color can mismatch with original input, its b/c of linear gradient feature

gradient
gg.setColors(['#FF29AA', '#009933']);
console.log(gg.drawGradient(9));
*/