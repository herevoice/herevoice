var map;
var erica = {lat: 37.296907, lng: 126.834278};
var manripo = {lat: 36.786421, lng: 126.142350};


function CenterControl(controlDiv, map, univ, location) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.width = "80px";
  controlUI.style.backgroundColor = '#E91E63';
  controlUI.style.border = '2px solid #E91E63';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '12px';
  controlUI.style.marginRight = '5px';
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Helvetica ';
  controlText.style.fontSize = '16px';
  controlText.style.fontWeight = 'bold';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = univ;
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    map.setCenter(location);
    map.setZoom(17);
  });

}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	    center: erica,
	    zoom: 17,
	    mapTypeControl: false,
	    streetViewControl:false,
	    scaleControl: false
	});
	var bounds = new google.maps.LatLngBounds();

	var markers = [
        ['학생복지관', 37.298179,126.834358],
        ['한양대 에리카 본문', 37.296907, 126.834278],
        ['셔틀콕',37.298725,126.838059]
    ];

    for(var i = 0; i < markers.length; i++) {

        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0],
            icon: './css/'+'marker.png'
        });
        /*
        google.maps.event.addListener(markers[key], 'click', function(innerKey) {
      return function() {
          infowindows[innerKey].open(map, markers[innerKey]);
      }
    }(key));
        */
        google.maps.event.addListener(marker, 'click', function() {
        	map.setZoom(19);
	    	  map.setCenter(this.getPosition());
        });

        map.fitBounds(bounds);
    }

	var centerControlDiv = document.createElement('div');
	var centerControlDiv2 = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, "한양대", erica);
	var centerControl = new CenterControl(centerControlDiv2, map, "만리포", manripo);
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv2);

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		//map.setCenter(center); 
		map.fitBounds(bounds);
		
	});
}