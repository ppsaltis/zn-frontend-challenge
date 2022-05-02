import { useAppDispatch,useAppSelector } from './../services/hooks'
import { Port } from "./../services/ports-reducer"
export const CALCULATE_DISTANCE_BETWEEN_PORTS = "REDUX_THUNK_CALCULATE_DISTANCE_BETWEEN_PORTS"


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
                            {type: CALCULATE_DISTANCE_BETWEEN_PORTS, data: voyage.ports })
                    }>Calculate Total Distance </button>

                    {voyage.duration == 0 
                        ? 
                        '' 
                        :
                        <div>
                            <h3>Total Distance</h3>
                            <p>{voyage.duration} K.M</p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default VoyagePort
