
import React, {useState } from 'react'
import auth  from '../services/authService'
import {Redirect} from 'react-router-dom'

const LoginForm = (props) => {
    const [account, setAccount] = useState({username:'', password:''});
    const [errors, setErrors] = useState({});

    const validateProperty = (name, value) => {
        if( name === "username" ) {
            if( value.trim() === "") return "username 이 비었어요";
        }
        if( name === "password" ) {
            if( value.trim() === "") return "password is empty";
        }
        return null;
    }

    const validate = () => {
        const rErrors = {};
        for( const name of ['username', 'password']) {
            const errorMessage = validateProperty(name, account[name]);
            if( errorMessage ) rErrors[name] = errorMessage;
        }
        return Object.keys( rErrors ).length === 0 ? null : rErrors;
    }
    const handleSubmit = async  e => {
        e.preventDefault();

        const rErrors = validate();
        setErrors( rErrors || {} )

        if( rErrors ) return ;
        try{
            await auth.login( account );
            const {state} = props.location;
            window.location = state? state.from.pathname: "/";
        } catch( ex ) {
            if( ex.response && ex.response.status === 400 ) {
                const rErrors = {...errors};
                rErrors.username = ex.response.data;
                setErrors( rErrors );

            }
        }
        console.log("handleSubmit");
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
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={account.username} onChange={handleChange} />
                    { errors.username && <div className="alert alert-danger">{errors.username}</div>}
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="text" className="form-control" id="password" name="password" value={account.password} onChange={handleChange} />
                    { errors.password && <div className="alert alert-danger">{errors.password}</div>}
                </div>
                <button className="btn btn-primary btn-block">제출</button>
            </form>
        </div>
    )
}

export default LoginForm
