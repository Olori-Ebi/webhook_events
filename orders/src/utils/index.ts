import axios from 'axios';

export const PublishCustomerEvents = async (payload: any) => {
    try {
        await axios.post('http://localhost:8000/customer/app-events', {
        payload
    })
    } catch (error) {
      console.log(error);
    }
}
