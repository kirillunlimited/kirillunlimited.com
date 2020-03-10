# kirillunlimited.ru

## Development
1. `npm install` to install [Parcel](https://parceljs.org/) with all required dependencies
2. Create `.env` file in the root directory and declare Google Analytics tracking ID `GA_ID` variable in it
3. `npm run dev` to start development

## Build and deploy
1. `npm install -g firebase-tools` to install [Firebase CLI](https://github.com/firebase/firebase-tools)
2. `firebase login` to authorize to your firebase account
3. `npm run build` to bundle for production
4. `firebase deploy` to reveal this amazing project to the world