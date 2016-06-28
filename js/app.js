// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('eStock',
 ['ionic',
  'eStock.services',
  'eStock.menu',
  'eStock.newItem',
  'eStock.readItem',
  'eStock.placeAssembly',
  'eStock.someItems',
  'eStock.settings',
  'ionic-material',
  'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'components/menu/menu.html',
    controller: 'AppCtrl'
  })
  // .state('app.placeItem', {
  //     url: '/placeItem',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'components/placeItem/placeItem.html',
  //         controller: 'placeItemCrtl'
  //       }
  //     }
  // })
  .state('app.placeAssembly', {
      url: '/placeAssembly',
      views: {
        'menuContent': {
          templateUrl: 'components/placeAssembly/placeAssembly.html',
          controller: 'placeAssemblyCtrl'
        }
      }
  })
  .state('app.newItem', {
      url: '/newItem',
      views: {
        'menuContent': {
          templateUrl: 'components/newItem/newItem.html',
          controller: 'newItemCtrl'
        }
      }
  })
  .state('app.readItem', {
      url: '/readItem',
      views: {
        'menuContent': {
          templateUrl: 'components/readItem/readItem.html',
          controller: 'readItemCtrl'
        }
      }
  })
  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'components/settings/settings.html',
          controller: 'settingsCtrl'
        }
      }
  })
  .state('app.someItems', {
      url: '/someItems',
      views: {
        'menuContent': {
          templateUrl: 'components/someItems/someItems.html',
          controller: 'allProjectsCtrl'
        }
      }
  })
  .state('app.assembliesInProject', {
      url: '/someItems/:assembliesInProject',
      views: {
        'menuContent': {
          templateUrl: 'components/someItems/assembliesInProject.html',
          controller: 'assembliesInProjectCtrl'
        }
      }
  })
  .state('app.itemsInAssembly', {
      url: '/someItems/:assembliesInProject/:itemsInAssembly',
      views: {
        'menuContent': {
          templateUrl: 'components/someItems/assemblyItems.html',
          controller: 'itemsInAssemblyCtrl'
        }
      }
  })
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/readItem');
});
