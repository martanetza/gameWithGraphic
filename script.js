window.addEventListener("load", loadSVG);

//show graphic - load SVG

function loadSVG() {
  fetch("prototypesave1_game 1.svg")
    .then(res => res.text())
    .then(svgdata => {
      document.querySelector("main").insertAdjacentHTML("afterbegin", svgdata);

      // short introduction to how we change scenes in the game: there is 5 scenes in the game and I show and hide them by adding or removing class “hide”( that has display: none) when needed. We all know that solution. The only thing I want to mention here is that because the game has 5 scenes I decided to divide svg also into 5 main groups, each of them will has own id: first, second third fourth fifth (based also on Juliana's design) and so I show and or hide each group if needed. Whenever I do that you will see in the code something like for example: document.querySelector("#SECOND").classList.add("hide"); document.querySelector("#THIRD").classList.remove("hide");

      // --------------------------------------- game scene 1 ----------------------------------

      document
        .querySelector("#playButton")
        .addEventListener("mouseover", () => {
          // this is the first place where you will find greenSock animation … greenSock has some different tools such us for example tweenLite and tweenMax – they say that tweenMax has tweenLite in it plus some extensions and plugins – in the code I used both because I stared without reading the documentation, just by following some examples so I didn't know the difference... you can say that we used different tools just to try them on. It's really easy to use greenSock and you will learn in quickly but it will take me ages to rewrite things that you can already find in the tutorials. So please visit their website, for example you can start here: https://greensock.com/get-started-js  I promise that it won't take much time and you will understand everything
          TweenLite.to("#playButton", 0.2, {
            scale: 0.96,
            transformOrigin: "50% 50%"
          });
        });
      document.querySelector("#playButton").addEventListener("mouseout", () => {
        TweenLite.to("#playButton", 0.2, {
          scale: 1,
          transformOrigin: "50% 50%"
        });
      });
      animationFallingBoxes();
      animateListOfHorses();
    });
}

// --------------------------------------- animate list of horses - game scene 2 ----------------------------------

function animationFallingBoxes() {
  // whooshSound – is the sound of fallen box. Because we want to play one sound before the other ends we need to add 4 sound instead of just 1. We will play each of the sound in the loop, together with the animation  (see below for loop function)
  let whooshSound = document.querySelectorAll(
    "#whooshSound0, #whooshSound1, #whooshSound2, #whooshSound3"
  );

  document.querySelector("#playButton").addEventListener("click", () => {
    document.querySelector("#FIRST").classList.add("hide");
    TweenLite.to("#playButton", 1, {
      scale: 0.5
    });

    let boxesWithHorses = document.querySelectorAll(
      "#horse1, #horse2, #horse3, #horse4"
    );

    for (let i = 0; i < boxesWithHorses.length; i++) {
      console.log(i);
      let whooshSoundPlay = "whooshSound" + i;
      console.log("whooshSoundPlay", whooshSoundPlay);
      TweenLite.from(boxesWithHorses[i], 1, {
        delay: i / 2,
        y: "-=519",
        ease: Elastic.easeOut.config(0.5, 0.3),
        onStart: function() {
          console.log("play " + i);
          whooshSound[i].play();
          //document.querySelector("#whooshSound0").play();
        }
      });
    }

    document.querySelector("#SECOND").classList.remove("hide");
    document
      .querySelectorAll("#horse1, #horse2, #horse3, #horse4")
      .forEach(element => {
        element.addEventListener("click", event => {
          clickToBet(event);
          document.querySelector("#SECOND").classList.add("hide");
          document.querySelector("#THIRD").classList.remove("hide");

          TweenMax.to("#lets-race", 1.4, {
            scale: 5,
            opacity: 0,
            transformOrigin: "50% 50%"
          });

          // document.querySelector("#lets-race").addEventListener("click", () => {
          //   document.querySelector("#THIRD").classList.add("hide");
          //   document.querySelector(".cls-4-1").classList.remove("hide");
          //  });
        });
      });
  });
}

function animateListOfHorses() {
  let allBoxes = document.querySelectorAll(".orangeBox");

  let allBoxes_a = document.querySelectorAll(".cls-2-4a");
  let textGroup = document.querySelectorAll(".text-group");
  let allImageHorses = document.querySelectorAll(
    "#horseImage1, #horseImage2, #horseImage3, #horseImage4"
  );

  console.log(allBoxes);
  for (let i = 0; i < allBoxes.length; i++) {
    Array.from(allBoxes[i].querySelectorAll("text, path")).forEach(item => {
      item.addEventListener("mouseenter", () => {
        event.preventDefault();
        console.log(event.target);
        TweenMax.to(allBoxes_a[i], 0.4, {
          scaleY: -1.2,
          y: "1"
        });
        TweenMax.to(allImageHorses[i], 0.4, {
          scaleY: 0,
          transformOrigin: "100% 100%"
        });
        TweenMax.to(textGroup[i], 0.4, {
          y: "-70"
        });
      });
    });
  }
  for (let i = 0; i < allBoxes.length; i++) {
    Array.from(allBoxes[i].querySelectorAll("path, text")).forEach(item => {
      item.addEventListener("mouseleave", () => {
        event.preventDefault();
        console.log(event.target);
        TweenMax.to(allBoxes_a[i], 0.4, {
          scaleY: 0
        });
        TweenMax.to(allImageHorses[i], 0.4, {
          scaleY: 0.33,
          transformOrigin: "100% 100%"
        });
        TweenMax.to(textGroup[i], 0.4, {
          y: "0"
        });
      });
    });
  }
}

