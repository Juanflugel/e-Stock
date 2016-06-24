angular.module('eStock.placeAssembly',['eStock.services'])

.controller('placeAssemblyCtrl',['$scope','shop','$cordovaBarcodeScanner','handleProjects',function ($scope,shop,$cordovaBarcodeScanner,handleProjects){

 // shop.assembly.query({},function (data) {
 // 	$scope.currentObj = data[6];
 // 	$scope.itemsToMove = $scope.currentObj.assemblyItems;
 // 	$scope.itemsToSubtract = shop.resumeCodeAndAmount($scope.itemsToMove);
 // });
// confi inicial de la vista
var firmaId = 'RMB01';
$scope.currentObj = {}; // current assembly
$scope.assembly = false; // ng-show
// confi inicial de la vista

var currentAmounts = []; // codigos y cantidades a mandar al backend;[['code',amount],['code',amount]]
var multyQuery = []; // ['itemcode','itemCode',itemCode] To query just the necesary items

$scope.itemsToMove = []; // collection with all the items which belong to the subassembly
$scope.itemsToSubtract =[]; //[['itemCode',Amount]]
$scope.itemsInStock = []; // collection with just the items that will be taken from the Stock to inert the assemlby in the project

// query from DB all the projects that belong to the company
shop.project.query({companyId:firmaId,projectState:'open'},function (data){
		$scope.activos = data; // referente solo a los projecto que estan en ejecucion
});


 var callJustTheOnes = function(){
	var query = {};
	query.array = multyQuery;
	query.companyId = firmaId;
	shop.itemId.query(query,function (data) {
		$scope.itemsInStock = data;
		$scope.itemsInStock = shop.resumeCodeAndAmount($scope.itemsInStock); //[['itemCode',Amount]]
		/*alert($scope.itemsInStock.length);//[['itemCode',Amount]]*/

	})
 };


$scope.takeAssembly = function(){

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text).toUpperCase();;
			 const type = String(barcodeData.format);
			 var query = {};
			 query.assemblyNumber = code;
			 query.companyId = firmaId;

			 shop.assembly.query(query,function (data) {
							
					if (data.length == 0){
						alert('The Scaned Assembly is not registered yet');
					}
					else{
						
						 $scope.currentObj = data[0];
						 $scope.itemsToMove = $scope.currentObj.assemblyItems;
						 $scope.itemsToSubtract = shop.resumeCodeAndAmount($scope.itemsToMove);
						 multyQuery = shop.justItemCode($scope.itemsToSubtract);
						 $scope.assembly = true;
						 callJustTheOnes();
					}
					 
				 },function(queryerr){
					alert(queryerr);
				 });

		  },function(scanerror) {
		  // An error occurred
	   });
		
	}

$scope.restarArrays = function () {
	currentAmounts = shop.subtract2arrays($scope.itemsInStock,$scope.itemsToSubtract);
	alert(currentAmounts);
}
	
$scope.assemblyToProject = function(idProject){
	var start = new Date();
	$scope.itemsToMove = handleProjects.addItemAssembledProperty($scope.itemsToMove);
	var query = {};
	query._id = idProject;
	query.companyId = firmaId;
	query['projectAssemblies.assemblyNumber'] = $scope.currentObj.assemblyNumber;
		

	// query for insert intem in project
	shop.handleItems.update(query,$scope.itemsToMove,function (data){
			//console.log(data);
				shop.itemUpdateMulti.update({},currentAmounts,function (data) {	
					 var t = new Date() - start;
					alert('Update in Stock successful : '+ t);
					$scope.assembly = false;			
					},function (error) {
						alert('fail update in Stock');
					}
				);

			},function (error){});




	}


}]);