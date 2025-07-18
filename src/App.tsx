import {Footer} from "./backend/view/footer.tsx"
import {SiteContent} from "./backend/view/site_content.tsx";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useState} from "react";
import type {basicLaunchDataInterface} from "./backend/model/interfaces.ts";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#000011"
        }
    },
});

function App() {
    const [basicLaunchData, setbasicLaunchData] = useState<basicLaunchDataInterface[]>([]);
    return (<>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {SiteContent({basicLaunchData, setbasicLaunchData})}
                    {Footer()}
                </LocalizationProvider>
            </ThemeProvider>
        </>
    )
}

export default App
