const paymentBtn = document.querySelector('.payment');
const stripe = Stripe(
  'pk_test_51MNJsDSCNzy8gdEynu4tsCKCJ5TKsm5m2O4q1P89s2FeH5Pn5ITkJUbwCy7B8jHo7vbtT4YBVrYi0HKOJJfq5mbA00yR9jpuJi'
);

const orderBook = async (bookId, fullname, email, phone, address,booktype, note) => {
  try {
    // 1) Get Checkout session from API

    const session = await axios.post(`/api/v1/orders/checkout-session/${bookId}`, {
      fullname: fullname,
      email: email,
      phone: phone,
      address: address,
      booktype: booktype,
      note: note,
    });
    // 2) Create checkout from + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (e) {
    console.log(e);
  }
};
//contact the customer's office
const orderBookCod = async (bookId, fullname, email, phone, address,booktype, pack, note) => {
  try {
    await axios.post(`/api/v1/orders/cod/${bookId}`, {
      fullname: fullname,
      phone: phone,
      email: email,
      address: address,
      booktype:booktype,
      pack: pack,
      note: note,
      
    });
  } catch (e) {
    console.log(e);
  }
};
paymentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const { bookId } = e.target.dataset;
  const fullname = document.querySelector('.fullname_order').value;
  const email = document.querySelector('.email_order').value;
  const phone = document.querySelector('.phone_order').value;
  const address = document.querySelector('.address_order').value;
  let booktype = document.querySelector('.booktype_order').value;
  const packSelect = document.querySelector('.pack_order');
  const pack = packSelect.options[packSelect.selectedIndex].text;
  const note = document.querySelector('.note_order').value;
  const payment_order = document.querySelector('.payment_order').value;  
  
  if (
    fullname.length == 0 ||
    email.length == 0 ||
    phone.length == 0 ||
    address.length == 0 ||
    pack == 'Choose the packing method' ||
    payment_order == 'Choose form' ||
    booktype == 'Choose Book Type'
  ) {
    swal({
      title: 'Please fill out the information completely',
      icon: 'error',
    });
    return false;
  }


  if (payment_order == 2) {
    swal({
      title: 'Are you sure',
      icon: 'warning',
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Please wait for the page to go to card payment ', {
          icon: 'success',
        });
        orderBook(bookId, fullname, email, phone, address,booktype, note);
      }
    });
  } else if (payment_order == 1) {
    orderBookCod(bookId, fullname, email, phone, address,booktype, pack, note);
    swal({
      title:
        'Order is successful, please wait to return to the homepage and view the order information on your personal information page',
      icon: 'success',
    });
    window.setTimeout(() => {
      location.assign('/');
    }, 1000);
  }
});
