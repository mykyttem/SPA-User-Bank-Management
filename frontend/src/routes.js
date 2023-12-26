import { createBrowserRouter, Route, createRoutesFromElements, Navigate } from "react-router-dom";

import Page404 from "./page404";
import RootLayout from "./rootLayout";  
import Users from "./users";
import Banks from "./banks";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <RootLayout/> }>
            <Route path="404" element={ <Page404 /> } />
            <Route path="*" element={ <Navigate to="404" replace /> }/>

            <Route path="users" element={ <Users /> } />
            <Route path="banks" element={ <Banks /> } />
        </Route>
    )
)


export default router;