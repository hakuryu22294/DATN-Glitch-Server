import axios from 'axios'

export const http = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 10000,
     headers: {
        'x-api-key': 'f171069c37f2e21cc8f3bfa102c0fe8525c0677b775181330170833da3aecd8e32aaf9ec366fe83b6913d80a33e0d8034541fcc6b9fdce7bdbbf769c11da32cf'
    },
   
})