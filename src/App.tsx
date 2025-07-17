import {Footer} from "./backend/view/footer.tsx"
import {SiteContent} from "./backend/view/site-content.tsx";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#000011"
        }
    },
});

function App() {
    return (<>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                {SiteContent()}
                {Footer()}
            </ThemeProvider>
        </>
    )
}


export default App
