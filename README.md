## June

> June is a micro blogging site with heavy limitations. It's similar to twitter but different in the approach and implementation.

![GitHub package.json version](https://img.shields.io/github/package-json/v/soulsam480/junev2)

#### Status
- Hosted
  - Prod -> https://june.sambitsahoo.com
  - Dev -> https://june-dev.sambitsahoo.com
- Development -> early alpha

#### Features

__current__
- create/archive/react on posts
- feed
- user pages
- post details page

__pojected__
- full CRUD on posts
- image uploads
- user settings and actions
- post comments, replies, actions
- add more [here](https://furikaeru.sambitsahoo.com/June_public_roadmap--9edb3666-9f84-445d-ad40-2645c0ffa666/)

#### June component library
June is built on an in-house component library which can be found [here](./app/src/Lib/). The components are developed on a need basis and it gets improved each commit. Any suggestions for improvements is appreciated. 

#### Stack

__API__:
- mongodb
- typegose
- expressjs
- dango
- passport (Google OAuth2)
- typescript
- jwt
- EC2 (for deployment)

__APP__:
- react
- react-router@6
- zustand
- windicss (tailwindcss)
- vite-plugin-purge-icons
- vite-plugin-pwa
- vite
- typescript

#### Run it locally
> You need to have pnpm installed as this repo is a `PNPM Workspace`.

- Clone/fork repo
```bash
pnpm i # install deps
```
- Add `env` variables.
```bash
# APP
VITE_API # REST endpoint -> http://localhost:3000/furikaeru

#API
MONGO_URI=
HASH_SALT=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_SECRET=
GCLIENT_ID=
GCLIENT_SECRET=
PORT=3003
```
- Run
```bash
pnpm dev # devserver
pnpm build # build 
```
Any contributions are welcome. reach me on [soulsam480@hotmail.com](mailto:soulsam480@hotmail.com)