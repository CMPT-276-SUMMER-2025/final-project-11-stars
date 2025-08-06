export interface basicLaunchDataInterface {
    // For setting the globe data in relation to launches. detailedLaunchData /could/ be used as it contains the same information, but it's cleaner this way.
    id: string;
    name: string;
    lng: number;
    lat: number;
}

// ID for basic/detailed launchData are connected per each launch

export interface detailedLaunchDataInterface {
    // Contains all data about launches
    id: any;
    launchName: any;
    imageURL: any;
    launchStatus: any;
    launchDate: any;
    location: {
        longitude: any;
        latitude: any;
    };
    pad: {
        name: any;
        image: any;
    };
    agency: {
        name: any;
        description: any;
        logo: any;
        link: any;
    };
    launcherConfiguration: {
        name: any;
        image: any;
        infoURL: any;
        wikiURL: any;
        totalSuccessfulLaunches: any;
        totalLaunches: any;
        height: any;
        diameter: any;
        launchMass: any;
        launchCost: any;
        isReusable: any;
        manufacturer: any;
    };
}

export interface newsFeedDataInterface {
    imageURL: string;
    sourceURL: string;
    headline: string;
    eventType: string;
    date: string;
    bodyText: string;
}

export interface newsOrLaunchDataSidePanelDataInterface {
    // Parent interface for the side panel that switches between news and launch data. The loading state is used when neither is being shown.
    contentType: "loading" | "newsFeed" | "launchDetails";
    content: "" | newsFeedDataInterface[] | detailedLaunchDataInterface;
}

export interface satelliteTLEInterface {
    // This is how CELESTRAK formats satellite data. This has to be converted to the lat/lng format before being used.
    name: string;
    line1: string;
    line2: string;
}

export interface satellitePositionInterface {
    // This is how GlobeGL formats satellite data. This has to be converted from the TLE to be set.
    lat: number;
    lng: number;
    alt: number;
    id: string;
    name: string;
}