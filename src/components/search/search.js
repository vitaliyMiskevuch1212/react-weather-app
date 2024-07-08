import { useState } from "react"
import { AsyncPaginate } from "react-select-async-paginate"
import { GEO_API_URL, geoApiOptions } from "../api.js"

const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null)



    const loadOptions = (inputValue) => {
        return fetch(
            `${GEO_API_URL}?minPopulation=1000000&namePrefix=${inputValue}`,
            geoApiOptions
        )
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            if (!Array.isArray(response.data)) {
                throw new Error('Data format is incorrect');
            }
            return {
                options: response.data.map((city) => ({
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.countryCode}`
                }))
            };
        })
        .catch(err => {
            console.error('Error fetching options:', err);
            return {
                options: [] // Повернення порожнього масиву у разі помилки
            };
        });
    };
    

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData)
    }

    return (
        <AsyncPaginate
            placeholder="Search for city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    )
}

export default Search