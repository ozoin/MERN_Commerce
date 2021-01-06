const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false
};

export const validateSignupData = (data) => {
    var RegexpObj = {
        EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        PASSWORD: /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/,
        STRING: /^([^0-9]*)$/,
    }
    const validator = (string,expr) =>  string && String(string).length>0 ? expr.test(String(string)) : false;

    let errors = {};
    if (isEmpty(data.email)){
        errors.email = 'Email must not be empty'
    } else if(!validator(data.email,RegexpObj.EMAIL)){
        errors.email = 'Must be a valid email'
    }
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    //if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
    
    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
};

export const validateLoginData = (data) => {
    let errors = {};

    var RegexpObj = {
        EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        PASSWORD: /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/,
        STRING: /^([^0-9]*)$/
    }
    const validator = (string,expr) =>  string && String(string).length>0 ? expr.test(String(string)) : false;

    
    if (isEmpty(data.email)){
        errors.email = 'Email must not be empty'
    } else if(!validator(data.email,RegexpObj.EMAIL)){
        errors.email = 'Must be a valid email'
    }
    if (isEmpty(data.password)){
        errors.password = 'Password must not be empty'
    }
    
    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
};