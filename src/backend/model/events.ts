import axios from "axios";
import type {newsFeedDataInterface} from "./interfaces.ts";

const loadNewsFeedData = async () => {
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

export {
    loadNewsFeedData
}