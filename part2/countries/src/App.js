import axios from "axios";
import { useEffect, useState } from "react";

const SingleCountryResult = ({ country }) => {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      )
      .then((res) => {
        setWeather(res.data);
      });
  }, [country.capitalInfo.latlng]);
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang) => {
          return <li key={lang}>{lang}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <h2>Weather in {country.capital[0]}</h2>
      {weather && (
        <div>
          <p>temperature {weather.main.temp} Celsius</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const CountriesResult = ({ countries, onSelectCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length === 1) {
    const country = countries[0];
    return <SingleCountryResult country={country} />;
  }

  return (
    <div>
      {countries.map((country, index) => {
        return (
          <p key={index}>
            {country.name.common}{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                onSelectCountry(country);
              }}
            >
              show
            </button>
          </p>
        );
      })}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      setCountries(res.data);
    });
  }, []);

  const filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div>
        find countries{" "}
        <input
          value={search}
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </div>
      <CountriesResult
        countries={filteredCountries}
        onSelectCountry={(country) => {
          setSearch(country.name.common);
        }}
      />
    </div>
  );
};

export default App;
