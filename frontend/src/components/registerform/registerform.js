import React from 'react';
import { Control, Form } from 'react-redux-form';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { PropTypes } from 'prop-types';

import { SHOWREEL_API } from '../../constants';
import { registerUser } from '../../actions/register';
import { logInUser, fetchJWTToken, saveJWTToken } from '../../actions/login';
import statusHandle from '../../utils/statusHandle';

class RegisterForm extends React.Component {
    getJWTToken(data) {
        this.props.dispatch(fetchJWTToken());

        return fetch(`${SHOWREEL_API + 'authenticate/'}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
        })
        .then(statusHandle)
        .then(response => response.json())
        .then(tokenString => tokenString)
        .catch(error => Promise.reject(error));
    }

    registerUser(data) {
        this.props.dispatch(registerUser());

        return fetch(`${SHOWREEL_API + 'users/'}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                email: data.email,
            }),
        })
        .then(statusHandle)
        .then(response => response.json())
        .catch(error => Promise.reject(error));
    }

    handleSubmit(val) {
        this.registerUser(val)
        .then(() => this.getJWTToken(val))
        .then((token) => {
            this.props.dispatch(saveJWTToken(token));
            this.props.dispatch(logInUser());
        });
    }

    render() {
        return (
            <Form model="userRegister" className="form" onSubmit={(val) => this.handleSubmit(val)}>

                <div className="form-item">
                    <label htmlFor="username">Username</label>
                    <Control.input model=".username" />
                    <div className="desc">Please enter your username</div>
                </div>

                <div className="form-item">
                    <label htmlFor="password">Password</label>
                    <Control.input type="password" model=".password" />
                    <div className="desc">Please enter your password</div>
                </div>

                <div className="form-item">
                    <label htmlFor="email">Email</label>
                    <Control.input type="email" model=".email" />
                    <div className="desc">Please enter your email (required for registration)</div>
                </div>

                <div className="form-item">
                    <button type="submit">Submit</button>
                </div>

            </Form>
        );
    }
}

RegisterForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect()(RegisterForm);
