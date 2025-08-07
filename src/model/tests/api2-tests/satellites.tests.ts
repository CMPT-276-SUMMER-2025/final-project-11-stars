import * as satellites from '../../satellites.ts';
import type { satellitePositionInterface } from '../../interfaces.ts';

// Tests ../../satellites.ts

function testParseRawTLEStringIntoTLEObjectArray() {
    let numOfTLEObjectsTested = 2;

    let satellites_RawString = 
    `ATLAS CENTAUR 2         
    1 00694U 63047A   25217.55738761  .00001129  00000+0  12677-3 0  9996
    2 00694  30.3573 322.4594 0552238 337.1556  20.5333 14.10943170101060
    THOR AGENA D R/B        
    1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992
    2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313`

    let expectedParsedTLEObjectArray = [
        {
            name: 'ATLAS CENTAUR 2',
            line1: '1 00694U 63047A   25217.55738761  .00001129  00000+0  12677-3 0  9996',
            line2: '2 00694  30.3573 322.4594 0552238 337.1556  20.5333 14.10943170101060'
        },
        {
            name: "THOR AGENA D R/B",        
            line1: '1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992',
            line2: '2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313'
        }
    ]

    let givenParsedTLEObjectObject = satellites.parseRawTLEStringIntoTLEObjectArray(satellites_RawString);    
    
    for(let i = 0; i < numOfTLEObjectsTested; i++) {
        let given : any = givenParsedTLEObjectObject[i];
        let expected : any = expectedParsedTLEObjectArray[i];

        if(!("name" in given) || expected.name != given.name) {
            console.log("parseRawTLEStringIntoTLEObjectArray failed, did not correctly parse string into object");
            return false;
        } else if(!("line1" in given) || expected.line1 != given.line1) {
            console.log("parseRawTLEStringIntoTLEObjectArray failed, did not correctly parse string into object");
            return false;
        } else if(!("line2" in given) || expected.line2 != given.line2) {
            console.log("parseRawTLEStringIntoTLEObjectArray failed, did not correctly parse string into object");
            return false;
        }
    }
    return true;
}

// helper function for following function
function satelliteInArray(name : string, satellites : satellitePositionInterface[]) {
    for(let i = 0; i < satellites.length; i++) {
        if(satellites[i].name === name) {
            return true;
        }
    }
    return false;
}

function testDeduplicateSatelliteNamesAndIDs() {
    // test data
    const testSatellites: satellitePositionInterface[] = [
        { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0},
        { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0},
        { name: "Galileo", id: "gal", alt: 0, lng: 0, lat: 0},
        { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0},
    ];
    // MUST have the same number of objects as testSatellites
    let expectedSatellites: satellitePositionInterface[] = [
        { name: "Starlink", id: "sl", alt: 0, lng: 0, lat: 0},
        { name: "Starlink (1)", id: "sl_1", alt: 0, lng: 0, lat: 0},
        { name: "Starlink (2)", id: "sl_2", alt: 0, lng: 0, lat: 0},
        { name: "Galileo", id: "gal", alt: 0, lng: 0, lat: 0}
    ];
    
    let givenSatellites : satellitePositionInterface[] = satellites.deduplicateSatelliteNamesAndIDs(testSatellites);
    
    if(givenSatellites.length != expectedSatellites.length) {
        console.log(`deduplicateSatelliteNamesAndIDs failed, did 
        not return back the expected number of satellites: 
        received(${givenSatellites.length}) expected(${expectedSatellites.length})`);
        return false;
    }
    // ensures each satellite name is correct / an expected name
    for(let i = 0; i < givenSatellites.length; i++) {
        if(!satelliteInArray(givenSatellites[i].name, expectedSatellites)) {
            console.log(`deduplicateSatelliteNamesAndIDs failed, ${givenSatellites[i].name} is not an expected satellite name`)
            return false;
        }
    }

    return true;
}

function testGetSatellitePositionAtTime() {
    // invalid tle(s)
    // results in all fields of the position function being NaN
    let tle1 : string = "INVALID";
    let tle2 : string = "INVALID";
    let time : Date = new Date("2024-11-02T12:00:00Z");

    let positionObject = satellites.getSatellitePositionAtTime(tle1, tle2, time);

    // test that function returns null when tle1 and tle2 is invalid
    if(positionObject != null) {
        return false;
    }

    // test valid tle(s) with invalid time
    tle1 = "1 00733U 64002A   25217.49128190  .00000202  00000+0  89688-4 0  9992"
    tle2 = "2 00733  99.1167 214.1200 0033186 166.0690 194.1416 14.33846936207313"
    time = new Date("wdadawdawd");
    positionObject = satellites.getSatellitePositionAtTime(tle1, tle2, time);
    if(positionObject != null) {
        return false;
    }

    // valid tle(s) with valid time
    time = new Date("2024-11-02T12:00:00Z");
    return satellites.getSatellitePositionAtTime(tle1, tle2, time) != null;
}

function main() {
    console.log("satellite tests");
    console.log(testParseRawTLEStringIntoTLEObjectArray());
    console.log(testDeduplicateSatelliteNamesAndIDs());
    console.log(testGetSatellitePositionAtTime());
}

main();
