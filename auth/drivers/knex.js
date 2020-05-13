class KnexDriver {
    constructor() {
        const config = require('../../config.js');

        this.knex = require('knex')({
            client: process.env.DB_CLIENT,
            connection: config.authConnection
        });
    }

    async check(authToken, clientIp) {
        const isAuthenticated = (await this.knex(process.env.DB_TABLE).where({
            token: authToken,
            ip: clientIp
        })).length

        if (isAuthenticated) {
            this.knex(process.env.DB_TABLE).where({
                token: authToken,
                ip: clientIp
            }).del()
        }

        return isAuthenticated
    }
}

module.exports = KnexDriver