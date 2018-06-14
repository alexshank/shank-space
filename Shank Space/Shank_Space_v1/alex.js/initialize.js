/****************************
 * Initialize the page
 */
$(document).ready(function(){
    // add site wide dependencies to page
    $.get('../components/head.html', function(data){
        $(document.head).append(data);
    });

    // add navigation to the page
    // could maybe use SITE WIDE js file to just call a function that does this
    $.get('../components/navigation.html', function(data){
        $('body').prepend(data);
    });
});

/****************************
 * Display success alert to the user
 * (displays to passed in element id)
 */
function success(id){
    $('#' + id).append('<div class="alert alert-success alert-dismissible" style="margin-top: 10px" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Success!</strong></div>');
}

/****************************
 * Change active page for navigation
 */
