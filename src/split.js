const cfg = require('../config');
const fs = require('fs');
const path = require('path');

class Splitter {
    dir = '';
    highWaterMark = 1024;
    maxFileSize = 1024;

    constructor(dir) {
        this.dir = dir;
        fs.readdir(this.dir, (err, files) => {
            if (err) {
                console.error(err);
            } else {
                files.forEach(file => {
                    let filePath = this.dir + file;
                    let isDir = fs.lstatSync(filePath).isDirectory();
                    if (!isDir) {
                        this.split(filePath);
                    }
                });
            }
        });
    }

    split(filePath) {
        console.log(`\n== Split file ${filePath} ==`);

        // Creating a directory for each file with the same name
        let fileName = path.basename(filePath);
        let fileExt = path.extname(fileName);
        fileName = fileName.split('.').slice(0, -1).join('.');
        let dirName = this.dir + fileName + '/';
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
            console.log(`Directory ${dirName} created.`);
        } else {
            console.log(`Directory ${dirName} is already exists.`);
        }

        // Read file
        const readStream = fs.createReadStream(filePath, {highWaterMark: this.highWaterMark});
        let part = 0;
        readStream.on('data', (chunk) => {
            part++;
            let partFile = `${dirName}${fileName}_part_${part}${fileExt}`;
            let writeStream = fs.createWriteStream(partFile);
            writeStream.write(chunk.toString());
            writeStream.on('finish', () => {
                console.log(`${partFile} file was created!`);
            });
            writeStream.end();
        });
    }
}

new Splitter(cfg.dir);