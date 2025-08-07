import * as launches from "../launches.ts";
import * as satellites from "../satellites.ts";
import axios from "axios";
import deepEqual from "deep-equal";

describe("Launches Tests", () => {
    const start = '2024-07-19T02:54:00Z';
    const end = '2024-08-04T15:02:53Z';

    test("loadLaunchesOverTime matches API and data is sanitized", async () => {
        const launchesFromModel = await launches.loadLaunchesOverTime(start, end, true);
        const url = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${start}&mode=detailed`;
        const result = await axios.get(url);
        const launchesFromAPI = result.data.results;

        let launchServiceProvider = launchesFromAPI[0]?.launch_service_provider ?? null;
        let launchRocketConfig = launchesFromAPI[0]?.rocket?.configuration ?? null;

        expect(launchesFromModel.length).toBe(launchesFromAPI.length);

        for (let i = 0; i < launchesFromModel.length; i++) {
            expect(launchesFromModel[i].id).toBe(launchesFromAPI[i].id);
        }

        const modelObject = launchesFromModel[0];
        const expectedObject = launches.setFieldsWithNoDataToNull({
            id: launchesFromAPI[0]?.id ?? null,
            launchName: launchesFromAPI[0]?.name ?? null,
            imageURL: launchesFromAPI[0].image?.image_url ?? null,
            launchStatus: launchesFromAPI[0].status?.abbrev ?? null,
            launchDate: launchesFromAPI[0].window_start == null ? "Not Launched Yet" : launchesFromAPI[0].window_start,

            location: launchesFromAPI[0].pad ? {
                longitude: launchesFromAPI[0].pad.longitude ?? null,
                latitude: launchesFromAPI[0].pad.latitude ?? null
            } : null,

            pad: launchesFromAPI[0].pad ? {
                name: launchesFromAPI[0].pad.name ?? null,
                image: launchesFromAPI[0].pad.image?.image_url ?? null
            } : null,

            agency: launchServiceProvider ? {
                name: launchServiceProvider.name ?? null,
                description: launchServiceProvider.description ?? null,
                logo: launchServiceProvider.logo?.image_url ?? null,
                link: launchServiceProvider.info_url ?? null
            } : null,

            launcherConfiguration: launchRocketConfig ? {
                name: launchRocketConfig.full_name ?? null,
                image: launchRocketConfig.image?.image_url ?? null,
                infoURL: launchRocketConfig.info_url ?? null,
                wikiURL: launchRocketConfig.wiki_url ?? null,

                totalSuccessfulLaunches: launchRocketConfig.successful_launches ?? null,
                totalLaunches: launchRocketConfig.total_launch_count ?? null,

                height: launchRocketConfig.length ?? null,
                diameter: launchRocketConfig.diameter ?? null,
                launchMass: launchRocketConfig.launch_mass ?? null,
                launchCost: launchRocketConfig.launch_cost ?? null,

                isReusable: launchRocketConfig.reusable ?? null,

                manufacturer: launchRocketConfig.manufacturer?.name ?? null
            } : null
        });

        expect(deepEqual(modelObject, expectedObject)).toBe(true);
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
