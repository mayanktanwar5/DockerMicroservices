var mysql = require('./mysql');
var fs = require('fs');
var logger1 = require("../logger/logger");

function newAdvertise(req,res)
{

	var table ="all_advertise";
	var  itemName = req.body.itemName;
	var category = req.body.category;
	var description = req.body.description;
	var auctionPrice = req.body.auctionPrice;
	var fixedPrice =req.body.fixedPrice;
	var fixedQuantity =req.body.fixedQuantity;
	var date = mysql.getDate();
	var time = mysql.getCurrentTime();
	var posted_by = req.session.user_id;
	var posted_date =date+" "+time;
	var id = posted_by+date+" "+time;
	logger1.stream.write({"user":req.session.user_id,"action":"add new sale item"});
	data ={"table":table ,"data":{"id":id,"itemName":itemName,"category":category,"description":description,"auctionPrice":auctionPrice,"fixedPrice":fixedPrice,"fixedQuantity":fixedQuantity,"posted_by":posted_by,"posted_date":posted_date}};

	mysql.insertData(function(err,dbres){
			if(err)
			{

			}
			else
			{
			res.send({"msg":"success"});
			}
	},data);

}

function alladvertise(req,res)
{
	var query ="select a.* , u.firstname , u.lastname from all_advertise a ,users_profile u where a.bought_by IS NULL and a.posted_by = u.email ;";
	mysql.fetchAllData(function(err,dbres){

			if(err)
			{

				throw err;
			}
			else if(dbres.length>0)
			{
				checkBiddingClosed(dbres);	
				res.send(dbres);
			}

	},query);
}

function bid(req,res )
{

	logger1.stream.write({"user":req.session.user_id,"action":"bid Items "});
	var bidData= req.body;
	var date =mysql.getDate();
	var timestamp =date+" "+mysql.getCurrentTime();
	finalbidData ={"adv_id":bidData.adv_id,"adv_item":bidData.adv_item,"adv_desc":bidData.adv_desc,"bid_by":bidData.bid_by,"bid_price":bidData.bid_price,"bid_date":date,"auction_price":bidData.auction_price,"posted_by":bidData.posted_by,"bid_open":"open"};
	var bidlogData ={"timestamp":timestamp,"user-bid-details":finalbidData};
	mysql.insertData(function(err,dbres){

		console.log("insert database" );
		if(err)
		{
			console.log(err);
		}
		else
		{

		fs.appendFile("./userTracking/bid.txt", JSON.stringify(bidlogData), function(err) {
    	if(err) {
        return console.log(err);
    	}
    	  console.log("The file was saved!");
		}); 	

		res.send({"msg":"success","data":dbres });
		}

	},{"table":"all_bids","data":finalbidData})

}


function myBids(req,res)
{

	var email= req.session.user_id;
	var bid_by ="'"+email+"'";	
	var query ="select a.* ,b.bid_price as mybid   ,b.bid_by as bidder,b.bid_date from all_bids b , all_advertise a where a.id = b.adv_id and b.bid_by = "+bid_by;
	
	mysql.fetchAllData(function(err,dbres){

			if(err)
			{

				throw err;
			}
			else if(dbres.length>0)
			{
				res.send(dbres);
			}

	},query);

}

function checkBiddingClosed(dbres)
{

for (db in dbres)
{
 
	if(!addDays(dbres[db].posted_date,1))
	{

		getMaxBid(dbres[db].id);
		closeAdv(dbres[db].id);

	}
}

}


function getMaxBid(id)
{

var query  = "select bid_by , bid_price ,adv_id from all_bids where bid_price =(select max(bid_price)  from all_bids where adv_id ='"+id+"' group by(adv_id) ) and adv_id ='"+id+"';";
mysql.fetchAllData(function(err,dbres){

if(err)
{

	throw err;
}
else if(dbres.length>0)
{
	setMaxBid(dbres[0]);
}


},query);


}


function setMaxBid(bid)
{

var updateData = [{"bid_price":bid.bid_price,"bid_by":bid.bid_by},{"id":bid.adv_id},{"id":bid.adv_id}];
var query ="UPDATE all_advertise SET  ? WHERE ? ";
var data = {"query":query,"update":updateData};

mysql.updateAllData(function(err,dbres){

if(err)
		{
			throw err;
		}

	},data);
 

}



function closeAdv(id)

{

	var updateData=[{"bid_open":"close"},{"adv_id":id}];
	var query ="UPDATE all_bids SET  ? WHERE ? ";
	var data ={"query" :query,"update":updateData};
	mysql.updateAllData(function(err,dbres){

if(err)
		{
			throw err;
		}
		

	},data)


}


function addDays (date, days) {
    var result = new Date(date);
    var currentDate = new Date();
    result.setDate(result.getDate() + days);
    return currentDate<result;
}



exports.newAdvertise=newAdvertise;
exports.alladvertise=alladvertise;
exports.bid=bid;
exports.myBids=myBids;