import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../contexts/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImage, setdocImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fee, setFee] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Gynecologist");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendURL, aToken } = useContext(AdminContext);

  const OnSubmitHandler = async (event) => {
    event.preventDefault();

    // Set a delay for loading toast (e.g., 500ms)
    let loadingToastId;
    const loadingTimeout = setTimeout(() => {
      loadingToastId = toast.loading("Submitting form...");
    }, 500); // Adjust the delay as desired

    try {
      // Ensure docImage is set
      if (!docImage) {
        clearTimeout(loadingTimeout);
        return toast.error("Please select a doctor image");
      }

      const formData = new FormData();
      formData.append("docImage", docImage);
      formData.append("docName", name);
      formData.append("docEmail", email);
      formData.append("docPassword", password);
      formData.append("docExperience", experience);
      formData.append("docFee", Number(fee));
      formData.append("docAbout", about);
      formData.append("docSpeciality", speciality);
      formData.append("docDegree", degree);
      formData.append(
        "docAddress",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // Make the API call
      const { data } = await axios.post(
        backendURL + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );

      clearTimeout(loadingTimeout); // Clear loading toast delay if request completes

      if (loadingToastId) {
        // Update or dismiss the loading toast based on success or error
        toast.update(loadingToastId, {
          render: data.success ? data.message : "Email already exists",
          type: data.success ? "success" : "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      if (data.success) {
        // Reset form fields if successful
        setdocImage(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFee("");
        setSpeciality("Gynecologist");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      }
    } catch (error) {
      clearTimeout(loadingTimeout); // Clear loading toast delay if request completes with an error
      if (loadingToastId) {
        toast.update(loadingToastId, {
          render: `Error: ${error.message}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.error(`Error: ${error.message}`);
      }
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={OnSubmitHandler} className="m-5 w-full">
        <p className="mb-3 text-lg font-medium">Add Doctor</p>

        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll ">
          <div className="flex items-center gap-4 mb-8 text-gray-500">
            <label htmlFor="doc-img">
              <img
                src={
                  docImage ? URL.createObjectURL(docImage) : assets.upload_area
                }
                alt=""
                className="w-16 bg-gray-100 rounded-full cursor-pointer"
              />
            </label>
            <input
              onChange={(e) => setdocImage(e.target.files[0])}
              type="file"
              id="doc-img"
              hidden
            />
            <p>
              Upload doctor <br /> picture
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor name</p>
                <input
                  type="text"
                  placeholder="name"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Email</p>
                <input
                  type="email"
                  placeholder="email"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor password</p>
                <input
                  type="password"
                  placeholder="password"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Experience</p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="6 Years">6 Years</option>
                  <option value="7 Years">7 Years</option>
                  <option value="8 Years">8 Years</option>
                  <option value="9 Years"> Years</option>
                  <option value="10 Years">10 Years</option>
                  <option value="> 10 Years">&gt; 10 Years</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Fee</p>
                <input
                  type="number"
                  placeholder="Fee"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setFee(e.target.value)}
                  value={fee}
                />
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Speciality</p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSpeciality(e.target.value)}
                  value={speciality}
                >
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastreonterologist">Gastreonterologist</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Education</p>
                <input
                  type="text"
                  placeholder="Education"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setDegree(e.target.value)}
                  value={degree}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Address</p>
                <input
                  type="text"
                  placeholder="Address 1"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setAddress1(e.target.value)}
                  value={address1}
                />
                <input
                  type="text"
                  placeholder="Address 2"
                  required
                  className="border rounded px-2"
                  onChange={(e) => setAddress2(e.target.value)}
                  value={address2}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mt-4 mb-2">About Doctor</p>
            <textarea
              placeholder="Write about the doctor..."
              rows={5}
              className="w-full px-4 pt-2 border rounded"
              onChange={(e) => setAbout(e.target.value)}
              value={about}
            />
          </div>

          <button
            type="submit"
            className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
