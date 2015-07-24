var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Q = require('q');
var htmlFetcher = require('../workers/htmlfetcher');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */



exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  var currentURLs;
  fs.readFile(exports.paths.list, function(error,content){
    if(!error){
      cb(content.toString().split('\n'));
    } else {
      console.log("error reading list of URLs");
    }
  });
};

exports.isUrlInList = function(url){
  var inList = false;
  var deferred = Q.defer();

  exports.readListOfUrls(function(arr){
    console.log("this is the list of urls", arr);
    for(var i = 0; i < arr.length - 1; i++){
       console.log("this is the passed in url: '", url);
      if(url === arr[i]){
        inList = true;
        break;
      }
    }
    deferred.resolve(inList);
  });
  return deferred.promise;
};

exports.addUrlToList = function(url){
  fs.exists(exports.paths.list, function(exists){
    if(exists){
      fs.appendFile(exports.paths.list, url + "\n");
    }else{
      fs.writeFile(exports.paths.list, url + "\n", "utf-8");
    }
  });
};

exports.isURLArchived = function(url){
  var deferred = Q.defer();
  console.log(exports.paths.archivedSites + "/" + url);
  fs.open(exports.paths.archivedSites + "/" + url, "r" , function(error){
    if(error){
      deferred.reject(false);
    } else{
      deferred.resolve(true);
    }
  });
  return deferred.promise;
};

exports.downloadUrls = function(url){
    console.log("initiating download of URL");
    htmlFetcher(url, function(data){
      console.log(data, ' this is the data from downloadUrls');
      fs.writeFile(exports.paths.archivedSites + '/' + url, data, function(err){
        if(err){
          console.log("error in writing file");
        }else{
          console.log('successfully downloaded file');
        }
      });
    });
   // .catch(function(err){
   //   console.log(err);
  };

