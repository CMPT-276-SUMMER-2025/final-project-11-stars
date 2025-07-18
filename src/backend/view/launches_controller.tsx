import {Alert, Button, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs as type_dayjs} from "dayjs";
import React, {useState} from "react";
import type {basicLaunchDataInterface, detailedLaunchDataInterface} from "../model/interfaces.ts";
import {extractBasicLaunchDataFromDetailedLaunchData} from "../model/launches.ts"
import {loadLaunchesOverTimePeriod} from "../controllers/launches_controller.ts";

const InvalidDateRangeAlert = () => (
    <Alert severity="error" style={{width: "45%"}}>
        End date must be the same or after the start date.
    </Alert>
);

const ValidDateRangeAlert = () => (
    <Alert severity="success" style={{width: "45%"}}>
        Date range is valid.
    </Alert>
);

export const LaunchDateRangePickersAndSubmitButton = ({setbasicLaunchData}: {
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>
}) => {
    const handleClickSubmitButton = async (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
        const ISOStartDate = startDate.toISOString();
        const ISOEndDate = endDate.toISOString();
        try {
            const newDetailedLaunchData = await loadLaunchesOverTimePeriod(ISOStartDate, ISOEndDate);
            console.log("handleClickSubmitButton, newDetailedLaunchData: ", newDetailedLaunchData) //todo - remove when done testing
            const newBasicLaunchData = extractBasicLaunchDataFromDetailedLaunchData(newDetailedLaunchData as detailedLaunchDataInterface[]);
            console.log("handleClickSubmitButton, newBasicLaunchData: ", newBasicLaunchData) //todo - remove when done testing
            setbasicLaunchData(newBasicLaunchData);
        } catch (error) {
            console.log("error getting/setting new launch data", error);
        }
    };

    const startOfCurrentMonth = dayjs().startOf("month");
    const endOfCurrentMonth = dayjs().endOf("month");

    const [startDate, setStartDate] = useState<type_dayjs>(startOfCurrentMonth);
    const [endDate, setEndDate] = useState<type_dayjs>(endOfCurrentMonth);

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
                Select a new date range for the launch display
            </Typography>
            <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly"}}>
                <div style={{width: "45%"}}>
                    <DatePicker
                        views={['year', 'month']}
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            if (newValue && newValue != startDate) {
                                setStartDate(newValue.startOf('month'))
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
                        value={endDate}
                        onChange={(newValue) => {
                            if (newValue && newValue != endDate) {
                                setEndDate(newValue.endOf('month'))
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
                {startDate && endDate ? (
                    endDate.endOf('month').isBefore(startDate.startOf('month'))
                        ? <InvalidDateRangeAlert/>
                        : <ValidDateRangeAlert/>
                ) : null}

                <div style={{display: "flex", width: "45%"}}>
                    <Button
                        variant="contained"
                        onClick={() => handleClickSubmitButton(startDate, endDate)}
                        disabled={!startDate || !endDate || endDate.endOf('month').isBefore(startDate.startOf('month'))}
                        fullWidth
                    >
                        Search For New Launches
                    </Button>
                </div>
            </div>
        </div>
    );
}