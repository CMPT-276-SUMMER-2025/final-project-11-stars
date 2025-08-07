const eventsC = require("../../events");
const axios = require("axios");

describe("events tests", () => {
  test("loadNewsFeedData should fetch same number of events and match headlines", async () => {
    const eventsFromModel = await eventsC.loadNewsFeedData();

    const URL = "https://lldev.thespacedevs.com/2.3.0/events/?limit=3&?ordering=-last_updated";
    const result = await axios.get(URL);
    const eventsFromAPI = result.data.results;

    let errorMessage = "";

    if (eventsFromAPI.length !== eventsFromModel.length) {
      errorMessage = `FAIL, the number of fetched events are not equal. Lengths were ${eventsFromModel.length} and ${eventsFromAPI.length}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }

    for (let i = 0; i < eventsFromModel.length; i++) {
      const eventModel = eventsFromModel[i];
      const eventAPI = eventsFromAPI[i];

      if (eventModel.headline !== eventAPI.name) {
        errorMessage = `The headlines of events do not match. Headlines were "${eventModel.event.name}" and "${eventAPI.headline}"`;
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    }

    // If we reach here, the test has passed
    expect(true).toBe(true);
  });
});
