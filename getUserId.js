import { Rettiwt } from 'rettiwt-api';

// Creating a new Rettiwt instance
// Note that for accessing user details, 'guest' authentication can be used
const rettiwt = new Rettiwt();

// Fetching the details of the user whose username is <username>
rettiwt.user.details('TeamInk95')
.then(details => {
	console.log(details)
})
.catch(error => {
	console.log('failure')
});
