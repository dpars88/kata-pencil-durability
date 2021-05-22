class Pencil {
    constructor( { point = 50, size = 0, eraser = 50 } = {}) {
        this.originalPoint = point;
        if (point < 0 || typeof(point) !== "number") {
            throw new Error("Point value must be a integer number and not negative");
        } else {
            this.point = point;
        }
        if (size < 0 || typeof(size) !== "number") {
            throw new Error("Size value must be a positive integer and not negative");
        } else {
            this.size = size;
        }
        if (eraser < 0 || typeof(eraser) !== "number") {
            throw new Error("Eraser value must be a positive integer and not negative")
        } else {
            this.eraser = eraser;
        }
    }

    write(text, paper) {
        for (let i = 0; i < text.length; i++) {
            const pointDull = this.point === 0;

            if (pointDull) {
                return paper;
            } else {
                const currentChar = text[i];
                const lowerCase = currentChar.toLowerCase() === currentChar;
                const whiteSpace = currentChar.trim().length !== 0;
                // if lowercase point - 1, if uppercase point - 2, if whitespace point - 0
                if (lowerCase && whiteSpace) {
                    this.point--;
                    paper.text += currentChar;
                } else if (!lowerCase && whiteSpace) {
                    this.point -= 2;
                    paper.text += currentChar;
                } else {
                    paper.text += " ";
                }
            }
        }
        return paper;
    }

    sharpen() {
        // check if any size left to sharpen or if point is already sharpened else resore to original point
        if (this.size === 0) { 
            throw new Error("Pencil out of length")
        } else if (this.point === this.originalPoint) { 
            throw new Error("Pencil already sharpened")
        } else { 
            this.point = this.originalPoint;
            this.size--;
            return;
        }
    }

    erase(wordToErase, paper) {
        // separate input text into two pieces and build the middle part back up, return all combined at the end
        let result = "";
        let erasedWord = "";
        const lastOccurance = paper.text.lastIndexOf(wordToErase);
        const wordLength = wordToErase.length;
        const firstHalf = paper.text.slice(0,lastOccurance);
        const secondHalf = paper.text.slice(lastOccurance + wordLength)

        if (!paper.text.includes(wordToErase)) {
            throw new Error ("Word to erase is not located within given paper");
        } else if (this.eraser === 0) {
            throw new Error ("No more eraser left! Time to get a new pencil!");
        } else {
            paper.erased = lastOccurance;
            paper.erasedStack.push(lastOccurance);
            for (let i = 0; i < wordLength; i++) {
                const space = wordToErase[i] === " " ? true : false;
                if (this.eraser !== 0 && !space) {
                    erasedWord += " ";
                    this.eraser--;
                } else if (space) {
                    erasedWord += " ";
                } else {
                    erasedWord += wordToErase[i];
                }
            }
        }
        result += firstHalf;
        result += erasedWord;
        result += secondHalf;
        paper.text = result;
        return paper;
    }

    edit(wordToAdd, paper) {
        // ensure erase has taken place before, just like erase break apart input and build back up to return at end
        if (!paper.erased) {
            throw new Error("Nothing has been previously erased to add new text to")
        } else {
            let result = "";
            let editedWord = "";
            const wordLength = wordToAdd.length;
            const firstPart = paper.text.slice(0, paper.erased);
            const editPart = paper.text.slice(paper.erased, paper.erased + wordLength)
            const lastPart = paper.text.slice(paper.erased + wordLength);
            for (let i = 0; i < editPart.length; i++) {
                // if curent index of paper text is whitespace, add current character of wordToAdd to editedWord
                if (editPart[i] === " ") {
                    let current = this.editWrite(wordToAdd[i]);
                    if (!current) {
                        editedWord += editPart[i];
                    } else {
                        editedWord += current;
                    }
                } else {
                    let current = this.editWrite("@");
                    if (!current) {
                        editedWord += editPart[i];
                    } else {
                        editedWord += current;
                    }
                }
            };
        paper.erasedStack.pop();
        if (paper.erasedStack.length === 0) {
            paper.erased = false;
        } else {
            paper.erased = paper.erasedStack[0];
        }
        result += firstPart;
        result += editedWord;
        result += lastPart;
        paper.text = result;
        return paper;
        };
    };

    editWrite(letter) {
        //need to check if capital, lowercase, whitespace
        const pointDull = this.point === 0;

        if (pointDull) {
            return false; //no more writing can be done because out of point value
        } else {
            const currentChar = letter;
            const lowerCase = currentChar.toLowerCase() === currentChar;
            const whiteSpace = currentChar.trim().length === 0;
            // if lowercase point - 1, if uppercase point - 2, if whitespace point - 0
            if (lowerCase && !whiteSpace) {
                this.point--;
                return letter;
            } else if (!lowerCase && !whiteSpace) {
                this.point -= 2;
                return letter;
            } else {
                return letter;
            }
        }
    }
}

module.exports = Pencil;