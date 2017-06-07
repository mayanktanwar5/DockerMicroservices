var mysql = require('./mysql');
var bcrypt =require('bcrypt');


function registerUser(req,res)
{

	var userData = req.body;
	var email =req.body.email;
	var password = req.body.password;
	var  mobile = req.body.mobile;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var  account_created = mysql.getDate();
	var encrypted = encrypt(req.body.password);
	var table_users_data ={"table":"users_data","data":{"email":email,"password":encrypted}};
	var  table_users_profile = {"table":"users_profile","data":{"email":email,"firstname":firstname,"lastname":lastname,"mobile":mobile,"account_created":account_created}};
	var stringifyData = JSON.stringify(req.body);


	mysql.insertData(function(err,dbres){		
		if(err)
		{
			res.send(err);
			console.log(dbres);

		}
		 else
		{ 
			req.session.user_id = userData.email;
			var user_profile;
			mysql.insertData(function(err,dbres)

			{
			 user_profile="created_profile";
			},table_users_profile);


		res.send({"msg":"user stored successfully",
				"userId": dbres,"user_profile":user_profile	});}

	},table_users_data);
	
}

function loginUser(req,res)
{

	var userData = req.body;
	var stringifyData = JSON.stringify(req.body);
	var user_id=req.body.email;

	mysql.fetchData(function(err,dbres){
		
		if(err)
		{
			throw err;
		}
		else
		{
			if(dbres.length>0)
			{
				
				if(comparePassword(   req.body.password, dbres[0].password))
				{


					
					req.session.user_id = dbres[0].email;
					lastloggedin(dbres[0].email);
					res.send({"msg":"success",
						"userId": dbres	});
				}
				else
				{
					res.send({"msg":"IncorrectPassword"});
				}	
			    
			}
			else
			{
				res.send({"msg":"404"});
			}

		}	

	},userData);
	
}



function lastloggedin(email)
{
	var  lastLoggedIn = "";
	var logged_in_at= mysql.getDate() +" "+ mysql.getCurrentTime();
    var table ="users_profile";
	var data = {"table":table,"column":"email","email":email};
	mysql.fetchUserData(function(err,dbres1){

		if(err)
		{
			throw err;

		}
		else if(dbres1.length>0)
		{

			lastLoggedIn=dbres1[0].logged_in_at;
			var loggedin ={"table":"users_profile","user_id":email,"profile":{"last_logged_in":lastLoggedIn,"logged_in_at":logged_in_at }};
			mysql.updateData(function(err,dbres)
		{

	if(err)
	{
		throw err;
	}
	else 
	{
	}

},loggedin);
		}
	},data);
}


  function canRedirectToHomepage(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.user_id)
	{
		var email = req.session.user_id;
		var table ="users_profile";
		var data ={"email":email,"column":"email","table":table};

		mysql.fetchUserData(function(err,dbres){

			if(err)
				{
					throw err;
				}
				else if(dbres.length>0)
				{
					res.send({"data":dbres[0] });

				}

			

		},data);
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	}
	
};


function logout(req,res)
{
	
	//winston.info(req.session.user_id);
   	req.session.destroy();
   	res.send(true);
		
}

function encrypt(string)
{

return bcrypt.hashSync(string,bcrypt.genSaltSync(10));

}

function comparePassword(string ,dbstring)
{
	return( bcrypt.compareSync(string,dbstring));
}


function createProfile(req,res)
{
var address1 = req.body.address1;
var address2 = req.body.address2;
var country = req.body.country;
var state = req.body.state;
var city = req.body.city;
var zipCode = req.body.zipCode;
var user_id = req.session.user_id;
var birthday =req.body.bday;

var data ={ "table":"users_profile","user_id":user_id,"profile":{"address1":address1,"address2":address2,"birthday":birthday,"country":country,"state":state,"zipcode":zipCode}};

mysql.updateData(function(err,dbres)
{

if(err)
{
	throw err;

}
else 
{

res.send({"msg":"200"});

}
},data);
}


function profile(req,res)
{

	var query = "select p.firstname, p.lastname ,p.account_created, p.birthday, p.country, a.*  from users_profile p , all_advertise a where p.email ='"+req.session.user_id+"' and a.posted_by='"+req.session.user_id+"';"; 

	mysql.fetchAllData(function(err,dbres){

		if(err)
		{
			throw err;
		}
		else if(dbres.length>0)
		{

			res.send(dbres);
		}
		else
		{
			res.send("noData");
		}
		
	},query);
}


function allBought(req,res)
{

	var query = "select p.firstname, p.lastname ,p.account_created,  p.country, a.* ,b.bought_date ,b.quantity from users_profile p , all_advertise a ,items_bought b  where b.id =a.id and p.email='"+req.session.user_id+"' and b.bought_by='"+req.session.user_id+"'";

	mysql.fetchAllData(function(err,dbres){

		if(err)
		{
			throw err;
		}
		else if(dbres.length>0)
		{

			res.send(dbres);
		}
		else
		{
			res.send("noData");
		}
		
	},query);
}
exports.allBought=allBought;
exports.profile=profile;
exports.registerUser=registerUser;
exports.loginUser=loginUser;
exports.canRedirectToHomepage=canRedirectToHomepage;
exports.logout=logout;
exports.createProfile=createProfile;