import Globe from 'react-globe.gl';
import "./App.css"
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import {useEffect, useState} from "react";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const GlobeContainer = () => {
    /*
        The Globe container only accepts width/height values in px,
        so the width and height need to be recalculated manually
        every time the user zooms.
    */
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 3 / 5,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth * 3 / 5,
                height: window.innerHeight
            });
        };

        // Whenever the user resizes the page, call the handleResize function
        window.addEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <Globe
                width={dimensions.width}
                height={dimensions.height}
                animateIn={true}
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
            />
        </div>
    );
};

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
