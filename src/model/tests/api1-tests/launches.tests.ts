import * as launches from "../../launches.ts"
import axios from "axios";
// TODO - remove @ts-ignore and add proper typing

// NOTE : The test function for setLaunchData is hard to implement because we 
// cannot have react states outside of a react component as apparently that breaks a rule, 
// and setLaunchData only accepts react states as arguments, therefore it would be difficult to 
// implement a proper test function and due to time constraints we have decided not to write 
// a test for it but we ensured it works.

// File for unit testing model in relation to api-1-feature-1/2.


// dates for launches
const start = '2024-07-19T02:54:00Z';
const end = '2024-08-04T15:02:53Z';

// Test through controller.
async function testLoadLaunchesOverTime() {

    // data from model
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
    let launchesFromModel = await launches.loadLaunchesOverTime(start,end,true);
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

async function main () {
    console.log("launches tests");

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
    console.log(await testLoadLaunchesOverTime());
    console.log(testSetFieldsWithNoDataToNull(objectWithUnwantedFields));
    console.log(await testExtractBasicLaunchDataFromDetailedLaunchData());
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
