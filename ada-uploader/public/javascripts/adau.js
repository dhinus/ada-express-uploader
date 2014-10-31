var ADAU = {
    categories: [],
    numberOfOnlineEntries: 0,
    numberOfOtherEntries: 0,

    setupCategories: function() {
        numberOfOnlineEntries = 0;
        numberOfOtherEntries = 0;
        categories = [
            {selected: false,
            value: 'originalSingle',
            categoryName: 'Best Original Audio Drama (Single Play)'},
            {selected: false,
            value: 'series',
            categoryName: 'Best Audio Drama (Series or Serial)'},
            {selected: false,
            value: 'adaptation',
            categoryName: 'Best Audio Drama (Adaptation from another source)'},
            {selected: false,
            value: 'actor',
            categoryName: 'Best Actor in an Audio Drama'},
            {selected: false,
            value: 'actress',
            categoryName: 'Best Actress in an Audio Drama'},
            {selected: false,
            value: 'supportingActor',
            categoryName: 'Best Supporting Actor in an Audio Drama'},
            {selected: false,
            value: 'supportingActress',
            categoryName: 'Best Supporting Actress in an Audio Drama'},
            {selected: false,
            value: 'sound',
            categoryName: 'Best Use of Sound in an Audio Drama'},
            {selected: false,
            value: 'comedyDrama',
            categoryName: 'Best Scripted Comedy Drama (script award)'},
            {selected: false,
            value: 'liveComedy',
            categoryName: 'Best Scripted Comedy with a Live Audience (script award)'},
            {selected: false,
            value: 'nonBroadcast',
            categoryName: 'Best Online/Non-Broadcast Audio Drama'}
        ];
    },

    displayEntryForm: function() {
        //console.log('display entry form');
        if (numberOfOtherEntries < 4) { // && numberOfOnlineEntries < 4) { - ADD THIS Later
            var entryForm = $('.entry-master').html();
            $('.entry').append(entryForm);
            var dropdown = $('select').last();
            ADAU.populateCategoryField(dropdown);
            var panelTitle = $('.panel-title').last().text("Entry " + (numberOfOtherEntries + numberOfOnlineEntries + 1));
            numberOfOtherEntries++; //add stuff to incr online entries here
        }
    
    },

    populateCategoryField: function(categoryField, currentValue) {
        //console.log('populateCategoryField' + currentValue);
        var dropdown = "<select class='category' name='category' currentvalue='" + categoryField + "'>\n";
        categories.forEach(function(i) {
            if (i.value === currentValue) {
                dropdown += "<option value='" + i.value + "' selected>" + i.categoryName + "</option>\n"
            }
            if (!i.selected) {
                dropdown += "<option value='" + i.value + "'>" + i.categoryName + "</option>\n"
            }
        });
        dropdown += "</select>";
        //console.log(dropdown);
        categoryField.html(dropdown);
    },

    categorySelected: function() {
        var oldValue = $(this).attr('currentvalue');
        var newValue = $(this).val();
        $(this).attr('currentvalue', newValue);
        categories.forEach(function(key) {
            if (key.value === oldValue) {
                key.selected = false;
            }
            if (key.value === newValue) {
                key.selected = true;
            }
        });
        ADAU.redrawCategories();
        //ADAU.printCategories();
    },

    redrawCategories: function() {
        var dropdowns = $('.entry select'); //check this gets all instances of select
        //console.log(dropdowns.length);
        dropdowns.each(function(dropdown) {
            //console.log("Current value: " + $(this).attr("currentvalue"));
            ADAU.populateCategoryField($(this), ($(this).attr("currentvalue")));
        });
    },

    //debug helper - delete when finished. Display the contacts of the categories array
    printCategories: function() {
        console.log("PRINT CATEGORIES");
        categories.forEach(function(i) {
            console.log('categories: ' + i.value + '/' + i.selected);
        });
    },

    addEntries: function() {
        //do validation
        console.log('Need to copy the validation function to client side');

        //compile all entry info into one entry per object
        var entryFormData = $('form').serializeArray();
        var entries = [];
        for (i=0; i < ((entryFormData.length - 2)/3); i++) {
            entries[i] = {  
                "entrycontact": entryFormData[0].value,
                "contactemail": entryFormData[1].value,
                "category": entryFormData[(i*3)+2].value,
                "entrant": entryFormData[(i*3)+3].value,
                "programmetitle": entryFormData[(i*3)+4].value
            }
        }
        //entries.forEach(function(element) {
            console.log('Entries data: ' + JSON.stringify(entries, null, 2));
        //});
        //Use AJAX to post the object to our submitentry service
        $.ajax({
            type: 'POST',
            data: entries,
            url: '/submit/submitentries',
            dataType: 'JSON'
        }).done(function(response) {
            //Check for successful (blank) response
            if (response.msg === '') {
                //show a success message on the page
                //hide form
            }
            else {
                //If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    },

    showEntries: function() {
        $.getJSON('/entries', function(data) {
            //display entries content here
        });
    }
    //TODO:when dropdown generated, set currentSelection to first option element
    //then when category changed, update list

    //TODO: handle counts for online and non-online categories

    //TODO: bug: when nothing specifically selected the first option continues to be displayed
    //need to select the default as current value when dropdown first drawn (Set 'selected' attribute??)

    //TODO: add fileupload data when fileuploader integrated to addentries()

} //end of ADAU object


