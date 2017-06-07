myApp.controller("userHomeController",['$scope','$http','$state','$stateParams' ,'isLoggedIn', function($scope,$http,$state,$stateParams,isLoggedIn ){

$scope.showLoggedIn=true;
console.log("I am in controller userHome");
console.log(" isLoggedIn === "+isLoggedIn);
console.log(" isLoggedIn === "+JSON.stringify(isLoggedIn));
var userData = isLoggedIn.data.data;
$scope.username=userData.firstname;
$scope.useremail=userData.email;
console.log("username "+isLoggedIn.data.msg);
$scope.lastloggedin= userData.last_logged_in;
$scope.atHome = true;

console.log(" params"+JSON.stringify(isLoggedIn.data.msg));



$http.post('/alladvertise').success(function(res){

console.log("JSON  "+JSON.stringify(res));
$scope.advertisement= res;
var x =res[0].posted_date;
console.log(x.substring(0,9));
dt = new Date (res[0].posted_date);
console.log("posted date ========> "+dt );
console.log(" valid till ========> "+ $scope.addDays(res[0].posted_date,-1));
//var y = addDays(res[0].posted_date,4);
var d= new Date();
console.log(" valid today =======> "+ ($scope.currentDate()< y));


});

$scope.currentDate = function()
{

	return new Date();
}


$scope.checkWon =function(adv)
{

	if(adv.auctionPrice)
	{

		if(adv.bid_price)
		{
			return false;
		}
		else
		{
			return true;
		}

	}

}


$scope.buyItem = function (adv)
{

$state.go("buy",{"data":{'advertise':adv,'user':isLoggedIn }});


} 

$scope.bidPrice =function(adv)
{

console.log("all the bids items "+JSON.stringify(adv));
var bid_price =$scope.bid;
console.log(" bid price"+$scope.adv);
$state.go("bid",{"adv":{'advertise':adv,'user':isLoggedIn ,'bid_price':bid_price}});

}

$scope.goToCart = function(){

	$state.go("myCart");
}

$scope.userLogout= function(){


	$http.post('/logout').success(

		function(res)
		{
			$state.go("home");
		}

		)

	//console.log(auth.logout());
}		

}]);


