import { useAppDispatch,useAppSelector } from './../services/hooks'
import { Port } from "./../services/ports-reducer"
export const CALCULATE_DISTANCE = "REDUX_THUNK_CALCULATE_DISTANCE"
export const CALCULATE_ESTIMATED_TIME_OF_ARRIVAL = "REDUX_THUNK_CALCULATE_ESTIMATED_TIME_OF_ARRIVAL"


export function VoyagePort(){
    const voyage = useAppSelector(state => state.voyage);
    const dispatch = useAppDispatch();
    
    return (
        <div className="voyage-listing">
            <h2>Voyage</h2>

            {
            voyage.ports.length == 0 ? 
                <table>
                    <thead>
                        <tr>
                            <th>Source Port</th>
                            <th>Destination Port</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>-</td>    
                            <td>-</td>    
                        </tr>
                    </tbody>
                </table>
            :
                voyage.ports.length == 1 ? 
                    <table>
                        <thead>
                            <tr>
                                <th>Source Port</th>
                                <th>Destination Port</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{voyage.ports[0].name}</td>    
                                <td>-</td>    
                            </tr>
                        </tbody>
                    </table>
                :
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Source Port</th>
                                <th>Destination Port</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voyage.ports.map(function(value, index, elements) {
                                if (index +1 == elements.length) {
                                    return;
                                }

                                var next = elements[index+1];
                                return (
                                    <tr>
                                        <td>{ value.name }</td>
                                        <td>{ next.name }</td>
                                    </tr>
                                );

                            })}
                        </tbody>
                    </table>  

                    <button onClick={() => 
                        dispatch( 
                            {type: CALCULATE_DISTANCE, data: voyage.ports })
                        }>Calculate Total Distance 
                    </button>

                    {voyage.totalDistance == 0 
                        ? 
                        '' 
                        :
                        <div>
                            <h3>Total Distance</h3>
                            <p>{voyage.totalDistance} K.M</p>
                        </div>
                    }

                    <button onClick={() => 
                        dispatch( 
                            {type: CALCULATE_ESTIMATED_TIME_OF_ARRIVAL, data: voyage.totalDistance })
                        }>Calculate Estimated time of arrival
                    </button>

                    {voyage.estimatedArrivalTime == '' 
                        ? 
                        '' 
                        :
                        <div>
                            <h3>Estimated time of arrival</h3>
                            <p>{voyage.estimatedArrivalTime}</p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default VoyagePort
