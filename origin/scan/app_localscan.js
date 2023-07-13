class SelectMetaFiles extends HTMLSelectElement {
    constructor(ds) {
        super();
        if (ds) {
            this.setDataSource(ds);
        }

        this.addEventListener('change', () => {
            app.parseMetaCSV();
            //const sel = [...this.childNodes].filter(d => d.selected);
        });
    }

    setDataSource(ds) {
        this.ds = ds;
        this.refreshChild();
    }

    getDataSource() {
        return this.ds;
    }

    refreshChild() {
        this.innerHTML = ''; // -- clear
        for (const [k, v] of Object.entries(this.ds)) {
            // -- file handle
            // relativePath, name = 'marine_meta.csv'
            const opt = document.createElement('option');
            let path = v.relativePath.replace(/\/marine_meta.csv$/, '').replace(/^\./, '');
            if ('' === path) {
                path = '/';
            }

            opt.textContent = path;
            opt.ds = v;
            this.appendChild(opt);
        }
    }

    // -- returns option element, it has dataSource as fileHandle
    // [option, option,...];
    getSelected() {
        const sel = [...this.childNodes].filter(d => d.selected);
        return sel;
    }
}
customElements.define('select-meta-files', SelectMetaFiles, { extends: 'select' });

class MetaDetailItem extends HTMLElement {
    static STYLE = `
    .detail-item {
        cursor: pointer;
        display: grid;
        grid-template-columns: 1fr 3fr 1fr 1fr 2fr 1fr;
        padding: 8px;
        border-top: 1px solid #E5E6E7;
        border-bottom: 1px solid #E5E6E7;

        font-family: "Lucida console";
    }

    .detail-item:hover {
        background-color: #E7E9EB;
    }

    #group_g1 {
        text-overflow: ellipsis;
        overflow-x: hidden;
    }

    #lat {
        text-align: right;
        padding-right: 1rem;
    }

    #lng {
        text-align: right;
        padding-right: 1rem;
    }

    #ts_utc {
        text-align: center;
    }

    #bytes {
        text-align: right;
    }
`;
    static TEMPLATE_HTML = `
<div class="detail-item">
    <div id="type_g2"></div>
    <div id="group_g1"></div>
    <div id="lat"></div>
    <div id="lng"></div>
    <div id="ts_utc"></div>
    <div id="bytes"></div>
</div>
    `;
    constructor(ds) {
        super();
        this.execShadow();
        if (ds) {
            this.setDataSource(ds);
        }

    }

    setDataSource(ds) {
        this.ds = ds;
        this.refreshChild();
    }

    execShadow() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        const body = document.createElement('div');
        style.textContent = MetaDetailItem.STYLE;
        body.innerHTML = MetaDetailItem.TEMPLATE_HTML;

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(body);
        this.shadow = shadowRoot;

        this.listElements = ['type_g2', 'group_g1', 'lat', 'lng', 'ts_utc', 'bytes'];

        this.getElementsList(this.listElements);
    }

    refreshChild() {
        const ds = structuredClone(this.ds);

        ds.lat = MetaDetailItem.FormatLocation(ds.lat);
        ds.lng = MetaDetailItem.FormatLocation(ds.lng);
        ds.bytes = MetaDetailItem.FormatBytes(ds.bytes);
        ds.ts_utc = ds.ts_utc.toLocaleString('af', { timeZone: 'UTC' }).substring(0, 22);

        this.listElements.forEach(k => this.shadow.getElementById(k).textContent = ds[k])
    }

    static FormatLocation(d) {
        const n = Number(d);
        if (isNaN(n)) {
            return '-';
        }

        return n.toFixed(6);
    }

    static FormatBytes(b) {
        if (b === 0) {
            return "0.00 B";
        }

        let e = Math.floor(Math.log(b) / Math.log(1024));
        return (b / Math.pow(1024, e)).toFixed(2) +
            ' ' + ' KMGTP'.charAt(e) + 'B';
    }

    getElementsList(list) {
        for (let i = 0; i < list.length; i++) {
            const id = list[i];
            const e = this.shadow.getElementById(id);
            if (e) {
                this['$' + id] = e;
            }
        }
    }

}
customElements.define('meta-detail-item', MetaDetailItem);

