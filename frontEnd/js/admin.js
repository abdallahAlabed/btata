$(function(){
    var user_data = {};
    $.ajax({
        url:'http://localhost:8080/user',
        type:'GET',
        dataType:"JSON"
    }).done(user_data => {
        if(user_data.userRole == "ROLE_ADMIN"){
        }else{
            window.location.href = "home.html";
        }
    }).fail(data => {
        NotLoggedIn();
        clearSession();
    })
    let role,date;
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/users/"
    }).done(data => {
        users_data = data.rows;
        if(users_data.length == 0){
            $('#users-tab table').remove();
            $('#users-tab .table-responsive').append('<div class="alert alert-danger text-center">لا يوجد أي مستخدمين</div>');
            return false;
        }
        $.each(users_data, function(i, v){
            date = v.createTime.split('T')[0];
            role = (v.userRole == "ROLE_HANDYMAN") ? "بائع" : "مشتري";
            role = (v.userRole == "ROLE_ADMIN") ? "أدمن" : role;
            $('#users_data').append('<tr id="user-'+v.id+'"><td>'+v.username+'</td><td>'+v.emailAddress+'</td><td>'+v.mobileNumber+'</td><td>'+role+'</td><td>'+date+'</td><td><button class="btn delete_user" data-id="'+v.id+'">حذف</button></td></tr>')
        })
    })

    let products_data ={};
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/products/"
    }).done(data => {
        products_data = data.rows;
        if(products_data.length == 0){
            $('#products-tab table').remove();
            $('#products-tab .table-responsive').append('<div class="alert alert-danger text-center">لا يوجد أي منتجات</div>');
            return false;
        }
        $.each(products_data, function(i, v){
            date = v.createTime.split('T')[0];
            $('#products_data').append('<tr id="product-'+v.id+'"><td>'+v.name+'</td><td>'+v.price+'</td><td>'+v.store.user.firstName + ' ' + v.store.user.lastName +'</td><td>'+v.productCategory.categoryName+'</td><td>'+date+'</td><td><a href="product-detail.html?id='+v.id+'">عرض التفاصيل</a></td><td><button class="btn delete_product" data-id="'+v.id+'">حذف</button></td></tr>')
        })
    })

    let stores_data ={};
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/stores/"
    }).done(data => {
        stores_data = data.rows;
        if(stores_data.length == 0){
            $('#stores-tab table').remove();
            $('#stores-tab .table-responsive').append('<div class="alert alert-danger text-center">لا يوجد أي متاجر</div>');
            return false;
        }
        $.each(stores_data, function(i, v){
            date = v.createTime.split('T')[0];
            $('#stores_data').append('<tr id="store-'+v.id+'"><td>'+v.user.firstName + ' ' + v.user.lastName+'</td><td>'+v.email+'</td><td>'+v.phoneNumber+'</td><td>'+date+'</td><td><button class="btn delete_store" data-id="'+v.id+'">حذف</button></td></tr>')
        })
    })

    let categories_data ={};
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/product-categories/"
    }).done(data => {
        categories_data = data.rows;
        if(categories_data.length == 0){
            $('#categories-tab table').remove();
            $('#categories-tab .table-responsive').append('<div class="alert alert-danger text-center">لا يوجد أي قسم</div>');
            return false;
        }
        $.each(categories_data, function(i, v){
            date = v.createTime.split('T')[0];
            $('#categories_data').append('<tr id="category-'+v.id+'"><td>'+v.categoryName+'</td><td>'+date+'</td><td><button class="btn delete_category" data-id="'+v.id+'">حذف</button></td></tr>')
        })
    })

    

    var user_id;
    $(document).on('click','.delete_user',function(){
        user_id = $(this).data('id');
        $.ajax({
            method:"DELETE",
            url:"http://localhost:8080/user/"+user_id
        }).done(data => {
            $('#user-'+user_id).remove();
        })
    })

    var product_id;
    $(document).on('click','.delete_product',function(){
        product_id = $(this).data('id');
        $.ajax({
            method:"DELETE",
            url:"http://localhost:8080/product/"+product_id
        }).done(data => {
            $('#product-'+product_id).remove();
        })
    })

    var store_id;
    $(document).on('click','.delete_store',function(){
        store_id = $(this).data('id');
        $.ajax({
            method:"DELETE",
            url:"http://localhost:8080/store/"+store_id
        }).done(data => {
            $('#store-'+store_id).remove();
        })
    })

    var category_id;
    $(document).on('click','.delete_category',function(){
        category_id = $(this).data('id');
        $.ajax({
            method:"DELETE",
            url:"http://localhost:8080/product-category/"+category_id
        }).done(data => {
            $('#category-'+category_id).remove();
        })
    })

    var categoryName;
    $("#add_category").on('submit',function(e){
        e.preventDefault();
        categoryName = $('input[name="categoryName"]').val();
        var postData = {
            "categoryName": categoryName,
        };
        let axiosConfig = {
            headers: {
                'Authorization':getCookieValue('userData').userToken,
            }
        };   
        axios.post('http://localhost:8080/product-category',postData,axiosConfig).then(data=>{
            $('input[name="categoryName"]').val("");
            $('#categories_data').append('<tr class="highlight" id="category-'+data.data.id+'" style="background-color: #e2bc063d;transition: all 1s ease-in;""><td>'+data.data.categoryName+'</td><td>'+date+'</td><td><button class="btn delete_category" data-id="'+data.data.id+'">حذف</button></td></tr>');
            setTimeout(() => {
                $('.highlight').css('background-color','#fff');
            }, 1000);
        })
    })
    
})