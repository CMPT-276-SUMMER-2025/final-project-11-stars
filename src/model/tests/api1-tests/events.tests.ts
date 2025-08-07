import * as eventsC from "../../events.ts";
import axios from "axios";

describe("loadNewsFeedData", () => {
  test("should fetch events and match with API results", async () => {
    const eventsFromModel = await eventsC.loadNewsFeedData();

    const URL = "https://ll.thespacedevs.com/2.3.0/events/?limit=3&ordering=-last_updated";
    const result = await axios.get(URL);
    const eventsFromAPI = result.data.results;

    // Length mismatch check with error message
    if (eventsFromAPI.length !== eventsFromModel.length) {
      fail(
        `FAIL: The number of fetched events are not equal. Lengths were ${eventsFromModel.length} and ${eventsFromAPI.length}`
      );
    }

    // Check each event's headline/name
    for (let i = 0; i < eventsFromModel.length; i++) {
      const eventModel = eventsFromModel[i];
      const eventAPI = eventsFromAPI[i];

      const modelHeadline = eventModel.headline || eventModel.event?.name;
      const apiHeadline = eventAPI.name;

      if (eventModel.headline !== eventAPI.name) {
  throw new Error(
    `FAIL: The headlines of events do not match at index ${i}. Got "${eventModel.event.name}" from model and "${eventAPI.headline}" from API.`
  );
}

    }

    // Optional: If no failure occurred
    expect(true).toBe(true);
  });
});
