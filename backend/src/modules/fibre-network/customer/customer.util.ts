import * as yup from 'yup';

export const CreateCustomerSchema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  postcode: yup.string().required('Postcode is required'),
  latitude: yup
    .number()
    .typeError('Please type a number')
    .min(-90, 'Please type a number between -90 and 90')
    .max(90, 'Please type a number between -90 and 90')
    .required('Latitude is required'),
  longitude: yup
    .number()
    .typeError('Please type a number')
    .min(-180, 'Please type a number between -180 and 180')
    .max(180, 'Please type a number between -180 and 180')
    .required('Longitude is required'),
  capacity: yup
    .number()
    .typeError('Please type an integer')
    .integer('Please type an integer')
    .min(1, 'Please type a number between 1 and 100')
    .max(100, 'Please type a number between 1 and 100')
    .min(0, 'Capacity should be greater than 0')
    .required('Longitude is required'),
});
