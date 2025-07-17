import "./App.css"
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import {GlobeContainer} from "./backend/view/globe_component.tsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (<>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: 'start',
                        alignItems: 'center'
                    }}>
                        {GlobeContainer()}
                    </div>
            </ThemeProvider>
        </>
    )
}

export default App
