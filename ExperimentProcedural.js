//initialize the JsPsych object
const  jsPsych = initJsPsych({
    override_safe_mode : true
});

designfile = "DesignFiles/PP01.csv";

//Stimuli
var Monsters = [
    'monsters/obj00.png',
    'monsters/obj01.png',
    'monsters/obj02.png',
    'monsters/obj03.png',
    'monsters/obj04.png',
    'monsters/obj06.png',
    'monsters/obj05.png',
    'monsters/obj09.png',
    'monsters/obj07.png',
    'monsters/obj11.png',
    'monsters/obj12.png',
    'monsters/obj13.png',
    'monsters/obj14.png',
    'monsters/obj20.png']



//create our the timeline
var timeline = [];

//Welcome Screen
var welcomescreen = {
    type :  jsPsychHtmlKeyboardResponse,
    stimulus:`
        <p> Welcome to the Experiment</p>
        <p> Press 'Space' to continue.</p>`,
    choices : [" "] 
};
timeline.push(welcomescreen);

// Instruction Screen
var InstructionsBlock1 = {
   type : jsPsychInstructions,
   pages: [`<p>Welcome to the instructions.</p>`,
         `<p>The experiment will consist of two blocks.</p>
         <p>In the first block, you will be presented with a series of monsters. Please pick your favorite monster using the left or right arrow keys.</p>`,
         //lets introduce an example of how the monsters look like
        `<p> For example: You would be shown a pair of monsters as follows an you need to pick your favourite: </p>
        <div style ="display: flex; justify-content: center; gap: 20px;">
            <img src = "monsters/test1.png" alt = "Monster 1 " height = "150"> 
            <img src = "monsters/test2.png" alt = "Monster 2" height = "150">
        </div>`,
    `<p> Proceed to the first block when you are ready! Good luck! </p>`],
   show_clickable_nav : true
};
timeline.push(InstructionsBlock1);

// First Block Intro Screen
var FirstBlockScreen = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : `<p> The first block will begin now. Proceed by pressing 'Space'</p>`,
    choices : [" "]
};
timeline.push(FirstBlockScreen);


//fetching our design file and loading the stimuli
function LoadDesignFile(designfile) {
    return fetch(designfile)
    .then( (response) => response.text())
    .then( (text) => {
        return new Promise ( (resolve) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines : true,
                delimiter : ",",
                complete: (results) => {
                resolve(results.data);
                console.log(results.data);
            }
            } )
        })
    }) 

}
  


//Showing the monsters to be shown
function CreateTrial(data){
    var trials = [];

    data.forEach(element => {
        var leftStim = element.StimLeft;
        console.log(leftStim);
        var rightStim = element.StimRight;
        console.log(rightStim);

        var trial = {
            type : jsPsychHtmlKeyboardResponse,
            stimulus : `<div style="display: flex; justify-content: center ; gap: 100px;">
            <img id = "leftOption" src="monsters/${leftStim}" style="height:300px;">
            <img id = "rightOption" src="monsters/${rightStim}" style="height:300px;">
        </div>`,
        choices: ["ArrowLeft","ArrowRight"],
        data : {stimulus_left : leftStim, stimulus_right : rightStim},
        post_trial_gap : 800,
        on_finish: function (data) {
            // Adding a small timeout to ensure the elements are rendered
            setTimeout(() => {
                let leftStimElement = document.getElementById("leftOption");
                let rightStimElement = document.getElementById("rightOption");

                console.log('leftStimElement:', leftStimElement);  // Debugging log
                console.log('rightStimElement:', rightStimElement);  // Debugging log

                if (leftStimElement && rightStimElement) {
                    // Access the participant's response and modify the elements
                    if (data.response === "ArrowLeft") {
                        leftStimElement.style.backgroundColor = "rgba(137, 194, 114, 0.2)";
                    } else if (data.response === "ArrowRight") {
                        rightStimElement.style.backgroundColor = "rgba(137, 194, 114, 0.2)";
                    }
                } else {
                    console.log("Error: Image elements are not in the DOM.");
                }
            }, 300); // Small delay to allow the images to be rendered in the DOM
        }
        };
        trials.push(trial);


        
    });
    return trials;
}


    

//getting the timeline running
LoadDesignFile(designfile)
    .then(data => {
        var trials = CreateTrial(data);
        timeline.push(...trials);

        //Post-Trial Screen
    var PostTrialScreen = {
        type : jsPsychHtmlKeyboardResponse,
        stimulus : `<p> You have completed the first block.</p>
        <p> Thank you for playing!</p>
        <p> We will now continue with the second block.</p>
        <p> Press 'Space' to continue when you are ready!</p>`,
        choices : [" "]
    };
    timeline.push(PostTrialScreen);


    var InstructionsBlock2 = {
        type: jsPsychInstructions,
        pages: [
            `<p>Welcome to the Second Block.</p>
            <p>Here all the monsters you've seen before will be presented all at once.</p>
            <p>Your task is to sort them based on the suggested criteria or dimension.</p>`
        ],
        show_clickable_nav: true
    };

    timeline.push(InstructionsBlock2);


    //Sorting Task
    var SortingTask = {
        type: jsPsychFreeSort,
        stimuli : Monsters,

        sort_area_height: 100,
        sort_area_width: 900,
        sort_area_shape: 'square',
        stim_starts_inside : false,
        prompt_location : "below",
        randomize_stimuli : false,
        scale_factor : 1, 

        prompt: `<p> Please sort the stimuli according to size</p>`,

        column_spread_factor : 0.01,
        on_start: function(){
            let stimuli = document.querySelectorAll('.jspsych-free-sort-stimulus');
            console.log(stimuli);
           
            let leftPosition = '10%';  // Adjust this value as needed

        stimuli.forEach((stim, index) => {
            stim.style.position = 'absolute';
            stim.style.left = leftPosition;  // Set the stimuli to appear on the left
            stim.style.top = (index * 50) + 'px';  // Stack the stimuli vertically with a gap
        })
        }

    };

    timeline.push(SortingTask);





    jsPsych.run(timeline)
    })



