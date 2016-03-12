angular.module('eStock.newItem',[])

.controller('newItemCtrl', ['$scope','$cordovaBarcodeScanner','shop',function ($scope,$cordovaBarcodeScanner,shop){
    
    $scope.obj = {};
    // $scope.ver = true;

    $scope.newCode = function(){    

        $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                const code = String(barcodeData.text).toUpperCase();
                const type = String(barcodeData.format);

                    if (code ==''|| null|| undefined) {
                        $scope.ver = false;
                        alert('No Bar Code Scaned');
                    } 
                    else {
                        $scope.obj.itemCode = code;
                        $scope.obj.itemCodeType = type;
                        $scope.ver = true;
                    }                
                
            },function(error) {
            // An error occurred
            });
    };

    $scope.newItem = function(obj){
        // console.log(obj);
        shop.itemId.save(obj,function (data){
            console.log(data);
            $scope.obj = {};
            $scope.ver = false;
            alert('Bar Code Saved');
        },function(error){
            alert('Bar Code not saved');
        });

    }

}])