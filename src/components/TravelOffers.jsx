import { useState, useEffect } from 'react'
import DisplayFLights from './DisplayFLights'
import ExtraInfo from './ExtraInfo'


const TravelOffers = ({ history }) => {


  const[isLoading, setIsLoading] = useState(false)
  const[error, setError] = useState(false)
  const[selectedOptions, setSelectedOptions] = useState({
    destinationLocationCode: "",
    departureDate: "2022-04-12",
    returnDate: "",
    adults: 1,
    kids: 0,
    travelClass: "ECONOMY",
    nonStop: true,
    maxPrice: "250",
    max: "30",
  })
  const[selectedData, setSelectedData] = useState([])


  useEffect(() => {
    getData()
  },[selectedOptions])

  const getData = async () => {
    let ci = urlFunction() // getting the query string parameter
    // console.log("!!!!", ci)
    let t = await newTokenRequest() // we're getting a token and not saving it anymore in the state, but just in a local variable because this is sync
    // console.log('!!!', t)
    let iataCi = await cityCode(t, ci)
    let flightInfoToExtract = await fetchFlights(
      t,
      iataCi,
      selectedOptions.adults,
      selectedOptions.travelClass,
      selectedOptions.nonStop,
      selectedOptions.departureDate,
      selectedOptions.returnDate
      )
      console.log('bam here: ',flightInfoToExtract)
    await extractedData(flightInfoToExtract)
    // setSelectedData(extrudedAllTheWays)
  } 

  const urlFunction = () => {
    // access url
    const urlQueryString = window.location.search;

    // extract query from params in the 'flight' page
    const urlParams = new URLSearchParams(urlQueryString);
    const city = urlParams.get('cityQuery')
    return city
    // setCityQuery(city)
  }

  const newTokenRequest = async() => {
    try {
      const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&client_id=Qib3QfOzZG1a6g8r8zX0Kx9XhtA8XBS6&client_secret=BzObmAeMp1ClNDtn',
    })
      const data = await response.json()
      let tokenToSet = await data
      return tokenToSet.access_token
    }catch (error) {
      console.log(error)
      return ''
    }
  }

  async function cityCode(token, query) {
    try{
      if(query.length > 2) {
      const response = await fetch("https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" + query + "&sort=analytics.travelers.score&view=LIGHT&page%5Boffset%5D=0&page%5Blimit%5D=10", {
        headers: {
            'Authorization': 'Bearer ' + token,
          }
        })
      const { data }  = await response.json()
      console.log('!!! city stuff', data)
      const firstItem = await data[0].iataCode
      console.log(firstItem)
      let iataCity = firstItem
      return iataCity
      } else {
      console.log("oops")
      }
      }catch(err) {
        console.log(err)
      }

    // why can't I set the state to be the first array element?
    // setIATACode(data[0].iataCode)

  //  after each reload I need to remove all the values from the array
  }

  const fetchFlights = async(token = '', location = "LON", adults = 1, travelClass = "ECONOMY", nonStop, departureDate, returnDate) => {
    try{
      const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=PAR&destinationLocationCode=${location}&departureDate=${departureDate}${returnDate.length ? "&returnDate=" + returnDate : returnDate}&adults=${adults}&travelClass=${travelClass}&nonStop=${nonStop}&max=25`, {
        // ${returnDate.length > 2 ? ("returnDate=" + returnDate) : ""}
        // return Date is OPTIONAL - how to make it work? &returnDate=${returnDate}
        // 2030-12-31
        headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      const data = await response.json()
        // console.log("here's the data", data)

      if(!response.ok) {
        setError(true)
      } else {
        setIsLoading(true)
      }
      return data

    } catch(err) {
      console.log(err.message)
    }
  }

  const extractedData = (arr) => {
    try {
      let extrudedData = arr.data.map((element) => ({
        id: element.itineraries[0].segments.map((seg) => (
          seg.id
        )),
        departureCode: element.itineraries[0].segments.map((segm) => (
          segm.departure.iataCode
        )),
        departureTerminal: element.itineraries[0].segments.map((segm) => (
          segm.departure.terminal
        )),
        departureTime: element.itineraries[0].segments.map((segm) => (
          segm.departure.at
        )),
        arrivalCode:  element.itineraries[0].segments.map((segm) => (
          segm.arrival.iataCode
        )),
        arrivalTerminal:  element.itineraries[0].segments.map((segm) => (
          segm.arrival.terminal
        )),
        arrivalTime:  element.itineraries[0].segments.map((segm) => (
          segm.arrival.at
         )),
        flightDuration: element.itineraries[0].segments[0].duration,

        carrierCode: element.itineraries[0].segments.map((segm) => (
          segm.carrierCode
        )),
        aircraftCode: element.itineraries[0].segments.map((segm) => (
          segm.aircraft.code
        )),
        priceCurrency: element.price.currency,
        priceTotal: element.price.total,
        priceBase: element.price.base,
        priceFees: element.price.fees.map((fee) => (
          fee.amount + " " + fee.type + " "
        )),
        fareOption: element.travelerPricings[0].fareOption,
        cabin: element.travelerPricings[0].fareDetailsBySegment[0].cabin,
        weightOfIncludedCHeckedBags: element.travelerPricings[0].fareDetailsBySegment.map((arr) => (
          arr.includedCheckedBags.weight + "   " + arr.includedCheckedBags.weightUnit
        ))
        // weightUnit: element.travelerPricings[0].fareDetailsBySegment.map((i) => (
          // i.includedCheckedBags.weightUnit
          // props will have includedCheckedBags.weightUnit once we give it the parameters for it
          // since now we're working on their link. We're not using our custom
        // )),
      }
      ))

      // console.log("extruded", extrudedData)
      // setSelectedData(extrudedData)
      // return extrudedData

      if(extrudedData)  {
        setSelectedData(extrudedData)
        // console.log("selected data should be set =>   ", selectedData)
      } else {
        console.log("no data in the new arr")
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }

  // input and state change 
  function handleCheckbox () {
    setSelectedOptions({
       ...selectedOptions,
      nonStop: !selectedOptions.nonStop
    })
  }

  function handleAdultAddition () {
    const totalAdults = selectedOptions.adults + 1
    setSelectedOptions({
      ...selectedOptions,
      adults: totalAdults
    })
  }

  function handleAdultSubtraction () {
    const totalAdults = selectedOptions.adults - 1
    setSelectedOptions({
      ...selectedOptions,
      adults: totalAdults
    })
  }

  const handleDepartDate = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      departureDate: e.target.value
    })
  }

  const handleReturnDate = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      returnDate: e.target.value
    })
  }

  const handleTravelClassChange = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      travelClass: e.target.value
    })
  }

  return(
    <>
    <div className=" dark-banner">
      <h2>Hit the road, Jack!</h2>
    </div>
    <div className="header-bg" style={{height: "auto"}}>
      <div className="p-page pt-30">
      {
      isLoading ? <ExtraInfo />
      : null
      }

      {/* use this for the Extra Info code - maybe create a component for the both of them */}
      {/* {buyBtnIsOpen ? (
            <div className="buy-btn-modal">
              <h2>Ready to go?</h2>
              <p>Your email is the only thing keeping you and your ticket away from each other. Let's go!</p>

              <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder="myEmail@gmail.com" id="email-input"/>
                {submit ? 
                  <input type="submit" disabled/> : 
                  <input type="submit" />
                }
              </form>

              {submit ? 
              <p style={{
                marginTop: "30px",
                fontWeight: "800",
              }}>Your journey just begun!</p>
              : null}

              <span onClick={handleBuy}>X</span>
            </div>
         ): null} */}

     {/* inputs */}
      <div className="options-input-box">
        <form>
          <div className="wokr-already">
            <div className="d-flex-column">
             <p>Non-Stop: </p>
             <input
              type="checkbox"
              onClick={handleCheckbox}
              defaultChecked={selectedOptions.nonStop}
              />
           </div>

            <div className="d-flex-column" > 
              <p>Adults <small>(12+)</small>:</p>
              <div className="d-flex-row" style={{height: "2.8em"}}>
                <button onClick={() => handleAdultSubtraction()}>-</button>
                <input type="number" min="1" value={selectedOptions.adults}/>
                <button onClick={() => handleAdultAddition()}>+</button>
              </div>
            </div>

            <div className="d-flex-column">
              <p>Departure: </p>
              <input
               type="date"
               onClick={(e) => handleDepartDate(e)}
              />
            </div>
            <div className="d-flex-column">
              <p>Return: </p>
              <input
               type="date"
               onClick={(e) => handleReturnDate(e)}
              />
            </div>

            <div className="display-inline-flex" >
            <p>Travel Class: </p>
            <select onChange={(e) => handleTravelClassChange(e)}>
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
            </div>
          </div>
        </form> 
      </div> 



        {
          isLoading ?
            selectedData ? (
              // GIVES BACK ALL OF THE FUNCTION I JUST NEED THE OBJECT -DEAL W THAT 
              selectedData.map((array) => (
                <DisplayFLights
                  departureCode={array.departureCode}
                  departureTerminal={array.departureTerminal}
                  departureTime={array.departureTime}
                  arrivalCode={array.arrivalCode}
                  arrivalTerminal={array.arrivalTerminal}
                  arrivalTime={array.arrivalTime}
                  duration={array.flightDuration}
                  carrierCode={array.carrierCode}
                  aircraftCode={array.aircraftCode}
                  priceCurrency={array.priceCurrency}
                  priceTotal={array.priceTotal}
                  priceBase={array.priceBase}
                  priceFees={array.priceFees}
                  fareOption={array.fareOption}
                  cabin={array.cabin}
                  weightOfIncludedCHeckedBags={array.weightOfIncludedCHeckedBags}
                  key={array.id}
                  />
            ))
          ) : "oops, I think we're lost" // should direct to 404 page
        : <div className="loader"></div> //should be loader
        }
      </div>
  </div>
  </>
  )
}

export default TravelOffers