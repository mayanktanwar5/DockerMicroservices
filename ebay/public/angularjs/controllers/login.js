myApp.controller("loginController",['$scope','$http','$state','$stateParams' ,function($scope,$http,$state,$stateParams){

console.log("Hello from controller  login");

$scope.userLogin =function(){

console.log(JSON.stringify($scope.user));
console.log($scope.user.email);

$http.post('/login',$scope.user).success( function(res)
{
	
	if(res=="404")
	{

		$scope.loginError =true;
		$scope.incorrectPassword = false;
	}

	else if(res.msg=="success")
	{
		console.log("response" +JSON.stringify(res));
		$state.go("userHome" );

	}
	else if(res.msg=="IncorrectPassword")
	{
		$scope.incorrectPassword = true;
	}
	
	
}).error(function(err)
{
	console.log("error "+err);
	});
}





}])