$(document).ready(function() {
    $('#copybox').focusout(function(){

        var caption = $('#copybox').val();

        var copy = '';
        var copyplain = '';

        $.ajax({
            url: '/',
            type: 'post',
            data: { caption:caption },
            success:function(response){
               if(response.success == 1){ 
                copy = response.copy;
                var decodedCopy = decodeHtml(copy);

                $('#generatedCopy').text(decodedCopy);
            
               }else{ 
                  alert("not generated sucessfully");
               }
            }
        });
    });

    $('#generaltags').on('click', '.edittags', function(){
        $(".textedittags").hide();
        $(this).find(".textedittags").show().focus();
        $(this).find(".prefix").hide()
        $(this).find(".editvaluetags").hide();
    });

    $('#generaltags').on('focusout', '.textedittags', function(){
        var tags = $(this).val();
        // Hide Input element
        $(this).hide();
        // Hide and Change Text of the container with input elmeent
        $(this).prev('.editvaluetags').show();
        $(this).prev('.editvaluetags').text(tags);

        $.ajax({
            url: '/other',
            type: 'post',
            data: { type:'tags', tags:tags },
            success:function(response){
               if(response != 1){ 
                  alert("not saved sucessfully");
               }
            }
        });
        
    });

    $('#maintable').on('click', '.edit', function(){
        $(".textedit").hide();
        $(this).find(".textedit").show().focus();
        $(this).find(".prefix").hide()
        $(this).find(".editvalue").hide();
    });

    /*$('#maintable').on('click', '.edit', function(){
        $(".textedit").hide();
        $(this).find(".textedit").show().focus();
        $(this).find(".balls").hide();
    });*/

    $('#maintable').on('focusout', '.textedit', function(){
        var id = this.id;
        var split_id = id.split("_");
        var field_name = split_id[0];
        var edit_id = split_id[1];
        var value = $(this).val();
        // Hide Input element
        $(this).hide();
        // Hide and Change Text of the container with input elmeent
        $(this).prev('.editvalue').show();
        $(this).prev('.editvalue').prev('.prefix').show();
        $(this).prev('.editvalue').text(value);
        

        $.fn.submit(field_name, value, edit_id);
    });

    $.fn.submit = function(field_name, value, edit_id) {
        $.ajax({
            url: '/update',
            type: 'post',
            data: { field:field_name, value:value, id:edit_id },
            success:function(response){
               if(response != 1){ 
                  alert("not saved sucessfully");
               }
            }
        });
    }

    $('#maintable').on('change', '.submit', function(){
        var id = this.id;
        var split_id = id.split("_");
        var field_name = split_id[0];
        var edit_id = split_id[1];
        var value = $(this).val();

        $.fn.submit(field_name, value, edit_id);
    });

    $('#maintable').on('change', '.threadsbutton', function(){
        var id = this.id;
        var split_id = id.split("_");
        var field_name = split_id[0];
        var edit_id = split_id[1];
        var value = $(this).val();
        var newvalue = 0;

        if (value == 0) {
            newvalue = 1
        }

        $.fn.submit(field_name, newvalue, edit_id);
    });


    // Adds Row

    $("#addrow").click(function(){
        var typename = $("#typename").val();
        var emoji = $("#emoji").val();

        var name = $("#name").val();
        
        if (name == ''){
            alert("Name field cannot be blank!")
            return;
        }
        var instagram = $("#instagram").val();
        var threads = $("#threads:checked").val();

        var threadshtml = '<input class="form-check-input threadsbutton" id="threads_" type="checkbox" value="' + threads + '" aria-label="threadsCheckbox">';

        if (threads == "on") {
            threadshtml = '<input class="form-check-input threadsbutton" id="threads_" type="checkbox" value="' + threads + '" aria-label="threadsCheckbox" checked>';
        }

        var facebook = $("#facebook").val();
        var x = $("#x").val();
        var hashtags = $("#hashtags").val();

        var id;
        
        var row = `<tr id="temp">
                    <td>
                    <select class="form-select submit" aria-label="type name selection" id="typename_">
                    <option value="` + typename + `" selected>` + typename + `</option>
                    </select>
                    </td>
                    <td class="edit">
                        <span class="editvalue">` + emoji + `</span>
                        <input type="text" class="form-control textedit" value="`+ emoji + `" id="emoji_">
                    </td>
                    <td class="edit">
                        <span class="editvalue">` + name + `</span>
                        <input type="text" class="form-control textedit" value="` + name + `" id="name_">
                    </td>
                    <td class="edit">
                        <span class="prefix">@</span><span class="editvalue">` + instagram + `</span>
                        <input type="text" class="form-control textedit" value="` + instagram + `" id="instagram_">
                    </td>
                    <td>` + threadshtml + `</td>
                    <td class="edit">
                        <span class="prefix">@</span><span class="editvalue">`+ facebook + `</span>
                        <input type="text" class="form-control textedit" value="`+ facebook + `" id="facebook_">
                    </td>
                    <td class="edit">
                        <span class="prefix">@</span><span class="editvalue">` + x + `</span>
                        <input type="text" class="form-control textedit" value="` + x + `" id="x_">
                    </td>
                    <td class="edit">
                        <span class="editvalue">` + hashtags + `</span>
                        <input type="text" class="form-control textedit" value="` + hashtags + `" id="hashtags_">
                    </td>
                    <td>
                    <button type="button" class="btn btn-outline-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"></path>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"></path>
                        </svg>
                    </button>
                </td>
                </tr>`
        $(row).prependTo("table tbody");
        document.getElementById("newrowform").reset();
    

        var othertypes;

        $.ajax({
            url: '/newrow',
            type: 'post',
            data: { typename:typename, emoji:emoji, name:name, instagram:instagram, threads:threads, facebook:facebook, x:x, hashtags:hashtags },
            success:function(response){
               if(response.success == 1){ 
                id = response.id;
                othertypes = response.othertypes;

                $("#temp").find("[id]").each(function(){
                    $(this).attr('id', $(this).attr('id') + id);
                });

                $("#temp button").val(id)

                $('#temp').removeAttr('id');
                
                for(var type of othertypes){
                    $("#typename_" + id).append('<option value="' + type + '">' + type + '</option>')
                }
               }else{ 
                  alert("not saved sucessfully");
               }
            }
        });
    });

    // Removes Row
    $('#maintable').on('click', '.btn-outline-danger', function(){
        var rowid = $(this).val();
        $(this).closest("tr").remove();

        $.ajax({
            url: '/delete',
            type: 'post',
            data: { id:rowid },
            success:function(response){
            if(response != 1){
                alert("not saved sucessfully");
            }
            }
        });
    });
});


function copyText() {
      
    /* Copy text into clipboard */
    copy = $("#generatedCopy").text()
    navigator.clipboard.writeText(copy);
    $('#copied').show();
    $('#copied').delay(1000).fadeOut();
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
