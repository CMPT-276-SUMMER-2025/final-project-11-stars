"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs_1 = require("dayjs");
var react_1 = require("react");
var launchesC = require("../../../controllers/launches_controller.ts");
var launches = require("../../launches.ts");
var axios_1 = require("axios");
// TODO - remove @ts-ignore and add proper typing
// File for unit testing model in relation to api-1-feature-1/2.
// Test through controller.
function testLoadLaunchesOverTime(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var launchesFromModel, URL, result, launchesFromAPI, errorMessage, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, launchesC.loadLaunchesOverTimePeriod(startDate, endDate)];
                case 1:
                    _a.sent();
                    launchesFromModel = launchesC.getLaunches();
                    URL = "https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=".concat(startDate, "&window_start__lte=").concat(endDate, "&mode=detailed");
                    return [4 /*yield*/, axios_1.default.get(URL)];
                case 2:
                    result = _a.sent();
                    launchesFromAPI = result.data.results;
                    errorMessage = "";
                    if (launchesFromModel.length != launchesFromAPI.length) {
                        errorMessage = "FAIL, the number of feteched launches are not equal. Lengths were ".concat(launchesFromModel.length, " and ").concat(launchesFromAPI.length);
                        console.log(errorMessage);
                        return [2 /*return*/, false];
                    }
                    for (i = 0; i < launchesFromModel.length; i++) {
                        if (launchesFromModel[i].id != launchesFromAPI[i].id) {
                            errorMessage = "FAIL : The ids of launches do not match. ".concat(launchesFromModel[i].id, " != ").concat(launchesFromAPI[i].id);
                            console.log(errorMessage);
                            return [2 /*return*/, false];
                        }
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
// Testing @setFieldsWithNoDataToNull in launches.js.
// @param mockLaunchObject
// @param message Used to indicate child object was tested.
//@ts-ignore
function testSetFieldsWithNoDataToNull(launchObject) {
    // test function directly in launches.js 
    launchObject = launches.setFieldsWithNoDataToNull(launchObject);
    var invalidPrimitives = [undefined, "Unknown", ""];
    var errorMessage = "";
    for (var key in launchObject) {
        if (launchObject.hasOwnProperty(key)) {
            // if the key is null, it should stay that way
            if (Array.isArray(launchObject[key])) {
                // if field if an array
                if (launchObject[key].length == 0) {
                    errorMessage = "FAIL, the object has a field that is an empty array that was not set to null.";
                    console.log(errorMessage);
                    return false;
                }
            }
            else if (typeof launchObject[key] === "object" && launchObject[key] != null) {
                // if field is an object but not null
                if (!testSetFieldsWithNoDataToNull(launchObject[key])) {
                    return false;
                }
            }
            else if (invalidPrimitives.includes(launchObject[key])) {
                // field is a primitive 
                console.log("FAIL, the object has an invalid field (undefined, Unknown, empty string) that was not set to null.");
                return false;
            }
        }
    }
    return true;
}
function testExtractBasicLaunchDataFromDetailedLaunchData() {
    return __awaiter(this, void 0, void 0, function () {
        var launchesFromModel, newBasicLaunchData, i, launchObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, launchesC.getLaunches()];
                case 1:
                    launchesFromModel = _a.sent();
                    newBasicLaunchData = launches.extractBasicLaunchDataFromDetailedLaunchData(launchesFromModel);
                    // check to make sure each object has the 4 basic required fields
                    for (i = 0; i < newBasicLaunchData.length; i++) {
                        launchObject = newBasicLaunchData[i];
                        if (!("id" in launchObject)) {
                            return [2 /*return*/, false];
                        }
                        else if (!("name" in launchObject)) {
                            return [2 /*return*/, false];
                        }
                        else if (!("lng" in launchObject)) {
                            return [2 /*return*/, false];
                        }
                        else if (!("lat" in launchObject)) {
                            return [2 /*return*/, false];
                        }
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function testSetLaunchData() {
    return __awaiter(this, void 0, void 0, function () {
        var launchSearchStartDate, launchSearchEndDate, launchSearchStartDateAsDayJS, launchSearchEndDateAsDayJS, expectedBasicLaunchDataArray, expectedDetailedLaunchDataArray, _a, responseBasicLaunchDataArray, setresponseBasicLaunchDataArray, _b, responseDetailedLaunchDataArray, setresponseDetailedLaunchDataArray;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    launchSearchStartDate = '2024-07-19T02:54:00Z';
                    launchSearchEndDate = '2024-08-04T15:02:53Z';
                    launchSearchStartDateAsDayJS = (0, dayjs_1.default)(launchSearchStartDate);
                    launchSearchEndDateAsDayJS = (0, dayjs_1.default)(launchSearchEndDate);
                    expectedBasicLaunchDataArray = [
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
                    ];
                    expectedDetailedLaunchDataArray = [
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
                    ];
                    _a = (0, react_1.useState)([]), responseBasicLaunchDataArray = _a[0], setresponseBasicLaunchDataArray = _a[1];
                    _b = (0, react_1.useState)([]), responseDetailedLaunchDataArray = _b[0], setresponseDetailedLaunchDataArray = _b[1];
                    return [4 /*yield*/, launches.setLaunchData(launchSearchStartDateAsDayJS, launchSearchEndDateAsDayJS, setresponseBasicLaunchDataArray, setresponseDetailedLaunchDataArray).then(function () {
                            if (responseBasicLaunchDataArray != expectedBasicLaunchDataArray) {
                                return false; // if the basic data doesn't match, fail
                            }
                            else if (responseDetailedLaunchDataArray != expectedDetailedLaunchDataArray) {
                                return false; // if the detailed data doesn't match, fail
                            }
                            else {
                                return true; // if both match, pass
                            }
                        })
                        // If literally anything goes wrong, return false
                    ];
                case 1:
                    _c.sent();
                    // If literally anything goes wrong, return false
                    return [2 /*return*/, false];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var start, end, objectWithUnwantedFields, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log("launches tests");
                    start = '2024-07-19T02:54:00Z';
                    end = '2024-08-04T15:02:53Z';
                    objectWithUnwantedFields = {
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
                    // each function returns T/F, can remove these print statements if necessary
                    _b = (_a = console).log;
                    return [4 /*yield*/, testLoadLaunchesOverTime(start, end)];
                case 1:
                    // each function returns T/F, can remove these print statements if necessary
                    _b.apply(_a, [_g.sent()]);
                    console.log(testSetFieldsWithNoDataToNull(objectWithUnwantedFields));
                    _d = (_c = console).log;
                    return [4 /*yield*/, testExtractBasicLaunchDataFromDetailedLaunchData()];
                case 2:
                    _d.apply(_c, [_g.sent()]);
                    _f = (_e = console).log;
                    return [4 /*yield*/, testSetLaunchData()];
                case 3:
                    _f.apply(_e, [_g.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
main();
// DOES NOT test any function.
// Used to prints the fields of the object after the "no data" fields have been set to null.
//@ts-ignore
function printFieldsOfObject(object, prefix) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            if (object[key] === null) {
                console.log("".concat(prefix).concat(key, " : ").concat(String(object[key])));
            }
            else if (Array.isArray(object[key])) {
                var str = "";
                for (var _i = 0, _a = object[key]; _i < _a.length; _i++) {
                    var element = _a[_i];
                    str += " ".concat(element);
                }
                console.log("".concat(prefix).concat(key, " : ").concat(str));
            }
            else if (typeof object[key] === "object") {
                printFieldsOfObject(object[key], "\t");
            }
            else {
                console.log("".concat(prefix).concat(key, " : ").concat(String(object[key])));
            }
        }
    }
}
