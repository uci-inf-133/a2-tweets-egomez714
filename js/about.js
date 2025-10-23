function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	let max = -Infinity;
	let min = Infinity;
	for (let i = 0; i < tweet_array.length; i++){
		let temp = tweet_array[i].time.getTime();
		if (temp > max){
			max = temp;
		}
		if (temp < min){
			min = temp;
		}
	}
	document.getElementById('firstDate').innerText = new Date(min).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
	});
	document.getElementById('lastDate').innerText = new Date(max).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
	});

	var completeCount = 0;
	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].source === 'completed_event'){
			completeCount += 1;
		}
	}
	document.getElementsByClassName('completedEvents')[0].innerText = completeCount;
	document.getElementsByClassName('completedEventsPct')[0].innerText = ((completeCount / tweet_array.length) * 100).toFixed(2) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});