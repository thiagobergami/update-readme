# README: Personal README Automation with Node.js

## Overview

This Node.js project is designed to streamline the process of updating my personal  [README file](https://github.com/thiagobergami/thiagobergami) with the latest projects I'm involved in.

## Features

- **Integration with my personal Notion**: I rely on Notion to track my projects, so I've created a [!Notion database](https://thiago-me.notion.site/Github-Update-0aed70e445ab494397e8f04aae40c97c?pvs=4) that summarizes my past, current, and future projects.

- **Automated README Update**: This project utilizes Node.js to access the Notion database, clone my personal README, and subsequently commit and push the changes. I employ Windows Task Scheduler for scheduling automated executions.


## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/readme-automation.git
   ```

2. Install the project dependencies:
    ```bash
    npm install
    ```

3. Fill the information on the .env file

4. Run the project
    ```bash
    npm start
    ```

Feel free to reach out if you have any questions or need assistance with the installation or configuration.