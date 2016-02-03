module.exports = function($scope) {
    $scope.message = 'register';

    $scope.registerUser = function($scope, $http){
        console.log("update user was called!");
        http({
            method: 'GET',
            url:'/regi/register'
        })
    }
};