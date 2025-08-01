import {Footer} from "./backend/view/footer.tsx"
import {SiteContent} from "./backend/view/site_content.tsx";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useState} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsFeedDataInterface, newsOrLaunchDataSidePanelDataInterface,
    satelliteTLEInterface
} from "./backend/model/interfaces.ts";
import dayjs, {Dayjs as type_dayjs} from "dayjs"

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

    return (<div style={{width: "100vw", height: "100vh", overflowY: "hidden"}}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {SiteContent(launchSearchStartDate, setlaunchSearchStartDate,
                        launchSearchEndDate, setlaunchSearchEndDate,
                        detailedLaunchDataArray, setdetailedLaunchDataArray,
                        basicLaunchDataArray, setbasicLaunchDataArray,
                        newsFeedDataArray, setnewsFeedDataArray,
                        newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData,
                        satelliteTLEArray, setsatelliteTLEArray)}
                    {Footer()}
                </LocalizationProvider>
            </ThemeProvider>
        </div>
    )
}

export default App
