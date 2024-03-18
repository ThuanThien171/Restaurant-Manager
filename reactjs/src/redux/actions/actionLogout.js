function actionLogout() {
    const userInfo = undefined
    const data = {
        status: "LOGOUT",
        userInfo: userInfo,
    }
    return {
        type: "LOGOUT",
        data: data,
    }
}

export default actionLogout;