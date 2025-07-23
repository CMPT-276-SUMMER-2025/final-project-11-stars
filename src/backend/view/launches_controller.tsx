import {Alert, Box, Button, LinearProgress, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs as type_dayjs} from "dayjs";
import React, {useEffect, useState} from "react";
import type {basicLaunchDataInterface, detailedLaunchDataInterface} from "../model/interfaces.ts";
import {extractBasicLaunchDataFromDetailedLaunchData} from "../model/launches.ts"
import {loadLaunchesOverTimePeriod} from "../controllers/launches_controller.ts";
import {loadNewsFeedData} from "../model/events.ts";

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
//
export const setNewLaunchData = async (
    launchSearchStartDate: type_dayjs,
    launchSearchEndDate: type_dayjs,
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    setdetailedLaunchData: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>
) => {
    const ISOStartDate = launchSearchStartDate.toISOString();
    const ISOEndDate = launchSearchEndDate.toISOString();
    try {
        const newDetailedLaunchData = await loadLaunchesOverTimePeriod(ISOStartDate, ISOEndDate);
        setdetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]);
        console.log("handleClickSubmitButton, newDetailedLaunchData: ", newDetailedLaunchData) //todo - remove when done testing
        const newBasicLaunchData = extractBasicLaunchDataFromDetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]);
        console.log("handleClickSubmitButton, newBasicLaunchData: ", newBasicLaunchData) //todo - remove when done testing
        setbasicLaunchData(newBasicLaunchData);
    } catch (error) {
        console.log("error getting/setting new launch data", error);
    }
}

export const LaunchDateRangePickersAndSubmitButton = (
    launchSearchStartDate: type_dayjs,
    setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs,
    setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    basicLaunchDataArray: basicLaunchDataInterface[],
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    setdetailedLaunchData: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>
) => {
    // Create default data using as soon as the component mounts.
    useEffect(() => {
        (async () => {
            await loadNewsFeedData()
            setLoading(true);
            try {
                await setNewLaunchData(launchSearchStartDate, launchSearchEndDate, setbasicLaunchData, setdetailedLaunchData)
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const [loading, setLoading] = useState(false); // Show loading icon when making API calls
    const handleClickSubmitButton = async (launchSearchStartDate: dayjs.Dayjs, launchSearchEndDate: dayjs.Dayjs) => {
        setLoading(true);
        try {
            await setNewLaunchData(launchSearchStartDate, launchSearchEndDate, setbasicLaunchData, setdetailedLaunchData)
        } finally {
            setLoading(false);
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
                Globe Launch Search
            </Typography>
            <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly"}}>
                <div style={{width: "45%"}}>
                    <DatePicker
                        views={['year', 'month']}
                        label="Start Date"
                        value={launchSearchStartDate}
                        disabled={loading}
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
                        disabled={loading}
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
                launchSearchEndDate.endOf('month').isBefore(launchSearchStartDate.startOf('month')) ? (
                    <InvalidDateRangeAlert/>
                ) : (!loading && basicLaunchDataArray.length === 0) ? (
                    <NoDataForRangeAlert/>
                ) : (
                    <ValidDateRangeAlert/>
                )
                <div style={{display: "flex", width: "45%"}}>
                    <Button
                        variant="contained"
                        onClick={() => handleClickSubmitButton(launchSearchStartDate, launchSearchEndDate)}
                        disabled={!launchSearchStartDate || !launchSearchEndDate || launchSearchEndDate.endOf('month').isBefore(launchSearchStartDate.startOf('month'))}
                        fullWidth
                    >
                        {loading ? (
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