// global variables
var user_profile;
var user_google_id;
var user_first_name;
var user_last_name;

// constant for verifying that my user's tokens are for my project
var MY_GOOGLE_PROJECT_ID = '475941803768-ken45uco0p19stmnvgjit6d3mgtc9p0t.apps.googleusercontent.com';

var DISPLAYED_CLASS_ID;   // this is kept for efficiency

/*
 * when the page loads, validate user
 * and show their classes
 */
$('document').ready(function(){

    // really should figure out how to do this without a timer...
    setTimeout(function(){
        validateGoogleUserAndLoadContent();
    }, 2000);

});

/*
 * sign the google user out
 */
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    location.reload();
}

/*
 * Validate the google user so that their
 * data can be fetched from the database
 */
function validateGoogleUserAndLoadContent(){

    // get google user and their id token
    const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    const id_token = googleUser.getAuthResponse().id_token;

    // check if there's no user ID token (user not signed in)
    if(id_token == null){
        console.log('User ID token is null');
        $('#task_target').html('No user ID token present. Sign in to see your classes!');
        return;
    }

    // send token to google for validation
    var xhr = new XMLHttpRequest();

    // when the xhr request is done, use this callback function
    xhr.onreadystatechange = function(){

        /*
         * use google to check validity of token
         */
        if (this.readyState === 4 && this.status === 200) {

            // check that the token was for my product
            if(JSON.parse(this.responseText).aud === MY_GOOGLE_PROJECT_ID){

                console.log('The user is valid!');

                // set global variables
                user_profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                user_google_id = user_profile.getId();
                user_first_name = user_profile.getGivenName();
                user_last_name = user_profile.getFamilyName();

                // add user (if needed) and display their classes
                insertGoogleUser();
                loadClassesAndCreateSidebar();

            }
            // the token wasn't for this product
            else{
                console.log('The user token is for another product!');
            }

        }
        // no user id token was passed
        else if(this.status === 400){
            console.log('I do not know what could cause this.');
        }

    };

    xhr.open("GET", 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token, true);
    xhr.send();

}

/*
 * load all the user's classes into the sidebar
 */
function loadClassesAndCreateSidebar(){

    // send database query with AJAX call and return results
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {

            /*
             * get classes and place in the sidebar
             */
            var classesArray = JSON.parse(this.responseText);
            $('#classes_sidebar').html("");

            // go through each class and add to sidebar
            for(var i = 0; i < classesArray.length; i++){

                // create and add html
                $('#classes_sidebar').append('<a href=\"#\" class=\"list-group-item sidebar-class\" data-class-id=\"' + classesArray[i].id + '\">' + classesArray[i].name + '<span class=\"glyphicon glyphicon-trash pull-right sidebar-class-delete\" aria-hidden=\"true\"></span><span class=\"glyphicon glyphicon-pencil pull-right sidebar-class-edit\" aria-hidden=\"true\"></span><span id=\"count_' + classesArray[i].id + '\" class=\"label label-pill label-warning pull-right\">0</span></a>');

                // set first class as active tab and load its assignments
                if(i === 0){
                    $('#sidebar .list-group-item').addClass('active');
                    DISPLAYED_CLASS_ID = classesArray[i].id;
                    displayClassAssignments(DISPLAYED_CLASS_ID);
                }

            }

            /*
             * display the class assignments assignments
             */
            $('.sidebar-class').click(function(){

                // remove previous class's 'active' class
                $('#classes_sidebar .active').removeClass('active');

                // add 'active' class and display class's assignments
                DISPLAYED_CLASS_ID = $(this).data('class-id');
                $(this).addClass('active');
                displayClassAssignments();

            });

            /*
             * edit the class
             */
            $('.sidebar-class-edit').click(function(e){
                console.log('edit class');
                editClass($(this).parent().data('class-id'));
                e.stopPropagation(); // stop the parent div's onclick function
            });

            /*
             * delete the class
             */
            $('.sidebar-class-delete').click(function(e){
                console.log('delete class');
                deleteClass($(this).parent().data('class-id'));
                e.stopPropagation(); // stop the parent div's onclick function
            });

            // send database query with AJAX call and return results
            var xmlhttp2 = new XMLHttpRequest();
            xmlhttp2.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(JSON.parse(this.responseText));
                    var countArray = JSON.parse(this.responseText);
                    for(var q = 0; q < countArray.length; q++){
                        $('#count_' + countArray[q].class_id).html(countArray[q].count);
                    }
                }
            };
            xmlhttp2.open("GET", "../../alex.php/assignment_counts.php?keyword=yeah", true);
            xmlhttp2.send();

        }
    };
    xmlhttp.open("GET", "../../alex.php/user_classes.php?keyword=" + user_google_id, true);
    xmlhttp.send();

}

/*
 * show the input screen for classes
 */
