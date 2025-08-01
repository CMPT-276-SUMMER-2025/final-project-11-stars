import axios from "axios";
import type {newsFeedDataInterface} from "./interfaces.ts";

const loadNewsFeedData = async () => {
    const EVENTS_URL = `https://ll.thespacedevs.com/2.3.0/events/upcoming/?limit=3&?ordering=date`; // Real API with rate-limiting
    const response = await axios.get(EVENTS_URL);
    return response.data.results.map((event: any) => {
        let URL;

        // This checks to make sure that there are valid URLs available.
        // If not, explicitly set the URL field to null.
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
        return eventObject;
    });
}

export {loadNewsFeedData}