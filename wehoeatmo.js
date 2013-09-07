// Initialize restaurant and map variables
var restaurants = document.getElementsByTagName('li');
var button = document.getElementById('pick-restaurant');
var restaurantList = document.getElementById('restaurant-list');
var numRestaurants = restaurants.length;
var random;
var choice;
var choiceName;
var restMap;
var service;
var marker;
var place;
var request;

// Main function: this is called at the end of the script
function spin(city) {
	// Reduce font size for restaurants with long names
	reduceFontSize(restaurants);

	button.onclick = function() {	
		// When the button is clicked, pick a random number, translate that number into
		// a negative pixel count (each li element is 100 pixels tall, and the negative
		// indicates that the ul element should be moved up instead of down), and
		// slide the ul element upward by the chosen amount
		random = getRandom(numRestaurants);
		choice = -1 * (random * 100);
		restaurantList.style['-webkit-transform'] = 'translateY(' + choice + 'px)';
		restaurantList.style['-moz-transform'] = 'translateY(' + choice + 'px)';
		restaurantList.style['-ms-transform'] = 'translateY(' + choice + 'px)';
		restaurantList.style['-o-transform'] = 'translateY(' + choice + 'px)';
		restaurantList.style['transform'] = 'translateY(' + choice + 'px)';

		// Grab the name of the chosen restaurant
		choiceName = restaurants[random].innerHTML;
		
		// Look up the chosen restaurant in the given city on the map		
		createMap(choiceName, city);
	}
	
}

// Reduce font size to 0.8em for array members longer than 25 characters
function reduceFontSize(array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].innerHTML.length > 25) {
			array[i].style.fontSize = '1.5em';
		}
	}
}

// Choose a random number within the provided range
function getRandom(range) {
	return Math.floor(Math.random() * (range - 1));
}

function createMap(choiceName, city) {
	// Create the map if it does not exist	
	if (document.getElementById('map') === null) {
		var mapDiv = document.createElement('div');
		mapDiv.id = 'map';
		document.body.insertBefore(mapDiv, button.nextSibling);
	}
	
	// Display the chosen restaurant on the map 
	mapIt(choiceName, city);
}

function mapIt(choiceName, city) {
	// Default to West Hollywood if the city is not provided
	if (typeof city === 'undefined') {
		var city = new google.maps.LatLng(34.092047,-118.361906);
	}

	// Create a new Google Map for the provided city
	restMap = new google.maps.Map(document.getElementById('map'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: city,
		zoom: 15
	});

	// Make a request object based on the chosen restaurant
	request = {
		location: city,
		radius: '500',
		query: choiceName
	};
	
	// Perform a Place Search based on the request
	service = new google.maps.places.PlacesService(restMap);
	service.textSearch(request, mapCallback);
}

function mapCallback(results, status) {
	// If the Place Search finds a result, create a marker for the result after a delay
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		window.setTimeout(function() {
			createMarker(results[0]);
		}, 2000);
	}
}

function createMarker(place) {
	// Reset the center of the map to the location of the restaurant
	restMap.setCenter(place.geometry.location);

	// Display a marker at the location of the restaurant
	marker = new google.maps.Marker({
		position: place.geometry.location,
		map: restMap,
		title: choiceName
	});
	
	// Create an information window for the marker with the restaurant's name and address
	var infowindow = new google.maps.InfoWindow({
		content: '<img src="' + place.icon + '"/>' + '<p class="title">' + place.name + '</p>'
			+ '<p>' + place.formatted_address + '</p>',
		maxWidth: 200
	});
	
	// Open the information window when the marker is clicked
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(restMap, marker);
	});
}

// Call spin() to get this script rolling!
// spin();