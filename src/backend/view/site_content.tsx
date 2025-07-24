import {GlobeContainer} from "./globe_component.tsx";
import {LaunchDateRangePickersAndSubmitButton} from "./launches_controller.tsx";
import React, {useEffect, useState} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../model/interfaces.ts";
import dayjs, {Dayjs as type_dayjs} from "dayjs"
import {AnimatePresence, motion} from "framer-motion";
import {Button, LinearProgress, Link, Typography} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import Divider from '@mui/material/Divider';
// mui-image does not have types, so none can be installed to prevent the error.
//@ts-ignore
import Image from "mui-image"
import {loadNewsFeedData} from "../model/events.ts";


const newsFeed = (content: newsFeedDataInterface[]) => {
    const newsFeedItem = (content: newsFeedDataInterface) => {
        const formattedDate = dayjs(content.date).format('MMMM Do, YYYY');
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "3fr 8fr",
                    aspectRatio: 5,
                    gap: "0.5rem",
                    padding: "0 1.75rem",
                    height: "100%",
                    width: "100%"
                }}
            >
                <Image src={content.imageURL} style={{aspectRatio: "1/1"}}/>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        height: "100%",
                        width: "100%",
                        justifyContent: "start"
                    }}
                >
                    <Link
                        href={content.sourceURL}
                        underline="hover"
                        style={{display: "flex", flexDirection: "row"}}
                    >
                        <Typography color="primary" variant="h5">
                            {content.headline} <LinkIcon/>
                        </Typography>
                    </Link>
                    <Typography color="gray" variant="h6">
                        {content.eventType} on {formattedDate}
                    </Typography>
                    <Typography color="primary" variant="body2">
                        {content.bodyText}
                    </Typography>
                </div>
            </div>
        );
    };

    return (<div style={{
        display: "flex",
        flexDirection: "column",
        width: '100%',
        height: "100%",
        gap: "1rem"
    }}>
        <Typography variant={"h5"} align={"center"}>News Feed</Typography>
        {newsFeedItem(content[0])}
        {newsFeedItem(content[1])}
        {newsFeedItem(content[2])}
    </div>)
}

const launchDetails = (
    content: detailedLaunchDataInterface,
    setPanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
    newsFeedDataArray: newsFeedDataInterface[]
) => {
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

const loadingNews = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: '100%',
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem"
        }}>
            <Typography variant={"h6"} align={"center"}>
                Loading News Feed...
            </Typography>
            <div style={{width: "100%"}}>
                <LinearProgress/>
            </div>
        </div>
    )
}

export const newsOrLaunchDataSidePanel = (
    panelData: newsOrLaunchDataSidePanelDataInterface, setPanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
) => {
    const fadeVariants = {
        initial: {opacity: 0, transition: {duration: 0.5}},
        animate: {opacity: 1, transition: {duration: 0.5}},
        exit: {opacity: 0, transition: {duration: 0.5}}
    };
    const [newsFeedDataArray, setnewsFeedDataArray] = useState<newsFeedDataInterface[] | "">("")
    useEffect(() => {
        (async () => {
            setPanelData({contentType: "loading", content: ""});
            let newsFeedDataAsArray;
            try {
                // I have to use an intermediate variable or the code breaks. TODO - look into this
                newsFeedDataAsArray = await loadNewsFeedData()
                setnewsFeedDataArray(await loadNewsFeedData());
            } finally {
                setPanelData({contentType: "newsFeed", content: newsFeedDataAsArray});
            }
        })();
    }, []);

    return (
        <div style={{
            display: "flex",
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <AnimatePresence mode="wait">
                {(() => {
                    if (panelData.contentType === "newsFeed") {
                        return (
                            <motion.div
                                key="news"
                                variants={fadeVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {newsFeed(panelData.content as newsFeedDataInterface[])}
                            </motion.div>
                        );
                    } else if (panelData.contentType === "launchDetails") {
                        return (
                            <motion.div
                                key="details"
                                variants={fadeVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                style={{height: "100%", width: "100%"}}
                            >
                                {launchDetails(panelData.content as detailedLaunchDataInterface, setPanelData, newsFeedDataArray as newsFeedDataInterface[])}
                            </motion.div>
                        );
                    } else {
                        return (
                            <motion.div
                                key="loading"
                                variants={fadeVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {loadingNews()}
                            </motion.div>
                        );
                    }
                })()}
            </AnimatePresence>
        </div>
    )
};

export const SiteContent = (
    launchSearchStartDate: type_dayjs, setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs, setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    detailedLaunchDataArray: detailedLaunchDataInterface[], setdetailedLaunchDataArray: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>,
    basicLaunchData: basicLaunchDataInterface[], setbasicLaunchDataArray: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    newsOrLaunchDataSidePanelData: newsOrLaunchDataSidePanelDataInterface, setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'start',
            alignItems: 'center',
            width: "100%",
            height: "100%"
        }}>
            {GlobeContainer(basicLaunchData, detailedLaunchDataArray, setnewsOrLaunchDataSidePanelData)}
            <>
                <div style={{
                    width: window.innerWidth * (2 / 5),
                    height: window.innerHeight,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 0rem",
                }}>
                    {LaunchDateRangePickersAndSubmitButton(
                        launchSearchStartDate,
                        setlaunchSearchStartDate,
                        launchSearchEndDate,
                        setlaunchSearchEndDate,
                        setbasicLaunchDataArray,
                        setdetailedLaunchDataArray)}
                    <Divider orientation="horizontal" variant="middle"
                             style={{backgroundColor: "white", marginTop: "1rem"}} flexItem/>
                    {newsOrLaunchDataSidePanel(newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData)}
                </div>
            </>
        </div>
    )
}