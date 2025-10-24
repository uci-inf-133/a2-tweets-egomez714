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


	var eCount = 0;
	var lCount = 0;
	var aCount = 0;
	var mCount = 0;
	var wCount = 0;

	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].source === 'completed_event'){eCount += 1;}
		if (tweet_array[i].source === 'live_event'){lCount += 1;}
		if (tweet_array[i].source === 'achievement'){aCount += 1;}
		if (tweet_array[i].source === 'miscellaneous'){mCount += 1;}
		if (tweet_array[i].written){wCount += 1;}
	}
	document.getElementsByClassName('completedEvents')[0].innerText = eCount;
	document.getElementsByClassName('completedEventsPct')[0].innerText = ((eCount / tweet_array.length) * 100).toFixed(2) + '%';
	

	document.getElementsByClassName('liveEvents')[0].innerText = lCount;
	document.getElementsByClassName('liveEventsPct')[0].innerText = ((lCount / tweet_array.length) * 100).toFixed(2) + '%';
	

	document.getElementsByClassName('achievements')[0].innerText = aCount;
	document.getElementsByClassName('achievementsPct')[0].innerText = ((aCount / tweet_array.length) * 100).toFixed(2) + '%';


	document.getElementsByClassName('miscellaneous')[0].innerText = mCount;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = ((mCount / tweet_array.length) * 100).toFixed(2) + '%';

	document.getElementsByClassName('completedEvents')[1].innerText = eCount;

	document.getElementsByClassName('written')[0].innerText = wCount;
	document.getElementsByClassName('writtenPct')[0].innerText = ((wCount / tweet_array.length) * 100).toFixed(2) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});