import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

// Define the props interface for WeatherSearchForm
interface WeatherSearchFormProps {
  onSubmit: (data: { street: string; city: string; state: string }) => void;
}

const WeatherSearchForm: React.FC<WeatherSearchFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<{ city: boolean }>({
    city: false,
  });

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [name]: value });

    if (name === "city" && value.trim() !== "") {
      setErrors({ ...errors, city: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { city } = formData;

    if (city.trim() === "") {
      setErrors({ ...errors, city: true });
    } else {
      setErrors({ ...errors, city: false });
      onSubmit(formData); // Call the onSubmit prop with form data
    }
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow-sm bg-light">
      <h1 className="text-center mb-4">
        Weather Search{" "}
        <span role="img" aria-label="sun">
          ☀️
        </span>
      </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="street" className="mb-3">
          <Form.Label>
            Street<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="street"
            placeholder="Enter street"
            value={formData.street}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="city" className="mb-3">
          <Form.Label>
            City<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleInputChange}
            isInvalid={errors.city} // Highlight as invalid if there’s an error
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid city
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="state" className="mb-3">
          <Form.Label>
            State<span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your state</option>
            <option value="California">California</option>
            <option value="Texas">Texas</option>
            <option value="New York">New York</option>
          </Form.Select>
        </Form.Group>

        <hr />

        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="Autodetect Location"
              name="autodetect"
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="Current Location"
              name="currentLocation"
            />
          </Col>
        </Form.Group>

        <div className="d-flex justify-content-center mb-3">
          <Button type="submit" variant="primary" className="me-2">
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
