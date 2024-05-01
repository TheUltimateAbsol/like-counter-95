import { Rettiwt, Tweet, TweetFilter } from "rettiwt-api";
import {writeFileSync, readFileSync} from 'fs';

var likeData = JSON.parse(readFileSync('./like_data.json'))
var viewData = JSON.parse(readFileSync('./view_data.json'))


const API_KEY=process.env.API_KEY
const rettiwt = new Rettiwt({ apiKey: API_KEY});


function saveToDisk(newLikes, newViews){
	likeData = Object.assign(likeData, newLikes)
	viewData = Object.assign(viewData, newViews)
	writeFileSync('like_data.json', JSON.stringify(likeData));
	writeFileSync('view_data.json', JSON.stringify(viewData));
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }


async function getTweets(num){
	let tweets = []
	let found = 0
	let token = undefined
	let timeout = 0;
	while (found < num){
		try {
			const result = await rettiwt.tweet.search({ fromUsers: ['alkalinedd'] }, 20, token)
			for (let i = 0; i < result.list.length && found < num; i++){
				tweets.push(result.list[i])
				found++
			}
			// Find next token
			if (!result.next) break
			token = result.next.value

			await delay(1000) // avoid api rate limit throttle
			timeout = 0
		} 
		catch (error) {
			// Back out if api rate limit is a failure
			if (timeout > 900)
				break
			// If temporarily throttled, wait
			if (error.response && error.response.status == 429){
				await delay(30000)
				timeout += 30
				continue
			}
			// Otherwise exit
			else {
				break
			}
		}
	}
	return tweets
}


// Gets user tweets that are not replies and do not contain media
const target = parseInt(process.argv[2])
let tweets = await getTweets(target)
const newLikes = tweets.reduce(
	(accumulator, currentValue) => Object.assign(accumulator, {[currentValue.id] : currentValue.likeCount}),
	{},
  );
const newViews = tweets.reduce(
	(accumulator, currentValue) => Object.assign(accumulator, {[currentValue.id] : currentValue.viewCount == null ? 0 : currentValue.viewCount }),

	{},
  );
saveToDisk(newLikes, newViews)
let like_sum = Object.values(likeData).reduce((a, b) => a + b, 0)
let view_sum = Object.values(viewData).reduce((a, b) => a + b, 0)
console.log(like_sum, view_sum)

