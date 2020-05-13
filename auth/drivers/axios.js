class AxiosDriver {
    constructor() {}

    async check(authToken, clientIp) {
        const axios = require('axios')

        const response = await axios.get(
            process.env.AXIOS_ENDPOINT.replace('{authToken}', authToken).replace('{clientIp}', clientIp)
        )

        return response.data
    }
}

module.exports = AxiosDriver