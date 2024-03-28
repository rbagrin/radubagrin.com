import React, { useState } from "react";
import { Box, Button, Drawer, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import {
  CreateCustomerType,
  CustomerRegistrationResponseType,
} from "../types/fibre-network.types";
import { CustomerAPI } from "../api/customer.api";

interface DrawerProps {
  readonly refresh: () => Promise<void>;
}

export const NewCustomerDrawer = ({ refresh }: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState<
    CustomerRegistrationResponseType | undefined
  >(undefined);
  const [error, setError] = useState<unknown | null>(null);

  const formik = useFormik<CreateCustomerType>({
    initialValues: {
      name: "",
      address: "",
      postcode: "",
      latitude: 0,
      longitude: 0,
      capacity: 0,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      address: yup.string().required("Address is required"),
      postcode: yup.string().required("Postcode is required"),
      latitude: yup
        .number()
        .typeError("Please type a number")
        .min(-90, "Please type a number between -90 and 90")
        .max(90, "Please type a number between -90 and 90")
        .required("Latitude is required"),
      longitude: yup
        .number()
        .typeError("Please type a number")
        .min(-180, "Please type a number between -180 and 180")
        .max(180, "Please type a number between -180 and 180")
        .required("Longitude is required"),
      capacity: yup
        .number()
        .typeError("Please type an integer")
        .integer("Please type an integer")
        .min(1, "Please type a number between 1 and 100")
        .max(100, "Please type a number between 1 and 100")
        .min(0, "Capacity should be greater than 0")
        .required("Longitude is required"),
    }),
    onSubmit: async (values: CreateCustomerType) => {
      try {
        const response = await CustomerAPI.createCustomer({
          name: values.name,
          address: values.address,
          postcode: values.postcode,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          capacity: Number(values.capacity),
        });
        setResponse(response);
        await refresh();
      } catch (error) {
        console.error(error);
        setError(error);
        setResponse(undefined);
      }
    },
  });

  return (
    <Box>
      <Drawer
        anchor={"right"}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setTimeout(() => {
            formik.resetForm();
            setError(null);
            setResponse(undefined);
          }, 300);
        }}
      >
        <Box sx={{ width: "600px", p: 4 }}>
          <Typography variant="h1" sx={{ fontSize: 32, mb: 4 }}>
            Register new customer
          </Typography>

          {!error && !response ? (
            <FormikProvider value={formik}>
              <Form onSubmit={formik.handleSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <TextField
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={(e) => {
                      formik.setFieldValue("name", e.target.value);
                    }}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    sx={{ mt: 4 }}
                  />

                  <TextField
                    label="Address"
                    name="address"
                    value={formik.values.address}
                    onChange={(e) => {
                      formik.setFieldValue("address", e.target.value);
                    }}
                    fullWidth
                    helperText={formik.touched.address && formik.errors.address}
                    error={Boolean(
                      formik.touched.address && formik.errors.address
                    )}
                  />

                  <TextField
                    label="Postcode"
                    name="postcode"
                    value={formik.values.postcode}
                    onChange={(e) => {
                      formik.setFieldValue("postcode", e.target.value);
                    }}
                    fullWidth
                    helperText={
                      formik.touched.postcode && formik.errors.postcode
                    }
                    error={Boolean(
                      formik.touched.postcode && formik.errors.postcode
                    )}
                  />

                  <TextField
                    label="Latitude"
                    name="latitude"
                    value={formik.values.latitude}
                    onChange={(e) => {
                      formik.setFieldValue("latitude", e.target.value);
                    }}
                    fullWidth
                    helperText={
                      formik.touched.latitude && formik.errors.latitude
                    }
                    error={Boolean(
                      formik.touched.latitude && formik.errors.latitude
                    )}
                  />

                  <TextField
                    label="Longitude"
                    name="longitude"
                    value={formik.values.longitude}
                    onChange={(e) => {
                      formik.setFieldValue("longitude", e.target.value);
                    }}
                    fullWidth
                    helperText={
                      formik.touched.longitude && formik.errors.longitude
                    }
                    error={Boolean(
                      formik.touched.longitude && formik.errors.longitude
                    )}
                  />

                  <TextField
                    label="Capacity"
                    name="capacity"
                    value={formik.values.capacity}
                    onChange={(e) => {
                      formik.setFieldValue("capacity", e.target.value);
                    }}
                    fullWidth
                    helperText={
                      formik.touched.capacity && formik.errors.capacity
                    }
                    error={Boolean(
                      formik.touched.capacity && formik.errors.capacity
                    )}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 4 }}
                  >
                    Register
                  </Button>
                </Box>
              </Form>
            </FormikProvider>
          ) : !error && response ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box>
                <Typography variant="caption" color="grey">
                  Response
                </Typography>
                <Typography>
                  {response.success
                    ? `Success. ${response.customerMessage}`
                    : `Unfortunately the customer could not be registered. ${response.customerMessage}`}
                </Typography>
              </Box>

              {response.customerId && (
                <Box>
                  <Typography variant="caption" color="grey">
                    Customer ID
                  </Typography>
                  <Typography>{response.customerId}</Typography>{" "}
                </Box>
              )}

              {response.chamberId && (
                <Box>
                  <Typography variant="caption" color="grey">
                    Chamber ID
                  </Typography>
                  <Typography>{response.chamberId}</Typography>
                </Box>
              )}

              {response.chamberId && response.leftCapacity !== null && (
                <Box>
                  <Typography variant="caption" color="grey">
                    Left capacity in chamber
                  </Typography>
                  <Typography>{response.leftCapacity}</Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="grey">
                  Chamber message
                </Typography>
                <Typography>{response.chamberMessage}</Typography>
              </Box>

              {response.chamberId && (
                <Box>
                  <Typography variant="caption" color="grey">
                    Is closest chamber
                  </Typography>
                  <Typography>{response.isClosest ? "Yes" : "No"}</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="subtitle1" color="darkred">
                Something went wrong!
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setError(null);
                  setResponse(undefined);
                }}
              >
                Try again
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add customer
      </Button>
    </Box>
  );
};
