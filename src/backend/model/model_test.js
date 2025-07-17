import { getLaunches } from "../controllers/launchesController.js";

/**
 * File for testing model. Delete for production.
 */

const printResult = async () => {
    // test dates
    let launches = await getLaunches('2024-07-19T02:54:00Z','2024-08-01T15:02:53Z');
    
    let n = launches.length;

    for(let i = 0; i < n; i++) {
        // just do launches[i] for all information about each launch
        console.log(launches[i].window_start);
    }    
}

printResult();