// ---------------------------------------------- race - game scene 3 -----------------------------------------

let i;
let time; // the variable stores information about duration of animation - calculated individually for each horse
let scores = []; // this array will contain the durations of animations for all the horses
let horses = []; // this array will contain all horses that finishes the race
let chosenHorse; // this variable contains the information about chosen horse
let position; // this variable will contain information about position of the chosen horse
let randomVal; // Variable used to create a random easing for the moving horses
let durationRandom; // <-----------  Variable used to create a random value animation duration

// bet on a horse

function clickToBet(event) {
  // Create a condition to add event listener only to the elements that  contains an attribute “data – horse”
  if (event.target.parentElement.parentElement.dataset.horse) {
    // Set the value a variable “chosenHorse” with the value of the “data – horse” attribute
    chosenHorse = event.target.parentElement.parentElement.dataset.horse;
    horseRace();

    console.log(
      chosenHorse,
      document.querySelector("#race [data-horse='" + chosenHorse + "']")
    );
  }
}

function horseRace() {
  let raceSound = document.querySelector("#raceSound");

  let animateArrayOfHorses = document.querySelectorAll(
    "#white-horse, #brown-white-horse, #black-horse, #brown-horse"
  ); // the array contains all the horses from the scene with race, that will be animate with for loop function

  // target the line that belongs to the chosen horse and change its opacity... Please check if you can find the targeted element in the svg file and you can than you will understand this piece of code better.. so each time I will target here an element that has a certain dataset attribute (“data-horse = ….”) from the group that has an id = “race”
  document.querySelector(
    "#race [data-horse='" + chosenHorse + "']"
  ).style.opacity = "0.7";

  // animateArrayOfHorses = ok, this is not a well chosen name – should be rather something like: an array of horses to animate … but you will see that this function below was created to animate the horses from that array, this is a for loop function and is dedicated to each element from the array of horses so basically all horses that take part in the race
  for (let i = 0; i < animateArrayOfHorses.length; i++) {
    raceSound.play();
    randomVal = Math.random();

    // in GreenSock you can create your own easing. I decided to play around with it to make the horses behaving differently during the animation. You will see that one of the values from the string is dynamic and will change with each loop – again calculated with math.random method
    CustomEase.create(
      "run" + [i],
      "M0,0 C0.216,0.088 0.436,0.168 0.52,0.298 0.627,0.464 0.621,0.492 " +
        randomVal +
        ",0.664 0.804,0.804 0.856,0.81 1,1"
    );
    durationRandom = Math.random() * 10;
    time = durationRandom + 10;

    let element = animateArrayOfHorses[i]; // this is how we targeting the element of the array, with each loop a different one base on the index

    // in GreenSock you can create a timeline … if I understand it properly, it can be used if you want to add more complex animation to an element. So I decided to use it to rotate the horses... forward and backward. Apparently in greenSock this “repeat: -1” will make the animation infinite
    let tl = new TimelineMax({ repeat: -1, repeatDelay: 0 });
    tl.from(element, durationRandom / 10 + 0.2, {
      ease: Power2.easeIn,
      rotation: -10,
      transformOrigin: "50% 50%"
    });
    tl.to(element, durationRandom / 10 + 0.2, {
      ease: Power2.easeOut,
      rotation: 10,
      transformOrigin: "50% 50%"
    });
    tl.from(element, durationRandom / 10 + 0.2, {
      ease: Power2.easeIn,
      rotation: 10,
      transformOrigin: "50% 50%"
    });
    tl.to(element, durationRandom / 10 + 0.2, {
      ease: Power2.easeOut,
      rotation: -10,
      transformOrigin: "50% 50%"
    });

    TweenLite.to(element, time, {
      // <----------- animation - moveing the horses along the line
      ease: "run" + [i],
      x: 850,

      //onComplete in greenSock is like adding an event listener to an element that says “animationend” - so in this case with the method onComplete we call a function that:
      // - push a horse that finishes a race to a new array called “horses”
      // - push the time (duration of animation) to a new array  called “scores” etc.
      // the arrays with horses and scores will be used in the next function that displays the scores in the table

      onComplete: function() {
        // <----------- pushing horses and values of animation duration to an array
        console.log(i, Math.round(time * 100) / 100);
        scores.push(Math.round(time * 100) / 100);
        horses.push(element.dataset.name);
        time = Math.random() * 10 + 10;
        // why we need to sort the array of scores and we can't sort the array with horses ?????? :)))
        scores.sort(function(a, b) {
          return a - b;
        });
        console.log(horses);
        console.log(horses.length);

        // ok, at some point we need to show the scores and we will show them when all horses finises the race so if the array of horses has all horses inside = if this array has 4 elements the race is over and we can move to a next step, displaying scores. At this point we can also check what is the position of a chosen horse. We're doing that by using indexOf method

        if (horses.length === 4) {
          showScores();
          position = horses.indexOf(chosenHorse);
          console.log(position);
          document.querySelector("#THIRD").classList.add("hide");
          document.querySelector(".cls-4-1").classList.remove("hide");

          // scoresBoxes – this is an array that contains all the rows from the the table with scores... row = box and we need that to change the opacity of a box that belongs to a chosen horse
          let scoresBoxes = Array.from(document.querySelectorAll(".scorseBox"));
          scoresBoxes[position].style.opacity = "0.8"; // we use the variable "position" to target a right element from the array scoresBoxes to change the opacity

          // add event listener to show show the points
          document
            .querySelector(".nextButton")
            .addEventListener("click", showPoints);

          // add event listener to restart the game
          document
            .querySelector("#playAgainButton")
            .addEventListener("click", () => {
              document.querySelector(".cls-4-1").classList.add("hide");
              document.querySelector("#FIRST").classList.remove("hide");
              document.location.reload();
            });
        }
      }
    });
  }
}

