import {Alert, Box, Button, LinearProgress, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs as type_dayjs} from "dayjs";
import React, {useEffect, useState} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface, newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../../model/interfaces.ts";
import {setLaunchData} from "../../model/launches.ts"
import {loadNewsFeedData} from "../../model/events.ts";

const APIErrorAlert = () => (
    // TODO - implement in the alert box section.
    // Alert for when there's some sort of error with the API during fetching/setting data that we can't do anything about.
    // e.g. API server is down
    <Alert severity="error" style={{width: "45%"}}>
        Unexpected API error - try again.
    </Alert>
);

const InvalidDateRangeAlert = () => (
    // Alert for when the user selects an invalid date range
    // e.g. Start: January 2025, End: January 1991
    <Alert severity="error" style={{width: "45%"}}>
        Start date cannot be after end date.
    </Alert>
);

const NoDataForRangeAlert = () => (
    // Alert for when the request went through fine, but the data returned contained 0 launches.
    // Assume this is due to no recorded launches being available for the specified date range.
    <Alert severity="warning" style={{width: "45%"}}>
        No launches available for this date range.
    </Alert>
);

const ValidDateRangeAlert = () => (
    // Alert for when everything is fine.
    // Shows the user feedback that they did everything correctly.
    <Alert severity="success" style={{width: "45%"}}>
        Date range is valid.
    </Alert>
);

const AlertContainer = (
    launchSearchStartDate: type_dayjs,
    launchSearchEndDate: type_dayjs,
    isloadingLaunchDataFromAPI: boolean,
    errorLoadingLaunchDataFromAPI: boolean,
    basicLaunchDataArray: basicLaunchDataInterface[],
) => {
    if (errorLoadingLaunchDataFromAPI) {
        return <APIErrorAlert/>;
    }

    if (launchSearchEndDate.endOf('month').isBefore(launchSearchStartDate.startOf('month'))) {
        return <InvalidDateRangeAlert/>;
    }

    if (!isloadingLaunchDataFromAPI && basicLaunchDataArray.length === 0) {
        return <NoDataForRangeAlert/>;
    }

    return <ValidDateRangeAlert/>;
};


export const LaunchDateRangePicker = (
    launchSearchStartDate: type_dayjs, setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs, setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    basicLaunchDataArray: basicLaunchDataInterface[], setbasicLaunchDataArray: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    setdetailedLaunchDataArray: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>,
    newsFeedDataArray: newsFeedDataInterface[],
    setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
) => {
    const [isloadingLaunchDataFromAPI, setisloadingLaunchDataFromAPI] = useState(false); // To show loading icon when making API calls
    const [errorLoadingLaunchDataFromAPI, seterrorLoadingLaunchDataFromAPI] = useState(false); // To show API alert icon when making API calls
    // Create default data as soon as the component mounts.
    useEffect(() => {
        (async () => {
            await loadNewsFeedData() // this should really be moved up, coz it doesn't belong in this function. actually, all the data-loading stuff should be refactored out of here
            seterrorLoadingLaunchDataFromAPI(false);
            setisloadingLaunchDataFromAPI(true);
            try {
                // The search data parameters already have initialized data on site open
                await setLaunchData(launchSearchStartDate, launchSearchEndDate, setbasicLaunchDataArray, setdetailedLaunchDataArray)
            } catch (error) {
                seterrorLoadingLaunchDataFromAPI(true);
                setisloadingLaunchDataFromAPI(false);
            } finally {
                setisloadingLaunchDataFromAPI(false);
            }
        })();
    }, []);
    // The useEffect above and handleClickSubmitButton function basically do the same thing,
    // but the process is slightly different with/without user input, and so they are intentionally near-dulpicates.
    const handleClickSubmitButton = async (
        launchSearchStartDate: dayjs.Dayjs,
        launchSearchEndDate: dayjs.Dayjs,
        newsFeedData: newsFeedDataInterface[],
        setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
    ) => {
        setisloadingLaunchDataFromAPI(true); // Show the loading icon
        setnewsOrLaunchDataSidePanelData({contentType: "newsFeed", content: newsFeedData}); // Reset the news panel in case the user still has a launch selected
        try {
            await setLaunchData(launchSearchStartDate, launchSearchEndDate, setbasicLaunchDataArray, setdetailedLaunchDataArray)
        } catch (error) {
            seterrorLoadingLaunchDataFromAPI(true);
            setisloadingLaunchDataFromAPI(false);
        } finally {
            setisloadingLaunchDataFromAPI(false);// Stop showing the loading icon
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem"
        }}>
            <Typography variant={"h5"}>
                Launch Search
            </Typography>
            <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly"}}>
                <div style={{width: "45%"}}>
                    <DatePicker
                        disabled={isloadingLaunchDataFromAPI}
                        views={['year', 'month']}
                        label="Start Date"
                        value={launchSearchStartDate}
                        onChange={(newValue) => {
                            if (newValue && newValue != launchSearchStartDate) {
                                setlaunchSearchStartDate(newValue.startOf('month'))
                            }
                        }}
                        slotProps={{
                            textField: {
                                helperText: "Applies from the start of the selected month",
                                fullWidth: true
                            },
                        }}
                    />
                </div>
                <div style={{width: "45%"}}>
                    <DatePicker
                        disabled={isloadingLaunchDataFromAPI}
                        views={['year', 'month']}
                        label="End Date"
                        value={launchSearchEndDate}
                        onChange={(newValue) => {
                            if (newValue && newValue != launchSearchEndDate) {
                                setlaunchSearchEndDate(newValue.endOf('month'))
                            }
                        }}
                        slotProps={{
                            textField: {
                                helperText: "Applies until the end of selected month",
                                fullWidth: true
                            },
                        }}
                    />
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly"}}>
                {AlertContainer(
                    launchSearchStartDate,
                    launchSearchEndDate,
                    isloadingLaunchDataFromAPI,
                    errorLoadingLaunchDataFromAPI,
                    basicLaunchDataArray)
                }
                <div style={{display: "flex", width: "45%"}}>
                    <Button
                        variant="contained"
                        onClick={() => handleClickSubmitButton(launchSearchStartDate, launchSearchEndDate, newsFeedDataArray, setnewsOrLaunchDataSidePanelData)}
                        disabled={!launchSearchStartDate || !launchSearchEndDate || launchSearchEndDate.endOf('month').isBefore(launchSearchStartDate.startOf('month'))}
                        fullWidth
                    >
                        {isloadingLaunchDataFromAPI ? (
                            <Box sx={{width: '100%'}}>
                                <LinearProgress color="inherit"/>
                            </Box>
                        ) : (
                            'Search For New Launches'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}