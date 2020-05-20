# Zeye Server

> Based on [mediasoup-demo](https://github.com/versatica/mediasoup-demo) server

## Build Setup

```bash
yarn
node server.js 
```

## Getting Started
#### 1. Create and edit .env file
`$ cp .env.example .env`
#### 2. Decide if you want to secure wss endpoint
`CHECK_AUTH=true` or `CHECK_AUTH=false`
#### 3. If you want it secured
Check which provider you would like to use

`AUTH_DRIVER=knex` or `AUTH_DRIVER=http`

- knex for database
- http for axios http request

#### 3.0. Database table example
```
CREATE TABLE `zeye_wss_tokens` (
  `id` int UNSIGNED NOT NULL,
  `ip` varchar(32) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL
)
```
#### 3.1. knex
Provide your connection settings in `DB_*`

- Mysql node driver is already shipped
- For pg\sqlite\etc check [knex docs](http://knexjs.org/#Installation-client) and change `authConnection` in `config.js` accordingly, but don`t forget DB_TABLE, it is still very much needed to be set
- Install necessary driver:
```
$ npm install pg
$ npm install sqlite3
$ npm install oracledb
$ npm install mssql
```
#### 3.2 http
Edit line `AXIOS_ENDPOINT=` to match your backend endpoint

`{authToken}`, `{roomId}` and `{clientIp}` are mandatory in url, because they will be replaced with actual client\`s token, ip and desired room

Example:
`AXIOS_ENDPOINT=https://zeye.loc/api/checkWssToken?authToken={authToken}&clientIp={clientIp}&roomId={roomId}`

Backend example (Laravel):
```php
// somewhere in your controller

public function createWssToken (Request $request) {
    // check $request->password or Auth::user() here, abort(401) on fail

    $token = Str::random(50)
 
    DB::('zeye_wss_tokens')->insert([
        'token' => $token,
        'room' => $request->room,
        'ip' => $request->ip(),
        'created_at' => now()
    ]);
 
    return $token;
}

public function checkWssToken (Request $request) {
    $token = $request->get('authToken')
    $ip = $request->get('clientIp')
    $room = $request->get('roomId')
 
    $tokenEntry = DB::('zeye_wss_tokens')
        ->where('token', $token)
        ->where('room', $room)
        ->where('ip', $ip);

    $result = $tokenEntry->count() > 0

    $tokenEntry->delete()
 
    return $result;
}
```
Notes: 
- Mind trusted proxies\HTTP_X_FORWARDED_FOR, you need real client ip, not the one your balancer have
- Clear expired tokens every once in a while