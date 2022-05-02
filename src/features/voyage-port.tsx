import { useAppSelector } from './../services/hooks'

export function VoyagePort(){
    const voyage = useAppSelector(state => state.voyage);

    return (
        <div className="voyage-listing">
            <h2>Voyage</h2>

            {
            voyage.ports.length == 0 ? '' :
                voyage.ports.length == 1 ? 
                    <table>
                        <thead>
                            <tr>
                                <th>Source Port</th>
                                <th>Destination Port</th>
                                <th>Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{voyage.ports[0].name}</td>    
                                <td></td>    
                                <td></td>    
                            </tr>
                        </tbody>
                    </table>  
                :
                <table>
                    <thead>
                        <tr>
                            <th>Source Port</th>
                            <th>Destination Port</th>
                            <th>Distance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voyage.ports.map(function(value, index, elements) {
                            debugger;
                            if (index +1 == elements.length) {
                                return;
                            }

                            var next = elements[index+1];
                            return (
                                <tr>
                                    <td>{ value.name }</td>
                                    <td>{ next.name }</td>
                                    <td>{ value.lat * next.lat }</td>
                                </tr>
                            );

                        })}
                    </tbody>
                </table>  
            }
        </div>
    )
}

export default VoyagePort
