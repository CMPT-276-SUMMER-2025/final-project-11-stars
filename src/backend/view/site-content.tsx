import {GlobeContainer} from "./globe-component.tsx";

export const SiteContent = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'start',
            alignItems: 'center'
        }}>
            {GlobeContainer()}
        </div>
    )
}