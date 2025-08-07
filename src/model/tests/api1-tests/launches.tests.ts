import * as launches from "../../launches.ts";
import axios from "axios";

// Dates for the test case range
const start = '2024-07-19T02:54:00Z';
const end = '2024-08-04T15:02:53Z';

describe("Launches Model Tests", () => {

  test("loadLaunchesOverTime should fetch same number of launches as API", async () => {
    const launchesFromModel = await launches.loadLaunchesOverTime(start, end, true);
    const URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${start}&mode=detailed`;
    const result = await axios.get(URL);
    const launchesFromAPI = result.data.results;

    expect(launchesFromModel.length).toBe(launchesFromAPI.length);

    for (let i = 0; i < launchesFromModel.length; i++) {
      expect(launchesFromModel[i].id).toBe(launchesFromAPI[i].id);
    }
  });

  test("setFieldsWithNoDataToNull should nullify empty/invalid fields recursively", () => {
    const input = {
      undefinedField: undefined,
      unknownField: "Unknown",
      emptyArray: [],
      emptyString: "",
      objectWithInvalidField: {
        childUnknown: "Unknown",
        childEmptyArray: []
      },
      validArray: [21],
      validString: 'hello world'
    };

    const cleaned = launches.setFieldsWithNoDataToNull(input);

    function validateFields(obj: any) {
      const invalidPrimitives = [undefined, "Unknown", ""];
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];

        if (Array.isArray(value)) {
          if (value.length === 0) {
            fail(`Field "${key}" is an empty array that was not set to null`);
          }
        } else if (typeof value === "object" && value !== null) {
          validateFields(value); // recursive check
        } else if (invalidPrimitives.includes(value)) {
          fail(`Field "${key}" contains invalid primitive value "${value}"`);
        }
      }
    }

    validateFields(cleaned);
  });

  test("extractBasicLaunchDataFromDetailedLaunchData should return objects with required fields", async () => {
    const detailedData = await launches.loadLaunchesOverTime(start, end, true);
    const basicData = launches.extractBasicLaunchDataFromDetailedLaunchData(detailedData);

    for (let i = 0; i < basicData.length; i++) {
      const launch = basicData[i];
      expect(launch).toHaveProperty("id");
      expect(launch).toHaveProperty("name");
      expect(launch).toHaveProperty("lng");
      expect(launch).toHaveProperty("lat");
    }
  });

});
