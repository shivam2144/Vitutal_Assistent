import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios  from "axios";
function Customize2() {
  const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
  const [assistantName,setAssistantName]=useState(userData?.assistantName || "")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const handleUpdateAssistant = async()=>{
    setLoading(true)
    try{
    let formData = new FormData()
    formData.append("assistantName",assistantName)
    if(backendImage){
      formData.append("assistantImage",backendImage)
    }else{
      formData.append("imageUrl",selectedImage)
    }
    const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
    setUserData(result.data)
    setLoading(false)
    console.log(result.data)
    navigate("/")
  }catch(error){
    setLoading(false)
  console.log(error)
  }
  }

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-[#030353] p-[20px] relative">
      <IoArrowBack className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" onClick={()=>navigate("/customize")}/>
      <h1 className="text-white text-[30px] text-center mb-10">
        Enter your <span className="text-blue-400">Assistant Name</span>
      </h1>

      <div className="w-full flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="eg.shifra"
          className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required onChange={(e)=>{
           setAssistantName(e.target.value)
          }} value={assistantName} 
        />
        {assistantName && <button className="flex justify-center items-center min-w-[300px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer" disabled={loading} onClick={()=>{
        
         handleUpdateAssistant()
        }}>
        {!loading ?"Finally Create your Assistant":"Loading...."}  
        </button>}


        
      </div>
    </div>
  );
}

export default Customize2;
