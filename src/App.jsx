import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import "./sass/app.scss";

import axios from "axios";

import TopSection from "./components/top/top";
import BottomSection from "./components/bottom/bottom";

const WEATHER_KEY = "2c2119e198f5ca7ff8622f9055ad2912";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: "New York",
      isLoading: true      
    };
  }

  updateWeather() {
    const { cityName,} = this.state;
    const URL = `http://api.weatherstack.com/current?access_key=${WEATHER_KEY}&query=${cityName}`;
    axios
      .get(URL)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        this.setState({ 
          isLoading: false,
          temperature: data.current.temperature, 
          isDay: data.current.is_day, 
          weather_descriptions: data.current.weather_descriptions, 
          weather_icons: data.current.weather_icons
        });
      })
      .catch((err) => {
      if(err) console.error("Cannot fetch Weather Data from API kuch nahi aaya,", err);
    }); 
  }

  componentDidMount() {
    const { eventEmitter } = this.props;
    
    this.updateWeather();

    eventEmitter.on("updateWeather", data => {
      this.setState({ cityName: data }, () => this.updateWeather());
    });
  }


  render() {
    const { isLoading, cityName, temperature, isDay, weather_descriptions, weather_icons } = this.state;

    return (
    <div className="app-container">
      <div className="main-container">
        {isLoading && <h3>Loading Weather.... </h3>}
        {!isLoading &&
        <div className="top-section">
          <TopSection 
           location={cityName}
           temperature={temperature} 
           isDay={isDay} 
           weather_descriptions={weather_descriptions} 
           weather_icons={weather_icons} 
           eventEmitter={this.props.eventEmitter}
          />
          </div>}
        <div className="bottom-section"><BottomSection /></div>
      </div>
    </div>
    ); 
  }
}

export default App;
