# Reddit Bot Flair Update Command Bot
This bot will follow a thread and __must have admin rights__ for setting suggested sort to new.\
Its purpose is to have a thread on your own subreddit where users can submit commands to update their user flairs.


## About <a name = "about"></a>

This bot __must have admin rights__ on the sub for setting the suggested sort to new.\
It will get the most recent top level comments from a specific thread which will be defined in the pw.env file.\
Each time a new comment is found it will validate the command and will update the user flair accordingly.


### Prerequisites

This application runs on NodeJS. Make sure you have an updated version of node downloaded to fit your system.\
You can find the download at https://nodejs.org/en/


Now that you have Node.js installed, you must create an account for the bot.



Once the account is created and you are logged into it, navigate to https://www.reddit.com/prefs/apps/


Here you will tell reddit about your bot and get the values needed to authenticate against the API.

1. click the [create app] button
2. give it a name
3. check the bubble for 'script'
4. give it a description
5. about url can be blank
6. redirect uri can be http://www.google.com (this doesn't matter but it must be there and be a valid uri)
7. Now that you have your script app created, you can use the values on this page to fill in your pw.env file

<img src='https://i.imgur.com/yq8akJ7.png'>


Before beginning the following steps, you must create a thread in your subreddit for the bot to follow.\
Take note of the thread id from the url bar. You'll need to enter this in the pw.env file

The post body should contain instructions on how to use the bot. For example:
```
To use this bot you must format a command like this:

!flair <flair css class> <optional flair text>

For example:

!flair red my flair text

This will result in your user flair being updated to a red background with text of "flair text"


Try !flair help for a list of css class to choose from
```

To create new flairs to add to your bot go into your Mod Dashboard and under Flairs & Emojis click on User flair.\
Create your flair and include any emojis you want in the Flair Text.\
Now give it a unique css class. No spaces, only dashes.\
Each of these css classes will need to be copy and pasted into your pw.env file.
<img src='https://i.imgur.com/7OzENr5.png'>


Navigate to pw.envEXAMPLE and remove EXAMPLE from the end of the filename.\
Now fill it in with the data you found at reddit.com/prefs/apps\
REDDIT_USER and REDDIT_PASS are the username and password of the bot account.\
MASTER_SUB will be the subreddit the bot will work on. The bot __must have admin rights__ to set the suggested sort of this thread to new.\
LIMIT defaults to 6 but can be set higher to check for missed requests while the bot was offline.\
DEBUG_CODE will display information about the submission queue.\
DEBUG_NETWORK will display all the http error codes received. After the initial startup, status code 200 is expected every 20 seconds.\
THREAD_ID is found in the url of your submission. See the following url:\
https://www.reddit.com/r/Bwz3rBot/comments/j4ispn/follow_this_post/


FLAIRS_LIST must be formatted as below:
```
USER_AGENT=''
CLIENT_ID=''
CLIENT_SECRET=''
REDDIT_USER=''
REDDIT_PASS=''
MASTER_SUB=''
DEBUG_CODE="false"
DEBUG_NETWORK="false"
THREAD_ID="j4596b"
LIMIT="5"
FLAIRS_LIST="blue,red,green,yellow,cake,dingus,coolio"
```



### Installing

Download the source code from this page.

Open up your terminal and cd into the folder of the files you just downloaded.

Install dependencies:
```
npm i
```

Run the bot:
```
node src/app.js
```