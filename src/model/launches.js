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
exports.setLaunchData = exports.setFieldsWithNoDataToNull = exports.getLaunchById = exports.getLaunchesAsList = exports.loadLaunchesOverTime = void 0;
exports.extractBasicLaunchDataFromDetailedLaunchData = extractBasicLaunchDataFromDetailedLaunchData;
var axios_1 = require("axios");
var isDevMode = import.meta.env.VITE_CUSTOM_DEV_MODE === "true";
// Handles business logic and access to data in relation to orbital launches.
var detailedLaunchDataArray;
// This method is expected to be called before any other method in this module.
// @param startDate Expected to be ISO 8601 format.
// @param endDate Expected to be ISO 8601 format.
var loadLaunchesOverTime = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var REAL_LAUNCHES_URL, BACKUP_LAUNCHES_URL, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                REAL_LAUNCHES_URL = "https://ll.thespacedevs.com/2.3.0/launches/?window_start__gte=".concat(startDate, "&window_start__lte=").concat(endDate, "&mode=detailed");
                BACKUP_LAUNCHES_URL = "https://lldev.thespacedevs.com/2.3.0/launches/?window_start__gte=".concat(startDate, "&window_start__lte=").concat(endDate, "&mode=detailed");
                if (!isDevMode) return [3 /*break*/, 2];
                return [4 /*yield*/, axios_1.default.get(BACKUP_LAUNCHES_URL)];
            case 1:
                // If we're in dev mode, skip calling the real API.
                response = _a.sent();
                return [3 /*break*/, 6];
            case 2:
                _a.trys.push([2, 4, , 6]);
                return [4 /*yield*/, axios_1.default.get(REAL_LAUNCHES_URL)];
            case 3:
                response = _a.sent();
                return [3 /*break*/, 6];
            case 4:
                error_1 = _a.sent();
                console.warn("Failed to load from LL2 Launches API. Falling back to dev/backup API.", error_1);
                return [4 /*yield*/, axios_1.default.get(BACKUP_LAUNCHES_URL)];
            case 5:
                response = _a.sent();
                return [3 /*break*/, 6];
            case 6:
                detailedLaunchDataArray = response.data.results.map(function (launch) {
                    var launchServiceProvider = launch.launch_service_provider;
                    var launchRocketConfig = launch.rocket.configuration;
                    var launchObject = {
                        id: launch.id,
                        launchName: launch.name,
                        imageURL: launch.image.image_url,
                        launchStatus: launch.status.abbrev,
                        launchDate: (launch.window_start == null) ? "Not Launched Yet" : launch.window_start,
                        // launch location is just location of pad
                        location: {
                            longitude: launch.pad.longitude,
                            latitude: launch.pad.latitude
                        },
                        pad: {
                            name: launch.pad.name,
                            image: launch.pad.image.image_url
                        },
                        agency: {
                            name: launchServiceProvider.name,
                            description: launchServiceProvider.description,
                            logo: launchServiceProvider.logo.image_url,
                            link: launchServiceProvider.info_url
                        },
                        launcherConfiguration: {
                            name: launchRocketConfig.full_name,
                            image: launchRocketConfig.image.image_url,
                            infoURL: launchRocketConfig.info_url,
                            wikiURL: launchRocketConfig.wiki_url,
                            totalSuccessfulLaunches: launchRocketConfig.successful_launches,
                            totalLaunches: launchRocketConfig.total_launch_count,
                            height: launchRocketConfig.length,
                            diameter: launchRocketConfig.diameter,
                            launchMass: launchRocketConfig.launch_mass,
                            launchCost: launchRocketConfig.launch_cost,
                            isReusable: launchRocketConfig.reusable,
                            manufacturer: launchRocketConfig.manufacturer.name
                        }
                    };
                    var filteredLaunchObject = setFieldsWithNoDataToNull(launchObject);
                    return filteredLaunchObject;
                });
                return [2 /*return*/, detailedLaunchDataArray];
        }
    });
}); };
exports.loadLaunchesOverTime = loadLaunchesOverTime;
var getLaunchesAsList = function () {
    return detailedLaunchDataArray;
};
exports.getLaunchesAsList = getLaunchesAsList;
// @returns Null if launch is not found.
var getLaunchById = function (launchId) {
    for (var _i = 0, detailedLaunchDataArray_1 = detailedLaunchDataArray; _i < detailedLaunchDataArray_1.length; _i++) {
        var launch = detailedLaunchDataArray_1[_i];
        if (launchId == launch.id) {
            return launch;
        }
    }
    return null;
};
exports.getLaunchById = getLaunchById;
// Traverses all fields of the object, if any field is ('Unknown' or empty string or empty array), then set it to null,
// if the field itself refers to an object, then check that object for 'Unknown'/empty string/empty array fields.
// NOTE: This function is dependent on the Launch Library 2 /launches endpoint. May not work for other objects.
var setFieldsWithNoDataToNull = function (launchObject) {
    var invalidPrimitives = [
        "Unknown", undefined, ""
    ];
    for (var key in launchObject) {
        if (launchObject.hasOwnProperty(key)) {
            if (Array.isArray(launchObject[key])) {
                // if field if an array
                if (launchObject[key].length == 0) {
                    launchObject[key] = null;
                }
            }
            else if (typeof launchObject[key] === "object" && launchObject[key] != null) {
                // if field is an object but not null
                setFieldsWithNoDataToNull(launchObject[key]);
            }
            else if (invalidPrimitives.includes(launchObject[key])) {
                // field is a primitive 
                launchObject[key] = null;
            }
        }
    }
    return launchObject;
};
exports.setFieldsWithNoDataToNull = setFieldsWithNoDataToNull;
function extractBasicLaunchDataFromDetailedLaunchData(detailed) {
    return detailed.map(function (_a) {
        var id = _a.id, location = _a.location, launchName = _a.launchName;
        return ({
            id: id,
            name: launchName.split(" |")[0], // shortens the name for display. no error handling needed - if there isn't a pipe, split just returns the complete string at index 0
            lng: location.longitude,
            lat: location.latitude
        });
    });
}
var setLaunchData = function (launchSearchStartDate, launchSearchEndDate, setbasicLaunchData, setdetailedLaunchData) { return __awaiter(void 0, void 0, void 0, function () {
    var ISOStartDate, ISOEndDate, newDetailedLaunchData, newBasicLaunchData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ISOStartDate = launchSearchStartDate.toISOString();
                ISOEndDate = launchSearchEndDate.toISOString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, loadLaunchesOverTime(ISOStartDate, ISOEndDate)];
            case 2:
                newDetailedLaunchData = _a.sent();
                setdetailedLaunchData(newDetailedLaunchData);
                newBasicLaunchData = extractBasicLaunchDataFromDetailedLaunchData(newDetailedLaunchData);
                setbasicLaunchData(newBasicLaunchData);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.log("error getting/setting new launch data", error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.setLaunchData = setLaunchData;
