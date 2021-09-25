var parts = window.location.search.substr(1).split("&");
var $_GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

$(function(){
    var stars;
    //Get Category ID and Page ID From $_GET data
    let product_id = $_GET.id;

    //check product id
    if(typeof product_id == 'undefined' || parseInt(product_id) < 1 ||  Number.isInteger(parseInt(product_id)) == false){
        window.location.href = "./product-list.html";
    }
   

    let product_data = {};
    var product_images = {};
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/product/"+product_id,
        dataType:"JSON"
    }).done(data =>{
        product_data = data;

        product_images = [
            product_data.imageFilePath,
            product_data.imageFilePath1,
            product_data.imageFilePath2,
            product_data.imageFilePath3,
            product_data.imageFilePath4,
        ];
        //insert product data info html
        $("#title").text(product_data.name);
        $("#price").append(product_data.price);
        $("#phone_number").text(product_data.store.phoneNumber);
        $("#description p").text(product_data.productDescription);
        $("#specification div").text(product_data.productSpecification);
        $.each(product_data.keywords,function(k, v){
            $('#keywords').append('<a href="javascript:;" class="mr-1">'+v+'</a>');
        })
        stars = "";
        for (let index = 0; index < product_data.rate; index++) {
            stars = stars+'<i class="fa fa-star"></i>';
        }
        if(product_data.rate < 5){
            for (let index = 0; index < (5-product_data.rate); index++) {
                stars = stars+'<i class="far fa-star"></i>';
            }
        }
        $("#ratting").html(stars);
        var img;
        $.each(product_images,function(k, image){
            img = '<img src="'+image+'" alt="'+product_data.name+'">';
            $('#product_slider1').append(img);
            $('#product_slider2').append('<div class="slider-nav-img">' + img + '</div>');
        })
        // Product Detail Slider
        $('.product-slider-single').slick({
            infinite: true,
            autoplay: true,
            dots: false,
            fade: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.product-slider-single-nav'
        });
        $('.product-slider-single-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            rtl: true,
            dots: false,
            centerMode: true,
            focusOnSelect: true,
            asNavFor: '.product-slider-single'
        });
    })
    

    var is_ratted = false;
    var rate_____;
    var rate_id;
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/user_rate_product/"+getCookieValue('userData').userData.id,
    }).done(data =>{
        $.each(data , function(k, v){
         if(v.product.id == product_id){
            is_ratted = true;
            rate_____ = v.rate;
            rate_id = v.id;
            $('#rate_product i[data-item="'+rate_____+'"]').addClass('current_rate');
            for (let index = 1; index < rate_____+1; index++) {
                $('#rate_product i:nth-child('+index+')').removeClass('far').addClass('fa');
            }
         }
        })
    })
    //Rate
    var current_star;
    $('#rate_product i').on('click',function(){
        $('#rate_product i').removeClass('fa current_rate').addClass('far');
        current_star = parseInt($(this).data('item'));
        
        var postData = {
            "rate": current_star,
            "product":{"id": product_id},
            "user": {"id": getCookieValue('userData').userData.id} 
        };
        let axiosConfig = {
            headers: {
                'Authorization':getCookieValue('userData').userToken,
            }
        };  
        
        $(this).addClass('current_rate');
        for (let index = 1; index < current_star+1; index++) {
            $('#rate_product i:nth-child('+index+')').removeClass('far').addClass('fa');
        }
        
        if($('#rate_product').hasClass('rated') || is_ratted == true){
            axios.delete('http://localhost:8080/rate_product/'+rate_id,axiosConfig)
        } 
        axios.post('http://localhost:8080/rate_product',postData,axiosConfig).then(data=>{
            is_ratted = true;
            rate_id = data.data.id;
        })
    })
})