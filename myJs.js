var tID;
var timeToAnswer = 6;
const playButton = document.getElementById("play");
var canAnswerAQuestion = false;
var actualAnswer = "";
var step = -1;
var countDownID;

//const actualQuestion;
class zombie {
  constructor() {
    this.X = 0;
    this.type = "zombie";
  }

  getElementInHtml() {
    return document.getElementById("zombie");
  }
}
class fallingObjects {
  constructor(Id, type) {
    this.X = 10;
    this.Y = -50;
    this.Id = Id;
    this.IsInTheAir = false;
    this.collison = false;
    this.fallingSpeed = "slow";
    this.visible = false;
    this.type = type;
    this.visible = false;
    this.Y -= 10;
  }

  reInitialiaze() {
    this.X = 10;
    this.Y = -50;
    this.IsInTheAir = false;
    this.collison = false;
    this.fallingSpeed = "slow";
    this.visible = false;
    this.visible = false;
    this.getElementInHtml().style.transform = `translate(${this.X}px,${-this
      .Y}px)`;
    this.makeMeVisible();
  }

  getElementInHtml() {
    return document.getElementById(this.Id);
  }

  makeMeVisible() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].style.visibility = "visible";
    this.visible = true;
  }
  hideMe() {
    var imgs = document.getElementById(this.Id).getElementsByTagName("img");
    imgs[0].style.visibility = "hidden";
    this.visible = false;
  }
  isvisible() {
    return this.visible;
  }

  fall() {
    this.makeMeVisible();
    let intervalId = setInterval(() => {
      if (this.Y === -600) {
        this.IsInTheAir = false;
        //the falling element become invisible if not touched
        clearInterval(intervalId);
        this.hideMe();
        return;
      }
      this.Y -= 10;
      this.getElementInHtml().style.transform = `translate(${this.X}px,${-this
        .Y}px)`;
    }, 500);
  }
}

var trueSign = new fallingObjects("true", "trueType");
var falseSign = new fallingObjects("false", "falseType");
var myZombie = new zombie();

