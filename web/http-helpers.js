var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers.js");

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(asset, function(error,content){
    //console.log('content for ' + asset + content);
        if(!error){
          console.log('rendering html');
          callback(content);
        } else {
          console.log('error!');
          //res.writeHead(404, helpers.headers);
          res.end();
          //throw error;
        }
      });
};




// As you progress, keep thinking about what helper functions you can put here!
