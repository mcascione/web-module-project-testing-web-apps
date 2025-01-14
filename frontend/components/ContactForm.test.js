import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render (<ContactForm />);

});

test('renders the contact form header', () => {
    render (<ContactForm />);
    const formHeaderElement = screen.queryByText(/contact form/i);
    expect(formHeaderElement).toBeTruthy();
    expect(formHeaderElement).toBeInTheDocument();
    expect(formHeaderElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render (<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first Name*/i);
    userEvent.type(firstNameInput, '123');

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId('error');
        expect(errorMessages).toHaveLength(3);
    });
    
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
   render (<ContactForm />);
   const firstNameInput = screen.getByLabelText(/first name*/i);
   userEvent.type(firstNameInput, '12345');
   const lastNameInput = screen.getByLabelText(/last name*/i);
   userEvent.type(lastNameInput, '456');
   const submitButton = screen.getByRole('button');
   userEvent.click(submitButton);

   await waitFor(() => {
        const errorMessages = screen.queryAllByTestId('error');
        expect(errorMessages).toHaveLength(1);
   });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render (<ContactForm />);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, '1');
    userEvent.type(emailInput, '1@');
    userEvent.type(emailInput, '1@.');

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();

});

test('renders "lastName is a required field" if a last name is not entered and the submit button is clicked', async () => {
    render (<ContactForm />);
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastname is a required field/i);
    expect(errorMessage).toBeInTheDocument();  
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render (<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, '12345');
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, '678');
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, '123@gmail.com');
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText('12345');
        expect(firstNameDisplay).toBeInTheDocument();
        const lastNameDisplay = screen.queryByText('678');
        expect(lastNameDisplay).toBeInTheDocument();
        const emailDisplay = screen.queryByText('123@gmail.com');
        expect(emailDisplay).toBeInTheDocument();
        const messageDisplay = screen.queryByTestId('messageDisplay');
        expect(messageDisplay).not.toBeInTheDocument();
    });
});


test('renders all fields text when all fields are submitted.', async () => {
    render (<ContactForm />);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    userEvent.type(firstNameInput, 'Miranda');
    userEvent.type(lastNameInput, 'Cascione');
    userEvent.type(emailInput, 'fakeemail@email.com');
    userEvent.type(messageInput, 'Thank you!');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText('Miranda');
        const lastNameDisplay = screen.queryByText('Cascione');
        const emailDisplay = screen.queryByText('fakeemail@email.com') ;
        const messageDisplay = screen.queryByText('Thank you!');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});
