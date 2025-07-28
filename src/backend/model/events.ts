import axios from "axios";
import type {newsFeedDataInterface} from "./interfaces.ts";

const loadNewsFeedData = async () => {
    /*
    // TODO - Replace 'const EVENTS_URL' with the code below to account for rate-limiting. This SHOULD be safe to change, but check first.
    const BACKUP_EVENTS_URL = `https://lldev.thespacedevs.com/2.3.0/events/?limit=3&?ordering=-last_updated`; // Backup development API with no rate-limiting
    const REAL_EVENTS_URL = `https://ll.thespacedevs.com/2.3.0/events/?limit=3&?ordering=-last_updated`; // Real API with rate-limiting
    try {
        let response = await axios.get(REAL_EVENTS_URL);
        if (response.status != 200) {
            // if the response HTTP status is not 200 ("Success"), call the backup API.
            response = await axios.get(BACKUP_EVENTS_URL);
        }
    */
    const EVENTS_URL = `https://lldev.thespacedevs.com/2.3.0/events/?limit=3&?ordering=-last_updated`;
    try {
        let response = await axios.get(EVENTS_URL);
        return response.data.results.map((event: any) => {
            let URL;

            if (event.vid_urls.length != 0) {
                URL = event.vid_urls[0];
            } else if (event.info_urls.length != 0) {
                URL = event.info_urls[0];
            } else {
                URL = null;
            }

            let eventObject: newsFeedDataInterface = {
                bodyText: event.description,
                date: event.date,
                eventType: event.type.name,
                headline: event.name,
                imageURL: event.image.image_url,
                sourceURL: URL
            };
            // todo - filter data like in launches.ts
            return eventObject;
        });
    } catch (error) {
        console.error('Error fetching events', error);
    }
}

export {loadNewsFeedData}