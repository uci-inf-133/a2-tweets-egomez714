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
        // Use the parsed writtenText as the canonical source of truth.
        // If writtenText returns a non-empty string, the tweet contains user-written text.
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        // Strategy:
        // 1. Remove the tweet URL(s) and the #Runkeeper hashtag (and other hashtags/mentions we know are default).
        // 2. If the RunKeeper-provided text contains a hyphen after the automatic portion
        //    (e.g. "Just posted a 10.34 km run - New PB on this route"), keep the text after the hyphen.
        // 3. Remove common boilerplate like "Check it out" and "with @Runkeeper".
        // 4. Trim punctuation/whitespace and return the remainder if any alphanumeric characters remain.

        let t = this.text || "";

        // remove URLs
        t = t.replace(/https?:\/\/\S+/gi, "");

        // remove the RunKeeper hashtag(s) and other hashtags
        t = t.replace(/#\w+/gi, "");

        // remove the @Runkeeper mention (but preserve other potential mentions)
        t = t.replace(/@Runkeeper\b/ig, "");

        // normalize whitespace
        t = t.replace(/\s+/g, ' ').trim();

        // If there's a hyphen following the automatic part, keep only what's after the hyphen.
        const hyphenMatch = t.match(/^just\s+(?:completed|posted)[^\-]*-\s*(.*)$/i);
        if (hyphenMatch && hyphenMatch[1]) {
            let remainder = hyphenMatch[1].trim();
            // clean leading/trailing punctuation
            remainder = remainder.replace(/^[\s\-:;.,!]+|[\s\-:;.,!]+$/g, '');
            return remainder;
        }

        // Remove leading automatic phrases like "Just completed ..." or "Just posted ..."
        t = t.replace(/^just\s+(?:completed|posted)[^\n]*/i, '');

        // remove common boilerplate
        t = t.replace(/\bcheck it out\b[!.]*/ig, '');
        t = t.replace(/\bwith\s+@?runkeeper\b[!.]*/ig, '');

        // remove any remaining mentions (optional)
        t = t.replace(/@\w+/g, '');

        // collapse spaces and trim punctuation
        t = t.replace(/\s{2,}/g, ' ').trim();
        t = t.replace(/^[\s\-:;.,!]+|[\s\-:;.,!]+$/g, '');
        t = t.trim();

        // If there's any alphanumeric content left, treat it as user-written text.
        if (/[A-Za-z0-9]/.test(t)) {
            return t;
        }

        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}