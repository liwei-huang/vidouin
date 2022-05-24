/* 
  接口
  1. 通过城市名查询：https://api.openweathermap.org/data/2.5/weather?q={city}&lang=zh_cn&units=metric&appid=cb9fc2eca8fc4d5da4547950678b1f13
  2. 通过地理位置查询：https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&lang=zh_cn&units=metric&appid=cb9fc2eca8fc4d5da4547950678b1f13
*/

const inputCity = document.querySelector('#input-city');
const queryByCity = document.querySelector('#query-by-city');
const queryByPosition = document.querySelector('#query-by-position');
const infoList = document.querySelector('#info-list');
const items = infoList.querySelectorAll('span');
const queryState = document.querySelector('#query-state');

queryByCity.addEventListener('click', fireCityQuery);
queryByPosition.addEventListener('click', positionQuery);

function fireCityQuery() {
  const city = inputCity.value.trim();
  if (!city) {
    alert('输入不能为空。');
    return;
  }
  cityQuery(city);
}

function output({ weather: [{ description }], main: { temp, humidity }, name }) {
  queryState.textContent = '';
  items[0].textContent = name;
  items[1].textContent = temp;
  items[2].textContent = humidity;
  items[3].textContent = description;
}

function emptyInfoList() {
  items.forEach((item) => {
    item.textContent = '';
  });
  queryState.textContent = '查询中...';
}

async function process(response) {
  if (!response.ok) {
    queryState.textContent = `查询失败。 ${response.statusText}`;
    return;
  }
  const result = await response.json();
  output(result);
}

async function cityQuery(city) {
  emptyInfoList();

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=zh_cn&units=metric&appid=cb9fc2eca8fc4d5da4547950678b1f13`);

  process(response);
}

function positionQuery() {
  emptyInfoList();

  navigator.geolocation.getCurrentPosition(async (position) => {
    let { latitude, longitude } = position.coords;
    latitude.toFixed(2);
    longitude.toFixed(2);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=zh_cn&units=metric&appid=cb9fc2eca8fc4d5da4547950678b1f13`);

    process(response);
  }, (error) => {
    const { code } = error;
    switch (code) {
      case GeolocationPositionError.TIMEOUT:
        queryState.textContent = '请求超时。';
        break;
      case GeolocationPositionError.PERMISSION_DENIED:
        queryState.textContent = '无权限获取位置。';
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        queryState.textContent = '位置不可用。';
        break;
    }
  });
}
