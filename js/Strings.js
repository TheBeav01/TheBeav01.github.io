const WORK_EFF = "Worker efficiency++";
const WORK_EFF_TT = "Increases the gold workers gather by 150%";
const WORK_EFF_ID = "WorkEff";
const DBL_WORK_EFF = "DBL_WORK_EFF";
const UPG_TAG = "T2_R"
function getStory(msg) {

    switch (msg) {
        case 1:
            return "You gaze outside of the tower you call home. A gentle breeze"
                + " flutters through the window, displacing your royal robe. You feel... poor and pennnyless, though"
                + " you have a whole kingdom to run. Something will get you out of this state...";
        case 2:
            return "You extend your hand out and concentrate for a moment. A gold coin"
                + " appears in the palm of your hand. Though plain, the coin's size and shape make it suitable"
                + " to use for purchasing things.";
        case 3:
            return "You call for one of your aides. A mere moment passes before they head into your room."
                + " You place the gold coins in their hand and tell them to get more. They do your bidding. They always do your bidding."
                + "\n\rWorkers unlocked!";

        case 4:
            return "You curse under your breath as the golden coins tumble to the floor."
                + " One of your workers produces a leather bag, your own, in fact. Before you could ask"
                + " where they found it, they head out of your room. At least they found it!\n\n"
                + "Obtained: 1x Bag of holding, 1x Chronometer, and 1x Mysterious red sphere";

        case 5:

            return "Here you are, gathering all this wealth. You gathered so much, you forget to address the"
                + " strange feeling entering your mind. Something seems to be stirring.";
        case 6:

            return "By this point, something is seriously wrong. Your gaze turns to the walls bordering"
                + " your city. The wall guards seem to be readying their weapons. Not good.";
        case 7:

            return "From the distance, you see your wall guards fall. You bark at one of your workers to"
                + " investigate. From here, you can see that arrows pepper their bodies. From the arrowtip, they seem to be of"
                + " human origin. You extend your hand out to get more gold, but a loud boom from the gates reverberates through the city.";
        case 8:

            return "The invaders enter the city. Instinctively, you turn toward the only source of comfort, only to see"
                + " a fireball tear through the side of the tower you called home. Though the stained glass toward the top was preserved,"
                + " the normal purple glow behind it appears stronger.";
        case 9:
            return "Two explosions tear through the top of the towers. From each tower, a pulse rockets out, moving beyond the horizon."
                + " You look toward your bag and open it, sticking your hand in. It brushes past something cold that gives you pause"
                + " You pull it out. It appears to be a golden pocketwatch, at least from the outside. When you open it up, a bright glow fills your vision."
                + " Everything stops around you.";
        
        case 10:
            return "You find yourself in the bed of your tower room. A quick glance out of the window confirms your suspicion "
            + "that the clock was somehow magical. You re-open your bag and peer into it. You lost your gold, but kept the sphere and the "
            + "chronometer. As you reach past the clock, however, your fingers brush agaainst something cold. You pull it out. "
            + "It appears to be a black shard, but where did you get it? Just being near it makes you feel more powerful."
        
        case 11:

        case 12:

        case 13:

        case 14:
        default:
            return "";
    }
}

function goldToShardString() {
    return getGoldToNextShard() + " Gold to " + Number.parseInt(getShardAmt()+1) + " shards on ascension";
}