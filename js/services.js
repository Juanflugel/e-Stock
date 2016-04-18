angular.module('eStock.services',['ngResource'])


.factory('Config', function () {
  return {
      version : '0.0.1',
      ip: 'estock.website',
      port: 5006,
      protocol: 'http'
  };
})

.factory('shop',['$resource', 'Config', function ContenidoFactory($resource, Config){
  return {
    itemId: $resource('http://' + Config.ip + ':' + Config.port + '/items',{}),
    itemUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/items',{},{ update: {method: 'PUT'}}),
    itemUpdateMulti:$resource('http://' + Config.ip + ':' + Config.port + '/itemsMultipleAmount',{},{ update: {method: 'PUT'}}),
    company: $resource('http://' + Config.ip + ':' + Config.port + '/company',{}),
    project:$resource('http://' + Config.ip + ':' + Config.port + '/projects',{}),
    projectUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/itemToProject',{},{ update: {method: 'PUT'}}),
    resumeCodeAndAmount:function  (collection) {
        const sample = [];
        _.each(collection,function (obj) {
          const a = [obj.itemCode,obj.itemAmount];
          sample.push(a);
        });
        return sample;
    },
    subtract2arrays: function (a,b) { // a = array whit values from Stock ['itemCode',3]; b= array from values from the project ['itemCode',5]
      var diff = [];
      const lb = b.length;
      _.each(a,function (aObj) {
        for( i=0 ; i<lb ;i++){
          var bObj = b[i];
          if (aObj[0] == bObj[0]){
            diff.push([aObj[0],aObj[1]-bObj[1]]);
          }
        }
      });
      return diff;
    },
    justItemCode: function(collection){
      var queryArray = [];
      _.each(collection,function (array){
          queryArray.push(array[0]);
      });
      return queryArray;
    }

  };
}])

.factory('handleBills', function ($rootScope) {

  var currentBill={};
  var detalle ={};
  var toBuy = {};

  return {
    updateBills:function(){
      $rootScope.$broadcast('newBill');
    },
    updateBuyList:function(){
      $rootScope.$broadcast('newProductToBuy');
    },
    passBill: function(obj){
      currentBill = obj;
      console.log(currentBill);
    },
    remove: function(bill) {
      bills.splice(bills.indexOf(bill), 1);
    },
    getCurrentBill: function() {
      console.log('me llamaron');
      return currentBill;

    },
    passProduct: function(obj){
       detalle = obj;
    },
    getCurrentProduct: function(){
      return detalle;
    }
  }
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}])

.factory('socketio',['$rootScope',function ($rootScope) {
  var socket = io.connect('http://tsjuan.ddns.net:5006');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);