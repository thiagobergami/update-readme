const NodeGit = require('nodegit');
const path = require('path');
const fs = require('fs').promises;

class GitUpdate {
    constructor(content, token, userName, userEmail, repoURL) {
        this.repoURL = repoURL;
        this.localPath = path.join(__dirname, 'temp')
        this.readmeContent = content
        this.token = token
        this.userName = userName
        this.userEmail = userEmail
    }

    cloneRepository() {
        return NodeGit.Clone(this.repoURL, this.localPath);
    }

    delay(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    checkAndRemoveDirectory() {
        return fs.stat(this.localPath)
            .then((stats) => {
                if (stats.isDirectory()) {
                    return fs.rm(this.localPath, { recursive: true })
                        .then(() => {
                            console.log('Directory removed successfully.');
                        });
                }
            })
            .catch((err) => {
                if (err.code === 'ENOENT') {
                    console.log('Directory does not exist.');
                } else {
                    throw err;
                }
            });
    }

    readReadmeFile() {
        const readmePath = path.join(this.localPath, 'README.md');
        return fs.readFile(readmePath, 'utf-8')
            .then((readmeData) => {
                return readmeData;
            });
    }

    processReadmeData(readmeData) {
        const nowSectionRegex = /💬 Now:(.*?)💭 Later:/s;
        const laterSectionRegex = /💭 Later:(.*?)💤 Previously:/s;
        const previouslySectionRegex = /💤 Previously(.*?)## My Skills/s;

        const nowNames = this.readmeContent.get('Now')
            .map(item => `- [${item.name}](${item.url || '#'})`)
            .join('\n');

        const nowSection = `\n${nowNames}`;

        const laterNames = this.readmeContent.get('Later')
            .map(item => `- [${item.name}](${item.url || '#'})`)
            .join('\n');

        const laterSection = `\n${laterNames}`;

        const previouslyNames = this.readmeContent.get('Previously')
            .map(item => `- [${item.name}](${item.url || '#'})`)
            .join('\n');

        const previouslySection = `\n${previouslyNames}`;
        
        readmeData = readmeData.replace(nowSectionRegex, `💬 Now:\n${nowSection}\n\n💭 Later:`)
        readmeData = readmeData.replace(laterSectionRegex, `💭 Later:\n${laterSection}\n\n💤 Previously`)
        readmeData = readmeData.replace(previouslySectionRegex, `💤 Previously\n${previouslySection}\n\n## My Skills`)

        return readmeData
    }

    updateReadmeFile(newReadmeContent) {
        const readmePath = path.join(this.localPath, 'README.md');
        return fs.writeFile(readmePath, newReadmeContent, 'utf8')
            .then(() => {
                console.log('README.md updated successfully.');
            })
            .catch((err) => {
                console.error(`Error updating README.md: ${err}`);
            });
    }

    async commitAndPushChanges() {
        try {
            const repository = await NodeGit.Repository.open(this.localPath);

            const index = await repository.refreshIndex();
            await index.addAll();
            await index.write();
            const oid = await index.writeTree();
            const now = Date.now()
            const today = new Date(now)

            const head = await NodeGit.Reference.nameToId(repository, 'HEAD');
            const parent = await repository.getCommit(head);
            const author = NodeGit.Signature.create(this.userName, this.userEmail, now, 0);
            const committer = author;
            const commitMessage = `automatic update ${today.toDateString()}`;
            const commitId = await repository.createCommit('HEAD', author, committer, commitMessage, oid, [parent]);

            console.log(`Committed with ID: ${commitId.tostrS()}`);

            const remoteName = 'origin'; 
            const refSpecs = [`refs/heads/main:refs/heads/main`];

            const credentials = {
                certificateCheck: () => 1, // Accept the SSL certificate
                credentials: () => NodeGit.Cred.userpassPlaintextNew(this.token, ''),
            };

            const remote = await repository.getRemote(remoteName);
            await remote.push(refSpecs, {
                callbacks: credentials,
            }).catch((error) => {
                console.error(`Error pushing to remote: ${error}`);
            });

            console.log('Pushed changes to the remote repository.');
        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = GitUpdate