import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const boxEl = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function renderBox(list, box) {
  const markup = list
    .map(
      ({
        name: { official },
        capital,
        region,
        population,
        flags: { svg },
        languages,
      }) => `<div class="country-info__box">
        <img src="${svg}" alt="flag" width="30"/>
        <h1 class="country-info__main-title">${official}</h1>
      </div>
      <ul class="country-info__list">
        <li class="country-info__item">
          <h2 class="country-info__title">Capital:</h2>
          <p class="country-info__text">${capital}</p>
        </li>
        <li class="country-info__item">
          <h2 class="country-info__title">Region:</h2>
          <p class="country-info__text">${region}</p>
        </li>
        <li class="country-info__item">
          <h2 class="country-info__title">Population:</h2>
          <p class="country-info__text">${population}</p>
        </li>
        <li class="country-info__item">
          <h2 class="country-info__title">Languages:</h2>
          <p class="country-info__text">${Object.values(languages)}</p>
        </li>
      </ul>`
    )
    .join('');
  return (box.innerHTML = markup);
}

function onSearch(e) {
  const value = e.target.value.toLowerCase().trim();
  if (!value) {
    listEl.innerHTML = '';
    boxEl.innerHTML = '';
    return;
  }
  fetchCountries(value)
    .then(checkAndRender)
    .catch(error => console.log('Увы, нет страны с таким названием :('));
}

function checkAndRender(list) {
  if (list.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (list.length <= 10 && list.length > 1) {
    listEl.innerHTML = '';
    boxEl.innerHTML = '';
    renderList(list, listEl);
  } else {
    boxEl.innerHTML = '';
    listEl.innerHTML = '';
    renderBox(list, boxEl);
    return;
  }
}

function renderList(list, listBox) {
  const markup = list
    .map(
      ({ flags: { svg }, name: { official } }) =>
        `<li class="country-list__item">
<img src="${svg}" alt="flag" width="30">
<h1 class="country-list__title">${official}</h1>
      </li>`
    )
    .join('');
  return (listBox.innerHTML = markup);
}
