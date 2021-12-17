import { useState, useEffect } from 'react'
import ImageCard from './ImageCard'
import { useDispatch } from 'react-redux'
import {  addPhotos } from './actions'
import { counter } from './reducers/counter'

function PexelsPhotos ( {query} ) {
  const [pexelsPhotos, setPexelsPhotos] = useState([])
  // const hold = useSelector( state => state.hold )
  // const add = useSelector( state => state.add )
  const dispatch = useDispatch()

  useEffect(() => {
    fetchPexelsData() 
    console.log(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  async function fetchPexelsData () {
    try {
      const response = await fetch("https://api.pexels.com/v1/search?query=" + query + "&per_page=30", {
        // &size=large
        "method":"GET",
        "headers": {          
        "Authorization": "563492ad6f91700001000001d99276bcb4d4402fbf7f8f502c81c2ba"}
      })
      const {photos} = await response.json()
      if (photos) {
        dispatch(addPhotos(photos))
        dispatch(counter())
      } else {
        console.log("no - photos")
      }
      // setPexelsPhotos(photos)
      // console.log(pexelsPhotos)

      // push these results up to Homepage array or push these to an array and then use it in homepage
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
        <div className="image-display"> 
          <ul style={{
            paddingBottom: query.length > 4 ? "39px" : "none"
            }}>
              { 
                pexelsPhotos && pexelsPhotos.map((data, boop = data.id) => (
                  <ImageCard
                    src={data.src.medium}
                    key={boop}
                    query={query}
                  />
                ))
              }
            <li></li> {/* do not remove, neccesary for layout */}
          </ul>
        </div>
    </>
  )
}

export default PexelsPhotos