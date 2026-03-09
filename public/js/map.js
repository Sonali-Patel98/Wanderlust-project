
	mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    zoom: 11,
    center: listing.geometry.coordinates,   //starting position [lng,lat]
    });
    map.on('load', () => {
    map.addSource('dc-bakeries', {
      type: 'vector',
      url: 'mapbox://examples.dc-bakeries'
    });
    map.addLayer({
      'id': 'dc-bakeries-id',
      'type': 'circle',
      'source': 'dc-bakeries',
      'source-layer': 'city_labels',
      'paint': {
        'circle-radius': 4,
        'circle-color': '#ff69b4'
      }
    });
  });
const marker1 = new mapboxgl.Marker({color: 'red'})
        .setLngLat(listing.geometry.coordinates)  //listing geometry
        .setPopup(
          new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
          )
        )
        .addTo(map);