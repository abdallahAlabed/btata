      
    
    //const { default: Axios } = require("axios");

    // var loadFile = function(event) {
    //     var image = document.getElementById('output1');
    //     image.src = event;
    // };
    
    // var loadFile2 = function(event) {
    //     var image2 = document.getElementById('output2');
    //     image2.src = event;
    // };
    // var loadFile3 = function(event) {
    //     var image3 = document.getElementById('output3');
    //     image3.src = event;
    // };
    // var loadFile4 = function(event) {
    //     var image4 = document.getElementById('output4');
    //     image4.src = event;
    // };
    // var loadFile5 = function(event) {
    //     var image5 = document.getElementById('output5');
    //     image5.src = event;
    // };


    var loadFile = function(event) {
        var image = document.getElementById('output1');
        image.src = URL.createObjectURL(event.target.files[0]);
    };
    
    var loadFile2 = function(event) {
        var image2 = document.getElementById('output2');
        image2.src = URL.createObjectURL(event.target.files[0]);
    };
    var loadFile3 = function(event) {
        var image3 = document.getElementById('output3');
        image3.src = URL.createObjectURL(event.target.files[0]);
    };
    var loadFile4 = function(event) {
        var image4 = document.getElementById('output4');
        image4.src = URL.createObjectURL(event.target.files[0]);
    };
    var loadFile5 = function(event) {
        var image5 = document.getElementById('output5');
        image5.src = URL.createObjectURL(event.target.files[0]);
    };

    $('.cat').on('change', function() {
        $('.cat').not(this).prop('checked', false);  
    });
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
    var form_data;
    $('#add_product_form').on('submit',function(e){
        e.preventDefault();
        form_data = $(this).serialize();


        let name = $('input[name="name"]').val();
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

        var postData = {
            'name':name,
            'price':price,
            'imageFilePath':imageFilePath,
            'imageFilePath1':imageFilePath1,
            'imageFilePath2':imageFilePath2,
            'imageFilePath3':imageFilePath3,
            'imageFilePath4':imageFilePath4,
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
           window.location.href = "profile.html";
       }).catch(error =>{
           alert('الرجاء ملأ المعلومات')
       })
    })

    // name
    // price
    // imageFilePath
    // imageFilePath1
    // imageFilePath2
    // imageFilePath3
    // imageFilePath4
    // productCategory
    // store
    // productDescription
    // productSpecification