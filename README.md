# YelpCamp
Created for the web developer bootcamp by Colt Steele on Udemy.com 

YelpCamp is a web-based application that allows users to publish reviews of campgrounds they have visited. Users can comment on each other's posts. <br> 

This project was built to demonstrate RESTful routes with node.js and express as well as responsive layouts with Bootstrap and templating with EJS. 

### Preview App
https://yelpcamp-web-bootcamp.herokuapp.com/

# Built With 
- Node.js
- Express
- EJS
- MongoDB
- Mongoose 
- Passport.js 
- Bootstrap 
- Cloudinary 

# Getting Started 
### Prerequisites 
1. Node.js
2. Mongoose 

Installing 
1. Clone the GitHub repository 
2. Create a `.env` file at the root of the repository 
3. Inside the `.env` file, add the following lines of code: 
```
CLOUDINARY_API_SECRET= *unique to your cloudinary account
CLOUDINARY_API_KEY=*unique to your cloudinary account
databaseURL = mongodb://localhost/yelp_camp
secret = *pick random secret* 
```
4. Run `npm install` to install the dependencies. 
6. Run `node app.js` and `./mongod` in separate Termianl tabs to start the server and mongodb client. 

Completed Features: 

[x] Creation of database <br>
[x] Allow users to login and post new camppgrounds <br>
[x] Authorization for editing and deleting campgrounds and comments <br>
[x] Added cloudinary as a repository for uploading images <br>

Desired Features: 

[ ] Add moment.js for date formatting for comments and campgrounds <br>
[ ] Fuzzy search <br>
[ ] Pagination <br>
[ ] Ajax calls for populating data, adding comments <br> 
[ ] User pages <br> 
[ ] Maps support for displaying campground address <br>
[ ] Ratings in comments by other users and averaging the ratings 

