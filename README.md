BookMyHotel is a hotel booking website to book hotels in India.

Tech Stack used : 
Frontend : HTML , CSS , JavaScript , EJS AND Bootstrap.
Backend : Nodejs , Expressjs
Database : PostgresSQL
Payment gateway : Razorpay

Description of Routes:
1. "/" : It is the route for the home page. If the user is already logged in then it show the home page else it will should the Login page.
2. "/login" : For login purpose , the login route is defined. If the user is new then It will show the error message else after verifying the details of user it will redirect to home page.
3. "/signup" : To create a new account of user. If user already exists it show the message.
4. "/browseallhotels" : On clicking the browse hotels in navbar , It will show all the details of hotels in the form of css cards. If you want to search hotels by the location , you can search them easily by the search bar.
5. You can also update the location , checkin and checkout date
6. "/viewdetails" : Every hotel card has view details button to see the details and reviews of customers about that hotel.
7. "/addReview" : If you want to add your own review then an add review button performs that functionality.

After clicking on Book a room button on viewdetails page , you will see the Razorpay Payment gateway to pay the money. For now , I have kept it for the test mode.
Once the room is booked , It show an popup and will redirect to the home page.
On home page , a user can click on his/her profile to see the booked hotel rooms and can also cancel their room.

8. "/logout" : On user profile page , There is a button of Logout to get logged out from the website.
