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
}

function removeWrapper() {
	var group = document.getElementsByTagName('span');
	var fieldset = document.getElementById('custom-restaurants');

	for (var tagCount = 0; tagCount < group.length; tagCount++) {
		if (group[tagCount].className.indexOf('delete') !== -1) {
			addEvent(group[tagCount], 'click', function() {
				fieldset.removeChild(this.parentNode);
			});
		}
	}
}

function createPage() {
	var page = window.open('');
	var location = document.getElementById('location-input').value;
	page.document.write('<!DOCTYPE html><html><head>' +
		'<link rel="stylesheet" type="text/css" href="style.css" /></head><body><h1>' + location + 
		'</h1></body><script type="text/javascript" src="wehoeatmo.js"></script></html>');
}

var labels = document.getElementsByTagName('label');

addEvent(document.getElementById('add-mo'), 'click', addRestaurantField);

for (var i = 0; i < labels.length; i++) {
	createWrapper(labels[i]);
}

removeWrapper();

addEvent(document.getElementById('preview'), 'click', createPage);