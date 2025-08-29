const jwt = require('jsonwebtoken');

// Your secret key. Keep this in a secure environment variable, not in your code.
const JWT_SECRET_KEY = "7xdP6EGzCqIrx4aAAQvHyvVfKxI9fkSdEyMyllB+uX8=";

// The data you want to encode. This is the "payload" of the JWT.
const payload = {
  userType: "authenticUser",
  username: "whatsss1",
  name: "John Doe"
};

// Encode the data into a JWT.
const token = jwt.sign(payload, JWT_SECRET_KEY, {
  // Setting a lifetime is critical for security.
  // Here's an example of a token that expires in 1 day (86400 seconds).
  expiresIn: '5d' 
});

console.log(token);

