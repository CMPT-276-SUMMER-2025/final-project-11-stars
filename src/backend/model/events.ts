import axios from "axios";
import type {newsFeedDataInterface} from "./interfaces.ts";

const isDevMode = import.meta.env.VITE_CUSTOM_DEV_MODE === "true";

const loadNewsFeedData = async () => {
    const BACKUP_EVENTS_URL = `https://lldev.thespacedevs.com/2.3.0/events/upcoming/?limit=3&?ordering=date`; // Backup development API with no rate-limiting
    const REAL_EVENTS_URL = `https://ll.thespacedevs.com/2.3.0/events/upcoming/?limit=3&?ordering=date`; // Real API with rate-limiting
    let response;
    if (isDevMode) {
        // If we're in dev mode, skip calling the real API.
        response = await axios.get(BACKUP_EVENTS_URL);
    } else {
        try {
            response = await axios.get(REAL_EVENTS_URL);
        } catch (error) {
            console.warn("Failed to load from LL2 Events (news feed) API. Falling back to dev/backup API.", error);
            response = await axios.get(BACKUP_EVENTS_URL);
        }
    }
    return response.data.results.map((event: any) => {
        let URL;
        // This checks to make sure that there are valid URLs available.
        // If not, explicitly set the URL field to null.
        if (event.vid_urls.length !== 0) {
            URL = event.vid_urls[0].url;
        } else if (event.info_urls.length !== 0) {
            URL = event.info_urls[0].url;
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
}

export {loadNewsFeedData}