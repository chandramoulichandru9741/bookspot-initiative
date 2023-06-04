const Stripe = require('stripe');
//process.env not working
const stripe = Stripe(
  'sk_test_51MNJsDSCNzy8gdEy9SrwvHipd4FTfY6mtQ8RF4D4JfV5vuwNXdjXNDTpsm0GdWHJlz1yw6igPDZgzFacetbVRKSm00dKwDaWQK'
);
const Cart = require('../models/cartModel');
const Book = require('../models/bookModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./refactoryController');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const book = await Book.findById(req.params.bookId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?book=${req.params.bookId}&user=${req.user.id}&price=${
      book.priceafterSale
    }&fullname=${req.body.fullname}&email=${req.body.email}&phone=${req.body.phone}&address=${req.body.address}&note=${
      req.body.note
    }&booktype=${req.body.booktype}`,
    cancel_url: `${req.protocol}://${req.get('host')}/book/${book.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.bookId,
    line_items: [
      {
        price_data:{currency: 'inr',
        product_data : {
          name: book.name,
        },
       unit_amount : (req.body.booktype == "Printed Book"  ? book.priceafterSale - 10 : book.priceafterSale) * 100, },
       quantity: 1,
       
        
        
      },
    ],
    mode: 'payment',
  });
  
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
 

  let { book, user, price, fullname, phone, email, address,booktype, note } = req.query;
  if (booktype == "Printed Book"){
    price = price - 10;
  }

  if (!book && !user && !price) return next();
  await Order.create({
    book,
    user,
    price,
    paid: true,
    info: {
      fullname: fullname,
      email: email,
      address: address,
      phone: phone,
      booktype: booktype,
      pack:"Plastic wrap",
      note: note,
      payment: 'Online Payment',
      
    },
  });
  //delete cart after payment
  await Cart.findOneAndDelete({ book, user });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createOrderCod = catchAsync(async (req, res, next) => {
  
  const bookInfo = await Book.findById(req.params.bookId);
  const order = await Order.create({
    book: bookInfo._id,
    user: req.user.id,
    price: req.body.booktype == "Printed Book"  ? bookInfo.priceafterSale - 10 : bookInfo.priceafterSale,
    paid: false,
    info: {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      pack: req.body.pack,
      note: req.body.note,
      booktype: req.body.booktype,
      payment: 'Cod: Cash on delivery',
    },
    
  });
 
  await Cart.findOneAndDelete({ book: req.params.bookId });
  res.status(201).json(order);
});

exports.getOneOrder = factory.getOne(Order);
exports.getAllOrder = factory.getAll(Order);
exports.deleteOneOrder = factory.deleteOne(Order);
exports.updateOneOrder = factory.updateOne(Order);
