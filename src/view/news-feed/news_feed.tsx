import type {newsFeedDataInterface} from "../../../model/interfaces.ts";
import dayjs from "dayjs";
import Image from "mui-image";
import {Alert, IconButton, LinearProgress, Link, Tooltip, Typography} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

const NoNewsAlert = () => {
    return (
        <div style={{
            display: "flex",
            width: '100%',
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Alert severity="error" style={{width: "100%"}}>
                News is currently unavailable - check in later.
            </Alert>
        </div>
    );
}

const newsFeedItem = (content: newsFeedDataInterface) => {
    const truncateToNearestSentenceOrWord = (str: string) => {
        let returnString;
        const slicedAt150Chars = str.slice(0, 150); // Slice the string at 150 characters to start with
        const periodIndex = slicedAt150Chars.lastIndexOf('.'); // Get the index, if it exsits, of the last period in the string
        const spaceIndex = slicedAt150Chars.lastIndexOf(' '); // Get the index, if it exsits, of the last space in the string
        // lastIndexOf(STRING) returns -1 if there is no such character in STRING
        if (periodIndex > -1) {
            returnString = slicedAt150Chars.slice(0, periodIndex) + '…' // Prefer period truncations
        } else if (spaceIndex > -1) {
            returnString = slicedAt150Chars.slice(0, periodIndex) + '…' // Fall back to space truncations
        } else {
            returnString = slicedAt150Chars; // Incredibly unlikely, but kept in case of non-standard space chracters
        }
        return returnString;
    };
    const truncatedBodyText = truncateToNearestSentenceOrWord(content.bodyText);
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
                    justifyContent: "start",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
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
                <Tooltip
                    title={content.bodyText}>
                    <Typography
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {truncatedBodyText}
                    </Typography>
                </Tooltip>
            </div>
        </div>
    );
};

export const LoadingNews = () => {
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

export const NewsFeed = (content: newsFeedDataInterface[]) => {
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        width: '100%',
        height: "100%",
        gap: "1rem"
    }}>
        {content == undefined || content.length < 3 ? (
            <NoNewsAlert/>
        ) : (
            <>
                <Typography variant={"h5"} align={"center"}>News Feed
                    <Tooltip
                        title={<>The three nearest upcoming space-related events are
                            shown. <br/> If a news description is cut off, hover over it to see the full text.</>}
                        arrow>
                        <IconButton size="small" sx={{ml: 0.5}}>
                            <InfoOutlineIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </Typography>
                {newsFeedItem(content[0])}
                {newsFeedItem(content[1])}
                {newsFeedItem(content[2])}
            </>
        )}
    </div>)
}
