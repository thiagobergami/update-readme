class NotionApi {
    constructor(database_id, token, Client) {
        this.database_id = database_id
        this.notion = new Client({
            auth: token,
        })
    }

    async getDatabaseInformation() {
        const myPage = await this.notion.databases.query({
            database_id: this.database_id
        });
        const map = new Map();
        //now, later, previously
        map.set('Now', new Array())
        map.set('Later', new Array())
        map.set('Previously', new Array())
        for (let items of myPage.results) {
            const name = items.properties.Name.title[0].plain_text;
            const url = items.properties.Link.url;
            const type = items.properties.Tags.select.name;

            const obj = {
                'name': name,
                'url': url
            };
            
            map.get(type).push(obj)
        }
        return map
    }
}

module.exports = NotionApi