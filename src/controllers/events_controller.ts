import {
    loadNewsFeedData
} from "../model/events.js"


const getNews = async () => {
    return await loadNewsFeedData();
}


export {
    getNews
}