function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Count each activity type
	const activity = new Map();
	for (const tweet of tweet_array) {
		const type = tweet.activityType;
		if (activity.has(type)) {
			activity.set(type, activity.get(type) + 1);
		} else {
			activity.set(type, 1);
		}
	}
	// Find most and least frequent activity types
	let mostFrequentActivity = null;
	let leastFrequentActivity = null;
	let mostCount = -Infinity;
	let leastCount = Infinity;
	for (const [type, count] of activity) {
		if (count > mostCount) {
			mostCount = count;
			mostFrequentActivity = type;
		}
		if (count < leastCount) {
			leastCount = count;
			leastFrequentActivity = type;
		}
	}
	// Update HTML spans
	document.getElementById('longestActivityType').innerText = mostFrequentActivity;
	document.getElementById('shortestActivityType').innerText = leastFrequentActivity;
	let weekendCount = 0;
	let weekdayCount = 0;
	// Count weekend vs weekday activities
	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].time.getDay() === 0 || tweet_array[i].time.getDay() === 6){weekendCount += 1;} 
		else {weekdayCount += 1;}	
	}
	document.getElementById('weekdayOrWeekendLonger').innerText = (weekendCount > weekdayCount) ? 'weekends' : 'weekdays';

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	// turns map data into array of objects for vega-lite activityArray.key returns activity type and activityArray.value returns count
	const activityArray = Array.from(activity, ([key, value] ) =>({key, value}));
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityArray
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": {
	      "field": "key",
	      "type": "nominal",
	      "title": "Activity"
	    },
	    "y": {
	      "field": "value",
	      "type": "quantitative",
	      "title": "Count"
	    }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	activityArray.sort((a, b) => b.value - a.value);
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const activityArr = [];
	for (let i = 0; i < tweet_array.length; i++){
		if(tweet_array[i].activityType === activityArray[0].key ||
			tweet_array[i].activityType === activityArray[1].key || 
			tweet_array[i].activityType === activityArray[2].key)
				activityArr.push({
					activity: tweet_array[i].activityType,
					day: tweet_array[i].time.toLocaleString('en-US', { weekday: 'long' }),
					distance: tweet_array[i].distance
				})
	}
	plotOne = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityArr
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {
	      "field": "day",
	      "type": "nominal",
	      "title": "Day of the Week"
	    },
	    "y": {
	      "field": "distance",
	      "type": "quantitative",
	      "title": "distance"
	    },
		"color":{
			"field":"activity",
			"type":"nominal"
		}
	  }
	};

	
	plotTwo = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityArr
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {
	      "field": "day",
	      "type": "nominal",
	      "title": "Day of the Week"
	    },
	    "y": {
	      "field": "distance",
	      "type": "quantitative",
	      "title": "distance"
	    },
		"color":{
			"field":"activity",
			"type":"nominal"
		}
	  }
	};



	

	let showPlotOne = true;
	document.getElementById('aggregate').addEventListener('click', function() {
		if (showPlotOne) {
		vegaEmbed('#activityVis', plotOne, {actions:false});
		} else {
		vegaEmbed('#activityVis', plotTwo, {actions:false});
		}
		showPlotOne = !showPlotOne;
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});