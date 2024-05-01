import tweepy, json, os, sys

TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
USER_ID = os.getenv("USER_ID")

client = tweepy.Client(TWITTER_BEARER_TOKEN)
with open("like_data.json", "r+") as f:
    like_data = json.load(f)
current_likes = sum(like_data.values())
with open("view_data.json", "r+") as f:
    view_data = json.load(f)
current_views = sum(view_data.values())

# retrieve first n=`max_results` tweets
def get_tweets(user_id, **kwargs):
    tweets_list = []
    max_results = kwargs.get("max_results", 20)
    request_size = max_results
    if request_size > 100:
        request_size = 100
    elif request_size < 5:
        request_size = 5
    kwargs["max_results"] = request_size
    tweets = client.get_users_tweets(id=user_id,  **kwargs)
    
    # retrieve using pagination until no tweets left
    while True:
        if not tweets.data:
            break
        tweets_list.extend(tweets.data)
        if len(tweets_list) >= max_results:
            break
        if not tweets.meta.get('next_token'):
            break
        tweets = client.get_users_tweets(
            id=user_id,
            pagination_token=tweets.meta['next_token'],
            **kwargs,
        )
    return tweets_list

def save_to_disk(new_like_data, new_view_data):
    like_data.update(new_like_data)
    with open("like_data.json", "w") as outfile:
        json.dump(like_data, outfile)
    view_data.update(new_view_data)
    with open("view_data.json", "w") as outfile:
        json.dump(view_data, outfile)


def update(tweet_count):
    tweets = get_tweets(user_id=USER_ID, max_results=tweet_count, exclude="retweets", tweet_fields="public_metrics")
    new_like_data = { str(tweet.id) : tweet.public_metrics["like_count"] for tweet in tweets }
    new_view_data = { str(tweet.id) : tweet.public_metrics["impression_count"] for tweet in tweets }
    save_to_disk(new_like_data, new_view_data)
    return sum(like_data.values()), sum(view_data.values())


args = sys.argv[1:]
try:
    new_likes, new_views = update(int(args[0]))
    print(new_likes, new_views)
except:
    print(current_likes, current_views)