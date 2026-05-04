// 1. Import *useState* and *useEffect*
import { useState, useEffect} from "react";

    // 2. Create our *communes* variable as well as the *setCommunes* function via useState
    // We're setting the default value of dogImage to null, so that while we wait for the
    // fetch to complete, we dont attempt to render the image
export function useCommunes() {
    const [communes, setCommunes] = useState([]);

    // 3. Create out useEffect function
    useEffect(() => {
        fetch('https://data.gouv.nc/api/explore/v2.1/catalog/datasets/communes-nc/records?limit=50&select=nom_commune%2Cprovince')
            .then(response => response.json())
            .then(data => {
                const communesData = data.results.map(record => record);
                setCommunes(communesData.sort(() => Math.random() - 0.5));
            }   )
            .then(() => console.log(communes))
            .catch(error => console.error('Error fetching communes:', error));
    }, []); // The empty array ensures this effect runs only once when the component mounts

    return communes;

}
