angular.module('eStock.readItem',[])

.controller('readItemCtrl',['$scope','shop','$cordovaBarcodeScanner','$localstorage',function ($scope,shop,$cordovaBarcodeScanner,$localstorage){

	// shop.itemId.query({itemCode:"22.400.00.00.26-C"},function (data){
	// 	$scope.readObj = data[0];
	// });
	// }, false);
	// $scope.show = true;

	var firmaId = "RMB01";

	$scope.actualUser = $localstorage.getObject('currentUser');
	console.log($scope.actualUser);

    //$scope.whileObj = {}; // temporary objecto to keep the amount from query in case the user delete the amount
    // green arrow to come back from edition and reestablish the amount
    $scope.back = function(){                
    	$scope.edit = false;        
    }

    $scope.editAmount = function() {
    	$scope.edit = true;
    }

    $scope.updateAmount = function(obj){
    	console.log(obj);
    	obj.itemAmount = obj.itemAmount + obj.plusAmount;
    	obj.itemLastPerson = $scope.actualUser;
    	obj.itemLastPerson.insertedAmount = obj.plusAmount;
    	console.log(obj);
    	const code = obj.itemCode;
    	shop.itemUpdate.update({itemCode:code},obj,function(data){
    		console.log('res:',data);
    	// 	$scope.whileObj = angular.copy($scope.readObj);
    		$scope.edit = false;
    		alert( 'neue Menge : '+ obj.itemAmount +"\n" + obj.itemLastPerson.userName);
    			 	
    	}, function(error){
    		alert('The item amount was not updated');
    	});
    	
	   //console.log($scope.edit,obj);
	}

	$scope.searchCode = function(){    

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			// inicializacion de variables para construir los queries
			const patron = new RegExp('/');
			const code = String(barcodeData.text).toUpperCase();
			const type = String(barcodeData.format);
				var codeR = '';
				var amountL = 0;
			
			// verificar la existencia de un codigo
			if (code ==''|| null|| undefined) {
				$scope.show = false;
				alert('No Bar Code Scaned');
			}
			// verificar si el codigo viene con una cantidad 
			else if (patron.test(code)){
				var n = code.search(patron);
				codeR = code.slice(0,n);
				amountL = code.slice(n+1,code.length);
				// alert(amountL);
				// amountL = code.slice(n+1,code.length-1);
				//;

				shop.itemId.query({itemCode:codeR,companyId:firmaId},function (data) {
					
					if (data.length == 0){
						alert('The Scaned code is not registered yet');
					}
					else{
						$scope.readObj = data[0];
						$scope.readObj.plusAmount = parseInt(amountL);
						// $scope.whileObj = angular.copy($scope.readObj);
						$scope.show = true;
					}
					
					
				},function (err){
					alert(err);
				});
			} 
			else{ // en caso de que solo venga el codigo
				
				shop.itemId.query({itemCode:code,companyId:firmaId},function (data) {
					
					if (data.length == 0){
						alert('The Scaned code is not registered yet');
					}
					else{
						$scope.readObj = data[0];
						// $scope.whileObj = angular.copy($scope.readObj);
						$scope.show = true;
					}
					
					
				},function (queryerr){
					alert(queryerr);
				});
			}
			

		},function (scanerror) {
			alert(scanerror);
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