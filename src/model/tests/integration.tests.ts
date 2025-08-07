import * as launches from "../launches.ts";
import * as satellites from "../satellites.ts";
import axios from "axios";
import deepEqual from "deep-equal";

describe("Launches Tests", () => {
  const start = '2024-07-19T02:54:00Z';
  const end = '2024-08-04T15:02:53Z';

  test("loadLaunchesOverTime matches API and data is sanitized", async () => {
    const launchesFromModel = await launches.loadLaunchesOverTime(start, end, true);
    const url = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${start}&window_start__lte=${end}&mode=detailed`;
    const result = await axios.get(url);
    const launchesFromAPI = result.data.results;

    expect(launchesFromModel.length).toBe(launchesFromAPI.length);

    for (let i = 0; i < launchesFromModel.length; i++) {
      expect(launchesFromModel[i].id).toBe(launchesFromAPI[i].id);
    }

    const givenObject = launchesFromModel[0];
    const expectedObject = launches.setFieldsWithNoDataToNull({
      id: "46ca9221-6628-459b-91e7-0e8098edb575",
      launchName: "Long March 6A | G60 Polar Group 01",
      imageURL: "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/long_march_6a_image_20221109174525.png",
      launchStatus: "Success",
      launchDate: "2024-08-06T06:33:00Z",
      location: {
        longitude: 111.5802,
        latitude: 38.8583
      },
      pad: {
        name: "Launch Complex 9A",
        image: "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/cz-6c_liftoff__image_20240507065634.jpg"
      },
      agency: {
        name: "China Aerospace Science and Technology Corporation",
        description: "The China Aerospace Science and Technology Corporation (CASC) is the main contractor for the Chinese space program. It is state-owned and has a number of subordinate entities which design, develop and manufacture a range of spacecraft, launch vehicles, strategic and tactical missile systems, and ground equipment. It was officially established in July 1999 as part of a Chinese government reform drive, having previously been one part of the former China Aerospace Corporation. Various incarnations of the program date back to 1956.",
        logo: "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/china2520aerospace2520science2520and2520technology2520corporation_logo_20220826093937.png",
        link: "https://english.spacechina.com/"
      },
      launcherConfiguration: {
        name: "Long March 6A",
        image: "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/long_march_6a_image_20221109174525.png",
        infoURL: null,
        wikiURL: "https://en.wikipedia.org/wiki/Long_March_6",
        totalSuccessfulLaunches: 14,
        totalLaunches: 14,
        height: 50.0,
        diameter: 3.35,
        launchMass: 530,
        launchCost: null,
        isReusable: false,
        manufacturer: "China Aerospace Science and Technology Corporation"
      }
    });

    expect(deepEqual(givenObject, expectedObject)).toBe(true);
  });
});

describe("Satellites Tests", () => {
  test("Satellite parsing, deduplication, and position calculation", () => {
    const rawTLE = 
`ATLAS CENTAUR 2         
1 00694U 63047A   25217.55738761  .00001129  00000+0  12677-3 0  9996
2 00694  30.3573 322.4594 0552238 337.1556  20.5333 14.10943170101060
ATLAS CENTAUR 2         
1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992
2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313`;

    const expectedPositions = [
      {
        lat: -0.6757123890060491,
        lng: -161.96054300657127,
        alt: 696.8290902305898 / 6371,
      },
      {
        lat: 46.38248577829378,
        lng: 51.573518819875716,
        alt: 808.5183802203419 / 6371,
      }
    ];

    const tleArray = satellites.parseRawTLEStringIntoTLEObjectArray(rawTLE);
    const positions = satellites.getPositionsFromTLEArray(tleArray, new Date("2024-11-02T12:00:00Z"));

    // Check deduplication
    expect(positions[1].name).toBe(`${positions[0].name} (1)`);
    expect(positions[1].id).toBe(`${positions[0].id}_1`);

    // Check position accuracy
    for (let i = 0; i < positions.length; i++) {
      expect(positions[i].lat).toBeCloseTo(expectedPositions[i].lat, 5);
      expect(positions[i].lng).toBeCloseTo(expectedPositions[i].lng, 5);
      expect(positions[i].alt).toBeCloseTo(expectedPositions[i].alt, 5);
    }
  });
});
