import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, GetDoctorsData, backendURL, token } =
    useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [disable, setDisable] = useState(false);

  const fetchDocInfo = async () => {
    const newDocInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(newDocInfo);
  };

  const BookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!symptoms) {
      toast.warn("Please state what is wrong with you");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        { docId, symptoms },
        { headers: { token } }
      );

      if (data.success) {
        setDisable(true);
        toast("Wait for doctor to set a time and date for an appointment", {
          autoClose: false,
        });
        toast.success(data.message);
        GetDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  return (
    docInfo && (
      <div className="p-6 space-y-10">
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Doctor Image */}
          <div className="w-full sm:w-1/3">
            <img
              className="w-full h-auto rounded-lg shadow-lg"
              src={docInfo.docImage}
              alt={`${docInfo.name}`}
            />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {docInfo.name}
              <img className="w-5" src={Assets.verified_icon} alt="Verified" />
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {docInfo.docDegree} - {docInfo.docSpeciality}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <span className="px-2 py-0.5 border rounded-full">
                {docInfo.docExperience}
              </span>{" "}
              experience
            </p>

            {/* About Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                About the Doctor
              </h3>
              <p className="text-gray-700 mt-2">{docInfo.docAbout}</p>
            </div>

            {/* Fee */}
            <p className="mt-4 text-gray-700">
              <span className="font-medium">Appointment Fee:</span>{" "}
              {currencySymbol}
              {docInfo.docFee}
            </p>
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Tell us about your symptoms
          </h3>
          <textarea
            className="w-full mt-4 p-4 border rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={6}
            placeholder="Describe your symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
        </div>

        {/* Book Appointment Button */}
        <div className="flex justify-end">
          <button
            onClick={BookAppointment}
            disabled={disable}
            className={`px-8 py-3 rounded-lg text-white ${
              disable
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {disable ? "Request Sent" : "Send to Doctor"}
          </button>
        </div>

        {/* Related Doctors Section */}
        <RelatedDoctors docId={docId} docSpeciality={docInfo.docSpeciality} />
      </div>
    )
  );
};

export default Appointments;
