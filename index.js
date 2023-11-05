const { Client } = require("@notionhq/client")
const NotionApi = require("./src/notion")
const GitUpdate = require("./src/NodeGit")

require('dotenv').config()


    ; (async () => {
        const Notion = new NotionApi(process.env.NOTION_PAGE_ID, process.env.NOTION_TOKEN, Client)
        const content = await Notion.getDatabaseInformation()

        const userEmail = process.env.GITHUB_TOKEN
        const userName = process.env.GITHUB_TOKEN
        const token = process.env.GITHUB_TOKEN
        
        const Gitupdate = new GitUpdate(content, token, userName, userEmail)
        Gitupdate.checkAndRemoveDirectory()
            .then(() => Gitupdate.delay(2000))
            .then(() => {
                console.log("Deleting previous repository...");
                return Gitupdate.cloneRepository()
            })
            .then(() => Gitupdate.delay(3000))
            .then(() => {
                console.log("Waiting for repository clone...");
            })
            .then(() => {
                return Gitupdate.readReadmeFile()
            })
            .then((readmeData) => {
                return Gitupdate.processReadmeData(readmeData)
            })
            .then((newReadmeContent) => {
                return Gitupdate.updateReadmeFile(newReadmeContent)
            }).then(async () => await Gitupdate.commitAndPushChanges())
            .catch((err) => {
                console.error(`Error: ${err}`);
            });
    })();