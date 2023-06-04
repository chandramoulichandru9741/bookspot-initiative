const factory = require('./refactoryController');
const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');

exports.addItem = async (req, res, next) => {
  try{
    // res.send({quantity: 5});
    res.redirect('/cart');
  }catch(e){
    console.log(e);
  }
};

exports.addtoCart = async (req, res, next) => {
  try {
  Cart.find({ book: req.params.bookId, user: req.user.id}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
        if(docs.length != 0){
          docs[0].quantity = parseInt(docs[0].quantity) + parseInt(1);
          console.log(docs[0].quantity);

         
          console.log(docs[0].quantity);
          docs[0].save();
        }else{
          const booktocart = new Cart({
            user: req.user.id,
            book: req.params.bookId,
            quantity: parseInt(1)
          });
          booktocart.save();
        }
      }
  });
  res.redirect('/cart');
  } catch (e) {
    return res.redirect('/');
  }
};
exports.deleteCart = catchAsync(async (req, res, next) => {
  const bookDelete = await Cart.findOneAndDelete({ user: req.user.id, book: req.params.bookId });
  res.redirect('/cart');
});
