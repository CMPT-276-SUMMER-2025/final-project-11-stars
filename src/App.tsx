import {Footer} from "./backend/view/footer.tsx"
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline, Divider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useRef, useState} from "react";
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
import Globe from "react-globe.gl";
import {dropdownAndButtonForCenteringSatellite} from "./backend/view/globe/dropdown_and_button_to_center_satellite.tsx";

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
    const globeRef = useRef<InstanceType<typeof Globe>>(null);

    // API #1 Feature #1 & API #1 Feature #2
    const [launchSearchStartDate, setlaunchSearchStartDate] = useState<type_dayjs>(dayjs().startOf("month"));
    const [launchSearchEndDate, setlaunchSearchEndDate] = useState<type_dayjs>(dayjs().endOf("month"));
    const [detailedLaunchDataArray, setdetailedLaunchDataArray] = useState<detailedLaunchDataInterface[]>([]);
    const [basicLaunchDataArray, setbasicLaunchDataArray] = useState<basicLaunchDataInterface[]>([]);

    // API #1 Feature #3
    const [newsFeedDataArray, setnewsFeedDataArray] = useState<newsFeedDataInterface[]>([]);
    const [newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData] = useState<newsOrLaunchDataSidePanelDataInterface>({
        contentType: "loading",
        content: ""
    });

    // API #2 Feature #1
    const [satelliteTLEArray, setsatelliteTLEArray] = useState<satelliteTLEInterface[]>([]);
    const [satellitePositions, setsatellitePositions] = useState<satellitePositionInterface[]>([]);

    // API #2 Feature #3
    const [selectedSatelliteForCenteringID, setSelectedSatelliteForCenteringID] = useState<satellitePositionInterface | null>(null);

    return (<div style={{position: "relative", width: "100vw", height: "100vh", overflowY: "hidden"}}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {dropdownAndButtonForCenteringSatellite(satellitePositions, selectedSatelliteForCenteringID, setSelectedSatelliteForCenteringID, globeRef)}
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
                            {GlobeContainer(globeRef, basicLaunchDataArray, detailedLaunchDataArray, satelliteTLEArray, setsatelliteTLEArray, satellitePositions, setsatellitePositions,
                                setnewsOrLaunchDataSidePanelData)}
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
