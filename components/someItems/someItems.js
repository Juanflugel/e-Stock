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

.controller('itemsInAssemblyCtrl',['$scope','shop','handleProjects',function ($scope,shop,handleProjects){
	
	var itemsNewAmounts = []; // [itemCode,itemAmount]
	var itemsAndAmountInStock = []; // [itemCode,itemAmount]
	var itemsToTakeFromStock = []; // [itemCode,itemAmount]
	
	

	$scope.currentAssembly = handleProjects.getCurrentAssembly();

	$scope.itemList = $scope.currentAssembly.projectItems;

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
		query.array = shop.justItemCode(itemsToTakeFromStock); // prepare query
		console.log(itemsToTakeFromStock,query);
		shop.itemId.query(query,function (data){
			//console.log(data);
			 itemsAndAmountInStock = shop.resumeCodeAndAmount(data); // resume in a multyple array from code and amount
			 console.log(itemsAndAmountInStock);
			 itemsNewAmounts = shop.subtract2arrays(itemsAndAmountInStock,itemsToTakeFromStock);
			 alert('definitive:'+itemsNewAmounts.length);
			},function (error){})
	};


}]);