import axios from "axios";
import type {newsFeedDataInterface} from "./interfaces.ts";

const loadNewsFeedData = async (isCalledForTesting: boolean = false) => {
    //"isCalledForTesting" is an optional boolean that defaults to false
    // it is used to account for the fact that this function is called
    // from both the user-facing code (real api) and testing code (dev api)

    // API URL variables are in ALLCAPS to signify their importance
    const DEV_EVENTS_URL = `https://lldev.thespacedevs.com/2.3.0/events/upcoming/?limit=3&?ordering=date`; // Dev API with no rate-limiting
    const REAL_EVENTS_URL = `https://ll.thespacedevs.com/2.3.0/events/upcoming/?limit=3&?ordering=date`; // Real API with rate-limiting
    const API_URL_TO_BE_USED = isCalledForTesting ? DEV_EVENTS_URL : REAL_EVENTS_URL; // if called for testing purposes, use dev api. else, use real api

    const response = await axios.get(API_URL_TO_BE_USED);
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
        return eventObject;
    });
}

export {
    loadNewsFeedData
}