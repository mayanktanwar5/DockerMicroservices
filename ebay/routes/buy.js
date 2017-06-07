var mysql =require('./mysql');
var logger1 = require("../logger/logger");

function addToCart(req,res)
{

var email = req.body.email;
var adv_id = req.body.adv_id;
var quantity = req.body.quantity;

logger1.stream.write({"user":req.session.user_id,"action":"add Items to cart"});
var table_cart ={"table":"cart","data":{"email":email,"adv_id":adv_id,"quantity":quantity}};

mysql.insertData(function(err,dbres){

if(err)
{
throw err;
}
else
{

res.send({"msg":"success"});

}
},table_cart)

}

function checkItemAvailable(adv_id){

var  query= "select * from all_advertise where  id = '"+adv_id+"' and bought_by IS NULL";
var status ;
mysql.fetchAllData(function(err,dbres){


if(err)
{

	throw err;
}
else if (dbres.length>0)

{

status = true;
}
else
{
	status= false;
}

},query);

return staus;

};



function showCart(req, res)
{

	logger1.stream.write({"user":req.session.user_id,"action":"showCart Item"});

	var query ="select a.itemName ,a.id ,a.description,a.fixedQuantity ,c.quantity ,a.fixedPrice from cart c , all_advertise a where a.id = c.adv_id  and c.email = '"+req.session.user_id+"'";


	mysql.fetchAllData(function(err,dbres){

			if(err)
{

	throw err;
}
else if (dbres.length>0)

{

res.send(dbres);
}
else if(dbres.length<=0)
{

	res.send("NoItems");
}

	},query)

}


function removeCartItem(req,res)

{
	logger1.stream.write({"user":req.session.user_id,"action":"Remover Cart item"});
  var query = "delete from cart where adv_id= '"+req.body.id+"' and email ='"+req.body.email+"'";


  mysql.fetchAllData(function(err,dbres){

  	if(err)
  	{
  		throw err;

  	}
  	else 
  	{

  		res.send({"msg":"success"});
  	}

  },query)

}

function deleteCartItem(req ,id)

{

  var query = "delete from cart where adv_id= '"+id+"' and email ='"+req+"'";


  mysql.fetchAllData(function(err,dbres){

  	if(err)
  	{
  		throw err;

  	}
  	else 
  	{

  		//	res.send(dbres);
  	}

  },query)

}

function allCart(req ,res)
{


var query ="select a.itemName ,a.id ,c.email,a.description,a.fixedQuantity ,c.quantity,a.fixedPrice from cart c , all_advertise a where a.id = c.adv_id  and c.email = '"+req.session.user_id+"'";
//var data ;

	 
	mysql.fetchAllData(function(err,dbres){

	if(err)
		{

			throw err;
		}
		else if (dbres.length>0)

		{

		allCartItem(req,dbres);

		res.send("success");
		}
		else if(dbres.length<=0)
		{

			//res.send("NoItems");
		}

			},query)
			//console.log("I am data data data ======"+data);
			//return data;

		}



function allCartItem(req,dbres)
{

	for(db in dbres)
	{
		var updatedQuantity = dbres[db].fixedQuantity -dbres[db].quantity;
		updateCart(dbres[db].email,dbres[db].id,dbres[db].quantity,updatedQuantity)		
	}



}





function buyItem(req,res)
{

 var updateData;
	logger1.stream.write({"user":req.session.user_id,"action":"boughtItem","item_id":req.body.item.id});

	if(req.body.item.updatedQuantity<=0)
	{
		updateData=	[{"bought_by":"sold","fixedQuantity":req.body.item.updatedQuantity},{"id":req.body.item.id}];
	}

	else if(req.body.item.updatedQuantity>0)
	{

		updateData=	[{"fixedQuantity":req.body.item.updatedQuantity},{"id":req.body.item.id}];

	}

 var query ="UPDATE all_advertise SET  ? WHERE ? ";
 var data = {"query":query,"update":updateData};



mysql.updateAllData(function(err,dbres){



		if(err)
				{
					throw err;

				}
				else 
				{
				setItemsBought(req.session.user_id,req.body.item.id,req.body.item.boughtQuantity,req.body.item.updatedQuantity)
				res.send("success");
				
				}

	},data);
}



function getItem (req ,res)
{


var query = "select * from all_advertise where id ='"+req.id+"'";

mysql.fetchAllData(function(err,dbres){

if(err)

{

	throw err;
}
else if(dbres.length>0)
{
	res.send(dbres);
}


},query)

}



function updateCart(req,id,boughtquantity,updatedQuantity)
{
	var updateData

	if(updatedQuantity<=0)
	{


	updateData=	[{"bought_by":"sold","fixedQuantity":updatedQuantity},{"id":id}];
	}

	else if(updatedQuantity>0)
	{

		updateData=	[{"fixedQuantity":updatedQuantity},{"id":id}];
	}



	 
 //var updateData = [{"bid_price":bid.bid_price,"bid_by":bid.bid_by},{"id":bid.adv_id},{"id":bid.adv_id}];
var query ="UPDATE all_advertise SET  ? WHERE ? ";
 var data = {"query":query,"update":updateData};



	mysql.updateAllData(function(err,dbres){



		if(err)
				{
					throw err;
					console.log("ja nahi raha bhai close advertisement sql p");
				}
				else 
				{
				setItemsBought(req,id,boughtquantity,updatedQuantity);
				deleteCartItem(req,id);
				}

	},data);
}


function setItemsBought(req,id,boughtquantity,updatedQuantity)
{


var table_cart ={"table":"items_bought","data":{"id":id,"bought_by":req,"quantity":boughtquantity,"bought_date":mysql.getDate()}};

mysql.insertData(function(err,dbres){



},table_cart);

}


exports.getItem=getItem;
exports.buyItem =buyItem;
exports.allCart=allCart;
exports.addToCart=addToCart;
exports.showCart=showCart;
exports.removeCartItem=removeCartItem;