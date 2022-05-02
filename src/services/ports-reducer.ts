/**
 * Redux store for the Ports data.  Ports represent a geographical location
 * where a vessel may travel to
 */

import { AnyAction } from "redux"
import { LOAD_USERS_ERROR, LOAD_USERS_LOADING, LOAD_USERS_SUCCESS, LOAD_USERS_SUCCESS_REC } from "../features/voyage-planner"

export interface Port {
    uncode: string,
    name: string,
    lat: number,
    lng: number,
    duration: number
}

export interface PortsState {
    loading: boolean,
    error: string,
    count: number,
    offset: number,
    ports: Port[]
}

const initialState: PortsState = {
    loading: true,
    error: '',
    count: 0,
    offset: 0,
    ports: [],
}

/**
 * TODO: implement the reducer function to manage the list of ports
 * within the redux store
 * @param state 
 * @param action 
 * @returns PortsState
 */
export function portsReducer(state = initialState, action: AnyAction){
    switch (action.type) {
        case LOAD_USERS_LOADING: {
            return {
                ...state,
                loading: true,
                error: false,
            };
        }
        case LOAD_USERS_SUCCESS: {
            return {
                ...state,
                ports: action.data as Port[],
                loading: false
            }
        }
        case LOAD_USERS_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.error
            };
        }
        case LOAD_USERS_SUCCESS_REC: {
            return {
                ...state,
                ports: action.data as Port[],
            }
        }
        default: {
            return state;
        }
    }
}

/**
 * TODO: implement the fetchPorts function to retrieve the ports data
 * from the API.  Note: the API returns at most 10 ports per API call
 * so you may need multiple calls to fetch all the data
 * @param offset: where to start pulling from
 */
 export function fetchPorts(offset: number){}