import {
    loadNewsFeedData
} from "../model/events.ts"


const getNews = async () => {
    return await loadNewsFeedData();
}


export {
    getNews
}