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

const InvalidDateRangeAlert = () => (
    <Alert severity="error" style={{width: "45%"}}>
        Start date cannot be after end date.
    </Alert>
);

const NoDataForRangeAlert = () => (
    <Alert severity="warning" style={{width: "45%"}}>
        No launches available for this date range.
    </Alert>
);

const ValidDateRangeAlert = () => (
    <Alert severity="success" style={{width: "45%"}}>
        Date range is valid.
    </Alert>
);

export const LaunchDateRangePicker = (
    launchSearchStartDate: type_dayjs, setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs, setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    basicLaunchDataArray: basicLaunchDataInterface[], setbasicLaunchDataArray: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    setdetailedLaunchDataArray: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>,
    newsFeedDataArray: newsFeedDataInterface[],
    setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
) => {
    const [loadingLaunchDataFromAPI, setLoadingLaunchDataFromAPI] = useState(false); // To show loading icon when making API calls
    // Create default data as soon as the component mounts.
    useEffect(() => {
        (async () => {
            await loadNewsFeedData() // this should really be moved up, coz it doesn't belong in this function. actually, all the data-loading stuff should be refactored out of here
            setLoadingLaunchDataFromAPI(true);
            try {
                await setLaunchData(launchSearchStartDate, launchSearchEndDate, setbasicLaunchDataArray, setdetailedLaunchDataArray)
            } finally {
                setLoadingLaunchDataFromAPI(false);
            }
        })();
    }, []);

    const handleClickSubmitButton = async (
        launchSearchStartDate: dayjs.Dayjs,
        launchSearchEndDate: dayjs.Dayjs,
        newsFeedData: newsFeedDataInterface[],
        setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
    ) => {
        setLoadingLaunchDataFromAPI(true);
        setnewsOrLaunchDataSidePanelData({contentType: "newsFeed", content: newsFeedData}); // Reset the news panel in case the user still has a launch selected
        try {
            await setLaunchData(launchSearchStartDate, launchSearchEndDate, setbasicLaunchDataArray, setdetailedLaunchDataArray)
        } finally {
            setLoadingLaunchDataFromAPI(false);
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
                {launchSearchEndDate.endOf('month').isBefore(launchSearchStartDate.startOf('month')) ? (
                    <InvalidDateRangeAlert/>
                ) : (!loadingLaunchDataFromAPI && basicLaunchDataArray.length === 0) ? (
                    <NoDataForRangeAlert/>
                ) : (
                    <ValidDateRangeAlert/>
                )}
                <div style={{display: "flex", width: "45%"}}>
                    <Button
                        variant="contained"
                        onClick={() => handleClickSubmitButton(launchSearchStartDate, launchSearchEndDate, newsFeedDataArray, setnewsOrLaunchDataSidePanelData)}
                        disabled={!launchSearchStartDate || !launchSearchEndDate || launchSearchEndDate.endOf('month').isBefore(launchSearchStartDate.startOf('month'))}
                        fullWidth
                    >
                        {loadingLaunchDataFromAPI ? (
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