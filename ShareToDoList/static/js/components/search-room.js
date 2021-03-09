function init() {
  const room = document.getElementById('room-serach');
  room.addEventListener('change', (event) => {
    console.log(event.target)
  })
}

init();