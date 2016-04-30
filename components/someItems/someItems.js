angular.module('eStock.someItems',[])

.controller('allAssembliesCtrl', ['$scope','shop','handleProjects',function ($scope,shop,handleProjects){

    var query ={};

    shop.project.query(query,function (data){
        $scope.assemblyList = data;
    },function (error){});
    
    $scope.passAssembly = function(assembly){
        handleProjects.passAssembly(assembly);
    };

}])
.controller('itemsInAssemblyCtrl',['$scope','handleProjects',function ($scope,handleProjects){

$scope.currentAssembly = handleProjects.getCurrentAssembly();
    console.log($scope.currentAssembly);
$scope.itemList = $scope.currentAssembly.projectItems;

}]);