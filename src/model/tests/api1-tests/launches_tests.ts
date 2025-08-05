import dayjs from "dayjs";
import { useState } from "react";
import * as launchesC from "../../../controllers/launches_controller";
import type { basicLaunchDataInterface, detailedLaunchDataInterface } from "../../interfaces";
import * as launches from "../../launches"
import axios from "axios";
// TODO - remove @ts-ignore and add proper typing

// File for unit testing model in relation to api-1-feature-1/2.


// Test through controller.
async function testLoadLaunchesOverTime(startDate: string, endDate: string) {

    await launchesC.loadLaunchesOverTimePeriod(startDate, endDate);

    // data from model
    let launchesFromModel = launchesC.getLaunches();

    // getting the data ourselves
    let URL = `https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`;
    let result = await axios.get(URL);
    let launchesFromAPI = result.data.results;

    let errorMessage = "";

    if(launchesFromModel.length != launchesFromAPI.length) {
        errorMessage = `FAIL, the number of feteched launches are not equal. Lengths were ${launchesFromModel.length} and ${launchesFromAPI.length}`;
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
    return true;
}

// Testing @setFieldsWithNoDataToNull in launches.js.
// @param mockLaunchObject
// @param message Used to indicate child object was tested.

//@ts-ignore
function testSetFieldsWithNoDataToNull(launchObject) {
    // test function directly in launches.js 
    launchObject = launches.setFieldsWithNoDataToNull(launchObject);
    let invalidPrimitives = [ undefined, "Unknown", "" ];
    let errorMessage = "";

    for (let key in launchObject) {
        if (launchObject.hasOwnProperty(key)){
            // if the key is null, it should stay that way
            if(Array.isArray(launchObject[key])) {
                // if field if an array
                if(launchObject[key].length == 0) {
                    errorMessage = "FAIL, the object has a field that is an empty array that was not set to null.";
                    console.log(errorMessage);
                    return false;
                }
            } else if(typeof launchObject[key] === "object" && launchObject[key] != null) {
                // if field is an object but not null
                if(!testSetFieldsWithNoDataToNull(launchObject[key])) {
                    return false;
                }
            } else if(invalidPrimitives.includes(launchObject[key])) {
                // field is a primitive 
                console.log("FAIL, the object has an invalid field (undefined, Unknown, empty string) that was not set to null.");
                return false;            
            }
        }
    }
    return true;
}

async function testExtractBasicLaunchDataFromDetailedLaunchData() {
    let launchesFromModel = await launchesC.getLaunches();
    const newBasicLaunchData = launches.extractBasicLaunchDataFromDetailedLaunchData(launchesFromModel);
    // check to make sure each object has the 4 basic required fields
    for(let i = 0; i < newBasicLaunchData.length; i++) {
        let launchObject = newBasicLaunchData[i];
        if(!("id" in launchObject)) {
            return false;
        } else if(!("name" in launchObject)) {
            return false;
        } else if (!("lng" in launchObject)) {
            return false;
        } else if(!("lat" in launchObject)) {
            return false;
        }
    }
    return true;
}

async function testSetLaunchData() {
    // LL2 doesn't guarantee that their data is immutable change, so if this function ever fails, take a look at whether the API returns 'correct' but slightly different data (e.g. a different URL to an image)
    
    // Hardcoded dates to maintain consistency - the return data for these dates is known to be good
    const launchSearchStartDate = '2024-07-19T02:54:00Z';
    const launchSearchEndDate = '2024-08-04T15:02:53Z';
    // Cast both date strings to DayJS object, since that's what setLaunchData expects
    const launchSearchStartDateAsDayJS = dayjs(launchSearchStartDate)
    const launchSearchEndDateAsDayJS = dayjs(launchSearchEndDate)
    // Create arrays with the expected data to compare the response data to
    const expectedBasicLaunchDataArray = [
  {
    "id": "86139b24-aed8-47b0-a385-5ed28cca6409",
    "name": "Falcon 9 Block 5",
    "lng": -120.611,
    "lat": 34.632,
  },
  {
    "id": "59426ed2-57ff-4f61-8f62-9794b6dbb9ad",
    "name": "Falcon 9 Block 5",
    "lng": -80.57735736,
    "lat": 28.56194122,
    }
]
    const expectedDetailedLaunchDataArray = [
  {
    "id": "86139b24-aed8-47b0-a385-5ed28cca6409",
    "launchName": "Falcon 9 Block 5 | Starlink Group 11-1",
    "imageURL": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20221009234147.png",
    "launchStatus": "Success",
    "launchDate": "2024-08-04T07:24:00Z",
    "location": {
      "longitude": -120.611,
      "latitude": 34.632
    },
    "pad": {
      "name": "Space Launch Complex 4E",
      "image": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20231223073520.jpeg"
    },
    "agency": {
      "name": "SpaceX",
      "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
      "logo": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
      "link": "https://www.spacex.com/"
    },
    "launcherConfiguration": {
      "name": "Falcon 9 Block 5",
      "image": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
      "infoURL": "https://www.spacex.com/vehicles/falcon-9/",
      "wikiURL": "https://en.wikipedia.org/wiki/Falcon_9",
      "totalSuccessfulLaunches": 452,
      "totalLaunches": 453,
      "height": 70,
      "diameter": 3.65,
      "launchMass": 549,
      "launchCost": 52000000,
      "isReusable": true,
      "manufacturer": "SpaceX"
    }
  },
  {
    "id": "59426ed2-57ff-4f61-8f62-9794b6dbb9ad",
    "launchName": "Falcon 9 Block 5 | Cygnus CRS-2 NG-21 (S.S. Francis R. “Dick” Scobee)",
    "imageURL": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_20240804190439.jpeg",
    "launchStatus": "Success",
    "launchDate": "2024-08-04T15:02:53Z",
    "location": {
      "longitude": -80.57735736,
      "latitude": 28.56194122
    },
    "pad": {
      "name": "Space Launch Complex 40",
      "image": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_20240621050513.jpeg"
    },
    "agency": {
      "name": "SpaceX",
      "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
      "logo": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
      "link": "https://www.spacex.com/"
    },
    "launcherConfiguration": {
      "name": "Falcon 9 Block 5",
      "image": "https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
      "infoURL": "https://www.spacex.com/vehicles/falcon-9/",
      "wikiURL": "https://en.wikipedia.org/wiki/Falcon_9",
      "totalSuccessfulLaunches": 452,
      "totalLaunches": 453,
      "height": 70,
      "diameter": 3.65,
      "launchMass": 549,
      "launchCost": 52000000,
      "isReusable": true,
      "manufacturer": "SpaceX"
    }
  }
]
    // States to mimic the functionality of how setLaunchData actually operates, storing the responses
    const [responseBasicLaunchDataArray, setresponseBasicLaunchDataArray] = useState<basicLaunchDataInterface[]>([])
    const [responseDetailedLaunchDataArray, setresponseDetailedLaunchDataArray] = useState<detailedLaunchDataInterface[]>([])
    await launches.setLaunchData(launchSearchStartDateAsDayJS, launchSearchEndDateAsDayJS, setresponseBasicLaunchDataArray, setresponseDetailedLaunchDataArray).then(() => {
        if (responseBasicLaunchDataArray != expectedBasicLaunchDataArray) {
            return false // if the basic data doesn't match, fail
        } else if (responseDetailedLaunchDataArray != expectedDetailedLaunchDataArray) {
            return false // if the detailed data doesn't match, fail
        } else {
            return true // if both match, pass
        }
    })
    // If literally anything goes wrong, return false
    return false;
}


async function main () {
    console.log("launches tests");

    // TEST : testLoadLaunchesOverTime
    // dates for launches
    const start = '2024-07-19T02:54:00Z';
    const end = '2024-08-04T15:02:53Z';

    // TEST : testSetFieldsWithNoDataToNull
    // The possible ways (that I have seen) a field in Launch Library 2 can have "no data".
    // The method being tested must set each of these fields EXCEPT the last 2 to a null value.
    // The inner object should have all its fields set to null.
    let objectWithUnwantedFields = {
        undefinedField : undefined,
        unknownField : "Unknown",
        emptyArray : [],
        emptyString : "",
        objectWithInvalidField : {
            childUnknown : "Unknown",
            childEmptyArray : []
        },
        validArray : [21],
        validString : 'hello world'
    }

    // each function returns T/F, can remove these print statements if necessary
    console.log(await testLoadLaunchesOverTime(start,end));
    console.log(testSetFieldsWithNoDataToNull(objectWithUnwantedFields));
    console.log(await testExtractBasicLaunchDataFromDetailedLaunchData());
    console.log(await testSetLaunchData());
}

main();




// DOES NOT test any function.
// Used to prints the fields of the object after the "no data" fields have been set to null.
//@ts-ignore
function printFieldsOfObject(object, prefix) {

    for(let key in object) {
        if (object.hasOwnProperty(key)) {

            if(object[key] === null) {
                console.log(`${prefix}${key} : ${String(object[key])}`);
            
            } else if(Array.isArray(object[key])) {
                let str = "";
                for(let element of object[key]) {
                    str += ` ${element}`;
                }
                console.log(`${prefix}${key} : ${str}`);

            } else if (typeof object[key] === "object") {
                printFieldsOfObject(object[key], "\t");

            } else {
                console.log(`${prefix}${key} : ${String(object[key])}`);
            }
        }
    }
}