// ------------------------------------------- show scores -------------------------------------

function showScores() {
  let horseNames = document.querySelectorAll(".horseName");
  let horsesTimes = document.querySelectorAll(".horseTime");
  console.log(horseNames.length);
  for (let i = 0; i < horseNames.length; i++) {
    horseNames[i].textContent = horses[i];
    horsesTimes[i].textContent = scores[i];
  }
}

function showPoints() {
  console.log(chosenHorse);

  document
    .querySelectorAll(
      ".FIFTHcls-9a, .FIFTH2cls-24a, .FIFTH2cls-32a, .FIFTH2cls-39a"
    )
    .forEach(horse => {
      if (horse.dataset.horse === chosenHorse) {
        horse.classList.remove("hide");
      }
      TweenMax.from(horse, 3, {
        opacity: 0
      });
    });

  document
    .querySelectorAll(".nextButton, #playAgainButton, .scoresBox")
    .forEach(e => {
      e.classList.add("hide");
    });
  document.querySelector("#FIFTH").classList.remove("hide");

  let horseFeet = document.querySelectorAll(".FIFTHcls-4a");
  console.log(position);
  document.querySelector("#pointsText").textContent =
    50 - position * 10 + " POINTS";

  let bellSound = document.querySelectorAll(
    "#Bell1, #Bell2, #Bell3, #Bell4, #Bell5"
  );

  for (let i = 0; i < 5 - position - 1 + 1; i++) {
    TweenMax.to(horseFeet[i], 0.5, {
      delay: i,
      fill: "#f7931e",
      onStart: function() {
        bellSound[i].play();
      }
    });
  }
  TweenMax.from("#pointsText", 0.5, {
    delay: 5 - position - 1 + 1,
    scale: 5,
    transformOrigin: "50% 50%",
    opacity: 0,
    onStart: function() {
      document.querySelector("#sucess").play();
    },
    ease: Bounce.easeOut
  });

  let scoresParents = Array.from(document.querySelectorAll(".scoresParent"));
  let scorseBoxes = Array.from(document.querySelectorAll(".scorseBox"));
  console.log("hej");
  // box animatiom
  TweenMax.to(scorseBoxes[position], 0.5, {
    attr: { y: 258 }
  });
  // text animation
  console.log(scorseBoxes[position].parentNode.childNodes[2]);
  TweenMax.to(scoresParents[position].querySelector(".cls-4-6"), 0.5, {
    attr: { transform: "translate(303.23 298.35)" }
  });
  TweenMax.to(scoresParents[position].querySelector(".cls-4-7"), 0.5, {
    attr: { transform: "translate(798.01 300.63)" }
  });
  TweenMax.to(scoresParents[position].querySelector(".cls-4-8"), 0.5, {
    attr: { transform: "translate(195.33 299.36)" }
  });
  // remove all postion but one
  console.log(position);
  for (let i = 0; i < scoresParents.length; i++) {
    if (i != position) {
      scoresParents[i].classList.add("hide");
    }
  }
}
