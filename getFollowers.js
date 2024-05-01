import { Rettiwt } from "rettiwt-api";


const API_KEY=process.env.API_KEY
const rettiwt = new Rettiwt({ apiKey: API_KEY});

rettiwt.user.details('1710450814903291904')
.then(res => {
    console.log(res.followersCount);
})
.catch(err => {
    console.error(err);
});

