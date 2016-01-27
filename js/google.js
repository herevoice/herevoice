var map;
var erica = {lat: 37.296907, lng: 126.834278};
var manripo = {lat: 36.786421, lng: 126.142350};
var markers = [];


function CenterControl(controlDiv, map, univ, bounds) {

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
    map.fitBounds(bounds);
  });

}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	    center: erica,
	    zoom: 18,
	    mapTypeControl: true,
	    streetViewControl:false,
	    scaleControl: false,
      mapTypeId: google.maps.MapTypeId.SATELLITE
	});
	var bounds = new google.maps.LatLngBounds();
  var fireBaseURL = "https://herevoice.firebaseio.com/";
	/* var markers = [
        ['학생복지관', 37.298179, 126.834358],
        ['sample_id3','셔틀콕', 37.298725, 126.838059],
        ['sample_id4','제1공학관', 37.297554 ,126.837464],
        ['sample_id5','학술정보관',37.296744 , 126.83527],
        ['sample_id6','스매쉬룸',37.296854 , 126.836278],
        ['sample_id7','제3공학관',37.297499, 126.8363]
    ]; */
  
  var places = [];
  for(var i=0;i<markers.length;i++){
    places[i] = markers[i][0];
    console.log(places[i]);
  }
  for(var i = 0; i < markers.length; i++) {

    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    bounds.extend(position);

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i][0],
      icon: './css/'+'marker.png',
      animation: google.maps.Animation.DROP
    });
    attachPlaces(marker, places[i]);
    
    /*
    marker.addListener('click', toggleBounce);
    
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    */
    
    google.maps.event.addListener(marker, 'click', function() {
    	map.setZoom(18);
  	  map.setCenter(this.getPosition());
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ 
          $("#map").hide();
          $("#timeline").show();
        }, 1000);
        $("#timeline-name").html(this.title);
        console.log(this.getPosition().lat(), this.getPosition().lng());
        Android.setLocation(this.getPosition().lat(), this.getPosition().lng());
    });
    map.fitBounds(bounds);
  }
  google.maps.event.addListener(map, 'click', function() {
        console.log("reset");
        Android.setLocation(0,0);
  });
	var centerControlDiv = document.createElement('div');
	var centerControlDiv2 = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, "한양대", bounds);
	var centerControl = new CenterControl(centerControlDiv2, map, "만리포", bounds);
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv2);
  /*google.maps.event.addDomListener(window,"load",function() {
    map.fitBounds(bounds);
  });*/
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		//map.setCenter(center); 
		map.fitBounds(bounds);
	});
}

function attachPlaces(marker, places) {
  var infowindow = new google.maps.InfoWindow({
    content: places
  });
  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
      infowindow.open(map, marker);
  });
}