// # Thursday 19-10-2023 Classes pt 2 practice

// ## Learning Goals

// - Practice creating classes

// ## Task

// **Exercise**: Create a Simple Quiz Game

// ### Task 1: Create a class named Question to represent a quiz question. The class should have the following features:

// - A constructor that accepts the question text and an array of options.
// - A method to display the question and its options.
// - A method to check if the user's choice is correct.

// ### Task 2: Create instances of the Question class for at least three different quiz questions. Be creative with your questions and options.

// ### Task 3: Implement a way for users to answer the questions. You can use the readline library to take input from the user in the terminal. You can use HTML with DOM manipulation, this is something new for you and a good challenge.

// ### Task 4: After the user answers all the questions, display their results. Show how many questions they answered correctly and how many they got wrong.

// ![solution](solution.gif "solution")

// ## Bonus Task 1

// Add a scoring system to your quiz game. Assign points to each question, and keep track of the user's total score. Display the user's final score at the end.

// ## Bonus Task 2

// Add a timer to your quiz game. Give the user a limited amount of time to answer all questions. If they don't answer in time, consider the not answered questions as wrong.

// ![bonus solution](bonus-solution.gif "bonus solution")


// **_Feel free to get creative and customize the quiz game as you like. Have fun coding and learning!_**
 


// todo: timer einbauen / fixen 
// Todo: parent class game für idex timer score etc

const readline = require('readline');

class Question {
    constructor(question, options, correctAnswer) {
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.userAnswer = null;
    }

    displayQuestion() {
        console.log(this.question);
        this.options.forEach((option, index) => {
            console.log(`${index + 1}: ${option}`);
        });
    }

    checkAnswer() {
        if (this.userAnswer === this.correctAnswer) {
            console.log('Correct Answer');
            return 1; // Return 1 for correct answer
        } else {
            console.log('Wrong Answer');
            return 0; // Return 0 for wrong answer
        }
    }
}

const questions = [
    new Question('What is the capital of France?', ['Paris', 'Berlin', 'London'], 1),
    new Question('What is the capital of Germany?', ['Paris', 'Berlin', 'London'], 2),
    new Question('What is the capital of England?', ['Paris', 'Berlin', 'London'], 3),
    new Question('What is the capital of Italy?', ['Paris', 'Rom', 'London'], 2),
    new Question('What is the capital of Spain?', ['Paris', 'Berlin', 'Madrid'], 3),
    new Question('What is the capital of Portugal?', ['Paris', 'Lisbon', 'London'], 2),
    new Question ('What is the capital of the Netherlands?', ['Amsterdam', 'Berlin', 'London'], 1),
];

const rl = readline.createInterface({ // Readline is a Node.js module that provides an interface for reading data from a Readable stream (such as process.stdin) one line at a time.
    input: process.stdin,
    output: process.stdout
});

function askQuestion(index, score, totalTime, difficulty) { // askQuestion is a recursive function that asks the user a question, checks the answer, and moves to the next question.
    if (index === questions.length) {                       // It takes the index of the question, the current score, the total time, and the difficulty as parameters.
        // All questions answered, display results, calculate score, and ask for replay.
        console.log('Quiz completed!');
        console.log(`Your score: ${score} out of ${questions.length}`);
        rl.question('Do you want to play again? (yes/no): ', (response) => {
            if (response.toLowerCase() === 'yes') {
                // Reset user answers and play again
                questions.forEach((question) => {
                    question.userAnswer = null;
                });
                askForDifficulty(); // Start a new game
            } else {
                rl.close();
            }
        });
        return;
    }

    const currentQuestion = questions[index];
    currentQuestion.displayQuestion();

    const questionTimeout = difficulty === 'hard' ? totalTime : 2 * 60 * 1000; // 2 minutes for each question in medium and 2 minutes total in hard mode

    const timer = setTimeout(() => {
        console.log('Time is up for this question!');
        askQuestion(index + 1, score, totalTime, difficulty);
    }, questionTimeout);

    rl.question(`Enter the number of your answer (1, 2, or 3), or type "exit" to end the game: `, (answer) => {
        clearTimeout(timer); // Clear the timer when the user answers

        if (answer.toLowerCase() === 'exit') {
            console.log('Game Over');
            console.log(`Your score: ${score} out of ${questions.length}`);
            rl.question('Do you want to play again? (yes/no): ', (response) => {
                if (response.toLowerCase() === 'yes') {
                    questions.forEach((question) => {
                        question.userAnswer = null;
                    });
                    askForDifficulty();
                } else {
                    rl.close();
                }
            });
            return;
        }

        const numericAnswer = parseInt(answer);

        if (isNaN(numericAnswer) || numericAnswer < 1 || numericAnswer > 3) {
            console.log('Invalid input. Please enter 1, 2, or 3 or "exit" to end the game.');
            askQuestion(index, score, totalTime, difficulty); // Repeat the question
        } else {
            currentQuestion.userAnswer = numericAnswer;
            score += currentQuestion.checkAnswer();

            // Move to the next question
            askQuestion(index + 1, score, totalTime, difficulty);
        }
    });
}

function askForDifficulty() {
    rl.question('Choose the difficulty (easy, medium, hard): ', (difficulty) => {
        let totalTime = 0;
        if (difficulty === 'easy') {
            totalTime = Number.POSITIVE_INFINITY; // No time limit for easy
        } else if (difficulty === 'medium') {
            totalTime = questions.length * 2 * 60 * 1000; // 2 minutes per question in medium
        } else if (difficulty === 'hard') {
            totalTime = 2 * 60 * 1000; // 2 minutes total in hard
        } else {
            console.log('Invalid difficulty. Please choose from easy, medium, or hard.');
            askForDifficulty();
            return;
        }

        askQuestion(0, 0, totalTime, difficulty);
    });
}

// Start the game by asking for difficulty
askForDifficulty();