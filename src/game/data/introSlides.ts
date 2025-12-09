export interface Slide {
    title: string;
    lines: string[];
    interactive?: boolean;
}

export const INTRO_SLIDES: Slide[] = [
    {
        title: "The North Pole has\na problem...",
        lines: [
            "Santa's been burning the",
            "advent candle at both ends",
            "",
            "A toxic snow-snorting",
            "culture has taken over",
            "",
            "The elves' noses are freezing off",
            "",
            "The reindeers are fed up with",
            "their carrots being used",
            "as prostheses"
        ]
    },
    {
        title: "Something must\nbe done",
        lines: [
            "Mrs. Claus has declared the",
            "workshop a no-snow zone",
            "",
            "Straight-edged Rudolph",
            "has had enough!",
            "",
            "Help Rudolph cut the snow",
            "supply that threatens Christmas"
        ]
    },
    {
        title: "Intercept snow\nsmugglers",
        lines: [
            "Move Rudolph left and right",
            "with < and >",
            "",
            "Press and hold NOSE to",
            "stop and arrest an elf",
            "",
            "You get points for arresting",
            "elves with snow",
            "",
            "You lose points for snow",
            "that gets smuggled past you"
        ],
        interactive: true
    },
    {
        title: "Let elves carry out\ntheir lawful work",
        lines: [
            "Christmas is just around",
            "the corner",
            "",
            "Don't disrupt legitimate",
            "supplies to the workshop",
            "",
            "You lose points if you don't",
            "respect the elves'",
            "civil liberties"
        ]
    }
];
