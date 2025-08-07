import {
    loadLaunchesOverTime,
    getLaunchesAsList
} from "../model/launches.ts"


/**
 * Dates are expected to be in ISO 8601 format.
 * Will load all the launches to be within a certain time frame.
 *
 * IMPORTANT : Must use 'await' when calling this method such as (await loadLaunchesOverTimePeriod),
 * otherwise, if @getLaunch is called immediately after, the launches may not have been loaded yet,
 * therefore @getLaunch will return an empty list.
 */
const loadLaunchesOverTimePeriod = async (startDate: string, endDate: string) => {
    return await loadLaunchesOverTime(startDate, endDate, false);
}

const getLaunches = () => {
    return getLaunchesAsList();
}

export {
    loadLaunchesOverTimePeriod, 
    getLaunches
}