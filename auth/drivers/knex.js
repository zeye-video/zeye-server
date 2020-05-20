class KnexDriver {
    constructor() {
        const config = require('../../config.js');

        this.knex = require('knex')({
            client: process.env.DB_CLIENT,
            connection: config.authConnection
        });
    }

    async check(roomId, authToken, clientIp) {
        const isAuthenticated = (await this.knex(process.env.DB_TABLE).where({
            token: authToken,
            room: roomId,
            ip: clientIp
        })).length

        if (isAuthenticated) {
            this.knex(process.env.DB_TABLE).where({
                token: authToken,
                room: roomId,
                ip: clientIp
            }).del()
        }

        return isAuthenticated
    }
}

module.exports = KnexDriver