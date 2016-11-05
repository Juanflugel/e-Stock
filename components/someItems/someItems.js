angular.module('eStock.someItems',[])

.controller('allProjectsCtrl', ['$scope','shop','handleProjects',function ($scope,shop,handleProjects){

	var query = {};
	query.companyId = 'RMB01';
	query.projectState = 'open';

	shop.project.query(query,function (data){
		//console.log(data);
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

		for(var i=0; i < $scope.assemblyList.length; i++){

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

	var itemsToTakeFromStock = []; // [itemCode,itemAmount]
	$scope.itemsForStock = []; // items that the user check to insert in a project and discount from stock

	$scope.itemList = _.reject($scope.allItems,function (item){ // se descartan los items que ya estan insertados
		return item.itemAssembled == true; // de alguna forma los escope sigen vinculados
	});	

	if ($scope.itemList.length === 0){
		$scope.hideButton = true;
	}

	$scope.filterItemsForStock = function(){
		$scope.itemsForStock = _.filter($scope.itemList,function (item){
			return item.itemAssembled === true;
		});
	 	itemsToTakeFromStock = shop.resumeCodeAndAmountToDescount($scope.itemsForStock);
	};

	$scope.itemsToProject = function(){
	var start = new Date();
	var query = {};
		query.companyId = firmaId;
		query._id = $scope.currentProject._id;
		query['projectAssemblies.assemblyNumber'] = $scope.currentAssembly.assemblyNumber;
		

	// query for insert intem in project
	shop.handleItems.update(query,$scope.allItems,function (data){

				shop.itemIncrement.update({companyId:firmaId},itemsToTakeFromStock,function (data) {
					console.log(data);	
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