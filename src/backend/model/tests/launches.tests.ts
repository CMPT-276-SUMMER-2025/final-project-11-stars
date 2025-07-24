// import * as launchesC from "../../controllers/launches_controller.js";
// import * as launches from "../launches.js"
// import axios from "axios";
// // TODO - remove @ts-ignore and add proper typing
// /**
//  * File for unit testing model in relation to api-1-feature-1/2.
//  */

// async function testLoadLaunchesOverTime(startDate: string, endDate: string) {
//     // test through controller 

//     await launchesC.loadLaunchesOverTimePeriod(startDate, endDate);

//     let launchesFromModel = launchesC.getLaunches();

//     let result = await axios.get(`https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=${startDate}&window_start__lte=${endDate}&mode=detailed`);
//     let launchesFromAPI = result.data.results;

//     if(launchesFromModel.length != launchesFromAPI.length) {
//         console.log("FAIL : The number of feteched launches are not equal.");
//         console.log(`launchesFromModel : ${launchesFromModel.length} and launchesFromAPI : ${launchesFromAPI.length}`)
//         return false;
//     }

//     for(let i = 0; i < launchesFromModel.length; i++) {
//         if (launchesFromModel[i].id != launchesFromAPI[i].id) {
//             console.log(`FAIL : The ids of launches do not match. ${launchesFromModel[i].id} != ${launchesFromAPI[i].id}`);
//             console.log(`${launchesFromModel[i].id} != ${launchesFromAPI[i].id}`);
//             return false;
//         }
//     }
//     console.log("SUCCESS");
//     return true;
// }

// /**
//  * Testing @setFieldsWithNoDataToNull in launches.js.
//  * @param mockLaunchObject
//  * @param message Used to indicate child object was tested.
//  */

// //@ts-ignore
// function testSetFieldsWithNoDataToNull(mockLaunchObject, message) {
//     // test function directly in launches.js 

//     mockLaunchObject = launches.setFieldsWithNoDataToNull(mockLaunchObject);

//     let invalidFields = [
//         undefined, 
//         "Unknown",
//         ""
//     ]

//     for (let key in mockLaunchObject) {
//         if (mockLaunchObject.hasOwnProperty(key)){
//             if (mockLaunchObject[key] === null) {
//                 continue;

//             } else if(Array.isArray(mockLaunchObject[key])) {
//                 // if field if an array
//                 if(mockLaunchObject[key].length == 0) {
//                     console.log("FAIL : The object has a field that is an empty array that was not set to null.")
//                     return false;
//                 }

//             } else if(typeof mockLaunchObject[key] === "object") {
//                 // if field is an object
//                 if(!testSetFieldsWithNoDataToNull(mockLaunchObject[key], "child object")) {
//                     return false;
//                 }

//             } else if(invalidFields.includes(mockLaunchObject[key])) {
//                 // field is a primitive 
//                 console.log("FAIL : The object has an invalid field (undefined, Unknown, empty string) that was not set to null.")
//                 return false;            
//             }
//         }
//     }

//     console.log(`SUCCESS : ${message}`);
//     return true;
// }

// /**
//  * Used to prints the fields of the object after the "no data" fields have been set to null.
//  */
// //@ts-ignore
// function printFieldsOfObject(object, prefix) {

//     for(let key in object) {
//         if (object.hasOwnProperty(key)) {

//             if(object[key] === null) {
//                 console.log(`${prefix}${key} : ${String(object[key])}`);
            
//             } else if(Array.isArray(object[key])) {
//                 let str = "";
//                 for(let element of object[key]) {
//                     str += ` ${element}`;
//                 }
//                 console.log(`${prefix}${key} : ${str}`);

//             } else if (typeof object[key] === "object") {
//                 printFieldsOfObject(object[key], "\t");

//             } else {
//                 console.log(`${prefix}${key} : ${String(object[key])}`);
//             }
//         }
//     }
// }

// async function main () {
//     const start = '2024-07-19T02:54:00Z';
//     const end = '2024-08-04T15:02:53Z';

//     // The possible ways (that I have seen) a field in Launch Library 2 can have "no data".
//     // The method being tested must set each of these fields EXCEPT the last 2 to a null value.
//     let mockLaunchObject = {
//         undefinedField : undefined,
//         unknownField : "Unknown",
//         emptyArray : [],
//         emptyString : "",
//         objectWithInvalidField : {
//             childUnknown : "Unknown",
//             childEmptyArray : []
//         },
//         validArray : [21],
//         validString : 'hello world'
//     }

//     await testLoadLaunchesOverTime(start,end);
    
//     testSetFieldsWithNoDataToNull(mockLaunchObject, "parent object");
    
//     // following code is not necessary for testing, simply to print out the fields of the object for visual guarantees of success
//     console.log("\n");
//     printFieldsOfObject(mockLaunchObject, "");
//     console.log("\n");
// }

