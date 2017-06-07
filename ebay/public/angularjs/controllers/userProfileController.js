myApp.controller("userProfileController",['$scope','$http','$state','$stateParams','isLoggedIn',
	function($scope,$http,$state,$stateParams,isLoggedIn){

console.log("Hello from userProfile Controller");


var userData = isLoggedIn.data.data;
$scope.username=userData.firstname;
$scope.showProfile=true;



$http.post('/profile').success(function (res) {
	
	if(res =="noData")
	{
	console.log("response "+res);
	$scope.totalItems =0;
	}
	else
	{
		console.log("response "+JSON.stringify(res));
	$scope.userProfileData=res[0];
	$scope.userSaleData=res;

	$scope.totalItems =res.length;
	console.log("  length"+res.length);
	}

}).error(function (err) {
	

	console.log(err);
});


$scope.showItems = function(item)
{
if(item=='all')
{
	$scope.allauctions=false;
	$scope.allBuy=false;
	$scope.allsale=true;
	$scope.selectedall='buttonSelected';
	$scope.selectedbuy=false;
	$scope.selectedauc=false;
}
else if(item=="auctions")
{

	$scope.allauctions=true;
	$scope.allBuy=false;
	$scope.allsale=false;
	$scope.selectedauc='buttonSelected';
	$scope.selectedall=false;
	$scope.selectedbuy=false;
	
}
else if(item =='buyItem')
{

	$scope.allauctions=false;
	$scope.allBuy=true;
	$scope.allsale=false;
	$scope.selectedbuy='buttonSelected';
	$scope.selectedall=false;
	$scope.selectedauc=false;
}

}
$scope.showAll = function()
{
	$scope.showProfile=false;
	$scope.showSale = true;
}





	$scope.userLogout= function(){


	$http.post('/logout').success(

		function(res)
		{
			$state.go("home");
		}

		)
		}

	}]);