angular.module('eStock.orders',[])

.controller('ordersCtrl',['$scope','shop','handleProjects',function ($scope,shop,handleProjects) {

	console.log('orders controller working');
	$scope.companyId = 'RMB01';
	var query = {};
	query.companyId = $scope.companyId;
	query.orderState ='open';
	shop.orders.query(query,function (data){
		$scope.orderList = data;
	},function (error){});

	$scope.passOrder = function(order){
		handleProjects.passOrder(order);
	};

}])

.controller('itemsOrderCtrl',['$scope','shop','handleProjects','$state',function ($scope,shop,handleProjects,$state){

	$scope.companyId = 'RMB01';
	$scope.currentOrder = handleProjects.getCurrentOrder();
	$scope.allItemsInOrder = $scope.currentOrder.orderedItems;
	console.log($scope.allItemsInOrder);

	$scope.itemsOrderList = _.reject($scope.allItemsInOrder,function (item){ // se descartan los items que ya estan insertados
		return item.isDelivered == true; // de alguna forma los escope sigen vinculados
	});

	if($scope.itemsOrderList.length ===0){
		$scope.hideButton = true;
	}

	$scope.updateFilter = function(){
		$scope.delivereditems = _.filter($scope.itemsOrderList,function (item){
			return item.isDelivered === true;
		});
	};

	$scope.callDeliveredItems = function(){		
		var itemsArray = shop.resumeCodeAndOrderedAmount($scope.delivereditems);
		console.log(itemsArray);
		var query = {};
		query.companyId = $scope.companyId;
		query.orderNumber = $scope.currentOrder.orderNumber;
		shop.ordersUpdate.update(query,$scope.allItemsInOrder,function (data){
			console.log('alles gut');
			var query1 ={};
			query1.companyId = $scope.companyId;
			console.log(query1);
			shop.itemIncrement.update(query1,itemsArray,function (data){
					alert(data.answer);
					$state.go('app.orders');
			},function (error){});
			
		},function (error){})
	}
}]);