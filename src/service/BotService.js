const colors = require('colors');
const Snoowrap = require('snoowrap');
const requester = require('../config/snoo-config').actionRequester;
const command = require('../util/command');
const fl = process.env.FLAIRS_LIST;
const flairsList = fl.split(',');
const fs = require('fs');
const {
    request
} = require('http');

// This is where your code will go. It must return a promise!
// This function is called each time a new message is popped from the array.
// It gives you a pre-fetched 'RedditObject' of type comment(mention).
// The InboxStreamGenerator will always give you the first 5 mentions - unread or not
// So be sure to be save-checking saving and every time!
async function doSomething(item) {
    // Checking if the item was saved will keep the bot from processing anything twice.
    if (!item.saved) {
        console.log(`BotService processing item: ${item.id}`.green)
        //
        // CODE STARTS HERE //
        console.log(`From: u/${item.author.name.yellow}`)
        console.log(`Command: ${item.body.yellow}`)

        let cmd = command.buildCMD(item.body);
        if (cmd != null) {
            await assignFlairs(cmd, item);
        } else {
            await requester.getComment(item.id).reply("Comment must be formatted as a command with prefix = !")
        }


        // CODE ENDS HERE //
        //
        // Be sure to finish with saveItem(item) so the item will not be processed again.
        await saveItem(item) // Leave this line where it is!
        return console.log(`item  ${item.id} successfully processed!`)
    } else {
        return console.log(`item ${item.id} saved already. Skipping...`.gray)
    }
}

// 
// Write your functions down here and call them inside of doSomething.

async function assignFlairs(cmd, item) {
    console.log("command: ", cmd)


    if (cmd.directive == "flair") {
        // Process the Command
        su = await loadSavedUsers();
        savedUsers = su.split(',');
        let user = savedUsers.find(user => user == item.author.name)
        if (user) {
            console.log("Found user within the array. Returning from function with Error Message...".red)
            return requester.getComment(item.id).reply("Flair already set!")
        }

        let randomIndex = Math.floor(Math.random() * Math.floor(flairsList.length))
        let foundFlair = flairsList[randomIndex]
        let defaultText;
        let cssClass;
        await requester.getSubreddit(process.env.MASTER_SUB).getUserFlairTemplates()
            .then(templates => {
                const foundTemplate = templates.find(template => template.flair_css_class == foundFlair)
                console.log("Found this template: ", foundTemplate)
                defaultText = foundTemplate.flair_text;
                cssClass = foundTemplate.flair_css_class
            })
        console.log("Flair text will be: ", defaultText.trim());
        await requester.getUser(item.author.name).assignFlair({
            subredditName: process.env.MASTER_SUB,
            text: defaultText.trim(),
            cssClass: cssClass
        })
        await saveUserName(item.author.name)
    } else {
        console.log("command directive was NOT flair".red)
        await requester.getComment(item.id).reply('Try using command: !flair')
    }

}

// Load Saved Users File
async function loadSavedUsers() {
    return new Promise((resolve, reject) => {
        fs.readFile('./users.json', 'utf8', function (err, data) {
            if (err) {
                console.log("No existing data!".red)
                reject(null)
            } else {
                resolve(data)
            }
        })
    })

}

// 
async function saveUserName(name) {
    console.log("saving user to file...".green)
    fs.appendFile('./users.json', `${name.trim()},`, (err) => {
        if (err) {
            throw err
        }
    });

}

// 
// Leave this function alone!
async function saveItem(item) {
    console.log("saving the comment...".grey)
    return requester.getComment(item.id).save();
}
module.exports = {
    doSomething: doSomething
}