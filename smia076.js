var pageContent
var homeContent
var shopHTML
var NewsHTML
var MapHTML
var gBookHTML
//store all page HTML string
(function (){
	pageContent = document.getElementById('bodyContent')
	homeContent = document.getElementById('homeContent')
	shopHTML = document.getElementById('Shop')
	NewsHTML = document.getElementById('News')
	MapHTML = document.getElementById('Map')
	gBookHTML = document.getElementById('guestBook')
}())


function homePage(){
	pageContent.innerHTML = homeContent.innerHTML
}

function shopPage(){
	pageContent.innerHTML = shopHTML.innerHTML
	items();
}

function newsPage(){
	news()
}

function mapPage(){
	pageContent.innerHTML = MapHTML.innerHTML
	map()
}

function gBookPage(){
	pageContent.innerHTML = gBookHTML.innerHTML
}


//Shows News page function
function showNews(data){
	var discription = []
	var img = []
	console.log(data)
	pageContent.innerHTML = NewsHTML.innerHTML
	for (var i = 0; i < data.length; i++){
		var HTMLString = "<div class='newsContent'>"
		HTMLString += "<img class='newsImg' src='" + data[i].enclosureField['urlField'] + "'>"
		HTMLString += "<a class = 'newsTitle'href='"
		HTMLString += data[i].linkField + "' target='_blank'>" + data[i].titleField + "</a>"
		HTMLString += "<div class'newsDis'>"+ data[i].descriptionField + "</div>"
		HTMLString += "</div>"

		pageContent.innerHTML += HTMLString
	}
	 
	
}
//fetch news Data
function news(){
const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news',
	{headers : {
		"Accept": "application/json",}
		,});

const streamPromise = fetchPromise.then((response) => response.json());

streamPromise.then((data) => showNews(data));
}

//shows Map
function map(){
	const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard',
		{headers : {
			"Accept": "application/json",}
			,});

	const streamPromise = fetchPromise.then((response) => response.text());

	streamPromise.then((data) => showMap(data));
}

function showMap(data){

	var arr = data.split('\n')
	var addressArr = []

	//gets address of the location
	addressArr.push(arr[2].split(':')[1])
	addressArr.push("Telephone:" + arr[3].split(':')[1])
	addressArr.push(arr[4].split(";;")[1].split(";"))
	addressArr.push(arr[5])

	HTML = ""
	for(var i = 0; i < addressArr.length; i++){
		if(i == 2){
			HTML += "<div id='itemsList'>"
			for(k of addressArr[i]){
				HTML += k + " "
			}
			HTML += "</div>" 
		}
		else{
		HTML += "<div>" + addressArr[i] + "</div>"
}
	}
	pageContent.innerHTML += HTML
}

//shows items

function showItems(data){
	console.log(data)
	HTML = "<div id='itemsList'>"
	for(i of data){
		HTML += "<div class='item'>"
		HTML += "<div class='itemTitle'>" + i.Title + "</div>"
		HTML += "<img class='shopItem' src='http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=" + i.ItemId +"'>"
		HTML += "<div class='price'>" + '&#36;' + i.Price + "</div>"
		HTML += "</div> <hr>"
	}
	HTML += "</div>"
	pageContent.innerHTML += HTML
}

//fetch items data
function items(){
	const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items',
			{headers : {
				"Accept": "application/json",}
				,});

	const streamPromise = fetchPromise.then((response) => response.json());
	streamPromise.then((data) => showItems(data));
}
// search bar

function searchProduct(){
	var text = document.getElementById("shopSearch").value
	const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term=' + text,
			{headers : {
				"Accept": "application/json",}
				,});
	const streamPromise = fetchPromise.then((response) => response.json());
	streamPromise.then((data) => showSearchitem(data));

}

function showSearchitem(data){
	itemContent = document.getElementById('itemsList')
	HTML = ""
	for(i of data){
		HTML += "<div class='item'>"
		HTML += "<div class='itemTitle'>" + i.Title + "</div>"
		HTML += "<img class='shopItem' src='http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=" + i.ItemId +"'>"
		HTML += "<div class='price'>" + '&#36;' + i.Price + "</div>"
		HTML += "</div> <hr>"
	}
	itemContent.innerHTML = HTML 
}

//guest book

function postMessage(){
	var name = document.getElementById("guestName").value;
	var message = document.getElementById("message").value;
	if(message === ""){
		alert("please enter something")
		return;
	}

	fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name="+name,{
		method: 'POST',
		headers:{
			'Content-Type': "application/json",
		},
		body: JSON.stringify(message)
	})
	//delay 1 second after post message then shows the new guest book page
	setTimeout(showPostMessage, 1000)
	
}

function showPostMessage(){
	document.getElementById('guestMessage').innerHTML = "<object id='commentBox' type='text/html' data='http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments'></object>"
}