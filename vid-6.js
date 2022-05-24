const battery = document.querySelector('.battery');
const masks = document.querySelectorAll('.mask');
const batteryLevel = document.querySelector('.battery-level');

window.onload = async function () {
  let batteryManager = null;
  try {
    batteryManager = await navigator.getBattery();
  } catch (error) {
    alert('无法访问电池。\n' + error);
  }
  changeCharging(batteryManager);
  changeLevel(batteryManager);

  batteryManager.onchargingchange = function () {
    changeCharging(batteryManager);
  }

  batteryManager.onlevelchange = function () {
    changeLevel(batteryManager);
  }
}

function changeCharging(batteryManager) {
  if (batteryManager.charging) {
    masks.forEach(mask => {
      mask.classList.add('mask-charging');
    });
  } else {
    masks.forEach(mask => {
      mask.classList.remove('mask-charging');
    });
  }
}

function changeLevel(batteryManager) {
  if (batteryManager.level == 1) {
    masks.forEach(mask => {
      mask.classList.remove('mask-charging');
    });
  }
  battery.style.setProperty('--level', batteryManager.level);
  batteryLevel.textContent = batteryManager.level * 100 + '%';
}