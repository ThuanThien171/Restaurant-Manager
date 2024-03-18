function actionLogin(userInfo) {
    const data = {
        userInfo: userInfo,
        status: "LOGIN",
    }
    return {
        type: "LOGIN",
        data: data,
    }
}

export default actionLogin;