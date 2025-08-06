import type {newsFeedDataInterface} from "../../../model/interfaces.ts";
import dayjs from "dayjs";
import {Alert, IconButton, LinearProgress, Link, Tooltip, Typography} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import React from "react";

const NoNewsAlert = () => {
    return (
        <Alert severity="error">
            News is currently unavailable - check in later.
        </Alert>
    );
}

export const LoadingNews = () => {
    return (
        <>
            <Typography variant={"h6"} align={"center"} display={"flex"} flexDirection={"column"}>
                Loading News Feed...
                <div style={{width: "100%"}}>
                    <LinearProgress/>
                </div>
            </Typography>
        </>
    )
}

const newsFeedItem = (content: newsFeedDataInterface) => {
    const truncateToNearestSentenceOrWord = (str: string) => {
        let returnString;
        const slivedAt300Chars = str.slice(0, 300); // Slice the string at 150 characters to start with
        const periodIndex = slivedAt300Chars.lastIndexOf('.'); // Get the index, if it exsits, of the last period in the string
        const spaceIndex = slivedAt300Chars.lastIndexOf(' '); // Get the index, if it exsits, of the last space in the string
        if (str.length < 200) {
            returnString = str;
        }
        // lastIndexOf(STRING) returns -1 if there is no such character in STRING
        else if (periodIndex > -1) {
            returnString = slivedAt300Chars.slice(0, periodIndex) + '…' // Prefer period truncations
        } else if (spaceIndex > -1) {
            returnString = slivedAt300Chars.slice(0, periodIndex) + '…' // Fall back to space truncations
        } else {
            returnString = slivedAt300Chars; // Incredibly unlikely, but kept in case of non-standard space chracters
        }
        return returnString;
    };
    const truncatedBodyText = truncateToNearestSentenceOrWord(content.bodyText);
    const formattedDate = dayjs(content.date).format('MMMM Do, YYYY');

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                height: "100%",
                justifyContent: "center",
                flex: 1
            }}
        >
            {content.sourceURL ? (
                <Link
                    href={content.sourceURL}
                    underline="hover"
                    style={{display: "flex", flexDirection: "row"}}
                >
                    <Typography color="primary" variant="h5">
                        {content.headline} <LinkIcon/>
                    </Typography>
                </Link>
            ) : (
                <Typography color="primary" variant="h5">
                    {content.headline}
                </Typography>
            )}

            <Typography color="gray" variant="h6">
                {content.eventType} on {formattedDate}
            </Typography>
            <Tooltip
                title={content.bodyText}>
                <Typography>
                    {truncatedBodyText}
                </Typography>
            </Tooltip>
        </div>
    );
}

export const NewsFeed = (content: newsFeedDataInterface[]) => {
    if (!content || content.length == 0) { // if the news is invalid, display that the news is unavailable. the api error is handled in another function.
        return (<NoNewsAlert/>);
    } else {
        return (<div style={{
            display: "flex",
            flexDirection: "column",
            width: '100%',
            height: "100%",
            gap: "1rem"
        }}>
            <Typography variant="h5" align="center">
                <IconButton size="small" sx={{visibility: 'hidden', ml: 0.5}}>
                    <InfoOutlineIcon fontSize="small"/>
                </IconButton>
                News Feed
                <Tooltip
                    title={
                        <>
                            The 3 nearest upcoming space-related events are shown. <br/>
                            If a news description is cut off, hover over it to see the full text.
                        </>
                    }
                >
                    <IconButton size="small" sx={{ml: 0.5}}>
                        <InfoOutlineIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </Typography>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                height: "100%",
                width: "100%",
                overflowY: "auto"
            }}>
                {content.map((item, index) => (
                    <React.Fragment key={index}>
                        {newsFeedItem(item)}
                    </React.Fragment>
                ))}
            </div>
        </div>)
    }
}
