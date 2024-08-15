const filterButton = document.querySelector(".filter-by-region-container");
const filterOptions = document.querySelector(".filter-by-region-container ul");
const dropDownArrow = document.querySelector(".filter-by-region-container img");
const countryCardContainer = document.querySelector(".country-cards-container");
const noCountryFoundMsg = document.querySelector(".no-country-found");
const toggleDropDown = (e) => {
  e.stopPropagation();
  filterOptions.classList.toggle("show");
  dropDownArrow.classList.toggle("rotate-arrow");
};
const hideDropDown = () => {
  filterOptions.classList.remove("show");
  dropDownArrow.classList.remove("rotate-arrow");
};
filterButton.addEventListener("click", toggleDropDown);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideDropDown();
  }
});
document.addEventListener("click", (e) => {
  if (!filterButton.contains(e.target)) {
    hideDropDown();
  }
});

const showCountryCards = (countriesData) => {
  console.log(countriesData);
  countriesData.forEach((countryData) => {
    const countryCard = document.createElement("a");
    // countryCard.setAttribute('href',"/countryDetail.html")
    countryCard.classList.add("country-card");
    countryCard.innerHTML = `
<img src=${countryData.flags.svg}>
<div class="country-details">
<h2>${countryData.name.common}</h2>
<p><b>Population:</b>${countryData.population.toLocaleString("en-IN")}</p>
<p><b>Region:</b>${countryData.region}</p>
<p><b>Capital:</b>${countryData.capital}</p>
</div>
`;
    countryCard.href = `/countryDetail.html?name=${countryData.name.common}`;
countryCard.href=`/countryDetail.html?name=${countryData.name.common}`;
    countryCardContainer.append(countryCard);
  });
};

////main home page to show all country cards
const showAllCountriesCard = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countriesData = await res.json();
  showCountryCards(countriesData);
};

const searchInput = document.querySelector("input");
searchInput.addEventListener("input", (e) => {
  fetch(`https://restcountries.com/v3.1/name/${e.target.value}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Page Not Found" || data.message === "Not Found") {
        console.log("f");
        noCountryFoundMsg.classList.add("show-no-country-found-msg");
        countryCardContainer.style.display = "none";
      } else {
        console.log(data);

        noCountryFoundMsg.classList.remove("show-no-country-found-msg");
        countryCardContainer.style.display = "block";
        countryCardContainer.innerHTML = "";
        showCountryCards(data);
      }
    });
});

//Filter for a region

const filterElementTitle = document.querySelector(".filter-element-title");
const allRegion = document.querySelectorAll("li");
allRegion.forEach((region) => {
  // console.log(region.innerText);
  region.addEventListener("click", () => {
    console.log(region.innerText);
    filterElementTitle.innerText = region.innerText;
    showselectedRegionCountries(filterElementTitle.innerText);
  });
});

function showselectedRegionCountries(region) {
  console.log(region);
  if (region === "All") {
    countryCardContainer.innerHTML = "";

    showAllCountriesCard();
  } else {
    fetch(`https://restcountries.com/v3.1/region/${region}`)
      .then((res) => res.json())
      .then((data) => {
        countryCardContainer.innerHTML = "";
        showCountryCards(data);
      });
  }
}
showAllCountriesCard();

const addClickEventOnCard = () => {
  const cards = document.querySelectorAll(".country-cards-container>div");

  cards.forEach((card) => {
    card.addEventListener("click", () => {});
  });
};
