import React, {useState, useEffect} from "react"
import { Port } from '../services/ports-reducer'
import { Loader } from "@googlemaps/js-api-loader"
import { useAppSelector } from './../services/hooks'

declare global {
    interface Window {
        initMap: () => void;
    }
}

interface RouteMapParams{
    ports: Port[]
}
function RouteMap({ports}: RouteMapParams){
    const [theMap, setTheMap] = useState<google.maps.Map>()
    const voyage = useAppSelector(state => state.voyage);

    const loader = new Loader({
        apiKey: "AIzaSyDckokR5ozbjFB7hC0yip1S5mbPYcgoQv8",
        version: "weekly"
    })

    useEffect(() => {
        loader
            .load()
            .then((google) => {
                const mapOptions = {
                    center: {
                        lat: 0,
                        lng: 0
                      },
                      zoom: 3,
                }
                const map = new google.maps.Map(document.getElementById("route-map") as HTMLElement, 
                    mapOptions)
                
                voyage.ports.map(voyageItem => 
                    new google.maps.Marker( 
                        {position: { lat: voyageItem.lat , lng: voyageItem.lng }, map: map }).setMap(map)
                )
                
                
                setTheMap(map);
            })
    }, [voyage.ports]);   
    return (
        <div id="map-container">        
            <div id="route-map"></div>    
        </div>
    )
}

export default RouteMap;
