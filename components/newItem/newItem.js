angular.module('eStock.newItem',[])

.controller('newItemCtrl', ['$scope','$cordovaBarcodeScanner','items',function ($scope,$cordovaBarcodeScanner,items){
    
    $scope.obj = {};
    // $scope.ver = true;

    $scope.newCode = function(){    

        $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                const code = String(barcodeData.text);
                const type = String(barcodeData.format);

                    if (code ==''|| null|| undefined) {
                        $scope.ver = false;
                        alert('No Bar Code Scaned');
                    } 
                    else {
                        $scope.obj.itemCode = code;
                        $scope.obj.itemType = type;
                        $scope.ver = true;
                    }                
                
            },function(error) {
            // An error occurred
            });
    };

    $scope.newItem = function(obj){
        // console.log(obj);
        items.id.save(obj,function (data){
            console.log(data);
            $scope.obj = {};
            $scope.ver = false;
            alert('Bar Code Saved');
        },function(error){
            alert('Bar Code not saved');
        });

    }

}])