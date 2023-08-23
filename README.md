# gohey-san

## 構成
- `/Functions`
    - Express
- `/Hosting`
    - React

## Getting Started
First, prepare .env file and set API key.
```sh
touch .env
echo "REDIRECT_URI=localhost:8080/api/callback" >> .env
echo "CLIENT_ID=xxxxxxxxxx" >> .env
echo "CLIENT_SECRET=xxxxxxxxxxxxxxxxxx" >> .env
echo "REACT_APP_LIFF_ID=xxxxxxxxxxxxx" >> .env
```
Second, install dependencies.
And then run the development server:
```sh
npm i
npm run dev
```

## Setup
You must install `Firebase CLI`
```sh
npm install -g firebase-tools
firebase login
```

## Local development
### on Development Server
```sh
npm run dev
```
### on Emulator
**NOTE:** You must set `CLIENT_ID` and `CLIENT_SECRET` as Secrets to emulate and deploy on firebase.
```sh
firebase functions:secrets:set CLIENT_ID
firebase functions:secrets:set CLIENT_SECRET
```
You only need to do this operation once.
```sh
npm run build
firebase emulators:start
```

## Deploy on Firebase
```sh
npm run build
firebase deploy
```
