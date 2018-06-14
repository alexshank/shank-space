/**************************
 * Initialize the page
 */
$(document).ready(function(){
    // place quotes onto page
    $.get('../../content/quotes.txt', function(data) {
        // split raw string into individual quotes
        var quotes = data.split('*');

        // call function to place quotes onto page
        loadQuotes(quotes);
    });
});

/**************************
 * Load the quotes from a file
 */
function loadQuotes(quotes){
    // get destination div
    var target = $('#quotes-column');

    // add quotes to div
    for(var i = 0; i < quotes.length; i = i + 2){
        console.log(i);
        target.append('<blockquote><p>' + quotes[i] + '</p><footer>'+ quotes[i + 1] + '</footer></blockquote>');
    }
}
