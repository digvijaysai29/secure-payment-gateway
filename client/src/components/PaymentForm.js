// client/src/components/PaymentForm.js
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

const PaymentForm = () => {
    const validationSchema = Yup.object().shape({
        cardNumber: Yup.string()
            .required('Card number is required')
            .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
        expMonth: Yup.string()
            .required('Expiry month is required')
            .matches(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
        expYear: Yup.string()
            .required('Expiry year is required')
            .matches(/^[0-9]{2}$/, 'Invalid year'),
        cvc: Yup.string()
            .required('CVC is required')
            .matches(/^[0-9]{3,4}$/, 'Invalid CVC')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // API call to backend
            const response = await fetch('/api/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        setSubmitting(false);
    };

    return (
        <FormContainer>
            <Formik
                initialValues={{
                    cardNumber: '',
                    expMonth: '',
                    expYear: '',
                    cvc: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <FormGroup>
                            <Label>Card Number</Label>
                            <Field name="cardNumber" type="text" />
                            {errors.cardNumber && touched.cardNumber && (
                                <Error>{errors.cardNumber}</Error>
                            )}
                        </FormGroup>
                        
                        <FormRow>
                            <FormGroup>
                                <Label>Expiry Month</Label>
                                <Field name="expMonth" type="text" />
                                {errors.expMonth && touched.expMonth && (
                                    <Error>{errors.expMonth}</Error>
                                )}
                            </FormGroup>
                            
                            <FormGroup>
                                <Label>Expiry Year</Label>
                                <Field name="expYear" type="text" />
                                {errors.expYear && touched.expYear && (
                                    <Error>{errors.expYear}</Error>
                                )}
                            </FormGroup>
                            
                            <FormGroup>
                                <Label>CVC</Label>
                                <Field name="cvc" type="text" />
                                {errors.cvc && touched.cvc && (
                                    <Error>{errors.cvc}</Error>
                                )}
                            </FormGroup>
                        </FormRow>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Pay Now'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
};

export default PaymentForm;