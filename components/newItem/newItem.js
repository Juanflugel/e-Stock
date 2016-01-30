angular.module('eStock.newItem',[])

.controller('newItemCtrl', ['$scope','$cordovaBarcodeScanner','items',function ($scope,$cordovaBarcodeScanner,items){
    
    $scope.obj = {};


    $scope.newCode = function(){

        console.log('que mierda');
            

        $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                const code = String(barcodeData.text);
                const type = String(barcodeData.format);
                $scope.obj.itemCode = code;
                $scope.obj.itemType = type;
                $scope.ver = true;

            },function(error) {
            // An error occurred
            });
    };

    $scope.newItem = function(obj){
        console.log(obj);
        items.id.save(obj,function (data){
            console.log(data);
            $scope.obj = {};
        });

    }


        

        


}])