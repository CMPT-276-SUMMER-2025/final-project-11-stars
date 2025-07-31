import type {
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../../model/interfaces.ts";
import React from "react";
import dayjs from "dayjs";
import {Button, IconButton, Link, Tooltip, Typography} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

const getabsoluteLaunchDaysHoursDifference = (dateStr: string): { hours: number; days: number } => {
    const launchDate = dayjs(dateStr);
    const now = dayjs();

    const differenceInMiliseconds = Math.abs(launchDate.diff(now));

    const totalHours = Math.floor(differenceInMiliseconds / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return {days: days, hours: hours};
}

const formatDateToText = (date: string): string => {
    const launchDate = dayjs(date);
    const formattedDate = launchDate.format("MMMM DD, YYYY - HH:mm");

    const timeZoneAbbr = new Intl.DateTimeFormat("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: "short"
    }).format(launchDate.toDate()).split(' ').pop();

    return `${formattedDate} ${timeZoneAbbr}`.toUpperCase();
}

const launchText = (launchName: string, infoURL: string | null, wikiURL: string | null) => {
    const [topText, bottomText] = launchName.split(" | ");
    const URL = infoURL || wikiURL;

    return (
        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
            {URL ? (
                <Link href={URL} underline="hover" style={{display: "flex", flexDirection: "row", width: "100%"}}>
                    <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
                        <Typography variant="h3" align="center">
                            {topText}
                        </Typography>
                        <Typography variant="h3" align="center">
                            {bottomText}
                        </Typography>
                    </div>
                    <LinkIcon/>
                </Link>
            ) : (
                <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
                    <Typography variant="h3" align="center">
                        {topText}
                    </Typography>
                    <Typography variant="h3" align="center">
                        {bottomText}
                    </Typography>
                </div>
            )}
        </div>
    );
};

const agencyText = (agencyName: string, agencyLink: string | null) => {
    return (
        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
            {agencyLink ? (
                <Link href={agencyLink} underline="hover">
                    <Typography color="gray" variant="h4" align={"center"}
                                style={{display: "flex", flexDirection: "row"}}>
                        {agencyName} <LinkIcon/>
                    </Typography>
                </Link>
            ) : (
                <Typography color="gray" variant="h4" align={"center"}>
                    {agencyName}
                </Typography>
            )}
        </div>
    );
};

const launchTimeDate = (date: string) => {
    return (
        <Typography variant={"h5"} color={"white"}>
            {formatDateToText(date)}
        </Typography>
    )
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
            <Typography variant={"h4"} color={"white"}>
                {`${absoluteLaunchDaysHours.days} DAYS`}
            </Typography>
            <Typography variant={"h4"} color={"white"}
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

const launchLocation = (latitude: number | null, longitude: number | null, padName: string | null) => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div>
                {padName != null && (
                    <>
                        <Typography variant="h6" color="gray">
                            FROM PAD
                        </Typography>
                        <Typography variant="h4" color="white">
                            {padName}
                        </Typography>
                    </>
                )}
                {latitude != null && longitude != null && (
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography
                            variant="h5"
                            color="gray"
                        >
                            {`LAT: ${latitude.toFixed(3)}`}
                        </Typography>
                        <Typography
                            variant="h5"
                            color="gray"
                        >
                            {`LNG: ${longitude.toFixed(3)}`}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};


const rocketStats = (
    totalSuccessfulLaunches: number | null,
    totalLaunches: number | null,
    height: number | null,
    diameter: number | null,
    launchMass: number | null,
    launchCost: number | null,
    isReusable: boolean | null
) => {
    const formatLaunchText = (count: number) =>
        `${count} LAUNCH${count === 1 ? "" : "ES"}`;

    const failureCount =
        totalSuccessfulLaunches != null && totalLaunches != null
            ? totalLaunches - totalSuccessfulLaunches
            : null;

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "end"}}>
            {totalSuccessfulLaunches != null ? (
                <Typography color="green" variant="h5">
                    {`${formatLaunchText(totalSuccessfulLaunches)} SUCCESSFUL`}
                </Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Launch Success Count Unavailable
                </Typography>
            )}

            {failureCount != null ? (
                <Typography color="red" variant="h5">
                    {`${formatLaunchText(failureCount)} FAILED`}
                </Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Launch Failure Count Data Unavailable
                </Typography>
            )}

            {height != null ? (
                <Typography variant="h5">{`${height} METERS TALL`}</Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Height Data Unavailable
                </Typography>
            )}

            {diameter != null ? (
                <Typography variant="h5">{`${diameter} METERS WIDE`}</Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Diameter Data Unavailable
                </Typography>
            )}

            {launchMass != null ? (
                <Typography variant="h5">{`${launchMass} KG`}</Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Launch Mass Data Unavailable
                </Typography>
            )}

            {launchCost != null ? (
                <Typography variant="h5">{`$${launchCost.toLocaleString()} TO LAUNCH`}</Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Launch Cost Data Unavailable
                </Typography>
            )}

            {isReusable != null ? (
                <Typography color={isReusable ? "green" : "red"} variant="h5">
                    {isReusable ? "REUSABLE :D" : "NON-REUSABLE :("}
                </Typography>
            ) : (
                <Typography color="orange" variant="h5">
                    Reusability Data Unavailable
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
            justifyContent: "space-between"
        }}>
            <div>
                <Typography
                    variant="h5"
                    align="center"
                    alignSelf={"center"}
                    width={"100%"}
                >
                    <IconButton size="small" sx={{visibility: "hidden", ml: 0.5}}>
                        <InfoOutlineIcon fontSize="small"/>
                    </IconButton>
                    Launch Details
                    <Tooltip
                        title={"Some launch data might not be available due to reasons beyond our, or Launch Library II's, control"}>
                        <IconButton size="small" sx={{ml: 0.5}}>
                            <InfoOutlineIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </Typography>

                <Button variant="text"
                        onClick={() => setPanelData({contentType: "newsFeed", content: newsFeedDataArray})}>
                    {"< Go back to News Feed"}
                </Button>
            </div>
            <div style={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    justifyContent: "space-around"
                }}>
                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                        {launchText(content.launchName, content.launcherConfiguration.infoURL, content.launcherConfiguration.wikiURL)}
                        {agencyText(content.agency.name, content.agency.link)}
                    </div>

                    <div style={{
                        width: "100%",
                        minHeight: "50%",
                        maxHeight: "100%",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            justifyContent: "space-around"
                        }}>
                            {launchTimeDate(content.launchDate)}
                            {launchDelta(content.launchDate)}
                            {launchLocation(content.location.latitude, content.location.longitude, content.pad.name)}
                        </div>

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
        </div>
    )
}
