'use strict';
// import required modules
const fs = require('fs');
const util = require('util');
const uuidv4 = require('uuid/v4');

const createDir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const Utils = {
  // helper method to make the string capitalized, uppercase its first letter, lowercase the rest of the string
  // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  capitalize: function(word) {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  },

  // https://www.npmjs.com/package/uuid
  generateRandomUUID: function() {
    return uuidv4();
  },

  // method to handle file upload from the html form, store locally in uploads directory
  handleFileUpload: async function(file) {
    const filename = file.hapi.filename;
    const data = file._data;
    await writeFile('./uploads/' + filename, data);
  },

  // method to handle file download from mongo db, stores locally in public directory
  // public/images/{islandUUID}/{imageUUID}
  handleFileDownload: async function(dbImage, islandUUID) {
    const fileId = dbImage.uuid;
    const fileData = dbImage.data;
    const fileExtension = dbImage.name.substr(dbImage.name.lastIndexOf('.') + 1);
    await createDir('./public/images/' + islandUUID, { recursive: true });
    await writeFile('./public/images/' + islandUUID +'/' + fileId + '.' + fileExtension, fileData);
  },

  // method to handle deletion of an image from public directory
  handleFileDeletion: async function(islandUUID) {
    const dirPath = './public/images/' + islandUUID;
    // read all files and remove recursively
    // https://gist.github.com/liangzan/807712/8fb16263cb39e8472d17aea760b6b1492c465af2
    const files = fs.readdirSync(dirPath);
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        let filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    }
  }
};

module.exports = Utils;
