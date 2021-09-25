var parts = window.location.search.substr(1).split("&");
var $_GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}
$(function(){
    //Get Category ID and Page ID From $_GET data
    let product_id = $_GET.id;

    //check product id
    if(typeof product_id == 'undefined' || parseInt(product_id) < 1 ||  Number.isInteger(parseInt(product_id)) == false){
        window.location.href = "./product-list.html";
    }
    
  
    let product_data = {};
    var product_images = {};
    var date;
    var imageFilePath_db,imageFilePath1_db,imageFilePath2_db,imageFilePath3_db,imageFilePath_db4;
    $.ajax({
        method:"GET",
        url:"http://localhost:8080/product/"+product_id,
        dataType:"JSON"
    }).done(data =>{
        product_data = data;
        //insert product data info html
        $("#output1").attr("src",product_data.imageFilePath);
        $("#output2").attr("src",product_data.imageFilePath1);
        $("#output3").attr("src",product_data.imageFilePath2);
        $("#output4").attr("src",product_data.imageFilePath3);
        $("#output5").attr("src",product_data.imageFilePath4);

        imageFilePath_db = product_data.imageFilePath;
        imageFilePath1_db = product_data.imageFilePath1;
        imageFilePath2_db = product_data.imageFilePath2;
        imageFilePath3_db = product_data.imageFilePath3;
        imageFilePath4_db = product_data.imageFilePath4;

        $("input[name='title']").val(product_data.name);
        $("textarea[name='productDescription']").text(product_data.productDescription);
        $("textarea[name='productSpecification']").text(product_data.productSpecification);
        $("input[name='price']").val(product_data.price);
        $("#category-"+data.productCategory.id).attr('checked',true);
        date = data.createTime;
    })
    

    var form_data;
    $('#edit_product_form').on('submit',function(e){
        e.preventDefault();
        form_data = $(this).serialize();

        let name = $('input[name="title"]').val();
        let price = $('input[name="price"]').val();
        let imageFilePath = $('input[name="imageFilePath"]').val().replace('C:\\fakepath\\' , 'http://localhost:5500/uploads/');
        let imageFilePath1 = $('input[name="imageFilePath1"]').val().replace('C:\\fakepath\\' , 'http://localhost:5500/uploads/');
        let imageFilePath2 = $('input[name="imageFilePath2"]').val().replace('C:\\fakepath\\' , 'http://localhost:5500/uploads/');
        let imageFilePath3 = $('input[name="imageFilePath3"]').val().replace('C:\\fakepath\\' , 'http://localhost:5500/uploads/');
        let imageFilePath4 = $('input[name="imageFilePath4"]').val().replace('C:\\fakepath\\' , 'http://localhost:5500/uploads/');

        let productCategory = $('input[name="productCategory[id]"]:checked').val();
        let user = getCookieValue('userData').userData.id;
        let productDescription = $('textarea[name="productDescription"]').val();
        let productSpecification = $('textarea[name="productSpecification"]').val();
        console.log(imageFilePath == null);
        console.log(imageFilePath_db);
        var postData = {
            'name':name,
            'price':price,
            'imageFilePath':(imageFilePath == "") ? imageFilePath_db : imageFilePath,
            'imageFilePath1':(imageFilePath1 == "") ? imageFilePath1_db : imageFilePath1,
            'imageFilePath2':(imageFilePath2 == "") ? imageFilePath2_db : imageFilePath2,
            'imageFilePath3':(imageFilePath3 == "") ? imageFilePath3_db : imageFilePath3,
            'imageFilePath4':(imageFilePath4 == "") ? imageFilePath4_db : imageFilePath4,
            'productCategory':{"id":productCategory},
            'user':{"id":user},
            'store':{"id":user},
            'productDescription':productDescription,
            'productSpecification':productSpecification,
        };
        let  axiosConfig = {
            headers: {
                'Authorization':getCookieValue('userData').userToken,
            }
        };                                  
       axios.post('http://localhost:8080/product', postData, axiosConfig ).
       then(data =>{
            $.ajax({
                method:"DELETE",
                url:"http://localhost:8080/product/"+product_id
            }).done(data=>{
                window.location.href = "profile.html";
            })
       }).catch(error =>{
           alert('الرجاء ملأ المعلومات')
       })
    })

})