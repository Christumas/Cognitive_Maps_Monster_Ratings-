// Experiment flow
// Welcome -> Instructions -> Pre-Block start -> First Block -> Post block screen -> Pre-Block start -> Second Block -> End Screen


// Classes for Screens, Loading Data, First Block, Second Block


// Parent class for all our screen objects (Welcome, Pre-start, First Block)
class Screen{
    constructor(stimulus, choices = null){
        this.type = jsPsychHtmlKeyboardResponse;
        this.stimulus = stimulus;
        this.choices = choices;

    }

    //method to return the configuration of the object so we can push it to the timeline 
    //this method must be called when pushing our created object to the timeline
    toJsPsychObject() {
        return {
            type : this.type,
            stimulus : this.stimulus,
            choices :this.choices,
        };
    }
}

class Instructions extends Screen{
    constructor(pages,navigation = true){
        super();
        this.type = jsPsychInstructions;
        this.pages = pages;
        this.navigation = navigation;

    };

    toJsPsychObject(){
        return{
            type: this.type,
            pages: this.pages,
            show_clickable_nav: this.navigation

        };
    }
}


//Experiment class to have everything loaded before the experiment starts and ensures a smooth run
//Experiment class will also then handle the intialization of the blocks
class Experiment {
    constructor(stimuliPath, designfilePath){
        this.stimuliPath = stimuliPath;
        this.designfilePath = designfilePath;
        this.stimuli = [];
        this.designData = []
        
    }

    //method when called carries out asynchronously, hence async before defining the method
    //method to load up the design file
    async loadDesignFile() {
        try {
            let designfile = await fetch(this.designfilePath); //here we load the design file
            let table = await designfile.text(); //extract the table from our design file
            
            //now convert the csv 
            let parsedData = Papa.parse(table,{
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });

            this.designData = parsedData.data;
            console.log("Design File Loaded",this.designData); //for debugging
            
            //this.designData.map(trial => console.log(trial.StimLeft)); //for debugging

            
        }

        catch (error){
            console.error("Error loading design file",error)
        }
    }


     //method when called carries out asynchronously, hence async before defining the method
     //method to load all of the monster stimuli
    async loadStimuli () {
        const MonsterList =   ['monsters/obj00.png',
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

        MonsterList.forEach (monster => {
            this.stimuli.push(monster);
        })

    }

    //method to run our first block
    runFirstBlock(){
        let trials = this.designData.map(trial => {
            let LeftStim = trial.StimLeft;
            let RightStim = trial.StimRight;

            return {
                type: jsPsychHtmlKeyboardResponse,
                stimulus:`
                <!-- Here We control the entire layout of the stimuli -->
<!--This will be the parent container which holds all our stimuli>
<div class="StimuliContainer" style=" display:flex; border:5px solid green; flex-direction:column; align-items:center; gap:20px; padding:20px; width: 900px; height: 700px;">

    <!--Text Container-->
    <div class="TextContainer" style=" text-align:center; border:5px solid yellow; height: 50px;">
        <p>Pick your favourite Monster!</p>
        <p>Press LEFT or RIGHT arrow key to choose.</p>
    </div>

    <!--Image Container will contain the two containers for both left and right image-->
    <div class="ImageContainer" style=" display:flex; border:5px solid blue; flex-direction:row; align-items:center; justify-content: center; gap: 50px; width: 100%; height: 500px;">

        <!--Left image container-->
        <div class="leftContainer" style=" display:flex; border:5px solid pink; justify-content: center; align-items:center; width: 400px; height: 400px;">
            <img id="leftImage" src="monsters/${LeftStim}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>

        <!--Right image container -->
        <div class="rightContainer" style="display:flex; border:5px solid red; justify-content: center; align-items:center; width: 400px; height: 400px;">
            <img id="rightImage" src="monsters/${RightStim}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>

    </div>

</div>
`,
                choices: ["arrowleft", "arrowright"],
                post_trial_gap : 800,
                on_finish: (data) => {
                    console.log(data.response); //just as a debugging step to see which key is pressed

                }
                
            }

        })
        return trials;

    };


    runSecondBlock(){

        //define the criteria/dimensions inside this array, any new criteria we add, the code below
        //should generate an extra trial 
        let criteria = ["Colour", "Size", "Emotions", "Cuteness", "Shape"];
    

        let trials = criteria.map( dimension => {
            return {
                type : jsPsychFreeSort,
                stimuli: this.stimuli,
                prompt: `<p>Please sort the monsters according to their <b>${dimension}</b>. </p>`,
                sort_area_shape: 'square',
                sort_area_height: 115,
                sort_area_width: 900,
                stim_starts_inside : false,
                prompt_location : "below",
                scale_factor : 1,
                column_spread_factor : 0.01
            }
        });

        return trials;

    }
}


//Questionnaire Class to control the type of questions displayed at the end of the block
class questionnaireBlock{
    constructor(){
        this.surveyQuestions = [];
        this.likertQuestions = [];
        this.type = null;
        this.likertScale = [
            "1 \n Did not understand task",
            "2",
            "3",
            "4",
            "5 \n Understood the task"
        ]   
    }

    //create a screen to pop up questionnaire from our Screen class
    displayQScreen(){
        let message= `<p>You've completed the Second Block!</p>
        <p>In the next few screens you'll be shown a few questionnaires. Please answer truthfully.</p>
        <p>Press SPACE to continue.</p>`
        const QScreen = new Screen(message, choices = [' ']);
        
        return QScreen.toJsPsychObject() 


    }

    generateSurveytext(){

    }

}


