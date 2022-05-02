import { AnyAction } from "redux"
import { Port } from "./ports-reducer"
import { ADD_VOYAGE_PORTS,  } from "../features/voyage-planner"
import { CALCULATE_DISTANCE, CALCULATE_ESTIMATED_TIME_OF_ARRIVAL  } from "../features/voyage-port"

/**
 * This file controls the state of the "voyage" data.  A voyage consists of 0 or more
 * stops in a port.  You should calculate the total duration of the voyage as ports
 * are added by using the lat/lon of the port location and the VESSEL_SPEED_KNPH constant
 * for speed.  For the purpose of calculating distance, assume that the vessel can travel
 * in a straight line between ports (pretend it is a blimp).
 */


//Vessel speed in natical miles per hour
export const VESSEL_SPEED_KNPH = 10.0

interface VoyageState {
    //The total duration of the voyage in milliseconds
    duration: number,

    //ordered list of ports the vessel will stop at
    ports: Port[],

    totalDistance: number

    estimatedArrivalTime: string;
}

 
const initialState: VoyageState = {
    duration: 0,
    ports: [],
    totalDistance: 0,
    estimatedArrivalTime: ''
 }

 
 export function voyageReducer(state = initialState, action: AnyAction){
    switch (action.type) {
        case ADD_VOYAGE_PORTS: {
            return {
                ...state,
                ports: addPort(state, action.data),
            };
        }
        case CALCULATE_DISTANCE: {
            return {
                ...state,
                totalDistance: calculateDistanceBetweenSelectedPorts(action.data) 
            };
        }
        case CALCULATE_ESTIMATED_TIME_OF_ARRIVAL: {
            return {
                ...state,
                estimatedArrivalTime: calculateEstimatedTimeOfArrival(action.data) 
            };
        }
        default: {
            return state;
        }
    }
 }

 export function addPort(state: VoyageState, port: Port): Port[] {
    return state.ports.concat(port);
 }

 export function calculateDistanceBetweenSelectedPorts(ports: Port[]): number {
    let totalDistance: number = 0
    let totalDistanceInNauticalMiles: number = 0
    if (ports.length <= 1) // No ports or Only One 
        return 0;

    ports.map(function(value, index, elements) {
        if (index +1 == elements.length) {
            return;
        }
        let current = elements[index];
        var next = elements[index+1];
        
        totalDistance += haversine(current.lat, current.lng, next.lat, next.lng)
    })
    
    totalDistanceInNauticalMiles = totalDistance * 0.539957;
    return totalDistanceInNauticalMiles;
 }

 export function calculateEstimatedTimeOfArrival(totalDistance: number): string {
    const currentTime: Date = new Date();
    const durationInHours = totalDistance / 10; // 10 knot  
    
    const hours = (durationInHours / 60) - ((durationInHours / 60) % 1) 
    const mins = ((durationInHours / 60) % 1) * 60; // e.g convet 0.9 of an hour to mins

    currentTime.setHours(currentTime.getHours() + hours)
    currentTime.setMinutes(currentTime.getMinutes() + mins)

    return currentTime.toUTCString();
 }

 export function removePort(port: Port){}
 export function movePort(port: Port, newPosition: number){}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number
{
    // distance between latitudes
    // and longitudes
    let dLat = (lat2 - lat1) * Math.PI / 180.0;
    let dLon = (lon2 - lon1) * Math.PI / 180.0;
    
    // convert to radiansa
    lat1 = (lat1) * Math.PI / 180.0;
    lat2 = (lat2) * Math.PI / 180.0;
    
    // apply formulae
    let a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
    let rad = 6371.0710; // to use kilometers
    let c = 2 * Math.asin(Math.sqrt(a));
    return rad * c;
}