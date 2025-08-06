import type {
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../../../model/interfaces.ts";
import React from "react";
import dayjs from "dayjs";
import {Button, IconButton, Link, Tooltip, Typography} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

const stripBrackets = (input: string): string => {
    // Strip bracketed text from data in order to shorten it.
    const index = input.indexOf(" (");
    return index !== -1 ? input.slice(0, index) : input;
};

const formatDateToText = (date: string): string => {
    const launchDate = dayjs(date);
    const formattedDate = launchDate.format("MMMM DD, YYYY - HH:mm");

    const timeZoneAbbr = new Intl.DateTimeFormat("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: "short"
    }).format(launchDate.toDate()).split(' ').pop();

    return `${formattedDate} ${timeZoneAbbr}`.toUpperCase();
}

const launchHeaderWithLink = (launchName: string, infoURL: string | null, wikiURL: string | null) => {
    const [topText, bottomText] = launchName.split(" | ");
    const URL = infoURL || wikiURL;

    return (
        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
            {URL ? (
                <Link href={URL} underline="hover"
                      style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
                        <Typography variant="h4" align="center">
                            {topText}
                        </Typography>
                        <Typography variant="h4" align="center">
                            {bottomText}
                        </Typography>
                    </div>
                    <LinkIcon/>
                </Link>
            ) : (
                <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
                    <Typography variant="h4" align="center">
                        {topText}
                    </Typography>
                    <Typography variant="h4" align="center">
                        {bottomText}
                    </Typography>
                </div>
            )
            }
        </div>
    );
};

const agencyHeaderWithLink = (agencyName: string, agencyLink: string | null) => {
    return (
        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
            {agencyLink ? (
                <Link href={agencyLink} underline="hover">
                    <Typography color="gray" variant="h5" align={"center"}
                                style={{display: "flex", flexDirection: "row"}}>
                        {agencyName} <LinkIcon/>
                    </Typography>
                </Link>
            ) : (
                <Typography color="gray" variant="h5" align={"center"}>
                    {agencyName}
                </Typography>
            )}
        </div>
    );
};

const launchTimeDate = (date: string) => {
    return (
        <Typography variant={"h5"} color={"white"} align={"center"}>
            {formatDateToText(date)}
        </Typography>
    )
}

const getabsoluteLaunchDaysHoursDifference = (dateStr: string): { hours: number; days: number } => {
    // Used to display the time delta (absolute difference)
    const launchDate = dayjs(dateStr);
    const now = dayjs();

    const differenceInMiliseconds = Math.abs(launchDate.diff(now));

    const totalHours = Math.floor(differenceInMiliseconds / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return {days: days, hours: hours}; // Returns separate days and hours for two-line display
}

const launchDelta = (date: string) => {
    const absoluteLaunchDaysHours = getabsoluteLaunchDaysHoursDifference(date);
    const isPast = dayjs(date).isBefore(dayjs());
    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <Typography variant={"h6"} color={"gray"}>
                {isPast ? "LAUNCHED" : "LAUNCHES IN"}
            </Typography>
            <Typography variant={"h5"} color={"white"}>
                {`${absoluteLaunchDaysHours.days} DAYS`}
            </Typography>
            <Typography variant={"h5"} color={"white"}
                        style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
                {`${absoluteLaunchDaysHours.hours} HOURS`}
            </Typography>
            {isPast && (
                <Typography variant="h6" color="gray">
                    AGO
                </Typography>
            )}
        </div>
    )
}

const launchPadName = (name: string | null) => {
    if (name == null) return null;

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Typography variant="h6" color="gray">
                FROM
            </Typography>
            <Typography variant="h5" color="white">
                {stripBrackets(name)}
            </Typography>
        </div>
    );
};

const launchPadCoordinates = (latitude: number | null, longitude: number | null) => {
    if (latitude == null || longitude == null) {
        return null
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", gap: "0.5rem"}}>
                <Typography variant="h6" color="gray" component="span">
                    LAT:
                </Typography>
                <Typography variant="h5" color="white" component="span">
                    {latitude.toFixed(3)}
                </Typography>
            </div>
            <div style={{display: "flex", gap: "0.5rem"}}>
                <Typography variant="h6" color="gray" component="span">
                    LNG:
                </Typography>
                <Typography variant="h5" color="white" component="span">
                    {longitude.toFixed(3)}
                </Typography>
            </div>
        </div>
    );
};

