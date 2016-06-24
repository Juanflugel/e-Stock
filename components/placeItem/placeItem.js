
angular.module('eStock.placeItem', ['eStock.services'])

.controller('placeItemCrtl', ['$scope','shop','$cordovaBarcodeScanner',function ($scope,shop,$cordovaBarcodeScanner){
	// $scope.transfer = true;
	$scope.whileObj = {};

	$scope.forgetToPlace = function(){
		angular.copy($scope.whileObj,$scope.readObj);
		$scope.editAmount = false;
	}

	$scope.defineAmount = function(){
		
		$scope.editAmount = true;
	}

	var firmaId = 'RMB01';

	// query from DB all the projects that belong to the company
	shop.project.query({companyId:firmaId,projectState:'open'},function (data){
		$scope.projects = data;
		$scope.assemblies = $scope.projects.projectAssemblies;

	});
	// scan an Item and bring all the information from DB
	$scope.takeItem = function(){

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text).toUpperCase();;
			 const type = String(barcodeData.format);
			 var query = {};
			 query.itemCode = code;
			 query.companyId = firmaId;
			 shop.itemId.query(query,function (data) {
							
					if (data.length == 0){
						alert('The Scaned code is not registered yet');
					}
					else{
						 $scope.readObj = data[0];
						 $scope.whileObj = angular.copy($scope.readObj);
						 $scope.transfer = true;
					}
					 
				 },function(err){
					alert('query error');
				 });

		  },function(scanerror) {
		  alert(' scaner error');
	   });
		
	}
	// set the item and amount to the item array inisde a project
	$scope.itemToProject = function (proNumber,assemblyNumber){
		var obj = $scope.readObj;
		var query = {};
		query.projectNumber = proNumber;
		query['projectAssemblies.assemblyNumber'] = assemblyNumber;
		query['projectAssemblies.assemblyItems.itemCode'] = obj.itemCode;
		query.companyId = firmaId;
		console.log(query);

		

		// query for insert intem in project
		shop.projectUpdate.update(query,function (data){			
			$scope.transfer = false;
			const takenAmount = obj.itemAmount;
			const newAmount = $scope.whileObj.itemAmount-takenAmount;
			// query for update new amount
			obj.itemAmount = newAmount;

			shop.itemUpdate.update({itemCode:obj.itemCode},obj,function (data){
			 	alert('item insert in porject: '+ proNumber);
			
			}, function(error){
				alert('The item amount was not updated');
			});

		});

	}


}])