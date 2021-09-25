var parts = window.location.search.substr(1).split("&");
var $_GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}
//getCookieValue('userData').userToken
$(function(){
    //SELLER INFORMATION
    var user_data = {};
    $.ajax({
        url:'http://localhost:8080/user',
        type:'GET',
        dataType:"JSON"
    }).done(user_data => {
        if(user_data.userRole == "ROLE_HANDYMAN" || user_data.userRole == "ROLE_ADMIN"){
            $("#seller_name").text(user_data.firstName + ' ' + user_data.lastName);
            $('#seller_image').html('<img src="img/store-2.jpg" alt="'+user_data.firstName + ' ' + user_data.lastName +'">');
            $('#description').text(user_data.description);
        }else{
            window.location.href = "home.html";
        }
    }).fail(data => {
        NotLoggedIn();
        clearSession();
    })
    var user_id;
    
    //Get Category ID and Page ID From $_GET data
    let page_id = parseInt($_GET.page_id);
    page_id = (typeof $_GET.page_id == 'undefined' || Number.isInteger(page_id) == false) ? 1 : page_id;
    
    //check if page id and category id is numeric
    
    if(page_id < 1){
        window.location.href = 'category.html';
    }

    //pagination
    let pagination = 1;
    var active_class;
    
    //Category Products [You have to send get to backend by category id to receive category products list data] , page id + categody id
    //This is just temprory data
    var user_products_list = {},from,i;
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/user_products/"+getCookieValue('userData').userData.id,
        data:{page_number:page_id,page_size:9},
        dataType:"JSON",
    }).done(data => {
        user_products_list = data;
        pagination = Math.ceil(user_products_list.length/9);
        if(user_products_list.length == 0){
            pagination = 0;
            $('#user_products').after('<div class="alert alert-danger text-center">لا يوجد منتجات</div>');
        }

        from =(page_id-1)*9;
        i=0;
        $.each(user_products_list,function(k, product){
            if(k < from || k>=from+9) {
                return true;
            }
            stars = "";
            for (let index = 0; index < product.rate; index++) {
                stars = stars+'<i class="fa fa-star"></i>';
            }
            if(product.rate < 5){
                for (let index = 0; index < (5-product.rate); index++) {
                    stars = stars+'<i class="far fa-star"></i>';
                }
            }
            $('#user_products').append('<div class="col-md-4" id="product-'+product.id+'"><div class="product-item"><div class="product-title"><a href="product-detail.html?id='+product.id+'">'+product.name+'</a><div class="ratting">'+stars+'</div></div><div class="product-image"><a href="product-detail.html?id='+product.id+'"><img src="'+product.imageFilePath+'" alt="'+product.name+'"></a><div class="product-action"><a href="javascript:;" class="remove_product" data-id="'+product.id+'"><i class="fa fa-trash"></i></a><a href="edit-product.html?id='+product.id+'" data-id="'+product.id+'"><i class="fa fa-edit"></i></a></div></div><div class="product-price"><h3><span>JD</span>'+product.price+'</h3><a class="btn" href="product-detail.html?id='+product.id+'">عرض <i class="fas fa-eye"></i>  </a></div></div></div>')
        });

        if((page_id-1) > 0){
            $('#prev a').attr('href','profile.html?page_id='+(page_id-1)+'')
        }else{
            $('#prev').addClass('disabled').find('a').attr('href','javascript:;').css('opacity','.6');
        }
        if((page_id+1) <= pagination){
            $('#next a').attr('href','profile.html?page_id='+(page_id+1)+'')
        }else{
            $('#next').addClass('disabled').find('a').attr('href','javascript:;').css('opacity','.6');
        }
        for (let index = 1; index < pagination+1; index++) {
            active_class = (page_id == index) ? "active" : "";
            $('#next').before('<li class="page-item '+active_class+'"><a class="page-link" href="profile.html?page_id='+index+'">'+index+'</a></li>')
        }
    })


    var product_id;
    $(document).on('click','.remove_product',function(){
        product_id = $(this).data('id');
        $.ajax({
            method:"DELETE",
            url:"http://localhost:8080/product/"+product_id
        }).done(data => {
            $('#product-'+product_id).remove();
        })
    })
    // stars = "";
    // for (let index = 0; index < user_data.rate; index++) {
    //     stars = stars+'<i class="fa fa-star"></i>';
    // }
    // if(user_data.rate < 5){
    //     for (let index = 0; index < (5-user_data.rate); index++) {
    //         stars = stars+'<i class="far fa-star"></i>';
    //     }
    // }
    // $("#seller_rating").html(stars);

})