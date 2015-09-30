// Load data file with ratings
var ratings;
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		//alert(xhr.responseText);
		ratings = JSON.parse(xhr.responseText);
		console.log('Got the file!');
		//alert("ratings: "+ ratings);
	}
}
xhr.open("GET", chrome.extension.getURL('/netflix.json'), true);
//alert(chrome.extension.getURL('/netflix.json'));
xhr.send();


// Load account details
var authKey;// 
var accountID;// 
var xhr2 = new XMLHttpRequest();

xhr2.onreadystatechange = function() {
	if (xhr2.readyState == 4) {
		//alert(xhr.responseText);
		resp = JSON.parse(xhr2.responseText);
		console.log(resp);
		response = resp.shift();
		console.log(response);
		accountID = response.accountid;
		authKey = response.authkey;	
		console.log(authKey + ' '+ accountID);
		//alert("ratings: "+ ratings);
	}
}
xhr2.open("GET", chrome.extenssion.getURL('/account.json'), true);
xhr2.send();


// This is what does the work for a given movie
var tabIds = [];
function rate(movie) {
	//Create url
	url = "http://www.netflix.com/SetRating?value="+movie.rating+"&widgetid=M"+movie.id+"_"+accountID+"&rtrnct=true&authURL="+authKey;
	
	chrome.tabs.create({"url": url, "active": false}, function(tab) {
		console.log("Opened " + tab.id+ "| "+ url);
		tabIds.push(tab.id);
		if (tabIds.length > 10) {
			var tabId = tabIds.shift();
			console.log("Removing " + tabId);
			chrome.tabs.remove(tabId);
		}
	});
}

// The action starts when the extension is clicked
var intervalId;
chrome.browserAction.onClicked.addListener(function() {
	// Try to rate each movie every 5 seconds
	clearInterval(intervalId);
	console.log("hello!");
	intervalId = setInterval(function() { rate(ratings.shift())}, 5000);
});
