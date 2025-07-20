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
    newsOrLaunchDataSidePanelDataInterface
} from "./backend/model/interfaces.ts";
import dayjs, {Dayjs as type_dayjs} from "dayjs"

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#000011"
        }
    },
});

const App = () => {
    const [launchSearchStartDate, setlaunchSearchStartDate] = useState<type_dayjs>(dayjs().startOf("month"));
    const [launchSearchEndDate, setlaunchSearchEndDate] = useState<type_dayjs>(dayjs().endOf("month"));
    const [detailedLaunchData, setdetailedLaunchData] = useState<detailedLaunchDataInterface[]>([]);
    const [basicLaunchData, setbasicLaunchData] = useState<basicLaunchDataInterface[]>([]);
    const [newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData] = useState<newsOrLaunchDataSidePanelDataInterface>({contentType: "loading", content: ""});

    return (<>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {SiteContent(launchSearchStartDate, setlaunchSearchStartDate, launchSearchEndDate, setlaunchSearchEndDate, basicLaunchData, setbasicLaunchData, detailedLaunchData, setdetailedLaunchData, newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData)}
                    {Footer()}
                </LocalizationProvider>
            </ThemeProvider>
        </>
    )
}

export default App
