var beaches = [];
var count = $("#totalLocations li").length;
console.log("count : "+count);
for(var i = 1;i <= count; i++){
	var singledata = [];
	var lat=($("ul li:nth-child("+i+") #inputUserlat").val());
	var long=($("ul li:nth-child("+i+") #inputUserlong").val());
	var add=$("ul li:nth-child("+i+") #inputUseradd").val();
	console.log("add : "+add);
	console.log("add : "+lat);
	console.log("add : "+long);
	singledata.push(add);
	singledata.push(lat);
	singledata.push(long);
	beaches.push(singledata)
}
if (navigator.geolocation) {
	var markers = [];
	// Get current position
	navigator.geolocation.getCurrentPosition(function (position) {
		var singledata = [];
		//myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var lat=position.coords.latitude;
		var long=position.coords.longitude;
		var add="My location";
		singledata.push(add);
		singledata.push(lat);
		singledata.push(long);
		beaches.push(singledata)
		initialize();
	},
	function () {
		alert('fallback');
	});
}
function initialize() {
	console.log(beaches)
	var markers = [];
	console.log("beaches[0]")
	console.log(beaches[0][1])
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: new google.maps.LatLng(30.3165, 78.0322),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();

	for (var i = 0; i < beaches.length; i++) {
		console.log(i)
		var newMarker = new google.maps.Marker({
			position: new google.maps.LatLng(beaches[i][1], beaches[i][2]),
			map: map,
			title: beaches[i][0],
			icon: './images/marker.png'
		});

		google.maps.event.addListener(newMarker, 'click', (function (newMarker, i) {
			return function () {
				infowindow.setContent(beaches[i][0]);
				infowindow.open(map, newMarker);
			}
		})(newMarker, i));

		markers.push(newMarker);
	}
	
}