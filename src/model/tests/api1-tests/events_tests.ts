import * as eventsC from "../../events";
import axios from "axios";

async function testLoadNews() {
    let eventsFromModel = await eventsC.loadNewsFeedData();

    let URL = "https://lldev.thespacedevs.com/2.3.0/events/?limit=3&?ordering=-last_updated";
    let result = (await axios.get(URL))
    let eventsFromAPI = result.data.results;

    let errorMessage = "";

    if(eventsFromAPI.length != eventsFromModel.length) {
        errorMessage = `FAIL, the number of feteched events are not equal. Lengths were ${eventsFromModel.length} and ${eventsFromAPI.length}`;
        console.log(errorMessage);
        return false;
    }

    for(let i = 0; i < eventsFromModel.length; i++) {
        let eventModel = eventsFromModel[i];
        let eventAPI = eventsFromAPI[i];
        if(eventModel.headline != eventAPI.name) {
            errorMessage = `The headlines of events do not match. Headlines were "${eventModel.event.name}" and "${eventAPI.headline}"`;
            console.log(errorMessage);
            return false;
        }
    }
    return true;
}

async function main() {
    console.log("events tests");

    // each function returns T/F, can remove these print statements if necessary
    console.log(await testLoadNews());
}

main();


