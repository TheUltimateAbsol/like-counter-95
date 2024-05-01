import tweepy, os

TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
USER_ID = os.getenv("USER_ID")

client = tweepy.Client(TWITTER_BEARER_TOKEN)
followers_count = client.get_user(id=USER_ID, user_fields="public_metrics").data.public_metrics["followers_count"]
print(followers_count)