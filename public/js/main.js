$(document).ready(function(){
    $(".delete-article").on('click', function(e){
        var dataId = $(this).data('id');
        $.ajax({
            type: 'DELETE',
            url:'/articles/'+dataId,
            success: function(response){
                alert('Deleting Article');
                window.location.href = '/';
            },
            error: function(err){
                console.log(err);
            }
        })
    })
})