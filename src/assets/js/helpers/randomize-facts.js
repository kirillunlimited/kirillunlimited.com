const factBlocks = document.querySelectorAll('.random-facts__fact');
const randomizeFactsButton = document.querySelector('.random-facts__button');
const count = factBlocks && factBlocks.length;

let previousRandomPosition = -1;

const generateRandomNumber = (max, previousRandomNumber) => {
  const randomPosition = Math.floor(Math.random() * max);

  if (randomPosition === previousRandomNumber) {
    return generateRandomNumber(max, previousRandomNumber);
  }

  return randomPosition;
}

const randomizeFacts = () => {
  if (!count) {
    return;
  }

  factBlocks.forEach((fact) => {
    fact.classList.remove('random-facts__fact--visible');
  });

  const randomPosition = generateRandomNumber(count, previousRandomPosition);
  previousRandomPosition = randomPosition;

  factBlocks[randomPosition].classList.add('random-facts__fact--visible');
};

export const initFactsRandomizer = () => {
  randomizeFacts();

  randomizeFactsButton.addEventListener('click', () => {
    randomizeFacts();
  });
}
