angular.module('eStock.someItems',[])

.controller('allAssembliesCtrl', ['$scope','shop','handleProjects',function ($scope,shop,handleProjects){

	var query ={};

	shop.assembly.query(query,function (data){
		console.log(data);
		$scope.assemblyList = data;
	},function (error){});

	$scope.passAssembly = function(assembly){
		handleProjects.passAssembly(assembly);
	};

}])

.controller('itemsInAssemblyCtrl',['$scope','shop','handleProjects','$state',function ($scope,shop,handleProjects,$state){
	
	var firmaId = "RMB01";
	// query from DB all the projects that belong to the company
shop.project.query({companyId:firmaId,projectState:'open'},function (data){
		$scope.activos = data; // referente solo a los projecto que estan en ejecucion
});

	var itemsNewAmounts = []; // [itemCode,itemAmount]
	var itemsAndAmountInStock = []; // [itemCode,itemAmount]
	var itemsToTakeFromStock = []; // [itemCode,itemAmount]
	
	

	$scope.currentAssembly = handleProjects.getCurrentAssembly();

	$scope.itemList = $scope.currentAssembly.assemblyItems;

	$scope.itemsToInsert = []; // objects with allthe information
	

	$scope.chooseItemsToInsertInProject = function(){
		var query = {};
		query.companyId = "RMB01";
		var al = $scope.itemList.length;
		var stuck = $scope.itemList;

		for (i=0;i<al;i++){
			if (stuck[i].insert == true){
				$scope.itemsToInsert.push(stuck[i]);
			}
		}
		// resume in a multyple array from code and amount
		itemsToTakeFromStock = shop.resumeCodeAndAmount($scope.itemsToInsert);
		query.array = shop.justItemCode(itemsToTakeFromStock); // prepare query array
		console.log(itemsToTakeFromStock,query);
		shop.itemId.query(query,function (data){
			//console.log(data);
			 itemsAndAmountInStock = shop.resumeCodeAndAmount(data); // resume in a multyple array from code and amount
			 console.log(itemsAndAmountInStock);
			 itemsNewAmounts = shop.subtract2arrays(itemsAndAmountInStock,itemsToTakeFromStock);
			 alert(itemsNewAmounts.length + ' Items Selected');
			 $scope.arrayReady = true;
			},function (error){})
	};

	$scope.itemsToProject = function(idProject){
	var start = new Date();
	var query = {};
	query._id = idProject;
	// query for insert intem in project
	shop.projectUpdate.update(query,$scope.itemsToInsert,function (data){

				shop.itemUpdateMulti.update({},itemsNewAmounts,function (data) {	
					 var t = new Date() - start;
					alert('Update in Stock successful : '+ t);
					$state.go('app.someItems');			
					},function (error) {
						alert('fail update in Stock');
					}
				);

			},function (error){});
	}


}]);