# kirillunlimited.ru

## About

This project is built with [11ty](https://www.11ty.dev/) and [Parcel](https://parceljs.org/).

1. 11ty transforms `.md` files to `.html` to the `/dist/tmp` folder
2. Parcel processes these files as entry points, transforms required assets and outputs the resulting build to the final `/dist/public` folder.

## Installation

1. `yarn` to install Parcel with all required dependencies
2. `yarn global add firebase-tools` to install [Firebase CLI](https://github.com/firebase/firebase-tools)
3. `firebase login` to authorize to your firebase account

## Development

`yarn dev` to start hot-reloading local server @ http://localhost:5000

As there are several entry points (html files), Parcel oblige to explicitly point to these pages in browser. To fix this inconvenience, the firebase emulator is used.

## Build and deploy

`yarn deploy` to reveal this amazing project to the world.