class player {
  constructor() {
    this.brain = 5;
    this.X = 0;
    this.Y = 0;
    this.Id = "bunny";
    this.direction = 180;
    this.IsInTheAir = false;
    this.colludeWithTrue = false;
    this.colludeWithAZombie = false;
    this.colludeWithFalse = false;
  }
  getElementInHtml() {
    return document.getElementById(this.Id);
  }
  moveRight() {
    this.X += 5;
    var action;
    this.direction = 0;
    action = `rotateY(${this.direction}deg)translateX(${this.X}px)`;
    this.getElementInHtml().style.transform = action;
  }
  moveLeft() {
    this.X -= 5;
    var action;
    this.direction = 180;
    action = `rotateY(${this.direction}deg)translateX(${-this.X}px)`;
    this.getElementInHtml().style.transform = action;
  }
  fall() {
    return new Promise((resolve, reject) => {
      let intervalId = setInterval(() => {
        if (this.Y === 0) {
          this.IsInTheAir = false;
          clearInterval(intervalId);
          resolve();
          return;
        }
        this.Y -= 10;
        var action;
        if (this.direction === 0) {
          action = `rotateY(${this.direction}deg)translate(${this.X}px,${-this
            .Y}px)`;
        } else {
          action = `rotateY(${this.direction}deg)translate(${-this.X}px,${-this
            .Y}px)`;
        }
        this.getElementInHtml().style.transform = action;
      }, 10);
    });
  }
  removeBrain() {
    if (this.brain > 0) {
      this.brain = this.brain - 1;
    }
  }
  getBrain() {
    return this.brain;
  }
  addBrain() {
    if (this.brain < 5) this.brain = this.brain + 1;
  }
  checkColision(element) {
    let element1 = this.getElementInHtml().getBoundingClientRect();
    let element2 = element.getElementInHtml().getBoundingClientRect();
    if (
      element2.left < element1.left + element1.width &&
      element2.left + element2.width > element1.left &&
      element2.top < element1.top + element1.height &&
      element2.height + element2.top > element1.top
    ) {
      //condition to distinguish different collision

      if (element.type !== "zombie") {
        if (element.type == "trueType") this.colludeWithTrue = true;
        else if (element.type == "falseType") {
          this.colludeWithFalse = true;
          console.log("We colude with false element  ", this.colludeWithFalse);
        }
        element.hideMe();
      } else {
        this.colludeWithAZombie = true;
      }
      return true;
    } else {
      return false;
    }
  }
  handleColision(element) {
    console.log("we start with this amount of brain : ", this.brain);
    var WellAnswered = false;

    if (
      this.colludeWithTrue &&
      element.type == "trueType" &&
      actualAnswer === true &&
      element.isvisible()
    ) {
      this.addBrain();
      WellAnswered = true;
      console.log("YOU WIN THE QUESTION  the answe was true", this.brain);
    }
    if (
      this.colludeWithFalse &&
      element.type == "falseType" &&
      actualAnswer === false &&
      element.isvisible()
    ) {
      WellAnswered = true;
      this.addBrain();
      console.log("YOU WIN THE QUESTION  the answer was false ", this.brain);
    }

    if (!WellAnswered && element.isvisible()) {
      //we have a collision with the wrong element
      console.log("element.visvible", element.isvisible);
      this.removeBrain();
      console.log("YOU LOOSE THE QUESTION ", this.brain);
    } else {
      //we dont have a collision nothing happen yet we need to wait till this end of the countdown because things can still happen
    }
    setTimeout(printGifQuestionResult(), 3000);
  }
  jump() {
    let limit = 0;
    this.colludeWithFalse = false;
    this.colludeWithTrue = false;
    this.colludeWithAZombie = false;
    if (!this.IsInTheAir) {
      this.IsInTheAir = true;
      let intervalId = setInterval(() => {
        if (limit > 25) {
          this.fall();
          clearInterval(intervalId);
        }
        this.Y += 20;
        var action;
        if (this.direction === 0) {
          action = `rotateY(${this.direction}deg)translate(${this.X}px,${-this
            .Y}px)`;
        } else {
          action = `rotateY(${this.direction}deg)translate(${-this.X}px,${-this
            .Y}px)`;
        }
        this.getElementInHtml().style.transform = action;
        if (!this.colludeWithTrue || !this.colludeWithFalse) {
          console.log("on check");
          this.checkColision(trueSign);
          this.checkColision(falseSign);
        }
        limit++;
      }, 10);

      if (this.colludeWithFalse == false) {
        console.log("on lance handlecollision ", this.colludeWithFalse);
        this.handleColision(falseSign);
      } else if (this.colludeWithTrue == true) {
        console.log("on lance handlecollision ", this.colludeWithTrue);
        this.handleColision(trueSign);
      }
    }
  }
}
/*object definitions */

var bunny = new player();
//le rendre visible avant

const questions = [
  {
    question: `isNan(3)? true Or False? `,
    answer: false
  },
  {
    question: `isNan(Hello) True or False?`,
    answer: true
  },
  {
    question: `true&true True or False?`,
    answer: true
  },
  {
    question: `false&false True or False?`,
    answer: false
  },
  {
    question: `false||true True or False?`,
    answer: true
  }
];

