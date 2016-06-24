angular.module('eStock.someItems',[])

.controller('allProjectsCtrl', ['$scope','shop','handleProjects',function ($scope,shop,handleProjects){

	var query = {};
	query.companyId = 'RMB01';
	query.projectState = 'open';

	shop.project.query(query,function (data){
		console.log(data);
		$scope.projectList = data;
	},function (error){});

	$scope.passProject = function(project){
		handleProjects.passProject(project);
	};

}])

.controller('assembliesInProjectCtrl',['$scope','handleProjects',function ($scope,handleProjects){

	$scope.currentProject = handleProjects.getCurrentProject();
	$scope.assemblyList = $scope.currentProject.projectAssemblies;

	function doneOrNot (){ // funcion para mostrar el estado de un ensamble en un proyecto

		for(i=0;i<$scope.assemblyList.length;i++){

			var a = $scope.assemblyList[i].assemblyItems;
			var listo =_.reject(a,function (item){
				return item.itemAssembled == true;
			});

			if (listo.length == 0){
				$scope.assemblyList[i].assemblyState = 'Fertig';
			}
			else{
				$scope.assemblyList[i].assemblyState = 'Noch nicht Fertig';
			}

			
	   }
	 
	   return $scope.assemblyList;
	}

	doneOrNot();

	$scope.passAssembly = function(assembly){
		handleProjects.passAssembly (assembly);
	}

}])

.controller('itemsInAssemblyCtrl',['$scope','shop','handleProjects','$state',function ($scope,shop,handleProjects,$state){
	
	var firmaId = "RMB01";
	$scope.currentProject = handleProjects.getCurrentProject();
	$scope.currentAssembly = handleProjects.getCurrentAssembly();
	$scope.allItems = $scope.currentAssembly.assemblyItems;


	var itemsNewAmounts = []; // [itemCode,itemAmount]
	var itemsAndAmountInStock = []; // [itemCode,itemAmount]
	var itemsToTakeFromStock = []; // [itemCode,itemAmount]
	

	$scope.itemList = _.reject($scope.allItems,function (item){ // se descartan los items que ya estan insertados
		return item.itemAssembled == true; // de alguna forma los escope sigen vinculados
	});

	$scope.itemsToInsert = []; // objects with all the information
	

	$scope.chooseItemsToInsertInProject = function(){
		var query = {};
		query.companyId = "RMB01";
		var al = $scope.itemList.length;
		var stuck = $scope.itemList;

		for (i=0;i<al;i++){
			if (stuck[i].itemAssembled == true){
				$scope.itemsToInsert.push(stuck[i]);
			}
		}
		alert($scope.itemsToInsert.length);
		// resume in a multyple array from code and amount
		itemsToTakeFromStock = shop.resumeCodeAndAmount($scope.itemsToInsert);
		query.array = shop.justItemCode(itemsToTakeFromStock); // prepare query array

		shop.itemId.query(query,function (data){

			 itemsAndAmountInStock = shop.resumeCodeAndAmount(data); // resume in a multyple array from code and amount

			 itemsNewAmounts = shop.subtract2arrays(itemsAndAmountInStock,itemsToTakeFromStock);
			 alert(itemsNewAmounts.length + ' Items Selected');
			 $scope.arrayReady = true;
			},function (error){
				alert('error con la respuesta del array de items que se escogieron');
			})
	};

	$scope.itemsToProject = function(){

	var start = new Date();
	var query = {};
		query.companyId = firmaId;
		query._id = $scope.currentProject._id;
		query['projectAssemblies.assemblyNumber'] = $scope.currentAssembly.assemblyNumber;
		

	// query for insert intem in project
	shop.handleItems.update(query,$scope.allItems,function (data){

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