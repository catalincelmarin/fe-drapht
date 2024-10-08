import axios from 'axios';

// Assuming your server's authentication endpoint is baseURL + "/api/auth"
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Function to handle the login action
const login = async (username: string, password: string) => {
    try {
        // Constructing the payload with the user's credentials
        const payload = {
            username,
            password,
        };
        console.log("baseUrl",baseURL)

        // Making the POST request to the authentication endpoint
        const response = await axios.post(`${baseURL}/api/auth`, payload);


        // Optionally, you may want to store the token in localStorage, or manage it another way
        // localStorage.setItem('token', response.data.token);

        // Returning the response data (token) for further processing
        return response.data;
    } catch (error: any) {
        // Handling failed authentication attempts
        console.error('Authentication failed:', error.response.data);
        throw error;
    }
};

export { login }
