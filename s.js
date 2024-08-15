const filterButton = document.querySelector(".filter-by-region-container");
const filterOptions = document.querySelector(".filter-by-region-container ul");
const dropDownArrow = document.querySelector(".filter-by-region-container img");
const countryCardContainer = document.querySelector(".country-cards-container");
const noCountryFoundMsg = document.querySelector(".no-country-found");
const searchInput = document.querySelector("input");
const filterElementTitle = document.querySelector(".filter-element-title");

// Toggle dropdown visibility
const toggleDropDown = (e) => {
  e.stopPropagation();
  filterOptions.classList.toggle("show");
  dropDownArrow.classList.toggle("rotate-arrow");
};

// Hide dropdown
const hideDropDown = () => {
  filterOptions.classList.remove("show");
  dropDownArrow.classList.remove("rotate-arrow");
};

// Add event listeners for dropdown
filterButton.addEventListener("click", toggleDropDown);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideDropDown();
});
document.addEventListener("click", (e) => {
  if (!filterButton.contains(e.target)) hideDropDown();
});

// Fetch data from the API
const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Display country cards
const showCountryCards = (countriesData) => {
  countryCardContainer.innerHTML = countriesData.map(countryData => `
    <div class="country-card">
      <img src="${countryData.flags.svg}" alt="Flag of ${countryData.name.common}">
      <div class="country-details">
        <h2>${countryData.name.common}</h2>
        <p><b>Population:</b> ${countryData.population.toLocaleString()}</p>
        <p><b>Region:</b> ${countryData.region}</p>
        <p><b>Capital:</b> ${countryData.capital}</p>
      </div>
    </div>
  `).join('');
};

// Show all countries on the main page
const showAllCountriesCard = async () => {
  const countriesData = await fetchData("https://restcountries.com/v3.1/all");
  if (countriesData) showCountryCards(countriesData);
};

// Debounce function to limit the rate of function execution
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Search for countries
const searchCountries = async (query) => {
  if (!query) {
    showAllCountriesCard();
    return;
  }
  const data = await fetchData(`https://restcountries.com/v3.1/name/${query}`);
  if (data && data.message !== "Page Not Found" && data.message !== "Not Found") {
    noCountryFoundMsg.classList.remove("show-no-country-found-msg");
    countryCardContainer.style.display = "block";
    showCountryCards(data);
  } else {
    noCountryFoundMsg.classList.add("show-no-country-found-msg");
    countryCardContainer.style.display = "none";
  }
};

// Add event listener for search input
searchInput.addEventListener("input", debounce((e) => searchCountries(e.target.value), 300));

// Filter countries by region
const showSelectedRegionCountries = async (region) => {
  countryCardContainer.innerHTML = "";
  if (region === "All") {
    showAllCountriesCard();
  } else {
    const data = await fetchData(`https://restcountries.com/v3.1/region/${region}`);
    if (data) showCountryCards(data);
  }
};

// Add event listeners for region filter options
filterOptions.addEventListener("click", (e) => {
  if (e.target.tagName === 'LI') {
    const region = e.target.innerText;
    filterElementTitle.innerText = region;
    showSelectedRegionCountries(region);
  }
});

// Initialize the page with all countries
showAllCountriesCard();
