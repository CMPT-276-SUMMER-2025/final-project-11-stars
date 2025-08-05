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
    const URL = infoURL ?? wikiURL;

    const content = (
        <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
            <Typography variant="h3" align="center">
                {topText}
            </Typography>
            <Typography variant="h3" align="center">
                {bottomText}
            </Typography>
        </div>
    );

    return (
        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
            {URL ? (
                <Link href={URL} underline="hover">
                    {content} <LinkIcon/>
                </Link>
            ) : (
                content
            )}
        </div>
    );
};
const agencyText = (agencyName: string, agencyLink: string | null) => {
    const content = (
        <Typography color="gray" variant="h4">
            {agencyName} <LinkIcon/>
        </Typography>
    );

    return (
        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
            {agencyLink ? (
                <Link href={agencyLink} underline="hover">
                    {content}
                </Link>
            ) : (
                content
            )}
        </div>
    );
};
const launchTimeDate = (date: string) => {
    const absoluteLaunchDaysHours = getabsoluteLaunchDaysHoursDifference(date);
    if (dayjs(date).isBefore(dayjs())) {
        // if launch date is in the past
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                alignItems: "start"
            }}>
                <Typography variant={"h5"} color={"white"}>
                    {formatDateToText(date)}
                </Typography>
                <Typography variant={"h6"} color={"gray"}>
                    LAUNCHED
                </Typography>
                <Typography variant={"h4"} color={"white"}>
                    {`${absoluteLaunchDaysHours.days} DAYS`}
                </Typography>
                <Typography variant={"h4"} color={"white"}
                            style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
                    {`${absoluteLaunchDaysHours.hours} HOURS`}
                </Typography>
                <Typography variant={"h6"} color={"gray"}>
                    AGO
                </Typography>
            </div>
        )
    } else {
        // launch date is in the future
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    alignItems: "start"
                }}>
                <Typography variant={"h6"} color={"gray"}>
                    LAUNCHING IN
                </Typography>
                <Typography variant={"h4"} color={"white"}>
                    {`${absoluteLaunchDaysHours.days} DAYS`}
                </Typography>
                <Typography variant={"h4"} color={"white"}
                            style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
                    {`${absoluteLaunchDaysHours.hours} HOURS`}
                </Typography>
            </div>
        )
    }
}
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
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
            {totalSuccessfulLaunches != null && (
                <Typography color="green" variant="h5">
                    {`${formatLaunchText(totalSuccessfulLaunches)} SUCCESSFUL`}
                </Typography>
            )}
            {failureCount != null && (
                <Typography color="red" variant="h5">
                    {`${formatLaunchText(failureCount)} FAILED`}
                </Typography>
            )}
            {height != null && (
                <Typography variant="h5">{`${height} METERS TALL`}</Typography>
            )}
            {diameter != null && (
                <Typography variant="h5">{`${diameter} METERS WIDE`}</Typography>
            )}
            {launchMass != null && (
                <Typography variant="h5">{`${launchMass} KG`}</Typography>
            )}
            {launchCost != null && (
                <Typography variant="h5">{`$${launchCost.toLocaleString()} TO LAUNCH`}</Typography>
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
            flex: 1,
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "space-between"
        }}>
            <div>
                <div style={{width: "100%", justifyContent: "center"}}>
                    <Typography
                        variant="h5"
                        align="center"
                        alignSelf={"center"}
                    >
                        Launch Details
                        <Tooltip
                            title={"Some launch data might not be available due to reasons beyond our, or Launch Library II's, control"}>
                            <IconButton size="small" sx={{ml: 0.5}}>
                                <InfoOutlineIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </Typography>
                </div>
                <Button variant="text"
                        style={{paddingLeft: "1.75rem"}}
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
                    maxWidth: "100%",
                    maxHeight: "100%",
                    justifyContent: "center",
                    alignItems: "start",
                    gap: "1rem",
                    padding: "0rem 1.75rem"
                }}>
                    {launchText(content.launchName, content.launcherConfiguration.infoURL, content.launcherConfiguration.wikiURL)}
                    {agencyText(content.agency.name, content.agency.link)}
                    <div style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        justifyContent: "space-between"
                    }}>
                        {launchTimeDate(content.launchDate)}
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
