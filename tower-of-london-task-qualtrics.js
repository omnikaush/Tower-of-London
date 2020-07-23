Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and load required resources */
    var task_github = "https://omnikaush.github.io/Tower-of-London/"; // https://<your-github-username>.github.io/<your-experiment-name>

    // requiredResources must include all the JS files that demo-simple-rt-task-transformed.html uses.
    var requiredResources = [
        "https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.4.1/math.min.js",
        'https://omnikaush.github.io/Tower-of-London/jspsych/jspsych.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/plugins/jspsych-text.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-poldrack-text.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-poldrack-instructions.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-attention-check.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-single-stim-button.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-poldrack-single-stim.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/plugins/jspsych-survey-text.js',
        'https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/poldrack_utils.js',
        'https://omnikaush.github.io/Tower-of-London/experiment.js'
    ];

//***************************
/*
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/jspsych.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/plugins/jspsych-text.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-poldrack-text.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-poldrack-instructions.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-attention-check.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-single-stim-button.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/jspsych-poldrack-single-stim.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/plugins/jspsych-survey-text.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/jspsych/poldrack_plugins/poldrack_utils.js'></script>
<script src='https://omnikaush.github.io/Tower-of-London/experiment.js'></script>
*/
//***************************

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 3: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    // jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    // jQuery("<div id = 'display_stage'></div>").appendTo('body');
    //NOTE THAT WE DON'T NEED THIS AS LONG AS INIT EXP IS WORKING CORRECTLY

    /* Change 4: Wrapping jsPsych.init() in a function */
    
    
    function initExp() {
      
      document.getElementById('error_div').style.display = "none";
      
      jsPsych.init({
             timeline: tower_of_london_experiment,
             display_element: "getDisplayElement",
             fullscreen: true,
             on_trial_finish: function(data){
               addID('tower-of-london')
             },

             on_finish: function(data){
               
                console.log("WE FINISHED, YAY!");
                jQuery('.display_stage').remove();
                jQuery('.display_stage_background').remove();
                qthis.showNextButton();

                 // Serialize the data
                 var promise = new Promise(function(resolve, reject) {
                     var data = jsPsych.data.dataAsJSON();
                     resolve(data);
                 })

                 promise.then(function(data) {

                     jQuery.ajax({
                         type: "POST",
                         url: '/save',
                         data: { "data": data },
                         success: function(){ document.location = "/next" },
                         dataType: "application/json",
                         // Endpoint not running, local save
                         error: function(err) {

                             if (err.status == 200){
                                document.location = "/next"
                             } else {
                                 // If error, assue local save
                                 jsPsych.data.localSave('tower-of-london_results.csv', 'csv');
                            }
                         }

                     });
                 })
             }

      });
      
    }
    
    
    
    
    
    /*
    function initExp() {

        jsPsych.init({
            timeline: timeline,
            display_element: 'display_stage',
            on_finish: function (data) {
                // Change 5: Summarizing and save the results to Qualtrics 
                // summarize the results
                var trials = jsPsych.data.get().filter({
                    test_part: 'test'
                });
                var correct_trials = trials.filter({
                    correct: true
                });
                var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
                var rt = Math.round(correct_trials.select('rt').mean());

                // save to qualtrics embedded data
                Qualtrics.SurveyEngine.setEmbeddedData("accuracy", accuracy);
                Qualtrics.SurveyEngine.setEmbeddedData("rt", rt);

                // Change 6: Adding the clean up and continue functions.
                // clear the stage
                jQuery('display_stage').remove();
                jQuery('display_stage_background').remove();

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();
            }
        });
    }
    */   
    
    
    
});