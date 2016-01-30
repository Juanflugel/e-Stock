angular.module('eStock.services',['ngResource'])


.factory('Config', function () {
  return {
      version : '0.0.1',
      ip: 'tsjuan.ddns.net',
      port: 5006,
      protocol: 'http'
  };
})

.factory('items',['$resource', 'Config', function ContenidoFactory($resource, Config){
  return {
    id: $resource('http://' + Config.ip + ':' + Config.port + '/items',{}),
    idUpdate:$resource('http://' + Config.ip + ':' + Config.port + '/items',{},{ update: {method: 'PUT'}})  
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