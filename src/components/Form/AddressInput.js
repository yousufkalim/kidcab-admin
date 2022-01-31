import { useState } from "react";
import axios from "axios";
import Autocomplete from "react-autocomplete";
import { SetAuthToken } from "variables/auth";

function AddressInput({ label, address, setAddress }) {
  let [addresses, setAddresses] = useState([]);

  // Get All Address in drop down List from API
  const getAllAddress = async (e) => {
    setAddress({ ...address, label: e.target.value });

    delete axios.defaults.headers.common["Authorization"];

    let res = await axios.get(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=housenumber&autocomplete=1"
    );

    if (localStorage.Authorization) {
      SetAuthToken(localStorage.Authorization);
    }

    var addressToSet = []; // //debugger;
    for (var i = 0; i < res?.data?.features?.length; i++) {
      addressToSet.push({
        id: i,
        label: res?.data?.features[i].properties.label,
        label2: `${
          res?.data?.features[i].properties.label +
          "," +
          res?.data?.features[i].properties.context
        }`,
        city: res?.data?.features[i].properties.city,
        PostalCode: res?.data?.features[i].properties.postcode,
        lat: res?.data?.features[0].geometry.coordinates[1],
        lng: res?.data?.features[0].geometry.coordinates[0],
      });
    }
    if (addressToSet.length === res?.data?.features.length) {
      setAddresses(addressToSet);
    }
  };

  // Set Address in  setAddressValue State
  const handleAddressSelect = async (item) => {
    if (item) {
      for (var i = 0; i < addresses.length; i++) {
        if (addresses[i].label2 === item) {
          console.log("Address found ---> ", addresses[i]);
          var postal_code = addresses[i].PostalCode;
          var lat = addresses[i].lat;
          var lng = addresses[i].lng;
          const city = addresses[i].city;
          setAddress({
            ...address,
            label: addresses[i].label,
            label2: addresses[i].label2,
            postal_code,
            lat,
            lng,
            city,
          });
        }
      }
    } else {
      setAddress({
        ...address,
        address: "",
        zip_code: "",
        lat: "",
        long: "",
        city: "",
      });
    }
  };

  return (
    <>
      <label
        className="form-control-label"
        htmlFor={`input-address-${label.split(" ").join("")}`}
      >
        <span style={{ color: "red" }}>{address?.label ? "" : "*"}</span>{" "}
        {label}
      </label>

      {/* Semi automated field for address */}
      <Autocomplete
        getItemValue={(item) => item.label2}
        items={addresses}
        value={address?.label}
        onChange={getAllAddress}
        onSelect={handleAddressSelect}
        // Custom styling
        wrapperStyle={{ display: "block" }}
        renderInput={(props) => {
          return (
            <input
              className="form-control form-control-alternative"
              id={`input-address-${label.split(" ").join("")}`}
              placeholder={label}
              {...props}
            />
          );
        }}
        renderMenu={function (items, value, style) {
          return (
            <div
              style={{
                ...style,
                ...this.menuStyle,
                zIndex: 1,
                marginTop: "5px",
              }}
              children={items}
            />
          );
        }}
        renderItem={(item, isHighlighted) => (
          <div
            style={{
              background: isHighlighted ? "lightgray" : "white",
              padding: "10px",
            }}
          >
            {item.label}
          </div>
        )}
      />
    </>
  );
}

export default AddressInput;
