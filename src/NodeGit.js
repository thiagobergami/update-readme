const NodeGit = require('nodegit');
const path = require('path');
const fs = require('fs');

class GitUpdate {
    constructor(content) {
        this.repoURL = 'https://github.com/thiagobergami/thiagobergami';
        this.localPath = path.join(__dirname, 'temp')
        this.readmeContent = content
    }

    async cloneRepository() {
        try {
            const repository = await NodeGit.Clone(this.repoURL, this.localPath);
            console.log('Repository cloned to', repository.workdir());

            const readmePath = path.join(this.localPath, 'README.md');
            const readmeData = await fs.readFile(readmePath, 'utf-8');
            console.log('Readme data:', readmeData);

            const nowSectionRegex = /💬 Now:(.*?)💭 Later:/s;

            const nowNames = this.readmeContent.get('Now')
                .map(item => `- [${item.name}](${item.url || '#'})`)
                .join('\n');

            const nowSection = `💬 Now: \n${nowNames}`;

            const laterNames = this.readmeContent.get('Later')
                .map(item => `- [${item.name}](${item.url || '#'})`)
                .join('\n');

            const laterSection = `💭 Later:\n${laterNames}`;

            const previouslyNames = this.readmeContent.get('Previously')
                .map(item => `- [${item.name}](${item.url || '#'})`)
                .join('\n');

            const previouslySection = `💤 Previously: \n${previouslyNames}`;

            const updateReadme = data.replace(nowSectionRegex, `💬 Now:\n${nowSection}\n💭 Later:`)
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

module.exports = GitUpdate