$(function () {
  $('.khoisanpham').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  //hieu ung header va nut backtotop
  $('#backtotop').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 400);
  });

  $(window).scroll(function () {
    if ($('body,html').scrollTop() > 150) {
      $('.navbar').addClass('fixed-top');
    } else {
      $('.navbar').removeClass('fixed-top');
    }
  });

  $(window).scroll(function () {
    if ($('body,html').scrollTop() > 500) {
      $('.nutcuonlen').addClass('hienthi');
    } else {
      $('.nutcuonlen').removeClass('hienthi');
    }
  });

  // header form dangnhap dangky
  $('.nutdangnhap').click(function (e) {
    $('ul.tabs .tab-dangnhap').addClass('active');
  });
  $('.nutdangky').click(function (e) {
    $('ul.tabs .tab-dangky').addClass('active');
  });

  $('ul.tabs .tab-dangnhap').click(function (e) {
    $('ul.tabs .tab-dangnhap').addClass('active');
    $('ul.tabs .tab-dangky').removeClass('active');
  });

  $('ul.tabs .tab-dangky').click(function (e) {
    $('ul.tabs .tab-dangky').addClass('active');
    $('ul.tabs .tab-dangnhap').removeClass('active');
  });

  // form dangnhap dangky
  $('.tab-dangky').click(function (e) {
    $('#formdangnhap').removeClass('fade');
    $('#formdangky').removeClass('fade');
    $('#formdangnhap').modal('hide');
    $('#formdangky').modal('show');
  });
  $('.tab-dangnhap').click(function (e) {
    $('#formdangnhap').removeClass('fade');
    $('#formdangky').removeClass('fade');
    $('#formdangky').modal('hide');
    $('#formdangnhap').modal('show');
  });
  $('.close').click(function (e) {
    $('.modal').addClass('fade');
    $('ul.tabs .tab-dangnhap').removeClass('active');
    $('ul.tabs .tab-dangky').removeClass('active');
  });

  // thumb-img
  $('.thumb-img.thumb1').addClass('vienvang');
  $('.thumb-img').click(function (e) {
    $('.product-image').attr('src', this.src);
  });

  $('.thumb-img').click(function (e) {
    $('.thumb-img:not(:hover)').removeClass('vienvang');
    $(this).addClass('vienvang');
  });

  //btn-spin
  $('.btn-inc').click(function (e) {
    // add incement value
    let value = document.querySelector('.tongcong').textContent;
    value1 = value;
    var strval = $(this).parent().prev().val();
    var val = parseInt(strval) + 1;
    $(this).parent().prev().attr('value', val);
    value = parseInt(value) + parseInt(value1);
    axios({
      method: 'get',
      url: '/api/v1/carts/addItem',
    })
      .then((res) => {
        if (res.data.status === 'success') {
         console.log("inside add item");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    document.querySelector('.tongcong').innerHTML = `${value}.Rs`;
    //   $.ajax({
    //     url : `/api/v1/orders/${}`,
    //     type: "PATCH",
    //     data: JSON.stringify({amount:val}),
    //     contentType: "application/json; charset=utf-8",
    //     dataType   : "json",
    //     success    : function(){
    //         console.log("Pure jQuery Pure JS object");
    //     }
    // });
  });
  $('.btn-dec').click(function (e) {
    //dec value when click amount
    let value = document.querySelector('.tongcong').textContent;
    var strval = $(this).parent().next().val();
    var val = parseInt(strval) - 1;
    if (val < 1) {
      $(this).parent().next().attr('value', 1);
    } else {
      $(this).parent().next().attr('value', val);
      value = parseInt(value) / 2;
      document.querySelector('.tongcong').innerHTML = `${value}.Rs`;
    }
  });

  // gui danh gia
  $('.formdanhgia').hide(200);
  $('.vietdanhgia').click(function (e) {
    $('.formdanhgia').toggle(200);
  });

  //rotate chevron
  $('#step1contentid').on('show.bs.collapse', function () {
    $(this).prev().addClass('active');
  });
  $('#step1contentid').on('hide.bs.collapse', function () {
    $(this).prev().removeClass('active');
  });
  $('#step2contentid').on('show.bs.collapse', function () {
    $(this).prev().addClass('active');
  });
  $('#step2contentid').on('hide.bs.collapse', function () {
    $(this).prev().removeClass('active');
  });
  $('#step3contentid').on('show.bs.collapse', function () {
    $(this).prev().addClass('active');
  });
  $('#step3contentid').on('hide.bs.collapse', function () {
    $(this).prev().removeClass('active');
  });

  // nut btn-shopping-without-signup
  $('#step1contentid').collapse('show');
  $('.btn-shopping-without-signup').click(function (e) {
    $('#step1contentid').collapse('hide');
    $('#step2contentid').collapse('show');
  });

  // validate
  $('#form-signup').validate({
    rules: {
      name: {
        required: true,
      },
      phone: {
        required: true,
        minlength: 8,
      },
      password: {
        required: true,
        minlength: 6,
      },
      confirm_password: {
        required: true,
        minlength: 6,
        equalTo: '#inputPassword',
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      name: {
        required: 'Please enter your first and last name',
      },
      phone: {
        required: 'Please enter the phone number',
        minlength: 'The number you have just entered is an unreal number',
      },
      password: {
        required: 'Please enter a password',
        minlength: 'Please enter at least 6 characters',
      },
      confirm_password: {
        required: 'Please re-enter your password',
        minlength: 'Please enter at least 6 characters',
        equalTo: 'Password does not match',
      },
      email: {
        required: 'Please enter your email',
        minlength: 'Invalid email',
        email: 'Please enter your email',
      },
    },
  });

  $('#form-signin').validate({
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      password: {
        required: 'Please enter a password',
        minlength: 'Please enter at least 6 characters',
      },
      email: {
        required: 'Please enter your email',
        minlength: 'Invalid email',
        email: 'Please enter your email',
      },
    },
  });

  $('#form-signup-cart').validate({
    rules: {
      name: {
        required: true,
      },
      phone: {
        required: true,
        minlength: 8,
      },
      password: {
        required: true,
        minlength: 6,
      },
      confirm_password: {
        required: true,
        minlength: 6,
        equalTo: '#inputPassword',
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      name: {
        required: 'Please enter your first and last name',
      },
      phone: {
        required: 'Please enter the phone number',
        minlength: 'The number you have just entered is an unreal number',
      },
      password: {
        required: 'Please enter a password',
        minlength: 'Please enter at least 6 characters',
      },
      confirm_password: {
        required: 'Please re-enter your password',
        minlength: 'Please enter at least 6 characters',
        equalTo: 'Password does not match',
      },
      email: {
        required: 'Please enter your email',
        minlength: 'Invalid email',
        email: 'Please enter your email',
      },
    },
  });

  $('#form-signin-cart').validate({
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      password: {
        required: 'Please enter a password',
        minlength: 'Please enter at least 6 characters',
      },
      email: {
        required: 'Please enter your email',
        minlength: 'Invalid email',
        email: 'Please enter your email',
      },
    },
  });

  // add to cart

  $('.items .row').isotope({
    itemSelector: '.item',
  });

  $('.tag a').click(function (e) {
    var tacgia = $(this).data('tacgia');

    if (tacgia == 'all') {
      $('.items .row').isotope({ filter: '*' });
    } else {
      $('.items .row').isotope({ filter: tacgia });
    }
    return false;
  });

  $('.thay-doi-mk').hide();
  $('#changepass').click(function (e) {
    $('.thay-doi-mk').toggle(200);
  });
});
