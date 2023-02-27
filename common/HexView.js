class HexView extends HTMLElement {
    constructor(ds) {
        super();
        this.lastSelected = [];

		this.execShadow();

        if(ds) {
            this.setDataSource(ds);
        }
    }

	static TEMPLATE_STYLE = `
.container {
	display: grid;
	grid-template-columns: 3rem 500px 200px;
	align-content: start;
}

.left {
	display: grid;
	grid-template-columns: repeat(16, 1fr);
	font-family: monospace;
}

.right {
	display: grid;
	grid-template-columns: repeat(16, 1fr);
	font-family: monospace;
}

.address {
	display: grid;
	grid-template-columns: 1fr;
	font-family: monospace;
}

.color-header {
	color: grey;
}
`;

	static TEMPLATE_HTML = `
<div class="container">
	<div></div>
	<div id="hexHeader" class="left color-header"></div>
	<div id="asciiHeader" class="right"></div>
</div>
<hr>
<div id="result" class="container" style="height: 600px; overflow-y: scroll">
	<div id="address" class="address color-header"></div>
	<div id="hex" class="left"></div>
	<div id="ascii" class="right"></div>
</div>
`;

    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return [/* array of attribute names to monitor for changes */];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties

	execShadow() {
		const shadowRoot = this.attachShadow({ mode: 'open' });
		const style = document.createElement('style');
		const body = document.createElement('div');
		style.textContent = HexView.TEMPLATE_STYLE;
		body.innerHTML = HexView.TEMPLATE_HTML;
		
		shadowRoot.appendChild(style);
		shadowRoot.appendChild(body);
		this.shadow = shadowRoot;

		this.$result = this.shadow.getElementById('result');
		this.$address = this.shadow.getElementById('address');
		this.$hex = this.shadow.getElementById('hex');
		this.$ascii = this.shadow.getElementById('ascii');
		this.$hexHeader = this.shadow.getElementById('hexHeader');
	}

    setDataSource(ds) {
        this.ds = ds;
        this.refreshChild();
    }

    refreshChild() {
		// -- clear
		this.$hex.innerHTML = '';
		this.$ascii.innerHTML = '';

        if(!this.ds || 0 === this.ds.byteLength) {
            return;
        }

		// -- address
		const addrLen = Math.floor(this.ds.byteLength / 16) + 1;
		this.$address.innerHTML = '';
		for(let i = 0; i < addrLen; i++) {
			const addrCode = (i * 16).toString(16).toUpperCase().padStart(4, '0');
			const span = document.createElement('span');
			span.textContent = addrCode;
			this.$address.appendChild(span);
		}

        for(let i = 0; i < this.ds.byteLength; i++) {
            const byte = this.ds.getUint8(i);

            // -- left
            const span1 = document.createElement('span');
            span1.textContent = byte.toString(16).toUpperCase().padStart(2, '0');
			this.$hex.appendChild(span1);

            // -- right
            const span2 = document.createElement('span');
            span2.textContent = String.fromCharCode(byte);
			this.$ascii.appendChild(span2);
        }

		// -- draw header
		this.$hexHeader.innerHTML = '';
		for(let i = 0; i < 16; i++) {
			const text = '0' + i.toString(16).toUpperCase();
			const span = document.createElement('span');
			span.textContent = text;
			this.$hexHeader.appendChild(span);
		}
    }

    select(from, to) {
        const COLOR = 'orangered'
        this.lastSelected.forEach(d => d.style.color = '');
        this.lastSelected = [];

        const saveThis = [];

        const divLeft = this.$hex;
        const divRight = this.$ascii;

        for(let i = from; i < to; i++) {
            const spanLeft = divLeft.childNodes[i];
            const spanRight = divRight.childNodes[i];

            // spanLeft.style.backgroundColor = COLOR;
            // spanRight.style.backgroundColor = COLOR;
            spanLeft.style.color = COLOR;
            spanRight.style.color = COLOR;

            saveThis.push(spanLeft, spanRight);
        }

        this.lastSelected = saveThis;

        return this.lastSelected;
    }

	scrollToLastSelected() {
		this.lastSelected[0].scrollIntoView();
	}
}

customElements.define('hex-view', HexView);
