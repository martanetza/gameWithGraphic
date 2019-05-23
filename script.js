window.addEventListener("DOMContentLoaded", loadSVG);

//show graphic

function loadSVG() {
  fetch("prototypesave1_game 1.svg")
    .then(res => res.text())
    .then(svgdata => {
      document.querySelector("main").insertAdjacentHTML("afterbegin", svgdata);
      animation();
      initRace();
    });
}

function animation() {
  document.querySelector("#playButton").addEventListener("click", () => {
    document.querySelector("#FIRST").classList.add("hide");

    document.querySelector("#SECOND").classList.remove("hide");
    document
      .querySelectorAll("#horse1, #horse2, #horse3, #horse4")
      .forEach(element => {
        element.addEventListener("click", event => {
          clickToBet(event);
          document.querySelector("#SECOND").classList.add("hide");
          document.querySelector("#THIRD").classList.remove("hide");
          // document.querySelector("#lets-race").addEventListener("click", () => {
          //   document.querySelector("#THIRD").classList.add("hide");
          //   document.querySelector(".cls-4-1").classList.remove("hide");
          //  });
        });
      });
  });
}

//race

function initRace() {}

let i;
let time;
let scores = [];
let horses = [];
let chosenHorse;
let position;

// bet on a horse
// document
//   .querySelector(".listOfHorses")
//   .addEventListener("click", clickToBet);
function clickToBet(event) {
  chosenHorse = event.target.dataset.horse;
  horseRace();
  console.log(chosenHorse);
}

let randomVal = Math.random();

function horseRace() {
  let svg = document.querySelector("svg").getBoundingClientRect();

  let animateArray = document.querySelectorAll(
    "#white-horse, #brown-white-horse, #black-horse, #brown-horse"
  );
  for (let i = 0; i < animateArray.length; i++) {
    let randomVal = Math.random();

    CustomEase.create(
      "run" + [i],
      "M0,0 C0.216,0.088 0.436,0.168 0.52,0.298 0.627,0.464 0.621,0.492 " +
        randomVal +
        ",0.664 0.804,0.804 0.856,0.81 1,1"
    );
    time = Math.random() * 10 + 10;
    let element = animateArray[i];

    TweenMax.fromTo(
      element,
      1,
      { rotation: -20, transformOrigin: "50% 50%" },
      { rotation: 20, transformOrigin: "50% 50%", repeat: -1, repeatDelay: 0.4 }
    );

    // TweenLite.to(element, 1, {
    //   rotation: 10,
    //   transformOrigin: "left 50%"
    // });

    TweenLite.to(element, time, {
      ease: "run" + [i],
      x: svg.width - 40,

      onComplete: function() {
        console.log(i, Math.round(time * 100) / 100);
        scores.push(Math.round(time * 100) / 100);
        horses.push(element.dataset.name);
        time = Math.random() * 10 + 10;

        scores.sort(function(a, b) {
          return a - b;
        });
        console.log(horses);
        console.log(horses.length);
        if (horses.length === 4) {
          showScores();
          position = horses.indexOf(chosenHorse) + 1;
          console.log(position);
          document.querySelector("#THIRD").classList.add("hide");
          document.querySelector(".cls-4-1").classList.remove("hide");
          // document.querySelector("span").textContent = position;
        }
      }
    });
  }
}
function showScores() {
  let horseNames = document.querySelectorAll(".horseName");
  let horseTimes = document.querySelectorAll(".horseTime");
  console.log(horseNames.length);
  for (let i = 0; i < horseNames.length; i++) {
    horseNames[i].textContent = horses[i];
    horseTimes[i].textContent = scores[i];
  }
}
