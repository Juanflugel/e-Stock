angular.module('eStock.settings',['eStock.services'])

.controller('settingsCtrl', ['$scope','shop','$localstorage',function ($scope,shop,$localstorage){

	const companyId = "RMB01";

	shop.company.query({companyId:companyId},function (data){
		$scope.company = data[0];
		$localstorage.setObject('companyinfo',data[0]);
		},function (error){
			$scope.company = $localstorage.getObject('companyinfo');
		}
	);

	
	$scope.currentUser = $localstorage.getObject('currentUser') || {};

	$scope.saveUser = function(obj){
		console.log($scope.editInfo);
		$localstorage.setObject('currentUser',obj);
		alert('User changed to : '+ obj.userName);
	}
	


	
}])