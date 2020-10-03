const colors = require('colors');
const Snoowrap = require('snoowrap');
const requester = require('../config/snoo-config').actionRequester;
const command = require('../util/command');
const fl = process.env.FLAIRS_LIST;
const flairsList = fl.split(',');

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
        console.log(item.body.yellow)

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
        return console.log(`item ${item.id} saved already. Skipping...`)
    }
}

// 
// Write your functions down here and call them inside of doSomething.

async function assignFlairs(cmd, item) {
    console.log("command: ", cmd)
    // Process the Command
    if (cmd.directive == "flair") {
        console.log("command directive was flair.".green)
        let flairToAssign = cmd.args[0];
        console.log("flair to assign: ", flairToAssign)
        let foundFlair = flairsList.find(el => el == flairToAssign)

        if (foundFlair == undefined) {
            console.log("not found within the list. replying with error message.")
            return requester.getComment(item.id).reply(`Sorry, but ${cmd.args[0]} does not exist within the list of flairs!\n\nTry ${fl}`)
        } else {
            let flairText = new String();
            for (i = 1; i < cmd.args.length; i++) {
                flairText = flairText + " " + cmd.args[i]
            }

            let defaultText;
            await requester.getSubreddit(process.env.MASTER_SUB).getUserFlairTemplates()
                .then(templates => {
                    let foundTemplate = templates.find(template => template.flair_css_class == cmd.args[0])
                    console.log("Found this template: ", foundTemplate)
                    defaultText = foundTemplate.flair_text
                })
            if (cmd.args.length >= 2) {
                defaultText = flairText
            }
            console.log("Flair text will be: ", defaultText.trim());
            return requester.getUser(item.author.name).assignFlair({
                subredditName: process.env.MASTER_SUB,
                text: defaultText.trim(),
                cssClass: cmd.args[0],
            })
        }

    } else {
        console.log("command directive was NOT flair".red)
    }

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