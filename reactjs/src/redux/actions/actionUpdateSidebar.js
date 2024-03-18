export default function actionUpdateSidebar(sidebarState) {
    const data = {
        sidebarState: sidebarState,
    }
    return {
        type: "UPDATE_SIDEBAR",
        data: data,
    }
}