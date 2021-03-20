
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { apiConstants } from 'consts';
import './Map.scss';

mapboxgl.accessToken = apiConstants.MAPBOXGL_TOKEN

const Map = props => {
  const {zoom, lng, lat}=props
  const mapContainer = useRef()
  

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    const positionMarker = new mapboxgl.Marker({color:'var(--green)'})
    positionMarker.setLngLat([lng,lat]).addTo(map);
  }, [])

  return (
    <div className={`Map ${props.className || ''}`}>
      <div ref={mapContainer} className='map-container relh100' />
    </div>
  )
}

export default Map