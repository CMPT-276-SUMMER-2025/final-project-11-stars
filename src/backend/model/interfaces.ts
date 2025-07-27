export interface basicLaunchDataInterface {
    id: string;
    name: string;
    lng: number;
    lat: number;
}

export interface detailedLaunchDataInterface {
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
    contentType: "loading" | "newsFeed" | "launchDetails";
    content: "" | newsFeedDataInterface[] | detailedLaunchDataInterface;
}

export interface satelliteTLEInterface {
    name: string;
    line1: string;
    line2: string;
}
