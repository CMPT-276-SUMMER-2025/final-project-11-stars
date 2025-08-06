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
exports.setLaunchData = exports.setFieldsWithNoDataToNull = exports.getLaunchesAsList = exports.loadLaunchesOverTime = void 0;
exports.extractBasicLaunchDataFromDetailedLaunchData = extractBasicLaunchDataFromDetailedLaunchData;
var axios_1 = require("axios");
var launches_controller_ts_1 = require("../controllers/launches_controller.ts");
// Handles business logic and access to data in relation to orbital launches.
var detailedLaunchDataArray;
// This method is expected to be called before any other method in this module.
// @param startDate Expected to be ISO 8601 format.
// @param endDate Expected to be ISO 8601 format.
var loadLaunchesOverTime = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var LAUNCHES_URL, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                LAUNCHES_URL = "https://ll.thespacedevs.com/2.3.0/launches/?window_start__gte=".concat(startDate, "&window_start__lte=").concat(endDate, "&mode=detailed");
                return [4 /*yield*/, axios_1.default.get(LAUNCHES_URL)];
            case 1:
                response = _a.sent();
                detailedLaunchDataArray = response.data.results.map(function (launch) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
                    // If any data doesn't exist, set it to null
                    var launchServiceProvider = (_a = launch === null || launch === void 0 ? void 0 : launch.launch_service_provider) !== null && _a !== void 0 ? _a : null;
                    var launchRocketConfig = (_c = (_b = launch === null || launch === void 0 ? void 0 : launch.rocket) === null || _b === void 0 ? void 0 : _b.configuration) !== null && _c !== void 0 ? _c : null;
                    return {
                        id: (_d = launch === null || launch === void 0 ? void 0 : launch.id) !== null && _d !== void 0 ? _d : null,
                        launchName: (_e = launch === null || launch === void 0 ? void 0 : launch.name) !== null && _e !== void 0 ? _e : null,
                        imageURL: (_g = (_f = launch === null || launch === void 0 ? void 0 : launch.image) === null || _f === void 0 ? void 0 : _f.image_url) !== null && _g !== void 0 ? _g : null,
                        launchStatus: (_j = (_h = launch === null || launch === void 0 ? void 0 : launch.status) === null || _h === void 0 ? void 0 : _h.abbrev) !== null && _j !== void 0 ? _j : null,
                        launchDate: (launch === null || launch === void 0 ? void 0 : launch.window_start) == null ? "Not Launched Yet" : launch.window_start,
                        location: (launch === null || launch === void 0 ? void 0 : launch.pad) ? {
                            longitude: (_k = launch.pad.longitude) !== null && _k !== void 0 ? _k : null,
                            latitude: (_l = launch.pad.latitude) !== null && _l !== void 0 ? _l : null
                        } : null,
                        pad: (launch === null || launch === void 0 ? void 0 : launch.pad) ? {
                            name: (_m = launch.pad.name) !== null && _m !== void 0 ? _m : null,
                            image: (_p = (_o = launch.pad.image) === null || _o === void 0 ? void 0 : _o.image_url) !== null && _p !== void 0 ? _p : null
                        } : null,
                        agency: launchServiceProvider ? {
                            name: (_q = launchServiceProvider.name) !== null && _q !== void 0 ? _q : null,
                            description: (_r = launchServiceProvider.description) !== null && _r !== void 0 ? _r : null,
                            logo: (_t = (_s = launchServiceProvider.logo) === null || _s === void 0 ? void 0 : _s.image_url) !== null && _t !== void 0 ? _t : null,
                            link: (_u = launchServiceProvider.info_url) !== null && _u !== void 0 ? _u : null
                        } : null,
                        launcherConfiguration: launchRocketConfig ? {
                            name: (_v = launchRocketConfig.full_name) !== null && _v !== void 0 ? _v : null,
                            image: (_x = (_w = launchRocketConfig.image) === null || _w === void 0 ? void 0 : _w.image_url) !== null && _x !== void 0 ? _x : null,
                            infoURL: (_y = launchRocketConfig.info_url) !== null && _y !== void 0 ? _y : null,
                            wikiURL: (_z = launchRocketConfig.wiki_url) !== null && _z !== void 0 ? _z : null,
                            totalSuccessfulLaunches: (_0 = launchRocketConfig.successful_launches) !== null && _0 !== void 0 ? _0 : null,
                            totalLaunches: (_1 = launchRocketConfig.total_launch_count) !== null && _1 !== void 0 ? _1 : null,
                            height: (_2 = launchRocketConfig.length) !== null && _2 !== void 0 ? _2 : null,
                            diameter: (_3 = launchRocketConfig.diameter) !== null && _3 !== void 0 ? _3 : null,
                            launchMass: (_4 = launchRocketConfig.launch_mass) !== null && _4 !== void 0 ? _4 : null,
                            launchCost: (_5 = launchRocketConfig.launch_cost) !== null && _5 !== void 0 ? _5 : null,
                            isReusable: (_6 = launchRocketConfig.reusable) !== null && _6 !== void 0 ? _6 : null,
                            manufacturer: (_8 = (_7 = launchRocketConfig.manufacturer) === null || _7 === void 0 ? void 0 : _7.name) !== null && _8 !== void 0 ? _8 : null
                        } : null
                    };
                });
                return [2 /*return*/, setFieldsWithNoDataToNull(detailedLaunchDataArray)];
        }
    });
}); };
exports.loadLaunchesOverTime = loadLaunchesOverTime;
var getLaunchesAsList = function () {
    return detailedLaunchDataArray;
};
exports.getLaunchesAsList = getLaunchesAsList;
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
    var ISOStartDate, ISOEndDate, newDetailedLaunchData, newBasicLaunchData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ISOStartDate = launchSearchStartDate.toISOString();
                ISOEndDate = launchSearchEndDate.toISOString();
                return [4 /*yield*/, (0, launches_controller_ts_1.loadLaunchesOverTimePeriod)(ISOStartDate, ISOEndDate)];
            case 1:
                newDetailedLaunchData = _a.sent();
                setdetailedLaunchData(newDetailedLaunchData);
                newBasicLaunchData = extractBasicLaunchDataFromDetailedLaunchData(newDetailedLaunchData);
                setbasicLaunchData(newBasicLaunchData);
                return [2 /*return*/];
        }
    });
}); };
exports.setLaunchData = setLaunchData;
