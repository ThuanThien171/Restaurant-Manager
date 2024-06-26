// Chakra imports
import { ChakraProvider, Portal, useDisclosure } from "@chakra-ui/react";
import Configurator from "components/Configurator/Configurator";
import Footer from "components/Footer/Footer.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin";
// Layout components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes.js";
// Custom Chakra theme
import theme from "theme/theme.js";
// Custom components
import MainPanel from "../components/Layout/MainPanel";
import PanelContainer from "../components/Layout/PanelContainer";
import PanelContent from "../components/Layout/PanelContent";
import History from "views/Pages/History";
import Kitchen from "views/Pages/Kitchen";
import Table from "views/Pages/Table";
import Menu from "views/Pages/Menu";
//Admin components
import AddMenu from "views/RTL/Admin/AddNew/AddMenu";

import MenuDetail from "views/RTL/Admin/Update/MenuDetail";
import AreaDetail from "views/RTL/Admin/Update/AreaDetail";
import MaterialDetail from "views/RTL/Admin/Update/MaterialDetail";

import MenuManage from "views/RTL/Admin/Manage/MenuManage";
import SuperAdmin from "views/RTL/SuperAdmin/S_Admin.js";
import AreaManage from "views/RTL/Admin/Manage/AreaManage.js";
import BusinessChart from "views/RTL/Admin/Manage/ChartPage.js";
import Order from "views/Pages/Order";
import OrderHistory from "views/Pages/OrderHistory";
import StorageManage from "views/RTL/Admin/Manage/StorageManage";

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [sidebarVariant, setSidebarVariant] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  // ref for main panel div
  const mainPanel = React.createRef();
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/remat/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "ReMaT";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].views);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar;
          }
        }
      }
    }

    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.category === "account") {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/remat") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  document.documentElement.dir = "ltr";
  // Chakra Color Mode
  return (
    <ChakraProvider theme={theme} resetCss={false}>
      <Sidebar
        routes={routes}
        logoText={"ReMaT"}
        display="none"
        sidebarVariant={sidebarVariant}
        {...rest}
      />
      <MainPanel
        ref={mainPanel}
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
      >
        <Portal>
          <AdminNavbar
            onOpen={onOpen}
            logoText={"ReMaT"}
            brandText={getActiveRoute(routes)}
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            {...rest}
          />
        </Portal>
        {getRoute() ? (
          <PanelContent>
            <PanelContainer>
              <Switch>
                {getRoutes(routes)}
                <Route path={`/remat/history`} component={History} />
                <Route path={`/remat/kitchen`} component={Kitchen} />
                <Route path={`/remat/table`} component={Table} />
                <Route path={`/remat/order/:tableID`} component={Order} />
                <Route path={`/remat/menu`} component={Menu} />
                <Route path={`/remat/order-history/:id`} component={OrderHistory} />

                <Route path={`/remat/add-menu`} component={AddMenu} />

                <Route path={`/remat/menu-detail/:id`} component={MenuDetail} />
                <Route path={`/remat/area-detail/:id`} component={AreaDetail} />
                <Route path={`/remat/material-detail/:id`} component={MaterialDetail} />

                <Route path={`/remat/manage-menu`} component={MenuManage} />
                <Route path={`/remat/manage-area`} component={AreaManage} />
                <Route path={`/remat/chart`} component={BusinessChart} />
                <Route path={`/remat/manage-storage`} component={StorageManage} />

                <Route path={`/remat/Manage-user`} component={SuperAdmin} />

                {/* Add route here */}
                <Redirect from="/remat" to="/remat/home" />
              </Switch>
            </PanelContainer>
          </PanelContent>
        ) : null}
        <Footer />
        {/* <Portal>
          <FixedPlugin
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            onOpen={onOpen}
          />
        </Portal> */}
        <Configurator
          secondary={getActiveNavbar(routes)}
          isOpen={isOpen}
          onClose={onClose}
          isChecked={fixed}
          onSwitch={(value) => {
            setFixed(value);
          }}
          onOpaque={() => setSidebarVariant("opaque")}
          onTransparent={() => setSidebarVariant("transparent")}
        />
      </MainPanel>
    </ChakraProvider>
  );
}
