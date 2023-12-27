import { createBrowserRouter, Route, createRoutesFromElements, Navigate } from "react-router-dom";

import Page404 from "./pages/page404";
import RootLayout from "./rootLayout";  
import Users from "./pages/users";
import Banks from "./pages/banks";
import Home from "./pages/home";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <RootLayout/> }>
            <Route index element={<Home />} />
            <Route path="404" element={ <Page404 /> } />
            <Route path="*" element={ <Navigate to="404" replace /> }/>

            <Route path="users" element={ <Users /> } />
            <Route path="banks" element={ <Banks /> } />
        </Route>
    )
)


export default router;