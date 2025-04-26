import axios from 'axios';

async function getServiceDetails(id) {
    let response;
    try {
        response = await axios.get(`${process.env.DB_SERVICE_URL}/services/${id}`); 
        if (response.data) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

async function getEstimatedWaitTime(service) {
    try {
        const res = await axios.get(`${process.env.QUEUE_SERVICE_URL}/time/${service.tag}/${service.id}`);
        return res.data.estimated_wait_time;
    } catch (error) {
        console.error('Error fetching estimated wait time:', error.message);
        return 0; 
    }
}

export async function generateTicketNumber(id) {
    let service = await getServiceDetails(id);

    if (!service) return null;

    let estimated_wait_time = await getEstimatedWaitTime(service);
    const ticket = {
        created_at: Date.now(),
        number: Math.floor(1 + Math.random() * 1000),
        estimated_wait_time,
        service_tag: service.tag,
        service_id: service.id
    };

    try {
        let response = await axios.post(`${process.env.QUEUE_SERVICE_URL}/enqueue`, ticket);
        if(response.data) {
            if(response.data.error) {
                return { error: "Failed to enqueue ticket" }
            }
        }
        return ticket;
    } catch (error) {
        return { error: "Failed to contact queue service" };
    }
}  