const dayjs = require("dayjs");
const launchesC = require("../../../controllers/launches_controller.ts");
const launches = require("../../launches.ts");
const axios = require("axios");

describe("Launches Model Tests", () => {
  const start = '2024-07-19T02:54:00Z';
  const end = '2024-08-04T15:02:53Z';

  test("loadLaunchesOverTime returns matching launch data from API", async () => {
    await launchesC.loadLaunchesOverTimePeriod(start, end);
    const launchesFromModel = launchesC.getLaunches();

    const URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${start}&window_start__lte=${end}&mode=detailed`;
    const result = await axios.get(URL);
    const launchesFromAPI = result.data.results;

    expect(launchesFromModel.length).toBe(launchesFromAPI.length);

    for (let i = 0; i < launchesFromModel.length; i++) {
      expect(launchesFromModel[i].id).toBe(launchesFromAPI[i].id);
    }
  });

  test("setFieldsWithNoDataToNull removes all invalid fields", () => {
    const objectWithUnwantedFields = {
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

    const cleaned = launches.setFieldsWithNoDataToNull(objectWithUnwantedFields);

    const invalidPrimitives = [undefined, "Unknown", ""];
    const validate = (obj) => {
      for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        if (Array.isArray(obj[key])) {
          expect(obj[key].length).not.toBe(0); // Should not be empty arrays
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          validate(obj[key]);
        } else {
          expect(invalidPrimitives.includes(obj[key])).toBe(false);
        }
      }
    };

    validate(cleaned);
  });

  test("extractBasicLaunchDataFromDetailedLaunchData includes required fields", async () => {
    const launchesFromModel = await launchesC.getLaunches();
    const newBasicLaunchData = launches.extractBasicLaunchDataFromDetailedLaunchData(launchesFromModel);

    for (let launchObject of newBasicLaunchData) {
      expect(launchObject).toHaveProperty("id");
      expect(launchObject).toHaveProperty("name");
      expect(launchObject).toHaveProperty("lng");
      expect(launchObject).toHaveProperty("lat");
    }
  });

  test("setLaunchData returns expected values", async () => {
    const launchSearchStartDate = '2024-07-19T02:54:00Z';
    const launchSearchEndDate = '2024-08-04T15:02:53Z';

    const launchSearchStartDateAsDayJS = dayjs(launchSearchStartDate);
    const launchSearchEndDateAsDayJS = dayjs(launchSearchEndDate);

    const expectedBasicLaunchDataArray = [
      {
        id: "86139b24-aed8-47b0-a385-5ed28cca6409",
        name: "Falcon 9 Block 5",
        lng: -120.611,
        lat: 34.632,
      },
      {
        id: "59426ed2-57ff-4f61-8f62-9794b6dbb9ad",
        name: "Falcon 9 Block 5",
        lng: -80.57735736,
        lat: 28.56194122,
      },
    ];

    const expectedDetailedLaunchDataArray = expect.any(Array); // You can do deep comparison if needed

    let responseBasicLaunchDataArray = [];
    let responseDetailedLaunchDataArray = [];

    const setResponseBasic = (data) => {
      responseBasicLaunchDataArray = data;
    };

    const setResponseDetailed = (data) => {
      responseDetailedLaunchDataArray = data;
    };

    await launches.setLaunchData(
      launchSearchStartDateAsDayJS,
      launchSearchEndDateAsDayJS,
      setResponseBasic,
      setResponseDetailed
    );

    expect(responseBasicLaunchDataArray).toEqual(expectedBasicLaunchDataArray);
    expect(responseDetailedLaunchDataArray.length).toBeGreaterThan(0); // just ensure it got something
  });
});
