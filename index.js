const { Client } = require("@notionhq/client")
const NotionApi = require("./src/notion")
const GitUpdate = require("./src/NodeGit")

require('dotenv').config()


;(async () => {
    const Notion = new NotionApi(process.env.NOTION_PAGE_ID, process.env.NOTION_TOKEN, Client)
    const content = await Notion.getDatabaseInformation()

    const Gitupdate = new GitUpdate(content)
    Gitupdate.cloneRepository()
    /* Gitupdate.updateRepository() */

})();