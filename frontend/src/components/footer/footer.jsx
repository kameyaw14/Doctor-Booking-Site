import React from "react";
import { Assets } from "../../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate();

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div className="left ">
          <img className="mb-5 w-40" src={Assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="center">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col  gap-2 text-gray-600">
            <li onClick={()=>{navigate('/');scrollTo(0,0)}} className="hover:text-black cursor-pointer">Home</li>
            <li onClick={()=>{navigate('/about');scrollTo(0,0)}} className="hover:text-black cursor-pointer">About us</li>
            <li onClick={()=>{navigate('/contact');scrollTo(0,0)}} className="hover:text-black cursor-pointer">Contact us</li>
            <li onClick={()=>{navigate('/privacy-policy');scrollTo(0,0)}} className="hover:text-black cursor-pointer">Privacy policy</li>
          </ul>
        </div>
        <div className="right">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col  gap-2 text-gray-600">
            <li>0244799456</li>
            <li>kameyaw14@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright © 2024 GreatStack - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
