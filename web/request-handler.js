var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var helpers = require('./http-helpers');
var Q = require('q');
var htmlFetcher = require('../workers/htmlfetcher');
// require more modules/folders here!

var actions = {
  'GET': function(req, res){
    var publicFolder = archive.paths.siteAssets;
    var fixtureName = req.url;
    var fixturePath = "";
    //console.log("req.url = ", req.url);
      if(fixtureName === "/" || fixtureName.match(/[.]/g)){
        console.log(fixtureName);
        if(fixtureName.match(".css")){
          fixturePath = publicFolder + fixtureName;
        }else if(fixtureName === "/"){
          fixturePath = publicFolder + "/index.html";
        }else if(fixtureName.match("www.")){
          fixturePath = archive.paths.archivedSites + fixtureName;
        }
        res.writeHead(200, helpers.headers);
        helpers.serveAssets(res, fixturePath, function(data){
          res.end(data);
        });
      }else{
        console.log("Cant be found!");
        res.writeHead(404, helpers.headers);
        res.end();
      }
      
  },

  'POST': function(req, res){
    console.log('post went through');
    var fixtureName = req.url.slice(1);
    var url = "";
    req.on('data', function(chunk){
      url += chunk;
    });
    req.on('end', function(){
      res.writeHead(302, helpers.headers);
      console.log(url);
      url = url.slice(4);
      //console.log('this is the url ', JSON.parse(url).url);

      archive.isUrlInList(url)
        .then(function(inList){
        if(!inList){
          archive.addUrlToList(url);

        }else{
          console.log("URL is already in list!");
        }
      });

      archive.isURLArchived(url)
        .then(function(archived){
          if(archived){
            var fixturePath = archive.paths.archivedSites + "/" + url;
            console.log('already archived!');
            console.log('loading html files at: ', fixturePath);
            helpers.serveAssets(res, fixturePath, function(data){
              res.end(data);
            });
          }
        })
        .catch(function(){
          console.log('not yet archived');
          var fixturePath = archive.paths.siteAssets + "/loading.html";
          archive.downloadUrls(url);
          console.log('loading loadingpage at: ', fixturePath);
          helpers.serveAssets(res, fixturePath , function(data){
            res.writeHead(200, helpers.headers);
            res.end(data);
          });
        });

      //checks to see if sites.txt exists and performs append or create for new archive site
      //htmlFetcher("www.google.com");
      //res.end();

    });
  }

};

exports.handleRequest = function (req, res) {

  actions[req.method](req, res);

  console.log("Serving request type " + req.method + " for url " + req.url);

  //var publicFolder = __dirname + "/public/";

};