const app = (() => {
    let rootHandler = undefined;
    const META_CSV = 'marine_meta.csv';
    let metaCSVs = []; // fileHandle
    let dataSource = []; // json

    // -- map, plot
    let map = undefined; // map by leaflet
    let layerMarker, layerHighlight;
    let mapIcon = {};
    const colorPlot = d3.scaleOrdinal(['CTD9', 'ALL', 'PD0', 'SEGY'], d3.schemeCategory10);

    // child window, file clicking
    let lastChild = undefined;
    let clickedFiles = [];

    function checkMarineFileLoaded() {
        if (!MarineFile) {
            throw new Error('No MarineFile');
        }
    }

    function checkMarineParserLoaded() {
        if (!MarineParser) {
            throw new Error('No MarineParser');
        }

        ['ParserA', 'ParserEM', 'ParserSEGY', 'ParserCTD', 'ParserPD0'].forEach(k => self[k] = MarineParser[k]);
    }

    function checkPlotLoaded() {
        if (!Plot) {
            throw new Error('No Observable/plot');
        }
    }

    async function showRootPicker() {
        const hDir = await window.showDirectoryPicker({ id: 'localscan1', mode: 'readwrite' });
        rootHandler = hDir;

        hideRootSelect();

        getMetaCSV();

        initMap();
    }

    function hideRootSelect() {
        for (const e of document.getElementsByClassName('select-root')) {
            e.style.display = 'none';
        }

        for (const e of document.getElementsByClassName('root-selected')) {
            e.style.display = 'block';
        }
    }

    async function getFiles() {
        if (!rootHandler) {
            console.error('Root not selected');
            return undefined;
        }

        const files = [];
        for await (const file of getFilesRecursively(rootHandler, '.')) {
            files.push(file);
        }

        return files;
    }

    async function getMetaCSV() {
        if (!rootHandler) {
            console.error('Root not selected');
            return undefined;
        }

        const files = [];
        try {
            // -- ./marine_meta.csv
            const hFile = await rootHandler.getFileHandle(META_CSV);
            hFile.relativePath = './' + hFile.name;
            files.push(hFile);
        } catch (e) {
        };
        for await (const hDir of getDirHandlesRecursively(rootHandler, '.')) {
            try {
                const hFile = await hDir.getFileHandle(META_CSV);
                hFile.relativePath = hDir.relativePath + hFile.name;
                files.push(hFile);
            } catch (e) {
            }
        }

        metaCSVs = files;
        console.log(files);

        document.getElementById('select-meta-files').setDataSource(files);

        parseMetaCSV();

        // -- show delete button
        if(0 < metaCSVs.length) {
            document.getElementById('btnDeleteAllMetaCSV').style.display = 'inline-block';
        }

        return files;
    }

    // -- code from mozilla
    // directory always ends with /
    async function* getFilesRecursively(entry, path = '.') {
        if (entry.kind === "file") {
            const file = await entry.getFile();
            if (file !== null) {
                file.relativePath = path;
                yield file;
            }
        } else if (entry.kind === "directory") {
            for await (const handle of entry.values()) {
                const newPath = path + '/' + handle.name;
                yield* getFilesRecursively(handle, newPath);
            }
        }
    }

    // relativePath is always ends with /
    async function* getDirHandlesRecursively(entry, path = '.') {
        for await (const handle of entry.values()) {
            if ('directory' !== handle.kind) {
                continue;
            }

            const newPath = path + '/' + handle.name;
            handle.relativePath = newPath + '/';
            yield handle;
            yield* getDirHandlesRecursively(handle, newPath);
        }
    }

    function deleteAllMetaCSV() {
        if (!metaCSVs || 0 === metaCSVs.length) {
            alert('No CSV to delete, or rescan csv');
            return;
        }

        if (!confirm(`Do you want to delete ${metaCSVs.length} of csv?`)) {
            return;
        }

        execDeleteAllMetaCSV();
    }

    async function execDeleteAllMetaCSV() {
        const count = metaCSVs.length;
        for (let i = 0; i < metaCSVs.length; i++) {
            const hFile = metaCSVs[i];
            console.log('Deleting ' + hFile.relativePath);
            await hFile.remove();
        }

        alert(`${count} of files deleted`);

        getMetaCSV();
    }

    function createMetaCSV() {
        if (!confirm(`It will take some times to parse all files, Do you want to proceed?`)) {
            return;
        }

        execCreateMetaCSV();
    }

    async function execCreateMetaCSV() {
        // processed includes ignored files, which is not classified by exts
        let created = 0, total = 0, processed = 0;

        const mapTree = {};

        // -- using created, total, processed
        const eStatus = document.getElementById('statusMetaCSV');
        function updateStatus() {
            eStatus.textContent = `${processed} / ${total} -> ${created} CSVs`;
        }

        function appendNormalTree(path, file) {
            // ends with / always './' or './abcd/'
            const dir = path.replace(/[^/]*$/, '');
            if (!mapTree.hasOwnProperty(dir)) {
                mapTree[dir] = [];
            }

            mapTree[dir].push(file);

            total++;
            updateStatus();
        }

        for await (const file of getFilesRecursively(rootHandler, '.')) {
            appendNormalTree(file.relativePath, file);
        }

        for (const [k, v] of Object.entries(mapTree)) {
            const mfm = new MarineFileManager();
            v.forEach(file => {
                mfm.classify(file);
                processed++;
                updateStatus();
            });
            const metas = await mfm.parseMeta();
            const listCSV = metas.map(MarineFileManager.MetaToCSV);

            const header = MarineFileManager.MetaToCSVHeader();
            const body = listCSV.join('\n');

            if (0 < body.length) {
                const csv = header + '\n' + body;
                await writeMetaCSV(rootHandler, k, csv);
                created++;
                updateStatus();
            }
        }

        alert(`${created} marine_meta.csv created`);
        getMetaCSV();
    }

    async function requestFileHandle(handle, path) {
        const sep = path.split('/');

        let myHandle = handle;
        // -- ignore first .
        for (let i = 1; i < sep.length - 1; i++) {
            const p = sep[i];
            myHandle = await myHandle.getDirectoryHandle(p, { create: true });
        }

        return myHandle.getFileHandle(sep.at(-1), { create: true });
    }

    async function writeMetaCSV(originHandle, dir, content) {
        const hFile = await requestFileHandle(originHandle, dir + META_CSV);
        const writable = await hFile.createWritable();
        await writable.write(content);
        await writable.close();
    }

    function parseMetaCSV() {
        execParseMetaCSV();
    }

    async function execParseMetaCSV() {
        // from select list
        const metaList = document.getElementById('select-meta-files');
        const selected = metaList.getSelected();
        let listSrc = metaCSVs;
        if (selected && 0 < selected.length) {
            listSrc = selected.map(d => d.ds); // option.ds
        }

        const list = [];
        for (let i = 0; i < listSrc.length; i++) {
            const item = listSrc[i];
            const file = await item.getFile();
            const text = await file.text();

            const json = parseCSVtoJSON(text);
            json.forEach(d => d.relativePathMeta = item.relativePath)
            list.push(...json);
            item.json = json;
        }

        const mapType = {
            bytes: parseInt,
            count: parseInt,
            lat: parseFloat,
            lat2: parseFloat,
            lng: parseFloat,
            lng2: parseFloat,
            ms: parseInt,
            ms2: parseInt,
            ts_utc: d => new Date(d),
            ts2_utc: d => new Date(d),
        }


        list.forEach(d => {
            for (const [k, fn] of Object.entries(mapType)) {
                const value = d[k];
                if (value && 0 < value.length) {
                    d[k] = fn(value);
                }
            }
        });

        dataSource = list;
        plotMetaCSV();
        drawMarker();
        refreshDetail();

        console.log(dataSource);

        return list;
    }

    function parseCSVtoJSON(str) {
        const lines = str.split('\n');
        const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g;

        const header = lines[0].match(regex).map(d => d.replace(/^"(.*)"$/, '$1'));
        const body = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const v = line.match(regex).map(d => d.replace(/^"(.*)"$/, '$1'));
            body.push(v);
        }

        const json = body.map(d => {
            const obj = {};
            header.forEach((k, i) => {
                obj[k] = d[i]
            });
            return obj;
        });

        return json;
    }

    function plotMetaCSV() {
        const parent = document.getElementById('meta-plot');
        parent.innerHTML = '';
        const rect = parent.getBoundingClientRect();
        const w = ~~rect.width, h = ~~rect.height;

        const p = Plot.plot({
            color: {
                legend: true
            },
            grid: true,
            style: {
                fontSize: 15
            },
            x: {
                label: 'Date'
            },
            y: {
                ticks: 3
            },
            marginBottom: 40,
            width: w,
            height: h,
            inset: 20,
            marks: [
                Plot.frame(),
                Plot.rectY(dataSource, Plot.binX({ y: 'count' }, { x: 'ts_utc', fill: d => colorPlot(d.type_g2) }))
            ]
        })


        parent.appendChild(p);
    }

    function initMap() {
        const parent = document.querySelector('.meta-map');
        const rect = parent.getBoundingClientRect();
        const w = ~~rect.width, h = ~~rect.height;

        // -- this should be forced
        const eMap = document.getElementById('map');
        eMap.style.width = w + 'px';
        eMap.style.height = h + 'px';

        map = L.map(eMap, { zoomControl: false }).setView([25, 90], 2);

        async function requestTile() {
            const mapStyle = {
                fillColor: 'white',
                fillOpacity: 0.5,
                color: 'black',
                weight: 2,
                opacity: .5
            };

            // geojson from https://geojson-maps.ash.ms/
            const r = await fetch('../../libs/geotile/custom.geo.json');
            const geojson = await r.json();

            var myLayer = L.geoJSON(null, { style: mapStyle }).addTo(map);
            myLayer.addData(geojson);

            // -- init icons
            const iconHtml = `
            <svg
              width="6"
              height="6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="3" cy="3" r="3" fill="#color#" />
            </svg>`;

            // const mapIcon = {}; // global
            colorPlot.domain().forEach(k => {
                const color = colorPlot(k);
                const src = iconHtml.replace(/#color#/, color);
                mapIcon[k] = L.divIcon({
                    html: src,
                    className: "",
                    iconSize: [6, 6],
                    iconAnchor: [3, 3]
                });
            });

            layerMarker = L.layerGroup([]);
            layerMarker.addTo(map);

            layerHighlight = L.layerGroup([]);
            layerHighlight.addTo(map);
        }

        requestTile();
    }

    function drawMarker() {
        if (!map) {
            console.error('map is invalid, can not draw markers');
            return;
        }

        if (!layerMarker) {
            console.error('layerMarker is invalid, can not draw markers');
            return;
        }

        layerMarker.clearLayers();

        // -- [min, max]
        let lat = [999, -999], lng = [999, -999];

        dataSource.forEach(d => {
            if ('number' !== typeof d.lat || 'number' !== typeof d.lng) {
                return;
            }

            L.marker([d.lat, d.lng], { icon: mapIcon[d.type_g2] }).addTo(layerMarker);
            if (lat[0] > d.lat) {
                lat[0] = d.lat;
            }

            if (lat[1] < d.lat) {
                lat[1] = d.lat;
            }

            if (lng[0] > d.lng) {
                lng[0] = d.lng;
            }

            if (lng[1] < d.lng) {
                lng[1] = d.lng;
            }
        });

        // -- fot to map
        const bounds = L.latLngBounds([[lat[0], lng[0]], [lat[1], lng[1]]]);
        map.fitBounds(bounds);
    }

    function refreshDetail() {
        const parent = document.getElementById('meta-detail');
        parent.innerHTML = '';

        dataSource.forEach(d => {
            const metaDetailItem = new MetaDetailItem(d);
            parent.appendChild(metaDetailItem);
            metaDetailItem.addEventListener('mouseover', () => {
                const popup = `<div style="text-align: center;"><h1>${d.type_g2}</h1><div>${d.ts_utc.toLocaleString('af', { timeZone: 'UTC' })}</div><div>${d.group_g1}</div></div>`;
                highlightMarker(d.lat, d.lng, popup);
            });

            metaDetailItem.addEventListener('click', () => {
                openChild(d);
            });
        });
    }

    function highlightMarker(lat, lng, title) {
        if ('number' !== typeof lat || 'number' !== typeof lng) {
            return;
        }

        layerHighlight.clearLayers();

        const marker = L.marker([lat, lng]);
        marker.addTo(layerHighlight).bindPopup(title).openPopup();
    }

    function openChild(d) {
        const path = d.relativePathMeta.replace(META_CSV, '');

        const files = [];
        [d.file1, d.file2, d.file3, d.file4].forEach(d => { if (d) files.push(path + d) });
        // -- save to global
        clickedFiles = files;

        const idChild = 'localScanViewer';
        if ('ALL' === d.type_g2) {
            lastChild = open('../em/parseEM_context3d.html', idChild);
        } else if ('PD0' === d.type_g2) {
            lastChild = open('../../internal/adcp/parseADCP_context2d.html', idChild);
        } else if ('CTD9' === d.type_g2) {
            lastChild = open('../../internal/ctd/parseCTD.html', idChild);
        }
    }

    function getLastClickedFiles() {
        if (clickedFiles) {
            return {
                rootHandler: rootHandler,
                files: clickedFiles
            }
        }

        return undefined;
    }

    function setMessageHandler() {
        window.addEventListener('message', (e) => {
            console.log(e);
            if (lastChild && 'ask' === e.data) {
                const obj = getLastClickedFiles();
                lastChild.postMessage(obj);
            }
        });
    }

    function main() {
        // -- just crash!
        checkMarineParserLoaded();
        checkMarineFileLoaded();
        checkPlotLoaded();
        setMessageHandler();

        // initMap should be called when visible, otherwise can not calculate w, h

        // hideRootSelect();
        // initMap();
    }

    main();

    return {
        colorPlot: colorPlot,
        showRootPicker: showRootPicker,
        hideRootSelect: hideRootSelect,
        getFiles: getFiles,
        getMetaCSV: getMetaCSV,
        deleteAllMetaCSV: deleteAllMetaCSV,
        createMetaCSV: createMetaCSV,
        parseMetaCSV: parseMetaCSV,

        getLastClickedFiles: getLastClickedFiles
    }
})();