/*functions */
function typeAQuestion(question) {
  /*document.getElementById("question").innerHTML = question;*/
  return new Promise((resolve, reject) => {
    var i = 0;
    clearAQuestion();
    var timer = setInterval(function() {
      document.getElementById("question").innerHTML += question[i];
      i++;
      if (i > question.length - 1) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

function clearAQuestion() {
  document.getElementById("question").innerHTML = " ";
}
function printGifGameResult(result) {
  if (result == "dead" || "win") {
    if (result == "dead") {
      document.getElementById("dead-iframe").style.visibility = "visible";
      document.getElementById("true-iframe").style.visibility = "hidden";
      document.getElementById("false-iframe").style.visibility = "hidden";
      document.getElementById("win-iframe").style.visibility = "hidden";
    } else {
      document.getElementById("dead-iframe").style.visibility = "hidden";
      document.getElementById("true-iframe").style.visibility = "hidden";
      document.getElementById("false-iframe").style.visibility = "hidden";
      document.getElementById("win-iframe").style.visibility = "visible";
    }
  }
}
function printGifQuestionResult() {
  if (actualAnswer == true) {
    document.getElementById("true-iframe").style.visibility = "visible";
    document.getElementById("false-iframe").style.visibility = "hidden";
    document.getElementById("dead-iframe").style.visibility = "hidden";
    document.getElementById("win-iframe").style.visibility = "hidden";
  } else if (actualAnswer == false) {
    document.getElementById("false-iframe").style.visibility = "visible";
    document.getElementById("dead-iframe").style.visibility = "hidden";
    document.getElementById("true-iframe").style.visibility = "hidden";
    document.getElementById("win-iframe").style.visibility = "hidden";
  }
}

function animateScript() {}

function stopAnimate() {
  clearInterval(tID);
}
function returnCanAnswerAQuestion() {
  return canAnswerAQuestion;
}

function updateGame() {
  document.getElementById("countdown").innerHTML = "Bouhhh too Late ";
  setTimeout(printGifQuestionResult(), 3000);
  if (!bunny.colludeWithFalse || !bunny.colludeWithTrue) {
    trueSign.hideMe();
    falseSign.hideMe();
    bunny.removeBrain();
    setTimeout(printBrains(), 2000);
  }
}

function setNextRound() {
  if (bunny.getBrain() < 2 || step == questions.length - 1) {
    endGame();
    return false;
  } else {
    step += 1;
    trueSign.reInitialiaze();
    falseSign.reInitialiaze();
    bunny.colludeWithTrue = false;
    bunny.colludeWithFalse = false;
    return true;
  }
}

function startGame() {
  const shouldContinue = setNextRound();
  if (shouldContinue) {
    console.log("we enter step: " + step);
    actualAnswer = questions[step].answer;
    typeAQuestion(questions[step].question);
    //we need to listen on that
    trueSign.fall();
    falseSign.fall();
    printCountdown().then(startGame);
  }
}

playButton.onclick = startGame;

function endGame() {
  if (bunny.getBrain() < 2) {
    for (let x = myZombie.X; x < bunny.X; x -= 10) {
      var myHtmlzombie = document.getElementById("zombie");
      myHtmlzombie.style.visibility = "visible";
      myZombie.X -= 10;
      myHtmlzombie.style.transform = `translateX(${myZombie.X}px)`;
      bunny.checkColision(myZombie);
      if (bunny.colludeWithAZombie) {
        //ajouter la condition si le zombie est visible
        console.log("YOU LOOSE THE GAME ");
        bunny.removeBrain();
        setTimeout(printBrains(), 2000);
        setTimeout(printGifGameResult("dead"), 3000);
        typeAQuestion("YOU LOOSE");
        bunny.getElementInHtml().style.backgroundImage = `url("./images/bunnysprite5.jpg")`;

        break;
      }
    }
  } else {
    if (!bunny.colludeWithAZombie) {
      setTimeout(printGifGameResult("win"), 3000);
      typeAQuestion("YOU WIN");
      //mettre le lapin qui shoot
    }
  }
}

function printBrains() {
  var brainimgs = document
    .getElementById("brain-section")
    .getElementsByTagName("img");

  var amountofVisibleBrains = bunny.getBrain();

  for (let i = 0; i < 5; i++) {
    if (i < amountofVisibleBrains) {
      brainimgs[i].style.visibility = "visible";
    } else {
      brainimgs[i].style.visibility = "hidden";
    }
  }
}

function printCountdown() {
  var timeleftToAnswer = timeToAnswer;
  return new Promise((resolve, reject) => {
    countDownID = setInterval(function() {
      document.getElementById("countdown").innerHTML =
        timeleftToAnswer + " Sec";

      timeleftToAnswer -= 1;
      if (timeleftToAnswer <= -1) {
        updateGame();
        resetCountDown();
        resolve();
      }
    }, 1000);
  });
}
function resetCountDown() {
  document.getElementById("countdown").innerHTML = timeToAnswer + " Sec";
  clearInterval(countDownID);
}
animateScript();
document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37:
      bunny.moveLeft();
      break;
    case 38:
      bunny.jump();
      break;
    case 39:
      bunny.moveRight();
      break;
    default:
      break;
  }
};
