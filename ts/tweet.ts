class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("Just completed") || this.text.includes("Just posted")){
            return "completed_event";
        }
        else if (this.text.includes("Live")){
            return "live_event";
        }
        else if (this.text.includes("Achieved")){
            return "achievement";
        }
        else{
            return "miscellaneous";
        }
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        // Use the parsed writtenText to determine if there is user written content.
        // If writtenText returns a non-empty string, the tweet contains user-written text.
        return this.writtenText.length > 0;
    }

    get writtenText(): string {
        let t: string= this.text || "";

        // 1. Remove URLs (just look for "http" and cut it off)
        const httpIndex = t.indexOf("http");
        if (httpIndex !== -1) {
            t = t.substring(0, httpIndex);
        }

        // 2. Remove hashtags (#word)
        const hashIndex: number = t.indexOf("#");
        if (hashIndex !== -1) {
            t = t.substring(0, hashIndex);
        }

        // 3. Remove "@Runkeeper"
        t = t.replace("@Runkeeper", "");

        // 4. Clean up extra spaces
        t = t.trim().replace(/\s+/g, " ");

        // 5. Keep only what’s after the hyphen, if it exists
        const dashIndex: number = t.indexOf("-");
        if (dashIndex !== -1 && dashIndex < t.length - 1) {
            t = t.substring(dashIndex + 1).trim();
            return t;
        }
        return "";
    }


    get activityType(): string {
        if (this.source !== 'completed_event') {
            return "unknown";
        }

        // List of known activities
        const activities = [
            "run", "walk", "bike", "cycling", "swim", "elliptical", "spinning",
             "meditation", "hike", "freestyle", "workout", "yoga", 
            "ski", "snowboard", "kayak", "row", "skate", "climb"
        ];

        // Regex to match: e.g. "Just completed a 4.87 km run ..."
        // Find the activity after the distance/unit
        // example:[0] full regex, [1] distance, [2] unit, [3] activity
        const regex = /(?:completed|posted)\s*a\s*([\d.]+)\s*(km|mi|miles)\s*(\w+) /i;
        const match = this.text.match(regex);
        if (match && match[3]) {
            const candidate = match[3].toLowerCase().replace(/[.,!]/g, "");
            if (activities.includes(candidate)) {
                return candidate;
            }
        }
        return "unknown";
    }


    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        const regex = /(?:completed|posted)\s*a\s*([\d.]+)\s*(km|mi|miles)/i;
        const match = this.text.match(regex);
        if (match && match[1] && match[2]) {
            let distance = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            if (unit === "km") {
                distance *= .621371; // Convert miles to kilometers
            }
            return distance;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}