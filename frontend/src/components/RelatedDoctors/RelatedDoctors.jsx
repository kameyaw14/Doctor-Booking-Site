import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docSpeciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDoc] = useState([]);

  const findRelDocs = () => {
    if (doctors.length > 0 && docSpeciality) {
      const DocData = doctors.filter(
        (doc) => doc.docSpeciality === docSpeciality && doc._id !== docId
      );
      console.log(DocData);
      setRelDoc(DocData);
    }
  };

  useEffect(() => {
    findRelDocs();
  }, [docSpeciality, docId, doctors]);

  return (
    <div>
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
        <h1 className="text-3xl font-medium">Related Doctors</h1>

        {/* Check if there are related doctors */}
        {relDoc.length > 0 ? (
          <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
            {relDoc.slice(0, 5).map((item, index) => (
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
        ) : (
          // Message when no related doctors are found
          <p className="text-gray-600 mt-4">No related doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedDoctors;
