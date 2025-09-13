const {GitHub} = require('arctic');
// const {env} = require('../../env.js')

const github = new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}/login/callback`
)

module.exports = github;