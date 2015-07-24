var http = require('http');
var archives = require('../helpers/archive-helpers');
var fs = require('fs');
var Q = require('q');

// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
module.exports = function(url, cb){
  //var deferred = Q.defer();
  var temp = '';
  console.log(url);
  http.get("http://"+ url, function(res){
      
      res.on('data',function(chunk){
        temp += chunk.toString();
      });
      res.on('end',function(){
        cb(temp);
      });
  });
  //console.log(deferred.promise);
  //return deferred.promise;
};

