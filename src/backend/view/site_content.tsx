import {GlobeContainer} from "./globe_component.tsx";
import {LaunchDateRangePickersAndSubmitButton} from "./launches_controller.tsx";
import React from "react";
import type {basicLaunchDataInterface, detailedLaunchDataInterface} from "../model/interfaces.ts";
import {Dayjs as type_dayjs} from "dayjs"

export const SiteContent = (
    launchSearchStartDate: type_dayjs,
    setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs,
    setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    basicLaunchData: basicLaunchDataInterface[],
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    _detailedLaunchData: detailedLaunchDataInterface[], //todo - remove _ when used
    setdetailedLaunchData: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>
) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'start',
            alignItems: 'center'
        }}>
            {GlobeContainer({basicLaunchData})}
            <>
                <div style={{
                    width: window.innerWidth * (2 / 5),
                    height: window.innerHeight,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    gap: "1rem",
                    padding: "1rem",
                }}>
                    {LaunchDateRangePickersAndSubmitButton(
                        launchSearchStartDate,
                        setlaunchSearchStartDate,
                        launchSearchEndDate,
                        setlaunchSearchEndDate,
                        setbasicLaunchData,
                        setdetailedLaunchData)}
                </div>
            </>
        </div>
    )
}