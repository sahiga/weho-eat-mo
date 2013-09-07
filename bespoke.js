var bounds;
var latitude;
var longitude;

function createWrapper(element) {
	var nextElement = element.nextSibling.nextSibling;

	if (nextElement !== null && nextElement.tagName === 'INPUT') {
		var parent = element.parentNode;
		var wrapper = createElement('div', 'wrapper');
		var deleteButton = createElement('span', 'delete');

		parent.replaceChild(wrapper, element);

		appendMultipleChildren(wrapper, [element, nextElement, deleteButton]);
	}
}

function addEvent(object, name, func) {
	if (object.attachEvent) {
		object.attachEvent('on'+name, func);
	} else {
		object.addEventListener(name, func, false);
	}
}

function appendMultipleChildren(parent, childrenArray) {
	for (var child = 0; child < childrenArray.length; child++) {
		parent.appendChild(childrenArray[child]);
	}
}

function createElement(tag, cssClass) {
	var newElement = document.createElement(tag);
	newElement.className = cssClass;

	return newElement;
}

function addRestaurantField() {
	var fieldset = document.getElementById('custom-restaurants');
	var label = document.createElement('label');
	var input = createElement('input', 'restaurant-name');
	var wrapper = createElement('div', 'wrapper');
	var deleteButton = createElement('span', 'delete');

	label.innerHTML = 'Restaurant Name';

	fieldset.appendChild(wrapper);
	appendMultipleChildren(wrapper, [label, input, deleteButton]);

	addEvent(deleteButton, 'click', function() {
		fieldset.removeChild(wrapper);
	});

	if (bounds) {
		restaurantInputSearch(bounds);
	}
}

function removeWrapper() {
	var group = document.getElementsByTagName('span');
	var fieldset = document.getElementById('custom-restaurants');

	/*checkClass(group, 'delete',
		addEvent(this, 'click', function(parentOfGroup) {
			console.log(parentOfGroup)
			parentOfGroup.removeChild(this);
		}), fieldset);

*/	for (var tagCount = 0; tagCount < group.length; tagCount++) {
		if (group[tagCount].className.indexOf('delete') !== -1) {
			addEvent(group[tagCount], 'click', function() {
				fieldset.removeChild(this.parentNode);
			});
		}
	}
}

function checkClass(elementList, classToCheck, callback, callbackParams) {
	for (var count = 0; count < elementList.length; count++) {
		if (elementList[count].className.indexOf(classToCheck) !== -1) {
			console.log(callbackParams);
			callback.call(elementList[count], callbackParams);
		}
	}
}

function createPage() {
	var page = window.open('');
	var location = document.getElementById('location-input').value.split(', ')[0];
	var inputList = document.getElementsByTagName('input');
	var restaurants = [];
	var count = 0;

	page.document.write(
		'<!DOCTYPE html><html><head>' +
		'<link rel="stylesheet" type="text/css" href="style.css" /></head><body><h1>' + location + 
		' Eat Mo</h1><h2>Help me pick a restaurant!</h2><div class="spinner"><ol id="restaurant-list">' +
		'<li>???</li>');

	for (count = 0; count < inputList.length; count++) {
		if (inputList[count].className.indexOf('restaurant-name') !== -1 && inputList[count].value.length > 0) {
			restaurants.push(inputList[count].value.split(', ')[0]);
		}
	}

	for (count = 0; count < restaurants.length; count++) {
		page.document.write('<li>' + restaurants[count] + '</li>');
	}

	page.document.write('</ol></div>' +
		'<button id="pick-restaurant">Tell me where to go</button>' +
		'<footer><p>Built with <a href="http://www.wehoeatmo.com">WeHo Eat Mo</p></footer>' +
		'<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true"></script>' +
		'</body><script type="text/javascript" src="wehoeatmo.js"></script>' +
		'<script>spin(new google.maps.LatLng(' +  latitude + ', ' + longitude + '))</script></html>');


}

function getCity() {
	var placeInput = document.getElementById('location-input');
	var placeOptions = {
		types: ['(cities)'],
		componentRestrictions: {country: 'us'}
	};

	var autocompletePlace = new google.maps.places.Autocomplete(placeInput, placeOptions);

	google.maps.event.addListener(autocompletePlace, 'place_changed', function() {
		var place = autocompletePlace.getPlace();

		console.log('bazooka');

		if (place.geometry.location) {
			console.log('boo');
			bounds = new google.maps.LatLngBounds();
			bounds.extend(place.geometry.location);
			restaurantInputSearch(bounds);
		}

		latitude = place.geometry.location.lat();
		longitude = place.geometry.location.lng();
	})
}

function restaurantInputSearch(cityBounds) {
	var restaurantNames = document.getElementsByTagName('input');

	var restaurantOptions = {
		types: ['establishment'],
		bounds: cityBounds
	}

	for (var count = 0; count < restaurantNames.length; count++) {
		if (restaurantNames[count].className.indexOf('restaurant-name') !== -1) {
			var autocompleteRestaurant = new google.maps.places.Autocomplete(restaurantNames[count], restaurantOptions);
			
		}
	}
}

var labels = document.getElementsByTagName('label');

addEvent(document.getElementById('add-mo'), 'click', addRestaurantField);

for (var i = 0; i < labels.length; i++) {
	createWrapper(labels[i]);
}

removeWrapper();

addEvent(document.getElementById('location-input'), 'click', getCity);

addEvent(document.getElementById('preview'), 'click', createPage);