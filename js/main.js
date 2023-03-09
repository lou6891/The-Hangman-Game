/*
###############################################################
#########    Function used by WelcomePrompt    ##########
###############################################################
 */


function getRandomWord(difficulty){
    /*
    Get a random word for the difficulty selected from the
     */
    return word_dict[difficulty][Math.floor(Math.random()*word_dict[difficulty].length)];

}

function beginGame(selectorValue) {
    /*
    starts the hangman game. Here is a breakdown of what the function does:

    1. If selectorValue is truthy, it sets the global variable difficulty
        to selectorValue, generates a random word of the specified difficulty
        using the getRandomWord() function, converts the word to an array of
        uppercased letters, and creates a new set containing the letters in the word.
    2. It logs the word, letterSet, and a new set containing the letters in the word to the console.
    3. It hides the difficulty prompt and welcome prompt,
       removes the welcome prompt from the DOM, appends the on-screen container to the body,
       and makes the on-screen container visible.
    4. It calls the createWord() function to create the display for the word to be guessed.
     */

    if (selectorValue) {
        difficulty = selectorValue
        word = Array.from(getRandomWord(difficulty).toUpperCase())
        letterSet = new Set(word)
        console.log("line 96", word, letterSet, new Set(word))

        DifficultyPrompt.hidden = true
        WelcomePrompt.hidden = true
        WelcomePrompt.remove()

        body.append(document.getElementById("on-screen-container"))
        document.getElementById("on-screen-container").hidden = false

        createWord()
    }

}

/*
###############################################################
#########    Function used by On Screen Container    ##########
###############################################################
 */
const rows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];


function createWord(){
    /*
    This function creates the display for the word to be guessed.
    It first clears any existing content in the wordDisplay element,
    then loops through the word array to create a new paragraph element for each letter in the word,
    displaying a "-" character. It appends each paragraph element to a new span element and then appends
    that span to the wordDisplay element.
    Finally, it calls the create_keyboard() function.
     */
    // function that creates the script content
    const wordDisplay = document.getElementById("word-display");
    wordDisplay.innerHTML = ""

    if (word){
        for (let i in word){

            const letter = document.createElement("p");
            letter.id = "letter" + i
            letter.textContent = "-"

            const letterWrapper  =  document.createElement("span");
            letterWrapper.appendChild(letter)

            wordDisplay.appendChild(letterWrapper);
        }
    }
    create_keyboard()
}

function create_keyboard(){
    /*
    This function creates the keyboard buttons for the game.
    It first clears any existing buttons in the keyboard element,
    then loops through the rows array to create a new button for each letter in each row.
    It adds an event listener to each button that calls the addLetter() function when clicked.
    It then appends each button to a new row div element and appends that row to the keyboard element.
     */

    keyboard.innerHTML = ""

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowDiv = document.createElement("div");

        rowDiv.classList.add("row");
        rowDiv.id = "row" + i

        for (let j = 0; j < row.length; j++) {
            const letter = row.charAt(j);

            const button = document.createElement("button");
            button.id = "button" + letter
            button.textContent = letter;

            button.addEventListener("click", () => {
                addLetter(letter)
                button.style.background = "#444"
                button.style.pointerEvents = "none"
                button.style.color = "white"
            });
            rowDiv.appendChild(button);
        }
        keyboard.appendChild(rowDiv);
    }
}

function addLetter(letter){
    /*
    This function is called when a letter button is clicked.
    It first checks if the word array exists and if the number of incorrect guesses is less than 7.
    If the clicked letter is in the word, it updates the display to show the correct letters and checks
    if the game has been won.
    If the clicked letter is not in the word,
    it adds an image of a hanging skeleton and updates the number of incorrect guesses.
    If the number of incorrect guesses is equal to 7, it displays the game over screen.
     */

    if (word && errorCount <= 7){
        if (word.includes(letter)){
            rightCount += 1
            for (let i in word){
                if (letter === word[i].toUpperCase()){
                    const letterElement = document.getElementById("letter" + i);
                    letterElement.textContent =  word[i].toUpperCase()
                }
            }

            if(rightCount === letterSet.size){
                keyboard.hidden = true
                wordDisplay.remove()
                endGame.hidden = false

                document.getElementById("result_title").innerText = "YOU WON"
                document.getElementById("word-result").innerText = word.join("")


                // Show and animate the winning dancing skeletons
                for (let i = 1; i <= 3; i++) {
                    const dancing_gif = document.getElementById('dancing_skeleton_' + i);
                    dancing_gif.classList.add("show");
                }
            }
        }

        else {
            const hangmanContainer = document.getElementById("hangmanContainer")
            const img = document.createElement("img");
            img.src = "../img/life" + errorCount + ".png"
            img.className = "skeleton_picture"
            img.id = "life" + errorCount
            hangmanContainer.appendChild(img);
            errorCount > 1  ? document.getElementById("life" + (errorCount -1)).remove() : ""
            errorCount += 1;

            if(errorCount === 8){
                keyboard.hidden = true
                wordDisplay.remove()
                endGame.hidden = false


                document.getElementById("result_title").innerText = "YOU LOST"
                document.getElementById("word-result").innerText = word.join("")

                //Swing animation of the hangman
                const skeleton = document.getElementById('life7');
                skeleton.classList.add('swing');

            }
        }
    }
}