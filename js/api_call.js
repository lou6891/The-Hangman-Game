
const getRandomAlphabetLetter = ()=>{
    /*
        Function that return a random letter of the alphabet
        Important cause the Datamuse API doesn't provide an endpoit to get a random word
        This way we are getting a random character that will be used to randomize the word returned by the api
     */
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

async function datamuse_api_call(min_freq, max_freq){
    /*
        Function that return a random word got from a api call.
        Inputs:
            - minimum frequency of the word,
            - maximum frequency
    */
    try {

        const base_url = "https://api.datamuse.com/words?"

        // Sp (spelled like), return a word that has the character,
        // in this case begins with a random character and is followed by any, then followed by another random and by any
        const sp_param = "&sp=" + getRandomAlphabetLetter() + "*" + getRandomAlphabetLetter() + "*"

        // Metadata settings :
        // p = get the type of word,
        // d = get the definition,
        // f = get the frequency (the value is the number of times the word (or multi-word phrase) occurs per million words of English text
        const metadata = "&md=p,d,f"

        // baseline 100, max value 1000
        const returnLength = "&max=800"

        const url = base_url + sp_param + metadata + returnLength

        // call api
        const response = await fetch(url)
        const response_data = await response.json()

        // create a new array that will hold the words that have these characteristics:
        // 1. They are nouns
        // 2. their frequency satisfied the min_freq and max_freq (value given when choosing the difficulty)
        // 3. Check that the word has a definition
        const data = []

        // used for loop cause we don't need the return of map,so it's faster using for of
        // Speed comparison https://blog.bitsrc.io/finding-the-fastest-loop-type-in-javascript-38af16fe7b4f
        for (let word of response_data) {
            // find the frequency in the tags array and convert it to numerical value
            const find_freq = word["tags"].find(freq => freq.toLowerCase().startsWith("f"));
            const freq = parseFloat(find_freq.replace("f:", ""))

            // remove white space before and after and then check if the string contains white space or "-",
            // if yeas it's a double word (to be sure cause the hangman doesn't work with double words
            const doubleWordTester = (str) => { return /[\s-]/.test(str) }
            if (doubleWordTester(word["word"].trim())) { continue; }

            // Check the requirements
            if (word["tags"].includes("n") && (freq >= min_freq && freq <= max_freq) && word["defs"]) {
                // find the definition of the word, since a word might be adj and a noun or adv and noun, find the noun definition
                // if there is no noun definition, take the first one
                const find_def = word["defs"].find(def => def.toLowerCase().startsWith("n"));
                const def = find_def ? find_def.split('\t').pop() : word["defs"][0].split('\t').pop()
                data.push({word: word["word"], definition: def, freq: freq})
            }
        }

        // return a random word in the array of words that satisfy the requirements
        //all the extra steps ensure high level of random words, to avoid repeated ones
        return await data[Math.floor(Math.random() * data.length)]
    }
    catch (e) {
        console.log(e)
    }
}
