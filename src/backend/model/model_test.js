import {getLaunches, loadLaunchesOverTimePeriod, getLaunch} from "../controllers/launchesController.js";

/**
 * File for testing model. Delete for production.
 */

const printResult = async () => {
    // test dates
    await loadLaunchesOverTimePeriod('2024-07-19T02:54:00Z','2024-08-01T15:02:53Z');
    
    let launches = getLaunches();
    let n = launches.length;

    for(let i = 0; i < n; i++) {
        console.log(launches[i].launchDate);
    }    
}

printResult();