function displayClassInputFields(){
    $.get( "../../../alex.html/components/class_input.html",function(response){
        $('#task_target').html(response);
    });
}


/*
 * add the new class to the database
 */
function addClass(){

    // send database query to insert class into database
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            alert('Class added');
        }
    };
    xmlhttp.open("GET", "../../alex.php/add_class.php?google_id=" + user_google_id + "&name=" + $('#name-input').val() + "&notes=" + $('#notes-input').val() + "&time=" + $('#time-input').val(), true);
    xmlhttp.send();

}


/*
 * edit a class in the database
 */
function editClass(class_id){
    console.log('Editing class...');
}

/*
 * delete a class from the database
 * (NEED TO ADD STATEMENT THAT DELETES CLASS'S ASSIGNMENTS)
 */
function deleteClass(class_id){
    // send database query to insert class into database
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            alert('Class removed');
        }
    };
    xmlhttp.open("GET", "../../alex.php/delete_class.php?class_id=" + class_id, true);
    xmlhttp.send();

    // reload classes
    loadClassesAndCreateSidebar();
}

/*
 * display class assignments for the currently
 * active class
 */
function displayClassAssignments(){

    // send database query to get class assignments from database
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {

            // create array from JSON response
            var assignmentsArray = JSON.parse(this.responseText);

            // clear target div
            $('#task_target').html('');

            // check if the class has any assignments yet
            if(assignmentsArray.length > 0){
                // go through assignments and add them to target div
                for(var i = 0; i < assignmentsArray.length; i++){
                    var temp = assignmentsArray[i];    // for easier reference
                    $('#task_target').append('<div class="assignment" data-assignment-id="' + temp.id + '" data-class-id="' + temp.class_id + '"><div class="assignment-container"><div class="assignment-header">' + temp.name + '<span class="glyphicon glyphicon-trash pull-right task-delete" aria-hidden="true"></span><span class="glyphicon glyphicon-pencil pull-right task-edit" aria-hidden="true"></span><span class="label label-pill label-primary pull-right">' + temp.priority + '</span><span class="label label-pill label-primary pull-right">' + temp.due_date + '</span> <span class="label label-pill label-primary pull-right">' + temp.type + '</span></div><div class="assignment-info">' + temp.notes + '</div></div></div><br>');
                }

                // add click functionality
                $('.task-edit').click(function(e){
                    console.log('edit task');
                    var tem = $(this).closest(".assignment").data('assignment-id');
                    console.log('assignment id: ' + tem);
                    e.stopPropagation(); // (not needed at the moment)
                });

                $('.task-delete').click(function(e){
                    console.log('delete task');
                    var tem = $(this).closest(".assignment").data('assignment-id');
                    console.log('assignment id: ' + tem);
                    deleteAssignment(tem);
                    e.stopPropagation(); // (not needed at the moment)
                });
            }else{
                // tell the user there are no assignments for the class
                $('#task_target').html('There are currently no assignments for this class!');
            }

        }

    };
    xmlhttp.open("GET", "../../alex.php/class_assignments.php?keyword=" + DISPLAYED_CLASS_ID, true);
    xmlhttp.send();
}

/*
 * add the assignment to the database
 */
function addAssignment(){

    // get all the needed user input
    // (DISPLAY_CLASS_ID always kept)
    var name = $('#assignment-name').val();
    var type = $('#assignment-type').val();
    var notes = $('#assignment-notes').val();
    var date = $('#assignment-date').val();
    var priority = $('#assignment-priority input:radio:checked').val();   // this is so snazzy

    // send database query to insert class into database
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            alert(this.responseText);
            $('#assignmentInputModal').modal('hide');   // close modal
        }
    };
    xmlhttp.open("GET", "../../alex.php/add_assignment.php?class_id=" + DISPLAYED_CLASS_ID + "&name=" + name + "&notes=" + notes + "&due_date=" + date + "&priority=" + priority + "&type=" + type, true);
    xmlhttp.send();

}

/*
 * delete an assignment from the database
 */
function deleteAssignment(assignment_id){
    // send database query to remove assignment from database
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            alert('Assignment removed');
        }
    };
    xmlhttp.open("GET", "../../alex.php/delete_assignment.php?assignment_id=" + assignment_id, true);
    xmlhttp.send();

    // reload classes
    displayClassAssignments();
}

/*
 * add the user's name and id to the databse
 * (id is unique key, so duplicates won't
 * occur
 */
function insertGoogleUser(){
    // send database query to insert user into database
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // don't print this because it's almost always a duplicate error
            // console.log(this.responseText);
        }
    };
    xmlhttp.open("GET", "../../alex.php/add_user.php?user_id=" + user_google_id + "&first=" + user_first_name + "&last=" + user_last_name, true);
    xmlhttp.send();
}