const clockContainer = document.querySelector(".js-clock"),
  clockTitle = clockContainer.querySelector("h1");

function dgt(base) {
  return base > 9 ? base : `0${base}`;
}
function getTime() {
  const date = new Date();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const seconds = date.getSeconds();
  clockTitle.innerText = `${dgt(hours)}:${dgt(minutes)}:${dgt(seconds)}`;
}
function init() {
  setInterval(getTime, 1000);
}
init();
