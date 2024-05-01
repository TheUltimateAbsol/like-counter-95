Dependencies: jq and snscrape

```
sudo apt install jq
pip3 install snscrape
```

Run as a cronjob:
```
*/15 * * * * /data/data/com.termux/files/usr/bin/bash /data/data/com.termux/files/home/update.sh 20
0 1 * * * /data/data/com.termux/files/usr/bin/bash /data/data/com.termux/files/home/update.sh 100
0 0 1 * * /data/data/com.termux/files/usr/bin/bash /data/data/com.termux/files/home/update.sh 3200
```

Make sure to have some way of running it
```
cd /data/data/com.termux/files/home/like-counter
git pull
/data/data/com.termux/files/usr/bin/bash update.sh $1 /data/data/com.termux/files/usr/bin/python "TWITTER_BEARER_TOKEN" "USER_ID"
git add index.html likes.txt followers.txt
git commit -m "data update"
git push
```