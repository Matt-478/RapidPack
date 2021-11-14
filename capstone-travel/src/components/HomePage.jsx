import PexelsPhotos from './PexelsPhotos'
import PexelsVideos from './PexelsVideos';
import SnapMap from './SnapMap'

import { useState, useEffect } from 'react';

const HomePage = () => {


  // initial input value
  const[query, setQuery] = useState("")

  // value we use for fetches
  const[realState, setRealState] = useState("")

  // storing wikipedia fetch results
  const[cityInfo, setCityInfo] = useState([])

  
  useEffect(() => {
    // fetchWikipediaCitySummary(realState)
  },[realState])

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRealState(query)
  }

  function toTitleCase (str) {
    let text = str
    text = text.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
    return text
  }

  return (
    <>
    <div className="left-area-top">

    {/* insert search bar */}
    <div className="wrapper" >
    <form onSubmit={handleSubmit}>
      <div className="searchBar" >
        <input id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Search" value={query} onChange={handleChange}/>
        <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
          <svg  viewBox="0 0 24 24">
          <path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </button>
      </div>
      </form>
    </div>

    {/* area name */}
    <h1>{query && toTitleCase(query)}</h1>

    <div className="d-flex-space">
      <div className="left-side">

        {/* brief description */}
        <p>
          {cityInfo.extract}
        </p>

      </div>
      <div className="right-side">
        {/* map based on location */}
        {/* <SnapMap /> */}
      </div>
    </div>

    </div>

    {/* photos here (based on the search bar query) */}
    {/* <UnsplashPhotos /> */}
    {/* <PexelsPhotos query={realState}/> */}

    {/* videos based on location */}
    {/* <PexelsVideos query={realState}/> */}

    <div className="d-flex align-center space-between">
      <h3 className="d-inline">Interested? What are you waiting for?</h3>
      {/* book a trip */}
      <button className="pill-btn book-a-trip-btn">Book a trip now!</button>
    </div>
  </>
  )
}

export default HomePage





  // async function fetchWikipediaCitySummary(query) {
  //   const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + query + "?redirect=false")
  //   const data = await response.json()
  //   setCityInfo(data)
  //   console.log(cityInfo)

  //   // checking if the city typed is the same as in the query
  //   console.log(query)
  // }