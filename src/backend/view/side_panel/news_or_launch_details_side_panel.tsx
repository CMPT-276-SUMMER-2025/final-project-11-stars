import React, {useEffect} from "react";
import type {
    detailedLaunchDataInterface,
    newsFeedDataInterface,
    newsOrLaunchDataSidePanelDataInterface,
} from "../../model/interfaces.ts";
import {AnimatePresence, motion} from "framer-motion";
//@ts-ignore // mui-image does not have types, so none can be installed to prevent the error.
import {loadNewsFeedData} from "../../model/events.ts";
import {LoadingNews, NewsFeed} from "./news-feed/news_feed.tsx";
import {LaunchDetails} from "./launches/launch_details.tsx";

export const NewsOrLaunchDetailsSidePanel = (
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
        </div>
    )
};
