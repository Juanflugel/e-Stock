angular.module('eStock.readItem',[])
.controller('readItemCtrl',['$scope','items','$cordovaBarcodeScanner',function ($scope,items,$cordovaBarcodeScanner){

    $scope.editAmount = function(){
        console.log('funciona');
        $scope.edit = true;
    }

    $scope.updateAmount = function(obj){
        console.log(obj);
        const code = obj.itemCode;
        items.idUpdate.update({idCode:code},obj,function(data){
                console.log('res:',data);
        });
        
        $scope.edit = false;
    }


    $scope.searchCode = function(){    

        
        $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                const code = String(barcodeData.text);
                const type = String(barcodeData.format);
                items.id.query({idCode:code},function (data){
                $scope.readObj = data[0];
                $scope.show = true;
                });

            },function(error) {
            // An error occurred
        });
    };
    
    

    


}]);