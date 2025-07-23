import {GlobeContainer} from "./globe_component.tsx";
import {LaunchDateRangePickersAndSubmitButton} from "./launches_controller.tsx";
import React, {useEffect} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../model/interfaces.ts";
import dayjs, {Dayjs as type_dayjs} from "dayjs"
import {AnimatePresence, motion} from "framer-motion";
import {LinearProgress, Link, Typography} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
// mui-image does not have types, so none can be installed to prevent the error.
//@ts-ignore
import Image from "mui-image"
import {loadNewsFeedData} from "../model/events.ts";

const fadeVariants = {
    initial: {opacity: 0, transition: {duration: 0.5}},
    animate: {opacity: 1, transition: {duration: 0.5}},
    exit: {opacity: 0, transition: {duration: 0.5}}
};


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
// Not currently used - needs to be done on feature #2 branch
//@ts-ignore
const launchDetails = (content: detailedLaunchDataInterface | { launchName: string }) => {
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        width: '100%',
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem"
    }}>
        <p>{content.launchName}</p>
    </div>)
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


export const newsOrLaunchDataSidePanel = (data: newsOrLaunchDataSidePanelDataInterface, setData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
) => {
    useEffect(() => {
        (async () => {
            let newsFeedData;
            setData({contentType: "loading", content: ""});
            try {
                newsFeedData = await loadNewsFeedData()
            } finally {
                setData({contentType: "newsFeed", content: newsFeedData});
            }
        })();
    }, []);
    return (
        <AnimatePresence mode="wait">
            {(() => {
                if (data.contentType === "newsFeed") {
                    return (
                        <motion.div
                            key="news"
                            variants={fadeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {newsFeed(data.content as newsFeedDataInterface[])}
                        </motion.div>
                    );
                } else if (data.contentType === "launchDetails") {
                    return (
                        <motion.div
                            key="details"
                            variants={fadeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                width: '100%',
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "1rem"
                            }}>
                                LAUNCHDETAILS
                            </div>
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
    )
};

export const SiteContent = (
    launchSearchStartDate: type_dayjs,
    setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs,
    setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    basicLaunchData: basicLaunchDataInterface[],
    setbasicLaunchData: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    _detailedLaunchData: detailedLaunchDataInterface[], //todo - remove _ when used
    setdetailedLaunchData: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>,
    newsOrLaunchDataSidePanelData: newsOrLaunchDataSidePanelDataInterface,
    setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>
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
            {GlobeContainer({basicLaunchData})}
            <>
                <div style={{
                    width: window.innerWidth * (2 / 5),
                    height: window.innerHeight,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    gap: "1rem",
                    padding: "1rem 0rem",
                }}>
                    {LaunchDateRangePickersAndSubmitButton(
                        launchSearchStartDate,
                        setlaunchSearchStartDate,
                        launchSearchEndDate,
                        setlaunchSearchEndDate,
                        setbasicLaunchData,
                        setdetailedLaunchData)}
                    {newsOrLaunchDataSidePanel(newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData)}
                </div>
            </>
        </div>
    )
}