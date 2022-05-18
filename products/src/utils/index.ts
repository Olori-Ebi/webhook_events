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

export const PublishOrderEvents = async (payload: any) => {
    try {
        await axios.post('http://localhost:8000/order/app-events', {
        payload
    })
    } catch (error) {
      console.log(error);
        
    }
}

// export default {
//     PublishCustomerEvents, PublishOrderEvents
// }