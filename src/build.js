const cfg = require('../config');
const fs = require('fs');

class FSBuilder {
    dir = '';
    files = [];
    maxFileSize = 0

    constructor(dir, files, maxFileSize) {
        this.dir = dir;
        this.files = files;
        this.maxFileSize = maxFileSize;
        this.createDir();
        this.createFiles();
    }

    createDir() {
        console.log(`\n== CREATING DIRECTORY ${this.dir} ==`);
        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir);
            console.log(`Directory ${this.dir} created.`);
        } else {
            console.log(`Directory ${this.dir} is already exists.`);
        }
    }

    createFiles() {
        console.log(`\n== CREATING FILES IN ${this.dir} ==`);
        this.files.forEach((fileName) => {
            let filePath = this.dir + fileName;
            let writeStream = fs.createWriteStream(filePath);
            let fileSize = 0;
            while (fileSize < this.maxFileSize) {
                let newNumber = this.randomNumber(0, 9);
                fileSize += parseInt(Buffer.byteLength(newNumber, 'utf8'));
                writeStream.write(newNumber);
            }
            writeStream.on('finish', () => {
                console.log(`${filePath} file was created!`);
            });
            writeStream.end();
        });
    }

    randomNumber(min, max) {
        return parseInt(Math.random() * (max - min) + min).toString();
    }

}

new FSBuilder(cfg.dir, cfg.files, cfg.maxFileSize);