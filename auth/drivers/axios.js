class AxiosDriver {
    constructor() {}

    async check(roomId, authToken, clientIp) {
        const axios = require('axios')

        const response = await axios.post(
            process.env.AXIOS_ENDPOINT
                .replace('{roomId}', roomId)
                .replace('{authToken}', authToken)
                .replace('{clientIp}', clientIp)
        )

        return response.data
    }
}

module.exports = AxiosDriver