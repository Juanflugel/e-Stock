angular.module('eStock.readItem',[])

.controller('readItemCtrl',['$scope','items','$cordovaBarcodeScanner',function ($scope,items,$cordovaBarcodeScanner){

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
	   const code = obj.itemCode;
	   items.idUpdate.update({idCode:code},obj,function(data){
			 console.log('res:',data);
			 $scope.whileObj = angular.copy($scope.readObj);
			 $scope.edit = false;			 	
			 }, function(error){
			 	alert('The item amount was not updated');
			 });
	   
	   //console.log($scope.edit,obj);
    }

    $scope.searchCode = function(){    

	   $cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text);
			 const type = String(barcodeData.format);
			 items.id.query({idCode:code},function (data) {
			 			 	
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