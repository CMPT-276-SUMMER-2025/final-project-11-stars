import {GlobeContainer} from "./globe/globe_component.tsx";
import {LaunchDateRangePicker} from "./launches/launch_date_picker.tsx";
import React, {useEffect} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface
} from "../model/interfaces.ts";
import {Dayjs as type_dayjs} from "dayjs"
import {AnimatePresence, motion} from "framer-motion";
import {Divider} from "@mui/material";
//@ts-ignore // mui-image does not have types, so none can be installed to prevent the error.
import {loadNewsFeedData} from "../model/events.ts";
import {LoadingNews, NewsFeed} from "./news-feed/news_feed.tsx";
import {LaunchDetails} from "./launches/launch_details.tsx";

const SidePanelWithAnimatedTransitions = (
    newsFeedDataArray: newsFeedDataInterface[], setnewsFeedDataArray: React.Dispatch<React.SetStateAction<newsFeedDataInterface[]>>,
    panelData: newsOrLaunchDataSidePanelDataInterface, setPanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
) => {
    const fadeVariants = {
        initial: {opacity: 0, transition: {duration: 0.5}},
        animate: {opacity: 1, transition: {duration: 0.5}},
        exit: {opacity: 0, transition: {duration: 0.5}}
    };
    useEffect(() => {
        (async () => {
            setPanelData({contentType: "loading", content: ""});
            let newsFeedDataAsArray;
            try {
                // I have to use an intermediate variable or the code breaks - Anton TODO - look into this
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
                                {NewsFeed(panelData.content as newsFeedDataInterface[])}
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
                                {LaunchDetails(panelData.content as detailedLaunchDataInterface, setPanelData, newsFeedDataArray as newsFeedDataInterface[])}
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
                                {LoadingNews()}
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
    basicLaunchDataArray: basicLaunchDataInterface[], setbasicLaunchDataArray: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    newsFeedDataArray: newsFeedDataInterface[], setnewsFeedDataArray: React.Dispatch<React.SetStateAction<newsFeedDataInterface[]>>,
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
            {GlobeContainer(basicLaunchDataArray, detailedLaunchDataArray, setnewsOrLaunchDataSidePanelData)}
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
                    {LaunchDateRangePicker(
                        launchSearchStartDate, setlaunchSearchStartDate,
                        launchSearchEndDate, setlaunchSearchEndDate,
                        basicLaunchDataArray, setbasicLaunchDataArray,
                        setdetailedLaunchDataArray,
                        newsFeedDataArray,
                        setnewsOrLaunchDataSidePanelData)}
                    <Divider orientation="horizontal" variant="middle"
                             style={{backgroundColor: "white", marginTop: "1rem"}} flexItem/>
                    {SidePanelWithAnimatedTransitions(
                        newsFeedDataArray, setnewsFeedDataArray,
                        newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData)}
                </div>
            </>
        </div>
    )
}