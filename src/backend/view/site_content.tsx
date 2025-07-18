import {GlobeContainer} from "./globe_component.tsx";
import {LaunchDateRangePickersAndSubmitButton} from "./launches_controller.tsx";
import React from "react";
import type {basicLaunchDataInterface} from "../model/interfaces.ts";

const SideContainer = ({setbasicLaunchData}: {
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>
}) => {
    return (<>
        <div style={{
            width: window.innerWidth * (2 / 5),
            height: window.innerHeight,
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            gap: "1rem",
            padding: "1rem",
        }}>
            {LaunchDateRangePickersAndSubmitButton({setbasicLaunchData})}
        </div>
    </>)
}

export const SiteContent = ({basicLaunchData, setbasicLaunchData}: {
    basicLaunchData: basicLaunchDataInterface[],
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'start',
            alignItems: 'center'
        }}>
            {GlobeContainer({basicLaunchData})}
            {SideContainer({setbasicLaunchData})}
        </div>
    )
}