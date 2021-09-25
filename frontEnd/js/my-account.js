$(function(){
    //SELLER INFORMATION
    var user_data = {};
    $.ajax({
        url:'http://localhost:8080/user',
        type:'GET',
        dataType:"JSON"
    }).done(user_data => {
        $("#seller_name").text(user_data.firstName + " " + user_data.lastName);
        $('#description').text(user_data.description);
        $('#address_info').html('<h5>'+user_data.address+'</h5><p>'+user_data.mobileNumber+'</p>');
        $.each(user_data,function(k, v){
            $('#user_data_form input[name="'+k+'"]').val(v);
        })
        $("#user_data_form input['name=description']").val(v);
        if(user_data.userRole == "ROLE_HANDYMAN"){
            
        }
    }).fail(data => {
        NotLoggedIn();
        clearSession();
    })
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
    function validatePhoneNumber(input_str) 
      {
          var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      
          return re.test(input_str);
      }   
    var firstName,lastName,address,description,mobileNumber,emailAddress,password;
    $('#user_data_form').on('submit',function(e){
        e.preventDefault();
        firstName= $("input[name='firstName']").val(),
        lastName= $("input[name='lastName']").val(),
        address= $("input[name='address']").val(),
        description= $("input[name='description']").val(),
        mobileNumber= $("input[name='mobileNumber']").val(),
        emailAddress= $("input[name='emailAddress']").val(),
        password=$("input[name='set_password']").val(),
        $('.form_msg,.input_error').remove();
        if(firstName.length < 3){
            $("input[name='firstName']").after('<small class="input_error" style="color:red;"> يجب أن يحتوي الإسم الأول على الأقل 3 حروف.</small>');
        }
        if(address.length < 3){
            $("input[name='address']").after('<small class="input_error" style="color:red;"> يجب أن يحتوي العنوان على الأقل 3 حروف.</small>');
        }
        if(description.length < 3){
            $("input[name='description']").after('<small class="input_error" style="color:red;"> يجب أن يحتوي الوصف على الأقل 3 حروف.</small>');
        }
        if(lastName.length < 3){
            $("input[name='lastName']").after('<small class="input_error" style="color:red;"> يجب أن يحتوي اللقب على الأقل 3 حروف.</small>');
        }
        if(validateEmail(emailAddress) == false){
            $("input[name='emailAddress']").after('<small class="input_error" style="color:red;"> بريد إلكتروني غير صالح.</small>');
        }

        if(!validatePhoneNumber(mobileNumber)){
            $("input[name='phoneNumber']").after('<small class="input_error" style="color:red;"> رقم هاتف خاطئ.</small>');
        }

        if(password.length < 5){
            $("input[name='set_password']").after('<small class="input_error" style="color:red;"> كلمة مرور خاطئة.</small>');
        }

        if($('.input_error').length != 0){
            return false;
        }
        var postData = {
            "id":getCookieValue('userData').userData.id,
            "firstName": $("input[name='firstName']").val(),
            "lastName": $("input[name='lastName']").val(),
            "address": $("input[name='address']").val(),
            "description": $("input[name='description']").val(),
            "mobileNumber": $("input[name='mobileNumber']").val(),
            "emailAddress": $("input[name='emailAddress']").val(),
            'password':$("input[name='set_password']").val(),
        };
        let axiosConfig = {
            headers: {
                'Authorization':getCookieValue('userData').userToken,
            }
        };  
        axios.put('http://127.0.0.1:8080/user/'+getCookieValue('userData').userData.id, postData, axiosConfig)
        .then(data=>{
            $("input[name='set_password']").val('');
            $('#user_data_form').prepend('<div class="alert alert-success form_msg">تم تحديث المعلومات بنجاح</div>');
        }).catch(data =>{
            $("input[name='set_password']").after('<small class="input_error" style="color:red;"> كلمة المرور الحالية.</small>');
        })
    })

    $('#update_password').on('submit',function(e){
        e.preventDefault();
        currentPass=$("input[name='current_password']").val(),
        newPass= $("input[name='new_password']").val(),
        confirm_newPass= $("input[name='confirm_new_password']").val(),
        $('.form_msg,.input_error').remove();

        if(currentPass.length < 5){
            $("input[name='current_password']").after('<small class="input_error" style="color:red;"> كلمة المرور الحالية.</small>');
        }
        if(newPass.length < 5){
            $("input[name='new_password']").after('<small class="input_error" style="color:red;"> يجب أن تحتوي كلمة المرور على الأقل 5 حروف.</small>');
        }
        if(confirm_newPass != newPass){
            $("input[name='confirm_new_password']").after('<small class="input_error" style="color:red;"> كلمة المرور غير متطابقتين.</small>');
        }
        if($('.input_error').length != 0){
            return false;
        }
        var postData = {
            "id":getCookieValue('userData').userData.id,
            "password": $("input[name='current_password']").val(),
            "newPassword": $("input[name='new_password']").val(),
        };
        let axiosConfig = {
            headers: {
                'Authorization':getCookieValue('userData').userToken,
            }
        };  
        axios.put('http://127.0.0.1:8080/user/'+getCookieValue('userData').userData.id, postData, axiosConfig)
        .then(data=>{
            $("input[name='current_password'],input[name='new_password'],input[name='confirm_new_password']").val('');
            $('#update_password').prepend('<div class="alert alert-success form_msg">تم تحديث المعلومات بنجاح</div>');
        }).catch(data =>{
            $("input[name='current_password']").after('<small class="input_error" style="color:red;"> كلمة مرور خاطئة.</small>');
        })
    })
})