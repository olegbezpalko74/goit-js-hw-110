import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
  };
  
  refs.input.addEventListener(
    'input',
    debounce(onInputCountryName, DEBOUNCE_DELAY)
  );
  
  function onInputCountryName(e) {
    e.preventDefault();
    const countryName = refs.input.value.trim();
    if (countryName === '') {
      return;
    }
  
    fetchCountries(countryName).then(createCountriesList).catch(catchError);
  
    function createCountriesList(contries) {
      if (contries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            position: 'center-top',
            fontSize: '18px',
            distance: '120px',
          }
        );
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
      }
      if (contries.length >= 2 && contries.length <= 10) {
        const createListOfContries = contries
          .map(country => markupCountriesList(country))
          .join('');
        refs.countryList.innerHTML = createListOfContries;
        refs.countryInfo.innerHTML = '';
      }
      if (contries.length === 1) {
        const createCardContryInfo = contries
          .map(contry => markupCountryCardInfo(contry))
          .join('');
        refs.countryInfo.innerHTML = createCardContryInfo;
        refs.countryList.innerHTML = '';
      }
    }
  
    function markupCountriesList({ flags, name }) {
      return `<li class="country-list__item">
    <img class="country-list__flags" src="${flags.svg}" alt="${name.official}" width="35" />
    <h2 class="country-list__name">${name.official}</h2>
      </li>`;
    }
  
    function markupCountryCardInfo({
      flags,
      name,
      capital,
      population,
      languages,
    }) {
      return `<div class="country-info__container">
      <div class="country-info__wrapper"><img class="country-info__flags" src="${
        flags.svg
      }" alt="${name.official}" width="50"/>
    <h2 class="country-info__name">${name.official}</h2>
    </div>
    <p class="country-info__capital"><b>Capital: </b>${capital}</p>
    <p class="country-info__population"><b>Population: </b>${population}</p>
    <p class="country-info__languages"><b>Languages: </b>${Object.values(
      languages
    ).join(', ')}</p>
      </div>`;
    }
  
    function catchError(error) {
      Notify.failure('Oops, there is no country with that name', {
        position: 'center-top',
        fontSize: '18px',
        distance: '120px',
      });
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      return error;
    }
  }
