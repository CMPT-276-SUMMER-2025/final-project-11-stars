export const Footer = () => {
    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            pointerEvents: "none",
        }}>
            <div>
                © Anton, Bidisha, Paul & Sadab (Group 11 - "Stars") | 2025
            </div>
            <div>
                CMPT 276 Summer 2025 @ SFU
            </div>
        </div>
    )
}