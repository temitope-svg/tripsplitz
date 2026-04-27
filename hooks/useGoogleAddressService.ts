import axios from "axios";


export default function useGoogleAddressService() {


    const getAddressFromLatitudeAndLongtitude = async (latitude: number, longitude: number) => {
        try {
            const apiKey = 'AIzaSyAUqbDPvfPNZAjQFD50PlnYPRhIcNGABEE';
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );

            console.log("Response: ", response)

            if (response.data.results.length > 0) {
                return response.data.results[0];
            } else {
                return null;
            }
        } catch (error) {
            console.log("Error: ", error)
            return null
        }
    };


    return {
        getAddressFromLatitudeAndLongtitude
    }
}