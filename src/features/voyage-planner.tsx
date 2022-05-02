import React, {useState, useEffect} from 'react'
import RouteMap from "./route-map"
import { useAppDispatch, useAppSelector } from './../services/hooks'
import { Port, PortsState} from './../services/ports-reducer'
import VoyagePort from './../features/voyage-port'
import axios, { AxiosError } from "axios"
import "./voyage-planner.css"

interface VoyagePlannerParams{
    selectedPorts?: Port[]
}

const initialState: VoyagePlannerParams = {
    selectedPorts: []
}

const initialPortState: PortsState = {
    loading: true,
    error: '',
    count: 0,
    offset: 0,
    ports: []
}

export const LOAD_USERS_LOADING = 'REDUX_THUNK_LOAD_USERS_LOADING';
export const LOAD_USERS_SUCCESS = 'REDUX_THUNK_LOAD_USERS_SUCCESS';
export const LOAD_USERS_ERROR = 'REDUX_THUNK_LOAD_USERS_ERROR';
export const LOAD_USERS_SUCCESS_REC = 'REDUX_THUNK_LOAD_USERS_SUCCESS_REC';
export const ADD_VOYAGE_PORTS = "REDUX_THUNK_ADD_VOYAGE_PORTS"

function VoyagePlanner(params: VoyagePlannerParams){
    const ports = useAppSelector(state => state.ports);
    const voyage = useAppSelector(state => state.voyage);
    const [currentSelectedPort, setCurrentSelectedPort] = useState("")
    const [addedPorts, setAddedPorts] = useState([] as Port[])
    const dispatch = useAppDispatch();
    
    const changeSelectedPort = (selectedPort: string) => {
        var selectBox = document.getElementById("port-select") as HTMLSelectElement;
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;

        setCurrentSelectedPort(selectedValue);
    }
    
    const addPortToSelectedPorts = () => {
        if (currentSelectedPort == "") {
            setCurrentSelectedPort(ports.ports[0].name);
            setAddedPorts(prevArray => [...prevArray, ports.ports[0]])
            dispatch( {type: ADD_VOYAGE_PORTS, data:ports.ports[0]})
        }

        for (let index = 0; index < ports.ports.length; index++) {
            const element = ports.ports[index] as Port;
            if (element.name == currentSelectedPort && !containsObject(addedPorts, element)) {
                setAddedPorts(prevArray => [...prevArray, element])
                //let updatedList: Port[] = addedPorts.concat(element);
                dispatch( {type: ADD_VOYAGE_PORTS, data: element})
            }
        }
    }

    const containsObject = (array: Port[], element: Port): boolean => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === element.name) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        dispatch({type: LOAD_USERS_LOADING});

        let results: PortsState = initialPortState;
        let baseURL = "https://8u9tblsay0.execute-api.us-east-1.amazonaws.com/default/zn-frontend-challenge-port-service"
        let headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type' : 'application/json;charset=utf-8'}
        let params = { offset: 0 }

        let x = axios({
            baseURL: baseURL,
            headers: headers,
            params: params,        
        }).then(res =>  { 
            results.count = res.data.count
            results.offset = res.data.offset

            for (let index = 0; index < res.data.data.length; index++) {
                const element = res.data.data[index] as Port;
                results.ports.push(element);
            }

            if (res.data.offset < res.data.count) {
                params.offset = res.data.offset + 1

                axcall(baseURL, headers, params, results as PortsState, dispatch);
            }
        }).catch(e=> {
            const errorException: AxiosError = e;
            dispatch({type: LOAD_USERS_ERROR, 
                error: ( `${errorException.code} - ${errorException.message} - ${errorException.name}`) 
                || 'Unexpected Error!!!' });
        });
      },[dispatch]);

    return (
        ports.error != '' ? <h1>{ports.error}</h1>  : 
        ports.loading ?  <h1>Loading...</h1> 
            :
            <div className="voyage-planner-container">
                <div className="voyage-route-container">
                    <h2>Route Planner</h2>
                    <div className="port-locator">
                        <select id="port-select" onChange={(event) => changeSelectedPort(event.target.value)} > 
                            {
                                ports.ports.map( (port) => 
                                    <option key={port.name} id={port.name} value={port.name}>
                                        {[port.name]}
                                    </option> )
                            }
                        </select>
                        <button onClick={ () => { addPortToSelectedPorts()}}>+</button>
                    </div>
                    <VoyagePort />
                </div>
                <div className="voyage-map-container">
                    <h2>Route Map</h2>
                    <RouteMap ports={ports.ports}/>
                </div>

            </div>
    )
}

const axcall = async ( 
    baseURL: string, 
    headers: { }, 
    params: { offset: number }, 
    results: PortsState,
    dispatch: any ): Promise<any> => 
{ 
    axios({
        baseURL: baseURL,
        headers: headers,
        params: params 
    }
    ).then( 
        res =>  
        { 
            results.count = res.data.count
            results.offset = res.data.offset

            for (let index = 0; index < res.data.data.length; index++) {
                const element = res.data.data[index];
                
                results.ports.push(element);
            }       

            if (res.data.offset < res.data.count) {
                params.offset = res.data.offset + 1
                return axcall(baseURL, headers, params, results, dispatch);
            }
            else { // after all calls ends
                const ids = results.ports.map(o => o.name)
                const filtered = results.ports.filter( ( {name}, index) => !ids.includes(name, index + 1))
                dispatch({type: LOAD_USERS_SUCCESS, data: filtered});
            }
        }
    )
    .catch(e => {
            console.log(e)
    })
}

export default VoyagePlanner
