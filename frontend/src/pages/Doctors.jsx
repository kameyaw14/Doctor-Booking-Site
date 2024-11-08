import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { docSpeciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const handleFilterButton = () => {
    setShowFilter((prev) => !prev);
  };

  const applyFilter = () => {
    if (docSpeciality) {
      setFilterDoc(
        doctors.filter((doc) => doc.docSpeciality === docSpeciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, docSpeciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={handleFilterButton}
        >
          Filters
        </button>

        {/* Show filter options only on small screens when showFilter is true */}
        {showFilter && (
          <div
            className={`flex flex-col gap-4 text-sm text-gray-600 sm:hidden`}
          >
            {[
              "Gynecologist",
              "General Physician",
              "Dermatologist",
              "Pediatricians",
              "Neurologist",
              "Gastreonterologist",
            ].map((spec) => (
              <p
                key={spec}
                onClick={() => {
                  const path =
                    spec === docSpeciality ? "/doctors" : `/doctors/${spec}`;
                  navigate(path);
                }}
                className={`w-[94vw] sm:w-auto pl-3 py-1.5 border border-gray-300 rounded transition-all cursor-pointer ${
                  docSpeciality === spec ? "bg-indigo-100 text-black" : ""
                }`}
              >
                {spec}
              </p>
            ))}
          </div>
        )}

        {/* Existing filters for larger screens */}
        <div className={`hidden sm:flex flex-col gap-4 text-sm text-gray-600`}>
          {[
            "Gynecologist",
            "General Physician",
            "Dermatologist",
            "Pediatricians",
            "Neurologist",
            "Gastreonterologist",
          ].map((spec) => (
            <p
              key={spec}
              onClick={() => {
                const path =
                  spec === docSpeciality ? "/doctors" : `/doctors/${spec}`;
                navigate(path);
              }}
              className={`w-auto pl-3 py-1.5 border border-gray-300 rounded transition-all cursor-pointer ${
                docSpeciality === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              onClick={() => {
                navigate(`/appointments/${item._id}`);
                scrollTo(0, 0);
              }}
            >
              <img src={item.docImage} alt="" className="bg-blue-50" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 bg-green-500 rounded-full h-2"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">
                  {item.docName}
                </p>
                <p className="text-gray-600 text-sm">{item.docSpeciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
