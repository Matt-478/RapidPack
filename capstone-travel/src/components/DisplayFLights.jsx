import { useState, useRef } from 'react'
import './Styles/Collapsible.css'

const DisplayFLights = ({ id, departureCode, departureTerminal, departureTime, arrivalCode, arrivalTerminal, arrivalTime, carrierCode, aircraftCode, priceCurrency, priceTotal, priceBase, priceFees, fareOption, cabin, weightOfIncludedCHeckedBags}) => {
  const[isOpen, setIsOpen] = useState(false)
  const parentRef = useRef()

  return (
    <>
    {/* all the info is passed as a prop
    styling will be in this component, but
    the actual info should be in the parent component */}
    <div className="collapsible">
      <button
       className="toggle" 
       onClick={() => setIsOpen(!isOpen)}
       style={ isOpen ?{
        borderRadius: "30px 30px 0 0",
       } : {
        borderRadius: "30px 30px 30px 30px",
        padding: "10px 20px"
       }}>

        <div className="flex-align-center">
          <h2>FROM: {departureCode}</h2>
          <h2>TO: {arrivalCode}</h2>
          <h2>PRICE: {priceTotal}</h2> 
        </div>
      </button>
      <div 
        className="content-parent" 
        ref={parentRef} 
        style={ isOpen ? {
          height: parentRef.current.scrollHeight + "px" ,
          borderRadius: "0 0 30px 30px",
        } : {
          height: "0px",
          // borderRadius: "0 0 30px 30px"
        }}

        
        >

        <div className="content">
          {/* {props.children} */}
          <div>from: {departureCode}</div>
          <div>terminal: {departureTerminal}</div>
          <div>leaving at: {departureTime}</div>
          <div>to: {arrivalCode}</div>
          <div>terminal: {arrivalTerminal}</div>          
          <div>arriving at: {arrivalTime}</div>          
          <div>carrierCode: {carrierCode}</div>
          <div>aircraftCode: {aircraftCode}</div>
          <div>priceCurrency: {priceCurrency}</div>
          <div>priceTotal: {priceTotal}</div>
          <div>priceBase: {priceBase}</div>
          <div>priceFees: {priceFees}</div>
          <div>fareOption: {fareOption}</div>
          <div>cabin: {cabin}</div>
          <div>weightInfo: {weightOfIncludedCHeckedBags}</div> 
        </div>
      </div>
    </div>
    </>
  )
}

export default DisplayFLights