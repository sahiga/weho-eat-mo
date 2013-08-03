var restaurants = document.getElementsByTagName('li');
var button = document.getElementById('pick-restaurant');
var restaurantList = document.getElementById('restaurant-list');
var restaurantsLen = restaurants.length;
var random;
var choice;
var choiceName;
var restMap;
var service;
var marker;
var place;
var request;
var weho = new google.maps.LatLng(34.092047,-118.361906);


function getRandom() {
	return Math.floor(Math.random() * (restaurantsLen - 1));
}

function spin() {
	for (var i = 0; i < restaurants.length; i++) {
		if (restaurants[i].innerHTML.length > 25) {
			restaurants[i].style.fontSize = '0.8em';
		}
	}
	
	button.onclick = function() {
		random = getRandom();
		choice = -1 * (random * 100);
		restaurantList.style['-webkit-transform'] = 'translateY(' + choice + 'px)';
		choiceName = restaurants[random].innerHTML;
		
		createMap(choiceName);
	}
	
}

function createMap() {		
	if (document.getElementById('map') === null) {
		var mapDiv = document.createElement('div');
		mapDiv.id = 'map';
		document.body.insertBefore(mapDiv, button.nextSibling);
	}
	
	mapIt(choiceName);
}

function mapIt(choiceName) {
	
	restMap = new google.maps.Map(document.getElementById('map'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: weho,
		zoom: 15
	});

	request = {
		location: weho,
		radius: '500',
		query: choiceName
	};
	
	service = new google.maps.places.PlacesService(restMap);
	service.textSearch(request, mapCallback);
}

function mapCallback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		window.setTimeout(function() {
			createMarker(results[0]);
		}, 2000);
	}
}

function createMarker(place) {
	restMap.setCenter(place.geometry.location);

	marker = new google.maps.Marker({
		position: place.geometry.location,
		map: restMap,
		title: choiceName
	});
	
	var infowindow = new google.maps.InfoWindow({
		content: '<img src="' + place.icon + '"/>' + '<p class="title">' + place.name + '</p>'
			+ '<p>' + place.formatted_address + '</p>',
		maxWidth: 200
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(restMap, marker);
	});
}

spin();