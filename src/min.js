const cfg = require('../config');
const fs = require('fs');
const fileName = process.argv[2];

class WriteMin {
    dir = '';
    minNumber = 0;
    minFile = 'min.txt';

    constructor(fileName) {
        this.dir = cfg.dir + fileName + '/';
        this.minFile = cfg.dir + fileName + '.' + this.minFile;
        fs.readdir(this.dir, (err, files) => {
            if (!err) {
                files.forEach(file => {
                    let filePath = this.dir + file;
                    let isDir = fs.lstatSync(filePath).isDirectory();
                    if (!isDir) this.read(filePath);
                });
            }
        });
    }

    read(filePath) {
        const readerStream = fs.createReadStream(filePath);
        let curNumber = 0;
        readerStream.on("data", (chunk) => curNumber = chunk.toString());
        readerStream.on("end", () => {
            if (!this.minNumber || this.minNumber > curNumber) {
                this.minNumber = curNumber;
                this.write(curNumber);
            }
        });
    }

    write(data) {
        const writeStream = fs.createWriteStream(this.minFile);
        writeStream.write(data);
    }
}

if (!fileName || !fileName.length) {
    console.error('Please, type FileName ("a" or "b" by defaults)');
} else {
    new WriteMin(fileName);
}