// main();







import * as launchesC from '../../controllers/launches_controller';
import * as launches from '../launches';
import axios from 'axios';

jest.mock('axios');
jest.setTimeout(15000); // Extend timeout in case API is slow

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('launches module integration and unit tests', () => {
  const start = '2024-07-19T02:54:00Z';
  const end = '2024-08-04T15:02:53Z';

  const mockApiResponse = {
    data: {
      results: [
        {
          id: '1',
          name: 'Test Launch 1',
          image: { image_url: '' },
          status: { abbrev: 'TST' },
          window_start: '2024-07-20T00:00:00Z',
          pad: {
            longitude: 10,
            latitude: 20,
            name: 'Pad 1',
            image: { image_url: '' },
          },
          launch_service_provider: {
            name: 'Provider 1',
            description: 'Desc',
            logo: { image_url: '' },
            info_url: '',
          },
          rocket: {
            configuration: {
              full_name: 'Rocket 1',
              image: { image_url: '' },
              info_url: '',
              wiki_url: '',
              successful_launches: 5,
              total_launch_count: 10,
              length: 50,
              diameter: 5,
              launch_mass: 50000,
              launch_cost: 1000000,
              reusable: true,
              manufacturer: { name: 'Maker 1' },
            },
          },
        },
        // More launches can be added here
      ],
    },
  };

  afterEach(() => {
    launches.setDetailedLaunchDataArray([]);
    jest.clearAllMocks();
  });

  // Integration Test
  test('loadLaunchesOverTime (Integration) - model and API return same number of launches and IDs', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

    await launchesC.loadLaunchesOverTimePeriod(start, end);

    const launchesFromModel = launchesC.getLaunches();
    const launchesFromAPI = mockApiResponse.data.results;

    expect(launchesFromModel.length).toBe(launchesFromAPI.length);
    for (let i = 0; i < launchesFromModel.length; i++) {
      expect(launchesFromModel[i].id).toBe(launchesFromAPI[i].id);
    }
  });

  // Error Handling Test
  test('loadLaunchesOverTime handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValueOnce(new Error('API failure'));

    const result = await launches.loadLaunchesOverTime('2024-01-01', '2024-02-01');
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });

  // getLaunchById Unit Test
  test('getLaunchById returns correct launch or null', () => {
    launches.setDetailedLaunchDataArray([
      {
        id: '1',
        launchName: 'Test Launch',
        imageURL: '',
        launchStatus: '',
        launchDate: '',
        location: { longitude: 0, latitude: 0 },
        pad: { name: '', image: '' },
        agency: { name: '', description: '', logo: '', link: '' },
        launcherConfiguration: {
          name: '',
          image: '',
          infoURL: '',
          wikiURL: '',
          totalSuccessfulLaunches: 0,
          totalLaunches: 0,
          height: 0,
          diameter: 0,
          launchMass: 0,
          launchCost: 0,
          isReusable: false,
          manufacturer: '',
        },
      },
      {
        id: '2',
        launchName: 'Another Launch',
        imageURL: '',
        launchStatus: '',
        launchDate: '',
        location: { longitude: 0, latitude: 0 },
        pad: { name: '', image: '' },
        agency: { name: '', description: '', logo: '', link: '' },
        launcherConfiguration: {
          name: '',
          image: '',
          infoURL: '',
          wikiURL: '',
          totalSuccessfulLaunches: 0,
          totalLaunches: 0,
          height: 0,
          diameter: 0,
          launchMass: 0,
          launchCost: 0,
          isReusable: false,
          manufacturer: '',
        },
      },
    ]);

    expect(launches.getLaunchById('1')).toBeDefined();
    expect(launches.getLaunchById('2')).toBeDefined();
    expect(launches.getLaunchById('3')).toBeNull();

    launches.setDetailedLaunchDataArray([]);
    expect(launches.getLaunchById('1')).toBeNull();
  });

  // Controller: getLaunches returns correct list
  test('getLaunches returns the list set in the model', () => {
    const mockList = [
      { id: '1', launchName: 'Mock Launch 1' },
      { id: '2', launchName: 'Mock Launch 2' },
    ];
    launches.setDetailedLaunchDataArray(mockList as any);
    const result = launchesC.getLaunches();

    expect(result).toEqual(mockList);
  });

  // Controller: getLaunch returns correct launch by ID
  test('getLaunch returns correct launch from model by ID', () => {
    const mockList = [
      { id: 'abc', launchName: 'Launch ABC' },
      { id: 'xyz', launchName: 'Launch XYZ' },
    ];
    launches.setDetailedLaunchDataArray(mockList as any);

    expect(launchesC.getLaunch('abc')?.launchName).toBe('Launch ABC');
    expect(launchesC.getLaunch('xyz')?.launchName).toBe('Launch XYZ');
    expect(launchesC.getLaunch('missing')).toBeNull();
  });
});