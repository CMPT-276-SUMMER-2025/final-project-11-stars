import {GlobeContainer} from "./globe/globe_component.tsx";
import {LaunchDateRangePicker} from "./launches/launch_date_picker.tsx";
import React, {useEffect} from "react";
import type {
    basicLaunchDataInterface,
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface,
    satelliteTLEInterface
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
            let newsFeedDataIntermediateArray;
            try {
                // Use of an intermediate variable is required here, as the state doesn't get updated internally.
                newsFeedDataIntermediateArray = await loadNewsFeedData()
                setnewsFeedDataArray(newsFeedDataIntermediateArray);
            } finally {
                setPanelData({contentType: "newsFeed", content: newsFeedDataIntermediateArray});
            }
        })();
    }, []);
    return (
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
                            style={{height: "100%", width: "100%"}}
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
                            style={{height: "100%", width: "100%"}}
                        >
                            {LoadingNews()}
                        </motion.div>
                    );
                }
            })()}
        </AnimatePresence>
    )
};

export const SiteContent = (
    launchSearchStartDate: type_dayjs, setlaunchSearchStartDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    launchSearchEndDate: type_dayjs, setlaunchSearchEndDate: React.Dispatch<React.SetStateAction<type_dayjs>>,
    detailedLaunchDataArray: detailedLaunchDataInterface[], setdetailedLaunchDataArray: React.Dispatch<React.SetStateAction<detailedLaunchDataInterface[]>>,
    basicLaunchDataArray: basicLaunchDataInterface[], setbasicLaunchDataArray: React.Dispatch<React.SetStateAction<basicLaunchDataInterface[]>>,
    newsFeedDataArray: newsFeedDataInterface[], setnewsFeedDataArray: React.Dispatch<React.SetStateAction<newsFeedDataInterface[]>>,
    newsOrLaunchDataSidePanelData: newsOrLaunchDataSidePanelDataInterface, setnewsOrLaunchDataSidePanelData: React.Dispatch<React.SetStateAction<newsOrLaunchDataSidePanelDataInterface>>,
    satelliteTLEArray: satelliteTLEInterface[], setsatelliteTLEArray: React.Dispatch<React.SetStateAction<satelliteTLEInterface[]>>
) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%"
        }}>
            <div style={{
                width: "60%",
                height: "100%",
                display: "flex",
            }}>
                {GlobeContainer(basicLaunchDataArray, detailedLaunchDataArray, satelliteTLEArray, setsatelliteTLEArray, setnewsOrLaunchDataSidePanelData)}
            </div>
            <div style={{
                width: "40%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 0rem 2rem 0rem"
            }}>
                {LaunchDateRangePicker(
                    launchSearchStartDate, setlaunchSearchStartDate,
                    launchSearchEndDate, setlaunchSearchEndDate,
                    basicLaunchDataArray, setbasicLaunchDataArray,
                    setdetailedLaunchDataArray,
                    newsFeedDataArray,
                    setnewsOrLaunchDataSidePanelData)}
                <Divider orientation="horizontal"
                         variant="middle"
                         style={{backgroundColor: "white"}}
                         flexItem
                />
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0rem 1.75rem"
                }}>
                    {SidePanelWithAnimatedTransitions(newsFeedDataArray, setnewsFeedDataArray, newsOrLaunchDataSidePanelData, setnewsOrLaunchDataSidePanelData)}
                </div>
            </div>
        </div>
    )
}