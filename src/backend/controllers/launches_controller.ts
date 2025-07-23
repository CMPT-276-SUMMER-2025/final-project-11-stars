import { loadLaunchesOverTime, getLaunchesAsList, getLaunchById } from "../model/launches";

/**
 * Dates are expected to be in ISO 8601 format.
 * Will load all the launches to be within a certain time frame.
 *
 * IMPORTANT : Must use 'await' when calling this method such as (await loadLaunchesOverTimePeriod),
 * otherwise, if @getLaunch is called immediately after, the launches may not have been loaded yet,
 * therefore @getLaunch will return an empty list.
 */
const loadLaunchesOverTimePeriod = async (startDate: string, endDate: string) => {
    return await loadLaunchesOverTime(startDate, endDate);
}

const getLaunches = () => {
    return getLaunchesAsList();
}

const getLaunch = (id: string) => {
    return getLaunchById(id);
}

export {loadLaunchesOverTimePeriod, getLaunches, getLaunch}