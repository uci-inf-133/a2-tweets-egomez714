function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets
    .map(tweet => new Tweet(tweet.text, tweet.created_at))
    .filter(tweet => tweet.written);
}

function addEventHandlerForSearch() {
	document.getElementById('searchText').innerText = '';
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('tweetTable').innerHTML = '';
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    document.getElementById('searchText').innerText = event.target.value;

    const tbody = document.getElementById('tweetTable');
    tbody.innerHTML = ''; // always clear previous results

    let matchCount = 0;

    if (searchTerm !== '') {
        for (let i = 0; i < tweet_array.length; i++) {
            if (tweet_array[i].text.toLowerCase().includes(searchTerm)) {
                matchCount++;
                const row = document.createElement('tr');
                row.innerHTML = `<td>${matchCount}</td>
                                 <td>${tweet_array[i].activityType}</td>
                                 <td>${tweet_array[i].text}</td>`;
                tbody.appendChild(row);
            }
        }
    }
    // always update the count
    document.getElementById('searchCount').innerText = matchCount;
	});
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});