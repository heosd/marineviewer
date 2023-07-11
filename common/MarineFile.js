class MarineFile {
    addFile(file) { }
    async parseMeta() { }
    getMeta() { }
}

class MarineFileCTD extends MarineFile {
    static TYPE = 'CTD9';

    constructor() {
        super();

        this.fileList = new ParserCTD.CTDFileList();
    }

    addFile(file) {
        this.fileList.addFile(file);
    }

    async parseMeta() {
        const metas = [];
        const groups = this.fileList.getGroups();
        for (let i = 0; i < groups.length; i++) {
            const item = groups[i];
            try {
                await item.parse();
                const meta = item.parseMeta();
                meta.g1 = item.getName();
                meta.g2 = MarineFileCTD.TYPE;
                meta.file1 = item.files.xmlcon?.name;
                meta.file2 = item.files.hex?.name;
                meta.file3 = item.files.bl?.name;
                meta.file4 = item.files.hdr?.name;
                metas.push(meta);
            } catch (e) {
                console.error(`error while ${item.name}`);
                console.log(e);
            }
        }

        return metas;
    }
}

class MarineFileALL extends MarineFile {
    static TYPE = 'ALL';

    constructor() {
        super();
        this.fileList = [];
    }

    addFile(file) {
        this.fileList.push(file);
    }

    async parseMeta() {
        const metas = [];

        for (let i = 0; i < this.fileList.length; i++) {
            const file = this.fileList[i];
            const ab = await file.arrayBuffer();

            try {
                const meta = ParserEM.ParseMeta(ab);
                meta.g1 = file.name;
                meta.g2 = MarineFileALL.TYPE;
                meta.file1 = file.name;
                metas.push(meta);
            } catch (e) {
                console.error(`error while ${file.name}`);
                console.log(e);
            }
        }

        return metas;
    }
}

class MarineFilePD0 extends MarineFile {
    static TYPE = 'PD0';

    constructor() {
        super();
        this.fileList = [];
    }

    addFile(file) {
        this.fileList.push(file);
    }

    async parseMeta() {
        const metas = [];

        for (let i = 0; i < this.fileList.length; i++) {
            const file = this.fileList[i];
            const ab = await file.arrayBuffer();

            try {
                const meta = ParserPD0.ParseMeta(ab, true);
                meta.g1 = file.name;
                meta.g2 = MarineFilePD0.TYPE;
                meta.file1 = file.name;
                metas.push(meta);
            } catch (e) {
                console.error(`error while ${file.name}`);
                console.log(e);
            }
        }

        return metas;
    }
}

class MarineFileSEGY extends MarineFile {
    static TYPE = 'SEGY';

    constructor() {
        super();
        this.fileList = [];
    }

    addFile(file) {
        this.fileList.push(file);
    }

    async parseMeta() {
        const metas = [];

        for (let i = 0; i < this.fileList.length; i++) {
            const file = this.fileList[i];
            const ab = await file.arrayBuffer();

            try {
                const meta = ParserSEGY.ParseMeta(ab, true);
                meta.g1 = file.name;
                meta.g2 = MarineFileSEGY.TYPE;
                meta.file1 = file.name;
                metas.push(meta);
            } catch (e) {
                console.error(`error while ${file.name}`);
                console.log(e);
            }
        }

        return metas;
    }
}

class MarineFileManager {
    constructor() {
        this.instances = {};
    }

    static FILE_TYPE = {
        'ALL': {
            type: MarineFileALL.TYPE,
            title: 'Kongsberg EM ALL',
            cls: MarineFileALL,
        },
        'CTD9': {
            type: MarineFileCTD.TYPE,
            title: 'Seabird CTD 9plus',
            cls: MarineFileCTD,
        },
        'PD0': {
            type: MarineFilePD0.TYPE,
            title: 'Teledyne ADCP PD0',
            cls: MarineFilePD0,
        },
        'SEGY': {
            type: MarineFileSEGY.TYPE,
            title: 'Seismic SEGY',
            cls: MarineFileSEGY,
        }
    };

    // -- only lower
    static EXT_JUDGE = {
        'mb58': MarineFileManager.FILE_TYPE.ALL,
        'mb56': MarineFileManager.FILE_TYPE.ALL,
        'all': MarineFileManager.FILE_TYPE.ALL,
        'lta': MarineFileManager.FILE_TYPE.PD0,
        'sta': MarineFileManager.FILE_TYPE.PD0,
        'hex': MarineFileManager.FILE_TYPE.CTD9,
        'bl': MarineFileManager.FILE_TYPE.CTD9,
        'xmlcon': MarineFileManager.FILE_TYPE.CTD9,
        'hdr': MarineFileManager.FILE_TYPE.CTD9,
        'segy': MarineFileManager.FILE_TYPE.SEGY,
        'sgy': MarineFileManager.FILE_TYPE.SEGY,
    };

    static JudgeFile(name) {
        const m = name.match(/\.([^.]*)$/);
        if (m) {
            const ext = m[1].toLowerCase();
            const found = this.EXT_JUDGE[ext];
            return found;
        }

        return undefined;
    }

    classify(file) {
        const inst = this.getMarineFileInstance(file);
        if (inst) {
            inst.addFile(file);
        }
    }

    getMarineFileInstance(file) {
        const type = MarineFileManager.JudgeFile(file.name);
        if (!type) {
            return;
        }

        const strType = type.type;
        if (!this.instances[strType]) {
            this.instances[strType] = new type.cls();
        }

        return this.instances[strType];
    }

    async parseMeta() {
        const r = [];
        for (const [k, v] of Object.entries(this.instances)) {
            // you can use k later
            const meta = await v.parseMeta();
            r.push(...meta);
        }

        return r;
    }

    static MetaToCSV(obj) {
        const csv = [
            obj.g2,
            obj.eq,
            obj.eqid,
            obj.g1,
            obj.ts?.toLocaleString('af', { timeZone: 'UTC' }),
            obj.ms,
            obj.ts2?.toLocaleString('af', { timeZone: 'UTC' }),
            obj.ms2,
            obj.lat?.toFixed(6),
            obj.lng?.toFixed(6),
            obj.lat2?.toFixed(6),
            obj.lng2?.toFixed(6),
            obj.count,
            obj.bytes,
            obj.desc,
            obj.file1,
            obj.file2,
            obj.file3,
            obj.file4,
        ].map(MarineFileManager.EscapeCSV).join(',');
        return csv;
    }

    static EscapeCSV(str, quote = true) {
        let escaped = '';
        if (str && 'string' === typeof str) {
            escaped = str.replace(/\"/g, '\\"');
        } else if (str) {
            escaped = String(str).replace(/\"/g, '\\"');
        }

        if (false === quote) {
            return escaped;
        } else {
            return '"' + escaped + '"';
        }
    }

    static MetaToCSVHeader() {
        return [
            'type_g2',
            'eq',
            'eqid',
            'group_g1',
            'ts_utc',
            'ms',
            'ts2_utc',
            'ms2',
            'lat',
            'lng',
            'lat2',
            'lng2',
            'count',
            'bytes',
            'desc',
            'file1',
            'file2',
            'file3',
            'file4'
        ].map(MarineFileManager.EscapeCSV).join(',');
    }
}
