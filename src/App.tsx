import {Footer} from "./backend/view/footer.tsx"
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline, Divider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import React, {useRef, useState} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsFeedDataInterface, newsOrLaunchDataSidePanelDataInterface, satellitePositionInterface,
    satelliteTLEInterface
} from "./backend/model/interfaces.ts";
import dayjs, {Dayjs as type_dayjs} from "dayjs"
import {GlobeContainer} from "./backend/view/globe/globe_component.tsx";
import {LaunchDateRangePicker} from "./backend/view/side_panel/launches/launch_date_picker.tsx";
import {NewsOrLaunchDetailsSidePanel} from "./backend/view/side_panel/news_or_launch_details_side_panel.tsx"
import {
    dropdownAndButtonForCenteringSatellite
} from "./backend/view/satellite_controls/dropdown_and_button_to_center_satellite.tsx";
import {satelliteTimeDeltaSlider} from "./backend/view/satellite_controls/satellite_time_delta_slider.tsx";
import Globe from "react-globe.gl";


const darkTheme = createTheme({
    /*
        This is MUI's format for creating a dark theme.
        "mode" sets the predefined color pallette
        "background default" sets the color of the background image.
        This is used to match the background color of the site to the background color of the globe object.
    */
    palette: {
        mode: 'dark',
        background: {
            default: "#000011"
        }
    },
});

const App = () => {

    // States to hold globally used data

    // GlobeGL - API/Feature-Agnostic
    // This is needed for external/functional interaction with the globe object, such as centering the globe to a specific position.
    //@ts-ignore - This ignores the typing issue for the useRef, which is a bug from the react-globegl library.
    const globeRef = useRef<InstanceType<typeof Globe>>(null); // This is how the globe's parameters are functionally controlled. E.g. enabling/disabling globe's rotation
    const [disableGlobeInterval, setdisableGlobeInterval] = React.useState<boolean>(false)

    // API #1 Feature #1 & API #1 Feature #2
    const [launchSearchStartDate, setlaunchSearchStartDate] = useState<type_dayjs>(dayjs().startOf("month")); // Stores the start date for searching for launches
    const [launchSearchEndDate, setlaunchSearchEndDate] = useState<type_dayjs>(dayjs().endOf("month")); // Stores the end date for searching for launches
    const [detailedLaunchDataArray, setdetailedLaunchDataArray] = useState<detailedLaunchDataInterface[]>([]); // Stores the full data for the launches
    const [basicLaunchDataArray, setbasicLaunchDataArray] = useState<basicLaunchDataInterface[]>([]); // Stores the basic (globe object-related) data for the launches

    // API #1 Feature #3
    const [newsFeedDataArray, setnewsFeedDataArray] = useState<newsFeedDataInterface[]>([]); // Stores the data for the news feed
    const [newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData] = useState<newsOrLaunchDataSidePanelDataInterface>({
        // Stores what type of content should be displayed of the side panel, as well as the content itself.
        contentType: "loading",
        content: ""
    });

    // API #2 Feature #1
    const [satelliteTLEArray, setsatelliteTLEArray] = useState<satelliteTLEInterface[]>([]); // Stores the intermediate/TLE-based data for the satellite position calculations
    const [satellitePositions, setsatellitePositions] = useState<satellitePositionInterface[]>([]); // Stores the actual (latitude/longitude/altitude) data for the satellite position calculations

    // API #2 Feature #2
    const [satelliteSeekMinuteOffset, setsatelliteSeekMinuteOffset] = useState<number>(0); // Stores how far into the future/how far back the user wants to see the satellite positions. 
    // Limited to [-10080 minutes, +10080 minutes] = [-168 hours, 168 hours] = [-7 days, +7 days] = [-1 week, + week]

    // API #2 Feature #3
    const [selectedSatelliteForCentering, setSelectedSatelliteForCentering] = useState<satellitePositionInterface | null>(null); // Stores the satellite that is currently selected to continuously center the globe onto it
    const [lockGlobeDueToCenteredSatellite, setlockGlobeDueToCenteredSatellite] = useState<boolean>(false); // When a satellite is centered, the globe is locked form mouse movement

    return (<div style={{position: "relative", width: "100vw", height: "100vh", overflowY: "hidden"}}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {satelliteTimeDeltaSlider(
                            satelliteTLEArray,
                            setsatellitePositions,
                            setsatelliteSeekMinuteOffset,
                            selectedSatelliteForCentering,
                            globeRef, setdisableGlobeInterval
                        )}
                        {dropdownAndButtonForCenteringSatellite(
                            satellitePositions,
                            setSelectedSatelliteForCentering,
                            globeRef,
                            setlockGlobeDueToCenteredSatellite)}
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        height: "100%"
                    }}>
                        <div style={{
                            width: "60%",
                            height: "100%",
                            display: "flex",
                        }}>
                            {GlobeContainer(globeRef,
                                basicLaunchDataArray,
                                detailedLaunchDataArray,
                                setsatelliteTLEArray,
                                satellitePositions, setsatellitePositions,
                                setnewsOrLaunchDataSidePanelData,
                                satelliteSeekMinuteOffset,
                                selectedSatelliteForCentering,
                                lockGlobeDueToCenteredSatellite,
                                disableGlobeInterval
                            )}
                        </div>
                        <div style={{
                            width: "40%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "1rem 0rem 2rem 0rem"
                        }}>
                            {LaunchDateRangePicker(
                                launchSearchStartDate, setlaunchSearchStartDate,
                                launchSearchEndDate, setlaunchSearchEndDate,
                                basicLaunchDataArray, setbasicLaunchDataArray,
                                setdetailedLaunchDataArray,
                                newsFeedDataArray,
                                setnewsOrLaunchDataSidePanelData)}
                            <Divider orientation="horizontal"
                                     variant="middle"
                                     style={{backgroundColor: "white"}}
                                     flexItem
                            />
                            <div style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "1rem",
                                padding: "0rem 1.75rem"
                            }}>
                                {NewsOrLaunchDetailsSidePanel(newsFeedDataArray, setnewsFeedDataArray, newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData)}
                            </div>
                        </div>
                    </div>
                    {Footer()}
                </LocalizationProvider>
            </ThemeProvider>
        </div>
    )
}

export default App
