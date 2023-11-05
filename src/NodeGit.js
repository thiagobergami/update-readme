const NodeGit = require('nodegit');
const path = require('path');
const fs = require('fs');

class GitUpdate {
    constructor(content){
        this.repoURL = 'https://github.com/thiagobergami/thiagobergami';
        this.localPath = path.join(__dirname, 'temp')
        this.readmeContent = content
    }

    cloneRepository(){
        NodeGit.Clone(this.repoURL, this.localPath)
            .then((repository)=>{
                console.log('Reposiroty cloned to', repository.workdir())

                const readmePath = path.join(this.localPath, 'README.md');
                const readmeContents = fs.readFileSync(readmePath, 'utf8');
            })
    }
}

module.exports = GitUpdate