import { useContext, useEffect, useState } from "react";
import IconWeather from "../IconWeather/IconWeather";
import classes from "./RangeForecast.module.css"
import useHttp from "../../hooks/use-http";
import Day from "./Day/Day";
import TripsContext from "../../store/trips-context";
import LoadingIcon from "../UI/LoadingIcon/LoadingIcon";
import Warning from "../UI/Warning/Warning";

const RangeForecast = () => {
    const [week, setWeek] = useState([]); 
   
    const tripsCtx = useContext(TripsContext);
    const { isLoading, error, sendRequest: fetchRageForecast } = useHttp();

    const currentTrip = tripsCtx.trips.find(trip => trip.id === tripsCtx.currentTripId);

    const CITY = currentTrip.city;
    const START_DATE = currentTrip.startDate;
    const END_DATE = currentTrip.endDate;
    const API_KEY = tripsCtx.apiKay; 

    const URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
        + CITY + '/' + START_DATE + '/' + END_DATE +
        '?unitGroup=metric&include=days%2Ccurrent&key=' + API_KEY + '&contentType=json';

         
    useEffect(() => {       
        const transformDays = (forecast) => {            
            const days = forecast.days;

            const loadedWeek = [];
            for (const dayKey in days) {
                if (dayKey > 6) { break }
                loadedWeek.push(days[dayKey]);
            }            
            setWeek(loadedWeek)
        }       
        fetchRageForecast({ url: URL }, transformDays); 

    }, [fetchRageForecast, CITY]);

    if( isLoading ){ return  <LoadingIcon/> }
    if( error ){ return  <Warning>Sorry. Something went wrong</Warning> }



    return (
        <div className={classes['range-forecast']}>
            <h2>Week</h2>
            <ul>
                {week.map(day => (
                    <Day                        
                        key={day.datetime}
                        date={day.datetime}
                        icon={day.icon}
                        tempMin={day.tempmin}
                        tempMax={day.tempmax}
                    />
                ))}
            </ul>
        </div>
    )
}

export default RangeForecast;