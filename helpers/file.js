const fs = require('fs');
const e = require('express');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
}

exports.deleteFile = deleteFile;