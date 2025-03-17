const express = require('express');
const path = require('path');

const errorController = require('./controllers/error');

const connectDB = require('./util/database').connectDB;

const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('67d6e4bbccd1e748fcc4e621');
    req.user = new User(user.username, user.email, user.cart, user._id);
    next();
  } catch (error) {
    console.log(error);
  };
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connectDB(() => {
  app.listen(3000);
});
