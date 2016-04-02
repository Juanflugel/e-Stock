angular.module('eStock.placeAssembly',['eStock.services'])

.controller('placeAssemblyCtrl',['$scope','shop','$cordovaBarcodeScanner',function ($scope,shop,$cordovaBarcodeScanner){
// confi inicial de la vista
var firmaId = 'RMB01';
$scope.currentObj = {};
$scope.assembly = false; // ng-show
// confi inicial de la vista

var currentAmounts = []; // codigos y cantidades a mandar al backend;
var multyQuery = []; // ['itemcode','itemCode',itemCode] To query just the necesary items

$scope.itemsToMove = [];
$scope.itemsToSubtract =[]; //[['itemCode',Amount]]
$scope.itemsInStock = [];

// query from DB all the projects that belong to the company
shop.project.query({companyId:firmaId,isSubAssembly:0,projectState:'open'},function (data){
		$scope.activos = data; // referente solo a los projecto que estan en ejecucion
});
 var callJustTheOnes = function(){
 	var query = {};
 	query.array = multyQuery;
 	query.companyId = firmaId;
 	shop.itemId.query(query,function (data) {
		$scope.itemsInStock = data;
		$scope.itemsInStock = shop.resumeCodeAndAmount($scope.itemsInStock);
		/*alert($scope.itemsInStock.length);//[['itemCode',Amount]]*/

	})
 };


$scope.takeAssembly = function(){

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text).toUpperCase();;
			 const type = String(barcodeData.format);
			 var query = {};
			 query.projectNumber = code;
			 query.companyId = firmaId;

			 shop.project.query(query,function (data) {
							
					if (data.length == 0){
						alert('The Scaned Assembly is not registered yet');
					}
					else{
						 $scope.currentObj = data[0];
						 $scope.itemsToMove = $scope.currentObj.projectItems;
						 $scope.itemsToSubtract = shop.resumeCodeAndAmount($scope.itemsToMove);
						 multyQuery = shop.justItemCode($scope.itemsToSubtract);
						 
						 $scope.assembly = true;
						 callJustTheOnes();
					}
					 
				 },function(queryerr){
					alert(queryerror);
				 });

		  },function(scanerror) {
		  // An error occurred
	   });
		
	}

	$scope.assemblyToProject = function(idProject){
		currentAmounts = shop.subtract2arrays($scope.itemsInStock,$scope.itemsToSubtract);
		var query = {};
		query._id = idProject;

		// query for insert intem in project
		shop.projectUpdate.update(query,$scope.itemsToMove,function (data){
			alert('primera');
			shop.itemUpdateMulti.update(currentAmounts,function (data) {
				
			});

		});
alert('porfin mijo');



	}


}]);