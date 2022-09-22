import { useState } from "react";
import axios from "axios";
import Autocomplete from "react-autocomplete";
import { SetAuthToken } from "variables/auth";
import { toast } from "react-toastify";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import { useTranslation } from "react-i18next";

function AddressInputMultiple({
  label,
  address,
  setAddress,
  optional,
  allAddresses,
  setAllAddresses,
}) {
  const { t, i18n } = useTranslation();
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
        lat: res?.data?.features[i].geometry.coordinates[1],
        lng: res?.data?.features[i].geometry.coordinates[0],
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

  const handleAddressAdd = () => {
    if (allAddresses.length > 0) {
      if (allAddresses[allAddresses.length - 1].label === address.label) {
        toast.warning("Cannot add same address again");
      } else {
        if (address.label2) {
          setAllAddresses((prev) => [...prev, address]);
          setAddress({});
          toast.success("Address added");
        } else {
          toast.warning("Please enter a valid address from dropdown!");
        }
      }
    } else {
      if (address.label2) {
        setAllAddresses((prev) => [...prev, address]);
        setAddress({});
        toast.success("Address added");
      } else {
        toast.warning("Please enter a valid address from dropdown!");
      }
    }
  };

  const handleDeleteAddress = (e) => {
    let tempArray = allAddresses;
    let addressIndex = tempArray.map((address) => {
      if (address._id === e.target.value) {
        return address._id;
      }
    });
    tempArray.splice(addressIndex, 1);
    setAllAddresses(tempArray);
  };

  return (
    <>
      <label
        className="form-control-label"
        htmlFor={`input-address-${label.split(" ").join("")}`}
      >
        {t(label)}
      </label>

      {/* Semi automated field for address */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Autocomplete
          getItemValue={(item) => item.label2}
          items={addresses}
          value={address?.label}
          onChange={getAllAddress}
          onSelect={handleAddressSelect}
          // Custom styling
          wrapperStyle={{ display: "block", width: "100%" }}
          renderInput={(props) => {
            return (
              <input
                className="form-control form-control-alternative"
                style={{ paddingRight: "64px" }}
                id={`input-address-${label.split(" ").join("")}`}
                placeholder={t(label)}
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
        <i
          style={{ marginLeft: "-30px" }}
          onClick={handleAddressAdd}
          class="fas fa-plus"
        ></i>
        <UncontrolledDropdown>
          <DropdownToggle
            name
            href="#pablo"
            role="button"
            e-caret-hide
            style={{
              backgroundColor: "#fff",
              borderColor: "white",
              boxShadow: "none",
              margin: "0px",
              padding: "0px",
            }}
          >
            <i
              style={{ marginLeft: "-60px", color: "#46b9b5" }}
              class="fas fa-eye"
            ></i>
          </DropdownToggle>
          <DropdownMenu right={true}>
            {allAddresses.length > 0 ? (
              allAddresses.map((address) => {
                return (
                  <DropdownItem
                    name="address"
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                    onClick={(e) => handleDeleteAddress(e)}
                    value={address._id}
                  >
                    <i class="fas fa-trash-alt"></i>
                    <>{address.label}</>
                  </DropdownItem>
                );
              })
            ) : (
              <DropdownItem name="address" disabled={true}>
                {t("No address added")}
              </DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </>
  );
}

export default AddressInputMultiple;
