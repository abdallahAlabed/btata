$(function(){
    var categories_list = {};
    $.ajax({
        url:"http://localhost:8080/product-categories",
        type:"GET",
        dataTyoe:"JSON"
    }).done(data => {
        categories_list = data.rows;
        //loop Products in wishlist
        $.each(categories_list,function(k, category){
            $('#categories_list').append('<div class="col-md-3"><div class="product-item"><div class="product-title"><a href="#">'+category.categoryName+'</a></div><div class="product-image"><a href="product-list.html?category_id='+category.id+'"><img src="img/category_page_'+category.id+'.jpg" alt="'+category.categoryName+'"></a></div><div class="product-price product-price-btn2"><a class="btn" href="product-list.html?category_id='+category.id+'">عرض <i class="fas fa-eye"></i> </a></div></div></div>');
        })
    })
   
})