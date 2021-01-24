const cfg = require('../config');
const fs = require('fs');
const path = require('path');

class Reader {
    dir = '';
    highWaterMark = 1024;

    constructor(dir) {
        this.read(dir);
    }

    read(dir, mode = 'file') {
        this.dir = dir;
        fs.readdir(this.dir, (err, files) => {
            if (err) {
                console.error(err);
            } else {
                files.forEach(file => {
                    let filePath = dir + file;
                    let isDir = fs.lstatSync(filePath).isDirectory();
                    if (!isDir) {
                        if (mode === 'parts') {
                            this.readPart(filePath);

                        } else {
                            this.readFile(filePath);
                        }
                    }
                });
            }
        });
    }

    readFile(filePath) {
        let fileName = path.basename(filePath).split('.').slice(0, -1).join('.');
        let fileDir = path.dirname(filePath) + '/' + fileName + '/';
        if (!fs.existsSync(fileDir)) {
            console.error(`Can't find file parts.`);
        } else {
            this.read(fileDir, 'parts');
        }
    }

    async readPart(filePath) {
        const rs = fs.createReadStream(filePath, {highWaterMark: this.highWaterMark});
        const data = await this.readStream(rs);
        console.log(`\n== Read file ${filePath} ==\n${data}`);
    }

    readStream(stream, encoding = "utf8") {
        stream.setEncoding(encoding);
        return new Promise((resolve, reject) => {
            let data = "";
            stream.on("data", chunk => data += chunk);
            stream.on("end", () => resolve(data));
            stream.on("error", error => reject(error));
        });
    }
}

new Reader(cfg.dir);