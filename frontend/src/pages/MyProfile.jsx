import React, { useContext, useState } from "react";
import { Assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, loadUserProfileData, token, backendURL } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  // const [initialData, setInitialData] = useState(userData);

  const UpdateUserProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("userName", userData.userName);
      formData.append("userPhone", userData.userPhone);
      formData.append("userAddress", JSON.stringify(userData.userAddress));
      formData.append("userGender", userData.userGender);
      formData.append("userDoB", userData.userDoB);

      if (image) {
        formData.append("userImage", image);
      }

      const loadingToastId = toast.loading("Updating profile...");

      const { data } = await axios.post(
        backendURL + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      toast.dismiss(loadingToastId);

      if (data.success) {
        console.log("Current userAddress:", userData.userAddress);

        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error("Connection lost");
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    // setUserData(initialData);
    setIsEdit(false);
    setImage(false);
  };

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                src={image ? URL.createObjectURL(image) : userData.userImage}
                alt=""
                className="w-36 rounded opacity-75"
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : Assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.userImage} alt="" />
        )}

        {isEdit ? (
          <input
            className="border bg-gray-50 text-2xl font-medium max-w-60 mt-4"
            type="text"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, userName: e.target.value }))
            }
            value={userData.userName}
          />
        ) : (
          <p className="text-3xl font-medium max-w-60 mt-4 text-neutral-800">
            {userData.userName}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.userEmail}</p>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    userPhone: e.target.value,
                  }))
                }
                value={userData.userPhone}
              />
            ) : (
              <p className="text-blue-400">{userData.userPhone}</p>
            )}
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div>
                <input
                  className="bg-gray-50"
                  type="text"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        line1: e.target.value,
                      },
                    }))
                  }
                  value={userData.userAddress.line1}
                />
                <br />
                <input
                  className="bg-gray-50"
                  type="text"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        line2: e.target.value,
                      },
                    }))
                  }
                  value={userData.userAddress.line2}
                />
              </div>
            ) : (
              <p className="text-gray-500">
                {userData.userAddress.line1}
                <br />
                {userData.userAddress.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    userGender: e.target.value,
                  }))
                }
                value={userData.userGender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.userGender}</p>
            )}
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, userDoB: e.target.value }))
                }
                value={userData.userDoB}
              />
            ) : (
              <p className="text-gray-400">
                {new Date(userData.userDoB).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="font-medium mt-10">
            {isEdit ? (
              <>
                <button
                  className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-75"
                  onClick={UpdateUserProfile}
                >
                  Save information
                </button>
                <button
                  className="border border-red-500 px-8 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-75"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-75"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
