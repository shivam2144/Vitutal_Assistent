import React, { useContext, useRef, useState } from 'react'
import image1 from "../assets/image/image1.png"
import image2 from "../assets/image/image2.jpg"
import image3 from "../assets/image/authBg.png"
import image4 from "../assets/image/image4.png"
import image5 from "../assets/image/image5.png"
import image6 from "../assets/image/image6.jpeg"
import image7 from "../assets/image/image7.jpeg"
import Card from '../components/Card'
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Customize2 from './Customize2'
import { IoArrowBack } from "react-icons/io5";

function Customize() {
  const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage}=useContext(userDataContext);
  const inputImage=useRef(null)
  const handleImage=(e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  const navigate =useNavigate()

  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-black to-[#030353] p-[20px] relative'>
      <IoArrowBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>navigate("/")}/>

      {/* Content wrapper with padding-bottom to prevent overlap */}
      <div className='pb-[100px]'>
        {/* Heading */}
        <h1 className='text-white text-[30px] text-center mb-10'>
          Select your <span className='text-blue-400'>Assistant Image</span>
        </h1>

        {/* Image grid */}
        <div className='w-full max-w-[900px] mx-auto flex justify-center items-center flex-wrap gap-[15px]'>
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={image7} />

          {/* Add image card */}
          <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[300px] bg-[#030326d0] border-2 border-[#343492b9] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}flex items-center justify-center`} onClick={() => inputImage.current.click()
          }>
            {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px]' />}
            {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
            
          </div>
        </div>
        <input type='file' accept='image/*' ref={inputImage} hidden onClick={handleImage}/>
      </div>
       
       {selectedImage &&<div className="w-full flex justify-center absolute bottom-6">
        <button className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] flex items-center justify-center cursor-pointer" onClick={()=>navigate("/customize2")}>
          Next
        </button>
      </div>}
      {/* Bottom Centered Button */}
      

    </div>
  )
}

export default Customize