export const LaunchDetailsHeader = (
    setPanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
    newsFeedDataArray: newsFeedDataInterface[]
) => (
    <div>
        <Typography
            variant="h5"
            align="center"
            alignSelf="center"
            width="100%"
        >
            <IconButton size="small" sx={{visibility: "hidden", ml: 0.5}}>
                <InfoOutlineIcon fontSize="small"/>
            </IconButton>
            Launch Details
            <Tooltip
                title="Some launch data might not be available due to reasons beyond our, or Launch Library II's, control">
                <IconButton size="small" sx={{ml: 0.5}}>
                    <InfoOutlineIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
        </Typography>

        <Button
            variant="text"
            onClick={() =>
                setPanelData({contentType: "newsFeed", content: newsFeedDataArray})
            }
        >
            {"< Go back to News Feed"}
        </Button>
    </div>
);

export const timeDeltaAndLaunchPadInfo = (
    launchDate: string,
    padName: string,
    latitude: number | null,
    longitude: number | null
) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
        }}
    >
        {launchDelta(launchDate)}
        {launchPadName(stripBrackets(padName))}
        {launchPadCoordinates(latitude, longitude)}
    </div>
);

const rocketStats = (
    totalSuccessfulLaunches: number | null,
    totalLaunches: number | null,
    height: number | null,
    diameter: number | null,
    launchMass: number | null,
    launchCost: number | null,
    isReusable: boolean | null
) => {
    const rocketLabelText = (text: string) => (
        <Typography color="gray" variant="h6" component="span">
            {` ${text}`}
        </Typography>
    );

    const formatLaunchText = (count: number) => {
        // Tyopgraphy is set in the calling function
        return (
            <>
                {count} {rocketLabelText(`LAUNCH${count === 1 ? "" : "ES"}`)}
            </>
        );
    };

    const formatFailureText = (count: number) => {
        // Tyopgraphy is set in the calling function
        return (
            <>
                {count} {rocketLabelText(`FAILURE${count === 1 ? "" : "S"}`)}
            </>
        );
    };

    const failureCount = totalSuccessfulLaunches != null && totalLaunches != null ? totalLaunches - totalSuccessfulLaunches : null;

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "end"}}>
            {totalSuccessfulLaunches != null && (
                // Label text is inside formatLaunchText
                <Typography color="green" variant="h5">
                    {formatLaunchText(totalSuccessfulLaunches)}
                </Typography>
            )}

            {failureCount != null && (
                // Label text is inside formatFailureText
                <Typography color="red" variant="h5">
                    {formatFailureText(failureCount)}
                </Typography>
            )}

            {height != null && (
                <Typography variant="h5">
                    {height} {rocketLabelText("METERS TALL")}
                </Typography>
            )}

            {diameter != null && (
                <Typography variant="h5">
                    {diameter} {rocketLabelText("METERS WIDE")}
                </Typography>
            )}

            {launchMass != null && (
                <Typography variant="h5">
                    {launchMass} {rocketLabelText("TONNES")}
                </Typography>
            )}

            {launchCost != null && (
                <Typography variant="h5">
                    ${launchCost.toLocaleString()} {rocketLabelText("TO LAUNCH")}
                </Typography>
            )}

            {isReusable != null && (
                <Typography color={isReusable ? "green" : "red"} variant="h5">
                    {isReusable ? "REUSABLE :D" : "NON-REUSABLE :("}
                </Typography>
            )}
        </div>
    );

};

export const LaunchDetails = (
    content: detailedLaunchDataInterface,
    setPanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
    newsFeedDataArray: newsFeedDataInterface[]
) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            gap: "1rem"
        }}>
            {LaunchDetailsHeader(setPanelData, newsFeedDataArray)}
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "1rem",
                justifyContent: "space-around"
            }}>
                <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                    {launchHeaderWithLink(stripBrackets(content.launchName), content.launcherConfiguration.infoURL, content.launcherConfiguration.wikiURL)}
                    {agencyHeaderWithLink(stripBrackets(content.agency.name), content.agency.link)}
                    {launchTimeDate(content.launchDate)}
                </div>
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                }}>
                    {timeDeltaAndLaunchPadInfo(
                        content.launchDate,
                        content.pad.name,
                        content.location.latitude,
                        content.location.longitude
                    )}
                    {rocketStats(
                        content.launcherConfiguration.totalSuccessfulLaunches,
                        content.launcherConfiguration.totalLaunches,
                        content.launcherConfiguration.height,
                        content.launcherConfiguration.diameter,
                        content.launcherConfiguration.launchMass,
                        content.launcherConfiguration.launchCost,
                        content.launcherConfiguration.isReusable)}
                </div>
            </div>
        </div>
    )
}
