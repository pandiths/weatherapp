import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";

interface WeatherSearchFormProps {
  onSubmit: (data: {
    street: string;
    city: string;
    state: string;
    latitude?: string;
    longitude?: string;
  }) => void;
  onLocationFetch: (lat: string, long: string) => void;
}

const WeatherSearchForm: React.FC<WeatherSearchFormProps> = ({
  onSubmit,
  onLocationFetch,
}) => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<{
    city: boolean;
    street: boolean;
    state: boolean;
  }>({
    city: false,
    street: false,
    state: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [currentLocationEnabled, setCurrentLocationEnabled] = useState(false);

  useEffect(() => {
    const isValid =
      (formData.street.trim() !== "" &&
        formData.city.trim() !== "" &&
        formData.state.trim() !== "") ||
      currentLocationEnabled;
    setIsFormValid(isValid);
  }, [formData, currentLocationEnabled]);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [name]: value });

    if (name === "city" && value.trim() !== "")
      setErrors({ ...errors, city: false });
    if (name === "street" && value.trim() !== "")
      setErrors({ ...errors, street: false });
    if (name === "state" && value.trim() !== "")
      setErrors({ ...errors, state: false });
  };

  const fetchCurrentLocation = async () => {
    try {
      const response = await fetch(
        "https://ipinfo.io/json?token=ae70d9d9bf4133"
      );
      const data = await response.json();
      const [latitude, longitude] = data.loc.split(",");
      onLocationFetch(latitude, longitude);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleCheckboxChange = () => {
    setCurrentLocationEnabled((prev) => {
      const newValue = !prev;

      if (newValue) {
        // Clear form data and errors when checkbox is checked for autodetect
        setFormData({ street: "", city: "", state: "" });
        setErrors({ city: false, street: false, state: false });
        fetchCurrentLocation();
      } else {
        // Reset location if unchecked
        onLocationFetch("", "");
      }

      return newValue;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { city, street, state } = formData;

    const newErrors = { city: false, street: false, state: false };

    if (!currentLocationEnabled) {
      if (street.trim() === "") newErrors.street = true;
      if (city.trim() === "") newErrors.city = true;
      if (state.trim() === "") newErrors.state = true;

      if (newErrors.city || newErrors.street || newErrors.state) {
        setErrors(newErrors);
        return;
      }

      setErrors({ city: false, street: false, state: false });

      const wholeAddress = `${street}, ${city}, ${state}`;
      try {
        const apiKey = "AIzaSyDrnXf1KrA97FbpOdEqpqDE9yTL2rjjoiA";
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          wholeAddress
        )}&key=${apiKey}`;

        const response = await fetch(geocodingUrl);
        const geocodeData = await response.json();

        if (geocodeData.status === "OK") {
          const location = geocodeData.results[0].geometry.location;
          const latitude = location.lat.toString();
          const longitude = location.lng.toString();

          onSubmit({ ...formData, latitude, longitude });
        } else {
          console.error("Geocoding error:", geocodeData.status);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    } else {
      onSubmit({ latitude: "", longitude: "", street, city, state });
    }
  };

  const handleReset = () => {
    setFormData({ street: "", city: "", state: "" });
    setErrors({ city: false, street: false, state: false });
    setCurrentLocationEnabled(false);
    onLocationFetch("", "");
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow-sm bg-light">
      <h1 className="text-center mb-4">
        Weather Search{" "}
        <span role="img" aria-label="sun">
          ☀️
        </span>
      </h1>

      <Form onSubmit={handleSubmit} onReset={handleReset}>
        <Form.Group
          controlId="street"
          className="d-flex flex-row justify-content-center align-items-center"
        >
          <Form.Label>
            Street<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            className="mx-2 w-50"
            name="street"
            placeholder="Enter street"
            value={formData.street}
            onChange={handleInputChange}
            disabled={currentLocationEnabled}
            required={!currentLocationEnabled}
          />
        </Form.Group>

        <Form.Group
          controlId="city"
          className="d-flex flex-row justify-content-center align-items-center"
        >
          <Form.Label>
            City<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            className="mx-2 w-50"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleInputChange}
            isInvalid={errors.city}
            disabled={currentLocationEnabled}
            required={!currentLocationEnabled}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid city
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          controlId="state"
          className="d-flex flex-row justify-content-center align-items-center"
        >
          <Form.Label>
            State<span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="mx-2 w-50"
            disabled={currentLocationEnabled}
            required={!currentLocationEnabled}
          >
            <option value="">Select your state</option>
            <option value="California">California</option>
            <option value="Texas">Texas</option>
            <option value="New York">New York</option>
          </Form.Select>
        </Form.Group>

        <hr />

        <Form.Group className="d-flex flex-row justify-content-center align-items-center">
          <p>Autodetect Location</p>
          <Form.Check
            type="checkbox"
            name="currentLocation"
            className="mx-2 mt-0"
            checked={currentLocationEnabled}
            onChange={handleCheckboxChange}
          />
          <p>Current Location</p>
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button
            type="submit"
            variant="primary"
            className="me-2"
            disabled={!isFormValid}
          >
            Search
          </Button>
          <Button type="reset" variant="secondary">
            Clear
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default WeatherSearchForm;
