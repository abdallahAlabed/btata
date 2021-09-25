$(function(){
    
    let products_list = {
        0:{
            "id":1,
            "name":"Product 1",
            "price":500,
            "image":"img/product-6.jpg",
            "qty":7
        },
        1:{
            "id":2,
            "name":"Product 2",
            "price":400,
            "image":"img/product-7.jpg",
            "qty":2
        }
    }
    var product;
    $.ajax({
        method:"GET",
        url:'http://localhost:8080/user_liked_product/'+getCookieValue('userData').userData.id,
        dataType:"JSON"
    }).done(data => {
        if(data.length == 0){
            $('table').remove();
            $('.table-responsive').append('<div class="alert alert-danger text-center">لا يوجد أي منتجات في المفضلة</div>');
        }else{
            products_list = data;
            $.each(products_list,function(k, product_data){
                product = product_data.product;
                $('#wishlist_items').append('<tr id="product-'+product_data.id+'"><td><div class="img"><a href="product-detail.html?id='+product.id+'"><img src="'+product.imageFilePath+'" alt="Image"></a><p>'+product.name+'</p></div></td><td> JD'+product.price+'</td><td> <a href="product-detail.html?id='+product.id+'"> <button class="btn-cart">عرض التفاصيل</button> </a> </td><td><button class="remove_from_fav" data-id="'+product_data.id+'"><i class="fa fa-trash"></i></button></td></tr>');
            })
        }
    })

    //loop Products in wishlist
    


    //Remove Product From Wishlist
    var product_id;
    $(document).on('click','.remove_from_fav',function(){
        product_id = $(this).data('id');
        $.ajax({
            method:"DELETE",
            url:"http://localhost:8080/liked_product/"+product_id
        }).done(data =>{
            $('#product-'+product_id).remove();
        })
        
    })
})