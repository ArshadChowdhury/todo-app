# To Do App

To run the app locally you need to clone the repo first, then run -

``` npm install ```

& then - 

``` npm run dev ```

then you can see it running locally here - http://localhost:5173/

The app keeps track of card changes through state and then it stores the data utilizing localstorage of your browser & theme info is also stored in localstorage.
Used dnd kit for the drag n drop part of the app, used react-modal for modal to create new task, for css I used tailwindcss. Can either drag n drop to change state or can use context menu as well.
Added color to understand the states of the card. Blue for New, Orange for In progress and Green for Done, also added date time to ongoing so we can understand if it's overdue or not !!
