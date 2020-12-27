
import React, {useState } from 'react'
import Joi from 'joi-browser'
import * as userService from '../services/userService'
import auth from '../services/authService'
import {Redirect} from 'react-router-dom'

const RegisterForm = (props) => {
    const [account, setAccount] = useState({email: '', password:'', username:''});
    const [errors, setErrors] = useState({});

    const joiSchema = { 
        email: Joi.string().required().email().error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "any.empty":
                return { message: "1입력값이 비었습니다." };
                case "any.required":
                return { message: "필요합니다." };
                case "string.email":
                return { message: "email 형식으로 입력해 주세요." };
                default:
                return { message: "default 입니다." };
            }
            }
            )
        }),
        password: Joi.string().required().error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "any.empty":
                return { message: "3입력값이 비었습니다." };
                default:
                return { message: "default 입니다." };
            }
            }
            )
        }),
        username: Joi.string().required().min(5).max(10).error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "string.min":
                return { message: "글자값은 5자 이상으로 입력하세요" };
                case "string.max":
                return { message: "최대글자는 10자 이하로 입려가세요." };
                case "any.empty":
                return { message: "입력값이 비었습니다." };
                default:
                return { message: "default 입니다." };
            }
            }
            )
        })
    }

    const validate = () => {
        const schema = Joi.object().keys( 
            joiSchema
        );
        const result = schema.validate( account , {abortEarly: false} );
        //console.log("result", result);

        if( !result.error ) return null;

        const returnErrors = {}
        for ( let item of result.error.details ) {
            returnErrors[item.path[0]] = item.message;
        }
        return returnErrors;

    }

    const validateProperty = (name, value) => {
        const localSchema = Joi.object( { [name] : joiSchema[name] } );
        const obj = { [name]: value }
        const result = localSchema.validate( obj );
        if( !result.error ) return null;
        return result.error.details[0].message;
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const rErrors = validate();
        setErrors( rErrors || {} )

        if( rErrors ) return ;
        //console.log("handleSubmit", "account", account );
        try{
            const response = await userService.register( account )
            auth.loginWithJWT( response );
            window.location = "/"
        } catch( ex ) {
            const rErrors = {...errors}
            console.log("ex.response", ex.response);
            rErrors.email = ex.response.data;
            setErrors( rErrors );
            console.log("ex.response.data", ex.response.data);
        }
    }

    const handleChange = e => {
        const copied = {...account}
        copied[e.target.name] = e.target.value;
        setAccount( copied )

        const errorMessage = validateProperty(e.target.name, e.target.value);
        if( errorMessage ) {
            const cError = {...errors};
            cError[e.target.name] = errorMessage;
            setErrors( cError );
        } else {
            const cError = {...errors};
            delete cError[e.target.name];
            setErrors( cError );
        }
    }
    if( auth.getCurrentUser() ) return <Redirect to="/" />
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" id="email" name="email" value={account.email} onChange={handleChange} />
                    { errors.email && <div className="alert alert-danger">{errors.email}</div>}
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={account.password} onChange={handleChange} />
                    { errors.password && <div className="alert alert-danger">{errors.password}</div>}
                </div>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={account.username} onChange={handleChange} />
                    { errors.username && <div className="alert alert-danger">{errors.username}</div>}
                </div>
                <button className="btn btn-primary btn-block" 
                    disabled={validate()}>
                        제출</button>
            </form>
        </div>
    )
}

export default RegisterForm
