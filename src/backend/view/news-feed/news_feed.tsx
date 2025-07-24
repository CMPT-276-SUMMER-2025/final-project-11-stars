import type {newsFeedDataInterface} from "../../model/interfaces.ts";
import dayjs from "dayjs";
import Image from "mui-image";
import {LinearProgress, Link, Typography} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

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
        <Typography variant={"h5"} align={"center"}>News Feed</Typography>
        {newsFeedItem(content[0])}
        {newsFeedItem(content[1])}
        {newsFeedItem(content[2])}
    </div>)
}