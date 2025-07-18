import * as launchesC from "../../controllers/launches_controller.js";
import * as launches from "../launches.js"

import axios from "axios";

/**
 * File for unit testing model in relation to api-1-feature-1/2.
 */

async function testLoadLaunchesOverTime(startDate: string, endDate: string) {
    // test through controller 

    await launchesC.loadLaunchesOverTimePeriod(startDate, endDate);

    let launchesFromModel = launchesC.getLaunches();

    let result = await axios.get(`https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`);
    let launchesFromAPI = result.data.results;

    if(launchesFromModel.length != launchesFromAPI.length) {
        console.log("FAIL : The number of feteched launches are not equal.");
        console.log(`launchesFromModel : ${launchesFromModel.length} and launchesFromAPI : ${launchesFromAPI.length}`)
        return false;
    }

    for(let i = 0; i < launchesFromModel.length; i++) {
        if (launchesFromModel[i].id != launchesFromAPI[i].id) {
            console.log(`FAIL : The ids of launches do not match. ${launchesFromModel[i].id} != ${launchesFromAPI[i].id}`);
            console.log(`${launchesFromModel[i].id} != ${launchesFromAPI[i].id}`);
            return false;
        }
    }
    console.log("SUCCESS");
    return true;
}

/**
 * Testing @setFieldsWithNoDataToNull in launches.js.
 * @param message Used to indicate child object was tested.
 */
function testSetFieldsWithNoDataToNull(mockLaunchObject, message) {
    // test function directly in launches.js 

    mockLaunchObject = launches.setFieldsWithNoDataToNull(mockLaunchObject);

    let invalidFields = [
        undefined, 
        "Unknown",
        ""
    ]

    for (let key in mockLaunchObject) {
        if (mockLaunchObject.hasOwnProperty(key)){
            if(Array.isArray(mockLaunchObject[key])) {
                // if field if an array
                if(mockLaunchObject[key].length == 0) {
                    console.log("FAIL : The object has a field that is an empty array that was not set to null.")
                    return false;
                }
            } else if(typeof mockLaunchObject[key] === "object" && mockLaunchObject[key] != null) {
                // if field is an object
                if(!testSetFieldsWithNoDataToNull(mockLaunchObject[key], "child object")) {
                    return false;
                }

            } else if(invalidFields.includes(mockLaunchObject[key])) {
                // field is a primitive 
                console.log("FAIL : The object has an invalid field (undefined, Unknown, empty string) that was not set to null.")
                return false;            
            }
        }
    }

    console.log(`SUCCESS : ${message}`);
    return true;
}

/**
 * Used to prints the fields of the object after the "no data" fields have been set to null.
 */
function printFieldsOfObject(object, prefix) {

    for(let key in object) {
        if (object.hasOwnProperty(key)) {
            if(Array.isArray(object[key])) {
                let str = "";
                for(let element of object[key]) {
                    str += ` ${element}`;
                }
                console.log(`${prefix}${key} : ${str}`);

            } else if (typeof object[key] === "object" && object[key] != null) {
                printFieldsOfObject(object[key], "\t");

            } else {
                console.log(`${prefix}${key} : ${String(object[key])}`);
            }
        }
    }
}

async function main () {
    const start = '2024-07-19T02:54:00Z';
    const end = '2024-08-04T15:02:53Z';

    // The possible ways (that I have seen) a field in Launch Library 2 can have "no data".
    // The method being tested must set each of these fields EXCEPT the last 2 to a null value.
    let mockLaunchObject = {
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

    await testLoadLaunchesOverTime(start,end);
    
    testSetFieldsWithNoDataToNull(mockLaunchObject, "parent object");
    
    // following code is not necessary for testing, simply to print out the fields of the object for visual guarantees of success
    console.log("\n");
    printFieldsOfObject(mockLaunchObject, "");
    console.log("\n");
}

main();
