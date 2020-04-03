/****************************
 * Initialize page with anonymous function
 */
$(document).ready(function(){
    // show first tool
    showMinesweeper();

    // add click functionality
    $('#minesweeper').click(showMinesweeper);
    $('#other').click(showOther);

    // add navigation functionality
    $('#myFunctions').children().click(function(){
        $('#myFunctions').children().removeClass('active');
        $(this).addClass('active');
    });
});


/****************************
 * Display the other layout in the target div
 */
function showOther(){
    // change title
    changeTitle('Other');

    // change content
    $('#JS_Target').html('<p>Here is where another JavaScript program will be displayed.</p>');
}


/****************************
 * Change the content column's title
 */
function changeTitle(title){
    $('.main-column-title').text(title);
}