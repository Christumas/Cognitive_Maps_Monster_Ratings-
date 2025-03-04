//Define Paths for your experiment Data
const DesignFilePath = "DesignFiles/PP01.csv";
const MonstersPath = "'C:\JS Psych Experiments\Monster Ratings\monsters'"

//create our JsPsych and timeline to ensure the experiment runs
const  jsPsych = initJsPsych({
    override_safe_mode : true
});
const timeline = [];

//Create our Experiment object which will handle loading up our stimuli, designfile and game blocks
const MonstersExperiment = new Experiment(MonstersPath, DesignFilePath);

//This is asychronous function that will ensure that our Experiment object (pre)loads up the
//design files, stimuli and trials for the first and second blocks before the experiment starts.
//Once everything is loaded, in this function we define the flow of the experiment by pushing
//the objects(screens etc.) we created (see below) into the timeline.  
async function StartExperiment(){
    await MonstersExperiment.loadStimuli();
    console.log("Stimuli Loaded", MonstersExperiment.stimuli);
    await MonstersExperiment.loadDesignFile();
    console.log("Design File", MonstersExperiment.designData);

    FirstBlockTrials = MonstersExperiment.runFirstBlock();
    console.log("FirstBlockTrials", FirstBlockTrials);
    SecondBlockTrials = MonstersExperiment.runSecondBlock();
    console.log("Second Block Trials", SecondBlockTrials);
    
    
    timeline.push(WelcomeScreen.toJsPsychObject());
    timeline.push(WelcomeScreen.goFullScreen());
    timeline.push(InstructionsBlock1.toJsPsychObject());
    //timeline.push(FirstBlockTrials);
    timeline.push(PostBlockScreen.toJsPsychObject());
    //timeline.push(SecondBlockTrials);

    //Pushing all our questionnaire class related objects into the timeline
    //timeline.push(Questionnaires.displayQScreen()); // Our post second block screen leading into the questionnaires
    //timeline.push(Questionnaires.generateSurveytext());
    timeline.push(Questionnaires.generateLikert())
    timeline.push(EndScreen.toJsPsychObject());
    timeline.push(EndScreen.exitFullScreen());

    jsPsych.run(timeline)
}

//Creating our objects for the experiment from their respective classes

//Welcome screen
var welcomeMessage = `<p> Welcome to the Experiment</p>
<p> Press 'Space' to continue.</p>`
const WelcomeScreen = new Screen(welcomeMessage, choices = [' ']);


//Instructions Screen
const instructions = [`<p>Welcome to the instructions.</p>`,
         `<p>The experiment will consist of two blocks.</p>
         <p>In the first block, you will be presented with a series of monsters. Please pick your favorite monster using the left or right arrow keys.</p>`,
         //lets introduce an example of how the monsters look like
        `<p> For example: You would be shown a pair of monsters as follows an you need to pick your favourite: </p>
        <div style ="display: flex; justify-content: center; gap: 20px;">
            <img src = "monsters/test1.png" alt = "Monster 1 " height = "150"> 
            <img src = "monsters/test2.png" alt = "Monster 2" height = "150">
        </div>`,
    `<p> Proceed to the first block when you are ready! Good luck! </p>`]
const InstructionsBlock1 = new Instructions(instructions);


//Post First Block Screen
const PostBlockMessage = `<p>You've completed the first block. Thanks for Playing!</p>
<p> Press SPACE to continue to the second block when you are ready!.</p>`
const PostBlockScreen = new Screen(PostBlockMessage,choices = [' '])


//Questionnaire Block
const Questionnaires = new questionnaireBlock();


//End Screen
const EndScreenMessage = `<p>You've have completed the game!</p>
<p>Thank you for playing! </p>
<p>Press SPACE to exit the game!</p>`
const EndScreen = new Screen(EndScreenMessage, choices=[' '],
    callback = () => {
        jsPsych.data.get().localSave('csv','data.csv')
        }
);




StartExperiment();

   

