import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseURL } from '../App'
import { ToastConent } from '../GameMain/ToastConent'
import LoadingSvg from '../GamePage/extra/LoadingSvg'

export default function LoginPage(props) {
    const {
        socketRef, loaderShow, isAuth } = props
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErorrs] = useState(
        {
            userName: "",
            email: "",
            password: ""
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        let errors = {}
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userName || !email || !password || (!emailPattern.test(email) && email?.length > 0)) {
            if (!userName) {
                errors.userName = "UserName required!"
            }
            if (!email) {
                errors.email = "Email required!"
            }
            if ((!emailPattern.test(email) && email?.length > 0)) {
                errors.email = "Email Invalid!"
            }
            if (!password) {
                errors.password = "Password required!"
            }
            return setErorrs({ ...errors });
        } else {
            socketRef?.current && socketRef?.current?.emit("loginData", {
                userName: userName,
                email: email,
                password: password
            })
            ToastConent("success", "Login Success")
        }
    }

    useEffect(() => {
        if (errors?.email === "Email Invalid!") {
            ToastConent("error", errors?.email)
            setEmail("")
        }
    }, [errors])

    useEffect(() => {
        sessionStorage.removeItem("isAuth")
        sessionStorage.removeItem("loader")
    }, [])

    return (
        <>
            {
                isAuth === false ?
                    <div className='login-page' >
                        <form>
                            <div class="form-structor ">
                                <div class="signup">
                                    <h2 class="form-title" ><span>or</span>Login</h2>
                                    <div class="form-holder">
                                        <input type="text" class={`input ${errors.userName ? "errorShow" : ""}`} placeholder={errors.userName ? errors.userName : "UserName"} name="userName" onChange={(e) => {
                                            setUserName(e.target.value);
                                            if (!e.target.value) {
                                                return setErorrs({
                                                    ...errors,
                                                    userName: `UserName Is Required`,
                                                });
                                            } else {
                                                return setErorrs({
                                                    ...errors,
                                                    userName: "",
                                                });
                                            }
                                        }} />
                                        <input type="email" class={`input ${errors.email ? "errorShow" : ""}`} placeholder={errors.email ? errors.email : "Email"} name="email" onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (!e.target.value) {
                                                return setErorrs({
                                                    ...errors,
                                                    email: `Email Is Required`,
                                                });
                                            } else {
                                                return setErorrs({
                                                    ...errors,
                                                    email: "",
                                                });
                                            }
                                        }} />
                                        <input type="password" class={`input ${errors.password ? "errorShow" : ""}`} placeholder={errors.password ? errors.password : "Password"} name="password" onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (!e.target.value) {
                                                return setErorrs({
                                                    ...errors,
                                                    password: `Password Is Required`,
                                                });
                                            } else {
                                                return setErorrs({
                                                    ...errors,
                                                    password: "",
                                                });
                                            }
                                        }} />
                                    </div>
                                    <button class="submit-btn" type='button' onClick={handleSubmit} >Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    :
                    <LoadingSvg />
            }
        </>
    )
}
