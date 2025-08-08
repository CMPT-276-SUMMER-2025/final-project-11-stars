import * as eventsC from "../../events.ts";
import axios from "axios";

describe("loadNewsFeedData", () => {
  test("should fetch events and match with API results", async () => {
    const eventsFromModel = await eventsC.loadNewsFeedData(true);

    const URL = "https://lldev.thespacedevs.com/2.3.0/events/upcoming/?limit=3&?ordering=date";
    const testingAPICallResponse = await axios.get(URL);
    const eventsFromAPI = testingAPICallResponse.data.results;

    expect(eventsFromModel.length).toBe(eventsFromAPI.length);

    eventsFromModel.forEach((eventFromModel: any, i: number) => {
      const eventFromAPI = eventsFromAPI[i];
      expect(eventFromModel.headline).toBe(eventFromAPI.name);
    });
  });
});
