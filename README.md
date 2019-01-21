# kdh-react-boilerplate

This is a simple, barebones example of setting up a dashboard with KDH using React.

## Setup

1. Install and Run
```bash
yarn install && yarn start
```

2. (OPTIONAL: you can also use your own bot) Clone `gc/kdh-react-boilerplate-bot`, and
then put your token and client secret in `config.template.js`,
rename it to `config.js`. Run the bot with: ```
npm install && node bot```

## Why no Redux/Mobx/Router/Whatever/Error handling?

Extra libraries are at your discretion to use, this is just a simple barebones setup
to show roughly how to get a dashboard setup.

In a production application, you will almost definitely want to use react-router and,
possibly some code-splitting, state management (redux, etc), and other things.
