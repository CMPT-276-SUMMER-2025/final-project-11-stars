import * as launches from "../launches.ts";
import * as satellites from "../satellites.ts";
import axios from "axios";
import deepEqual from "deep-equal";

// Tests the retrieval of data and sanitation of data.
async function testLoadAndSanitizingLaunchData() {
   // dates for launches
    const start = '2024-07-19T02:54:00Z';
    const end = '2024-08-04T15:02:53Z'; // does not mean anything, just a placeholder because launches uses dev endpoint

    // data from model
    // using no end date because it does not work for the api currently
    let launchesFromModel = await launches.loadLaunchesOverTime(start, end, true);

    // getting the data ourselves
    let URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${start}&mode=detailed`;
    let result = await axios.get(URL);
    let launchesFromAPI = result.data.results;

    let errorMessage = "";
    if(launchesFromModel.length != launchesFromAPI.length) {
        errorMessage = `FAIL, the number of feteched launches are not equal. Lengths were model:${launchesFromModel.length} and api:${launchesFromAPI.length}`;
        console.log(errorMessage);
        return false;
    }

    for(let i = 0; i < launchesFromModel.length; i++) {
        if (launchesFromModel[i].id != launchesFromAPI[i].id) {
            errorMessage = `FAIL : The ids of launches do not match. ${launchesFromModel[i].id} != ${launchesFromAPI[i].id}`;
            console.log(errorMessage);
            return false;
        }
    }

    // expects the number of launches to be bigger than 0
    let givenObject = launchesFromModel[0];

    let expectedObject = launches.setFieldsWithNoDataToNull({
        id : "46ca9221-6628-459b-91e7-0e8098edb575",
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
                infoURL: "Unknown", // tests the set to null function
                wikiURL: "https://en.wikipedia.org/wiki/Long_March_6",

                totalSuccessfulLaunches: 14,
                totalLaunches: 14,
                height: 50.0,
                diameter: 3.35,
                launchMass: 530,
                launchCost: [], // tests the set to null function
                isReusable: false,
                manufacturer: "China Aerospace Science and Technology Corporation"
            }
    });
        console.log(givenObject);
        console.log(expectedObject);
    return deepEqual(givenObject, expectedObject);
}

// Tests all functions in satellites.ts in a single process.
// Gets the satellite data as string, parses it into an array of objects with lte fields, 
// deduplicating duplicate satellites along the way, 
// then translates each satellite into a object containing their positions in longitude, latitude and altitude.
// Any error in the process will result in a failed test.
async function testLoadAndSanitizingSatelliteData() {
    let satellites_rawData = 
        `ATLAS CENTAUR 2         
        1 00694U 63047A   25217.55738761  .00001129  00000+0  12677-3 0  9996
        2 00694  30.3573 322.4594 0552238 337.1556  20.5333 14.10943170101060
        ATLAS CENTAUR 2         
        1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992
        2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313`

    let expectedPositions = [
        {   // position of first satellite in satellites_rawData
            lat: -0.6757123890060491,
            lng: -161.96054300657127,
            alt: 696.8290902305898 / 6371
        },
        {   // position of second satellite in satellites_rawData
            lat: 46.38248577829378,
            lng: 51.573518819875716,
            alt: 808.5183802203419 / 6371
        }
    ]

    let satellitesTLEArray = satellites.parseRawTLEStringIntoTLEObjectArray(satellites_rawData);
    let satellitePositions = satellites.getPositionsFromTLEArray(satellitesTLEArray, new Date("2024-11-02T12:00:00Z"));

    if(satellitePositions[1].name != (`${satellitePositions[0].name} (1)`) || satellitePositions[1].id != (`${satellitePositions[0].id}_1`)) {
        // makes sure the duplicate in satellites_rawData has the added characters at end of name and id
        return false;
    } else if(expectedPositions[0].alt != satellitePositions[0].alt || expectedPositions[0].lng != satellitePositions[0].lng || expectedPositions[0].lat != satellitePositions[0].lat) {
        return false;
    } else if (expectedPositions[1].alt != satellitePositions[1].alt || expectedPositions[1].lng != satellitePositions[1].lng || expectedPositions[1].lat != satellitePositions[1].lat) {
        return false
    }
    return true;
}

async function main() {
    console.log(await testLoadAndSanitizingLaunchData()); // CAREFUL this method is designed to use the production API, may run out of rates
    console.log(await testLoadAndSanitizingSatelliteData());
}

main();