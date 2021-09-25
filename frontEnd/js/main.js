const getCookieValue=(key)=>{
    const cookie=document.cookie;
    try{
        let decode = encodeURI(cookie).split(';'),
            data = decode.find(value => value.indexOf(`${key}=`) > -1).replace(`${key}=`,'')
        return JSON.parse(decodeURI(data))
    }catch(error){
        console.warn(error)
        return undefined;
    }
}
function NotLoggedIn(){
    $('#add_product_btn,.btn.wishlist,a[href="my-account.html"]').hide(0);
}
function clearSession(){
    document.cookie += '; max-age=0';
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}
function CheckActivity(){
    if(document.cookie.length){
        $.ajaxSetup({
            headers:{
                'Authorization':getCookieValue('userData').userToken
            }
        })
        var cat___;
        $.ajax({
            url:'http://localhost:8080/user',
            type:'GET',
            dataType:"JSON"
        }).done(data => {
            $('#add_product_btn,.btn.wishlist,a[href="my-account.html"]').show(0);
            $.ajax({
                method:"GET",
                url:"http://localhost:8080/user_liked_product_count/"+getCookieValue('userData').userData.id,
            }).done(data=>{
                $(".btn.wishlist>span").text("("+data+")");
            })
            $('#logout').css('display','inline');
            $('#labelLogin').css('display','none');
            $('#sign-up').css('display','none');
            if(data.userRole == "ROLE_HANDYMAN" || data.userRole == "ROLE_ADMIN"){
                $('#store_input').val(data.id);
            }else{
                $('#dashboard-nav,#profile-nav,#dashboard-tab,#add_product_btn').remove();
                $('#address-nav,#address-tab').addClass('show active');
            }
            if(data.userRole == "ROLE_ADMIN"){
                $('a[href="my-account.html"]').first().after('<a class="btn" href="admin.html">لوحة التحكم</a>');
            }
        }).fail(data => {
            NotLoggedIn();
            clearSession();
        })
    }else{
        clearSession();
        NotLoggedIn();
    }
}
(function ($) {
    "use strict";
    CheckActivity();
    // setInterval(() => {
    //     CheckActivity()   
    // }, 1000);
    var stars;
    document.write('<script src="./node_modules/axios/dist/axios.min.js"></script>')

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 768) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Header slider
    $('.header-slider').slick({
        autoplay: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: true
    });
    if($("#most_liked").length != 0){
        //get random products to slide
        let most_liked = {};
        $.ajax({
            type:"GET",
            url:"http://localhost:8080/top_rated_products",
            dataType:'JSON'
        }).done(data =>{
            most_liked = data;
            $.each(most_liked,function(k, product){
                stars = "";
                for (let index = 0; index < product.rate; index++) {
                    stars = stars+'<i class="fa fa-star"></i>';
                }
                if(product.rate < 5){
                    for (let index = 0; index < (5-product.rate); index++) {
                        stars = stars+'<i class="far fa-star"></i>';
                    }
                }
                $('#most_liked').append('<div class="px-2"><div class="product-item"><div class="product-title"><a href="#">'+product.name+'</a><div class="ratting">'+stars+'</div></div><div class="product-image"><a href="product-detail.html?id='+product.id+'"><img src="'+product.imageFilePath+'" alt="'+product.name+'"></a><div class="product-action"><a href="javascript:;" class="add_to_fav" data-id="'+product.id+'"><i class="fa fa-heart"></i></a></div></div><div class="product-price"><h3><span>JD</span>'+product.price+'</h3><a class="btn" href="product-detail.html?id='+product.id+'">عرض <i class="fas fa-eye"></i>  </a></div></div></div>')
            })   
            // Product Slider 4 Column
            $('.product-slider-4').slick({
                autoplay: true,
                infinite: true,
                dots: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                rtl: true,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 4,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1,
                        }
                    },
                ]
            });
            
            
            // Product Slider 3 Column
            $('.product-slider-3').slick({
                autoplay: true,
                infinite: true,
                dots: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                rtl: true,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1,
                        }
                    },
                ]
            });
        })
         
    }
    
    
    
    
    // Brand Slider
    $('.brand-slider').slick({
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        slidesToShow: 5,
        slidesToScroll: 1,
        rtl: true,
        infinite: true,
        swipeToSlide: true,
        centerMode: true,
        focusOnSelect: false,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 300,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
    
    
    // Review slider
    $('.review-slider').slick({
        autoplay: true,
        dots: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        rtl: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
    

    if($("#random_products").length != 0){
        //get random products to slide
        let random_products = {};
        $.ajax({
            type:"GET",
            url:"http://localhost:8080/least_impressed_products",
            dataType:'JSON'
        }).done(data =>{
            random_products = data;
            $.each(random_products,function(k, product){
                stars = "";
                for (let index = 0; index < product.rate; index++) {
                    stars = stars+'<i class="fa fa-star"></i>';
                }
                if(product.rate < 5){
                    for (let index = 0; index < (5-product.rate); index++) {
                        stars = stars+'<i class="far fa-star"></i>';
                    }
                }
                $('#random_products').append('<div class="product-item"><div class="product-item"><div class="product-title"><a href="#">'+product.name+'</a><div class="ratting">'+stars+'</div></div><div class="product-image"><a href="product-detail.html?id='+product.id+'"><img src="'+product.imageFilePath+'" alt="'+product.name+'"></a><div class="product-action"><a href="javascript:;" class="add_to_fav" data-id="'+product.id+'"><i class="fa fa-heart"></i></a></div></div><div class="product-price"><h3><span>JD</span>'+product.price+'</h3><a class="btn" href="product-detail.html?id='+product.id+'">عرض <i class="fas fa-eye"></i>  </a></div></div></div>')
            }) 
            // Widget slider
            $('.sidebar-slider').slick({
                autoplay: true,
                dots: false,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                rtl: true
            });
        })
        ///user_liked_product_count/{user_id}
            
    }
   

    //Categories Data [You have to send get to backend to receive categories list data] , 
    var categories_list = {};
    var cat__,icon;
    if($("#categories_list_links").length != 0 || $("#categories_list_inputs").length != 0){
        $.ajax({
            url:"http://localhost:8080/product-categories",
            type:"GET",
            dataType:"JSON"
        }).done(data => {
            categories_list = data.rows;
            $.each(categories_list,function(k, category){

                switch(category.categoryName) {
                    case 'رسم':
                      icon = "fa-home";
                      break;
                    default:
                        icon = "fa-child";
                }                  
                $('#categories_list_links').append('<li class="nav-item"><a class="nav-link" href="product-list.html?category_id='+category.id+'"><i class="fa '+icon+'"></i>'+category.categoryName+'</a></li>');
            })
            $.each(categories_list,function(k, category){
                $('#categories_list_inputs').append('<li class="nav-item"><input id="category-'+category.id+'" class="cat" name="productCategory[id]" style="margin: 15px 0px 15px 15px;" type="checkbox" value="'+category.id+'"><span style="margin:15px 0px"><i class="fa fa-child"></i> '+category.categoryName+' </span></li>');
            })
        })
    }
    
    // Quantity
    $(document).on('click', '.qty button',function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });
    
    
    // Shipping address show hide
    $('.checkout #shipto').change(function () {
        if($(this).is(':checked')) {
            $('.checkout .shipping-address').slideDown();
        } else {
            $('.checkout .shipping-address').slideUp();
        }
    });
    
    
    // Payment methods show hide
    $('.checkout .payment-method .custom-control-input').change(function () {
        if ($(this).prop('checked')) {
            var checkbox_id = $(this).attr('id');
            $('.checkout .payment-method .payment-content').slideUp();
            $('#' + checkbox_id + '-show').slideDown();
        }
    });
	
  


    $("#login").submit(function (event) {
        event.preventDefault();
        $(".form_msg").remove();
        let username = event.target["0"].value
        let password = event.target["1"].value
        
        axios.post('http://localhost:8080/token/auth',{
            username:username,
            password:password,
        }).then(data=>{
            document.cookie='';
            axios.get('http://localhost:8080/user',{
                headers : {'Authorization' : data.headers.authorization}
            }).then(userData => {
                //console.log(userData)
                document.cookie=`userData=${JSON.stringify({
                    userToken:data.headers.authorization,
                    userData:userData.data
                })}`;
                if(userData.data.userRole == "ROLE_ADMIN") {
                    window.location.replace('admin.html');
                    return false;
                }
                window.location.replace('home.html')
            })
            //getCookieValue('userData').userData.id
            //headers : {'Authorization' : getCookieValue('userData').userToken}
            // document.cookie +='; max-age=0;'

        }).catch(error =>{
            $('#login').prepend('<div class="alert alert-danger form_msg">إسم المستخدم أو كلمة المرور خاطئة</div>');
        })
    });
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
    function validatePhoneNumber(input_str) 
      {
          var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      
          return re.test(input_str);
      }      
    $("#register").submit(function (event) {
        // debugger
        $('.input_error').remove();
        event.preventDefault();
        let username = event.target["0"].value
        let firstName = event.target["1"].value
        let famliy = event.target["2"].value
        let email = event.target["3"].value
        let phoneNumber = event.target["4"].value
        let address = event.target["5"].value
        let description = event.target["6"].value
        let password = event.target["7"].value
        let confirmPassword = event.target["8"].value
        let userRole = $('input[name="typeaccount"]:checked').val();
        if(username.length < 5){
            $("#username").after('<small class="input_error" style="color:red;"> يجب أن يحتوي إسم المستخدم على الأقل 5 حروف.</small>');
        }
        if(firstName.length < 3){
            $("#firstname").after('<small class="input_error" style="color:red;"> يجب أن يحتوي الإسم الأول على الأقل 3 حروف.</small>');
        }
        if(address.length < 3){
            $("#address").after('<small class="input_error" style="color:red;"> يجب أن يحتوي العنوان على الأقل 3 حروف.</small>');
        }
        if(description.length < 3){
            $("#description").after('<small class="input_error" style="color:red;"> يجب أن يحتوي الوصف على الأقل 3 حروف.</small>');
        }
        if(famliy.length < 3){
            $("#lastname").after('<small class="input_error" style="color:red;"> يجب أن يحتوي اللقب على الأقل 3 حروف.</small>');
        }
        if(password.length < 5){
            $("#password").after('<small class="input_error" style="color:red;"> يجب أن تحتوي كلمة المرور على الأقل 5 حروف.</small>');
        }
        if(password != confirmPassword){
            $("#confirm_password").after('<small class="input_error" style="color:red;"> كلمة المرور غير متطابقتين.</small>');
        }
        if(validateEmail(email) == false){
            $("#email").after('<small class="input_error" style="color:red;"> بريد إلكتروني غير صالح.</small>');
        }

        if(typeof userRole == "undefined"){
            $("#typeaccount").append('<small class="input_error mb-3 d-block" style="color:red;"> الرجاء إختيار نوع الحساب.</small>');
        }

        if(!validatePhoneNumber(phoneNumber)){
            $("#phone").after('<small class="input_error" style="color:red;"> رقم هاتف خاطئ.</small>');
        }

        if($('.input_error').length != 0){
            return false;
        }
        axios.post('http://127.0.0.1:8080/user',{
                    "username": username,
                    "password": password,
                    "userRole": userRole,
                    "disabled": false,
                    "firstName": firstName,
                    "lastName": famliy,
                    "address": address,
                    "description": description,
                    "mobileNumber": phoneNumber,
                    "emailAddress": email
                }).then(data=>{
                    sessionStorage.setItem('isLogedin','true');
                    axios.post('http://localhost:8080/token/auth',{
                        username:username,
                        password:password
                    }).then(data => {
                        axios.get('http://localhost:8080/user',{
                            headers : {'Authorization' : data.headers.authorization}
                        }).then(userData => {
                            document.cookie=`userData=${JSON.stringify({
                                userToken:data.headers.authorization,
                                userData:userData.data
                            })}`;
                            if(userData.data.userRole == 'ROLE_HANDYMAN'){
                                var postData = {
                                    "email": email,
                                    "website": "",
                                    "phoneNumber": phoneNumber,
                                    "companyCover": firstName + ' ' +famliy,
                                    "user": {"id": userData.data.id},
                                };
                                let axiosConfig = {
                                    headers: {
                                        'Authorization':data.headers.authorization,
                                    }
                                };                                  
                               axios.post('http://localhost:8080/store', postData, axiosConfig ).
                               then(data =>{
                                    window.location.href='./profile.html'
                               })
                            }else{
                                window.location.href='./home.html'
                            }
                        });

                    })
                    
                })

   

    })
    //Add to wishlist
    var product_id,fav_num,add_or_remove,remove_id;
    $(document).on('click','.add_to_fav',function(){
        product_id = $(this).data("id");
        remove_id = $(this).attr("data-remove");
        add_or_remove = ($(this).hasClass('active')) ? "remove" : "add";
        if(add_or_remove == "remove"){
            $.ajax({
                method:"DELETE",
                url:"http://localhost:8080/liked_product/"+remove_id
            }).done(data =>{
            })
            
            $(this).removeClass('active');
        }else{
            var postData = {
                "user": {"id":getCookieValue('userData').userData.id},
                "product": {"id":product_id},
            };
            let axiosConfig = {
                headers: {
                    'Authorization':getCookieValue('userData').userToken,
                }
            };                                  
           axios.post('http://localhost:8080/liked_product', postData, axiosConfig ).
           then(data =>{
               $(this).attr('data-remove',data.data.id);
           })
            $(this).addClass('active');
        }        
     
    });
})(jQuery);

