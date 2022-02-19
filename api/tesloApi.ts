
import axios from 'axios';



const tesloApi = axios.create({
    baseURL: '/api'
});


export default tesloApi;


