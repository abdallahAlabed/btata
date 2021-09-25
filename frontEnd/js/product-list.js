var parts = window.location.search.substr(1).split("&");
var $_GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}

$(function(){
    var stars;
    //Get Category ID and Page ID From $_GET data
    let category_id = $_GET.category_id;
    let page_id = parseInt($_GET.page_id);
    page_id = (typeof $_GET.page_id == 'undefined' || Number.isInteger(page_id) == false) ? 1 : page_id;

    //check if page id and category id is numeric
    
    if(typeof category_id == 'undefined' || page_id < 1 || parseInt(category_id) < 1 ||  Number.isInteger(parseInt(category_id)) == false){
        category_id = 0;
    }
    
    page_id--;

    console.log(page_id)

    //pagination
    let pagination = 0;
    var active_class;

    
    //Category Products [You have to send get to backend by category id to receive category products list data] , page id + categody id
    //This is just temprory data
    let category_products_list = {};
    $('#category_products').html("");
    let url = (category_id != 0) ? 'http://localhost:8080/products?product_category_id='+category_id : "http://localhost:8080/products/";
    $.ajax({
        method:"GET",
        url:url,
        data:{page_number:page_id,page_size:9},
        dataType:"JSON",
    }).done(data => {
        category_products_list = data.rows;
        pagination = Math.ceil(data.totalElements/9);
        if(category_products_list.length == 0){
            pagination = 0;
            $('#category_products').after('<div class="alert alert-danger text-center">لا يوجد منتجات</div>');
        }
        if((page_id) > 0){
            $('#prev a').attr('href','product-list.html?category_id='+category_id+'&page_id='+(page_id-1)+'')
        }else{
            $('#prev').addClass('disabled').find('a').attr('href','javascript:;').css('opacity','.6');
        }
        if((page_id+2) <= pagination){
            $('#next a').attr('href','product-list.html?category_id='+category_id+'&page_id='+(page_id+1)+'')
        }else{
            $('#next').addClass('disabled').find('a').attr('href','javascript:;').css('opacity','.6');
        }
        for (let index = 1; index < pagination+1; index++) {
            active_class = (page_id+1 == index) ? "active" : "";
            $('#next').before('<li class="page-item '+active_class+'"><a class="page-link" href="product-list.html?category_id='+category_id+'&page_id='+index+'">'+index+'</a></li>')
        }
        $.each(category_products_list,function(k, product){
            stars = "";
            for (let index = 0; index < product.rate; index++) {
                stars = stars+'<i class="fa fa-star"></i>';
            }
            if(product.rate < 5){
                for (let index = 0; index < (5-product.rate); index++) {
                    stars = stars+'<i class="far fa-star"></i>';
                }
            }
            $('#category_products').append('<div class="col-md-4"><div class="product-item"><div class="product-title"><a href="#">'+product.name+'</a><div class="ratting">'+stars+'</div></div><div class="product-image"><a href="product-detail.html?id='+product.id+'"><img src="'+product.imageFilePath+'" alt="'+product.name+'"></a><div class="product-action"><a href="javascript:;" class="add_to_fav" data-id="'+product.id+'"><i class="fa fa-heart"></i></a></div></div><div class="product-price"><h3><span>JD</span>'+product.price+'</h3><a class="btn" href="product-detail.html?id='+product.id+'">عرض <i class="fas fa-eye"></i>  </a></div></div></div>')
        })
    });
    

})