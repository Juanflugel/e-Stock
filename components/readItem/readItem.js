angular.module('eStock.readItem',[])

.controller('readItemCtrl',['$scope','shop','$cordovaBarcodeScanner','$localstorage',function ($scope,shop,$cordovaBarcodeScanner,$localstorage){
	$scope.show = true;
    const actualUser = $localstorage.getObject('currentUser');
    console.log(actualUser);
    $scope.whileObj = {}; // temporary objecto to keep the amount
    // green arrow to come back from edition and reestablish the amount
    $scope.back = function(){        
		angular.copy($scope.whileObj,$scope.readObj);         
		$scope.edit = false;        
    }

    $scope.editAmount = function() {
	   $scope.edit = true;
    }

    $scope.updateAmount = function(obj){
	   console.log(obj);
	   obj.itemLastPerson = actualUser;
	   console.log(obj);
	   const code = obj.itemCode;
	   shop.itemUpdate.update({idCode:code},obj,function(data){
			 console.log('res:',data);
			 $scope.whileObj = angular.copy($scope.readObj);
			 $scope.edit = false;
			 alert(obj.itemLastPerson.userName);	 	
			 }, function(error){
			 	alert('The item amount was not updated');
			 });
	   
	   //console.log($scope.edit,obj);
    }

    $scope.searchCode = function(){    

	   $cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text).toUpperCase();
			 const type = String(barcodeData.format);
	
			 shop.itemId.query({idCode:code},function (data) {
			 			 	
			 		if (data.length == 0){
			 			alert('The Scaned code is not registered yet');
			 		}
			 		else{
			 			 $scope.readObj = data[0];
						 $scope.whileObj = angular.copy($scope.readObj);
						 $scope.show = true;
			 		}
					 
				 },function(queryerr){
				 	alert(queryerror);
				 });

		  },function(scanerror) {
		  // An error occurred
	   });
    };

}])

.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
	 $timeout(function() {
	   element[0].focus(); 
	 }, 150);
    }
  };
});