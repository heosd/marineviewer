// http://127.0.0.1:8080/raw.all
const _FETCH_AB = [];

async function fetchFileFromURL(url, fnLog) {
	if(!fnLog) {
		fnLog = () => {}
	}

	fnLog(`trying to fetch from : ${url}`);
	const r = await fetch(url);

	fnLog(`fetched status : ${r.statusText}`);

	let resultArrayBuffer = undefined;
	if (url.match(/\.gz$/i)) {
		fnLog(`file gz type, load file`);
		const blob = await r.blob();
		fnLog(`file gz type, decompressing`);
		const ds = new DecompressionStream('gzip');
		const decompressedStream = blob.stream().pipeThrough(ds);
		const ab = await new Response(decompressedStream).arrayBuffer();
		resultArrayBuffer = ab;
	} else if(_FETCH_AB.some(regex => url.match(regex))) {
		const ab = await r.arrayBuffer();
		resultArrayBuffer = ab;
	}

	if (resultArrayBuffer) {
		fnLog(`trying to load from ArrayBuffer ${resultArrayBuffer.byteLength.toLocaleString('en')} bytes`);
		return resultArrayBuffer;
		// loadArrayBuffer(resultArrayBuffer);
	} else {
		fnLog(`invalid url or invalid file type, try another url`);
	}
}

(() => {
	function pushRegexToList(ext) {
		_FETCH_AB.push(new RegExp(`\\.${ext}$`, 'i'))
	}

	// /\.all$/i
	['all', 'mb58', 'sgy', 'lta', 'sta', 'enr', 'ens', 'enx'].forEach(pushRegexToList);

})();
