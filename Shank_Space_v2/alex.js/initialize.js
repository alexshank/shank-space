/****************************
 * Initialize the page
 */
$(document).ready(function(){
    // add site wide dependencies to page
    $.get('../components/head.html', function(data){
        $(document.head).append(data);
    });

    $.get('../components/navigation.html', function(data){
        $('body').prepend(data);
    });
});
