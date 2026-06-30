import { createHexTextBox, createHexBackground } from './celticBox.js'

const celticBackgroundData = {
    color: {
        bgColor: "#1a1a1a",
        hexColor: "#1f1f1f",
        pathColor: "#423a47",
        eraserColor: "#1a1a1a",
        contentColor: "#ff00d4"
    },
    position: {x: 0, y: 0},
    border: false,
    size: {x: window.innerWidth, y: window.innerHeight},
    dimensions: {
       hexWidth: 80,
       totalLineWidth: 80 / 7,
       lineGapWidth: 80 / 10,
       hexStrokeWidth: 80 / 80,
       radius: 80 / 2,
       height: 80 * (Math.sqrt(3) / 2)
    },
    svgNS: "http://www.w3.org/2000/svg"
};

const celticTextboxData = {
    color: {
        bgColor: "#161616e9",
        hexColor: "#dcdacc00",
        pathColor: "#084617",
        eraserColor: "#084617",
        contentColor: "#bfbdb2"
    },
    position: {x: 0, y: 0},
    border: true,
    size: {
        x: window.innerWidth * 0.8, 
        y: window.innerHeight * 0.8
    },
    dimensions: {
       hexWidth: 8,
       totalLineWidth: 8 / 7,
       lineGapWidth: 8 / 30,
       hexStrokeWidth: 8 / 80,
       radius: 8 / 2,
       height: 8 * (Math.sqrt(3) / 2)
    },
    svgNS: "http://www.w3.org/2000/svg"
};

const body = document.querySelector('body');

createHexBackground(celticBackgroundData, body);

const text =
`
Alright, dig it
Cold coolin' at a bar, and I'm lookin' for some action
But like Mick Jagger said, "I can't get no satisfaction"
The girls are all around, but none of them wanna get with me
My threads are fresh, and I'm lookin' def, yo, what's up with LOC?
The girls is all jockin' at the other end of the bar
Havin' drinks with some no name chump
When they know that I'm the star
So I got up and strolled over to the other side of the cantina
I asked the guy, "Why you so fly? He said, "Funky cold Medina"
Funky cold Medina
This brother told me a secret on how to get more chicks
Put a little Medina in your glass, and the girls will come real quick
It's better than any alcohol or aphrodisiac
A couple of sips of this love potion, and she'll be on your lap
So I gave some to my dog when he began to beg
Then he licked his bowl and he looked at me
And did the wild thing on my leg
He used to scratch and bite me, before he was much, much meaner
But now all the poodles run to my house for the funky cold Medina
You know what I'm sayin'?
I got every dog in my neighborhood breakin' down my door
I got Spuds McKenzie
Alex from Stroh's
They won't leave my dog alone with that Medina, pal
I went up to this girl, she said, "Hi, my name is Sheena"
I thought she'd be good to go with a little funky cold Medina
She said, "I'd like a drink, " I said, "Okay, I'll go get it"
Then a couple sips she cold-licked her lips
Then I knew that she was with it
So I took her to my crib, and everything went well as planned
But when she got undressed, it was a big old mess, Sheena was a man
So I threw him out, I don't fool around with no Oscar Meyer wiener
You must be sure that the girl is pure for the funky cold Medina
You know, ain't no plans with a man
This is the '80s, and I'm down with the ladies, you know
Break it down
Back in the saddle, lookin' for a little affection
I took a shot as a contestant on the love connection
The audience voted and you know they picked a winner
I took my date to the Hilton for Medina and some dinner
She had a few drinks, I'm thinkin' soon what I'll be gettin'
Instead, she started talkin' 'bout plans for our weddin'
Said, "Wait, slow down, love, not so fast says, I'll be seein' ya"
That's why I found you don't play around with the funky cold Medina
You know what I'm sayin'?
That Medina's a monster, y'all
Funky cold Medina
`
createHexTextBox(celticTextboxData, body, text);