const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/sum', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    res.json("The sum of a and b is " + (a+b));
});

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = Number(req.query.shift);

    const textArray = text.split('');
    const textToCode = textArray.map(letter => letter.charCodeAt(letter))
    
    const codeAnswerArray = textToCode.map(code => {
        if (code > 96 && code < 123) {
            console.log(code, shift)
            code += shift;
            console.log(code);
            if (code > 122) {
                console.log('fixing')
                return code -= 26;
            }
        } else if (code > 64 && code < 91) {
            code += shift;
            if (code > 90) {
                return code -= 26;
            }
        } 
        return code
    });
        
    const answerArray = codeAnswerArray.map(code => String.fromCharCode(code)).join('');

    res.json(answerArray);
})

app.get('/lotto', (req, res) => {
    const guess = req.query.arr;
    const winner = [];
    let counter = 0;

    function duplicateNumber(array) {
        console.log('Checking for duplicates in: ', array)
        const counts = [];

        for(let i = 0; i < array.length; i++) {
            
            if (counts[array[i]] === undefined) {
                counts[array[i]] = 1;
            } else {
                return true;
            }
        }
        return false;
    };

    function isValid(value) {
        console.log('Checking validity of numbers');
        
        return value > 0 && value < 21;
    }

    if (guess.length !== 6) {
        res.send('You must enter 6 numbers. Please submit a new ticket.')
    } else if (guess.every(isValid) === false) {
        res.send('All entries must be numbers between 1 and 20. Please submit a new ticket.')
    }else if (duplicateNumber(guess) === true) {
        res.send('Your ticket must contain 6 unique numbers. You\'re only hurting yourself. Please submit a new ticket.')
    }

    function makeNum() {
        return Math.floor(Math.random() * 20) + 1;
    }

    for (i = 0; i < 6; i++) {
        let num = makeNum();
        
        while(winner.includes(num)) {
            num = makeNum();
        };
        winner.push(num);
    }

    guess.forEach(number => {
        if (winner.includes(Number(number))) {
            counter++
        }
    });

    let resultMessage;
    
    if (counter === 4) {
        resultMessage = "Congratulations, you win a free ticket!";
    } else if (counter === 5) {
        resultMessage = "Congratulations! You win $100!";
    } else if (counter === 6) {
        resultMessage = "Wow! Unbelievable! You could have won the mega millions!"
    } else {
        resultMessage = "Sorry, you lose."
    }

    res.send(`The winning numbers were ${winner}. ${resultMessage}`);
})


app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});
