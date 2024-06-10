import { RouterProvider, createBrowserRouter } from "react-router-dom"

import './global.css'

import { ForWhom } from "./pages/Sender/ForWhom"
import { PsiwUpload } from "./pages/Sender/PsiwUpload"
import { Share } from "./pages/Sender/Share"
import { FromWho } from "./pages/Sender/FromWho"
import { SeePsiw } from "./pages/Recipient/SeePsiw"
import { React } from "./pages/Recipient/React"
import { Loading } from "./pages/Recipient/Loading"
import { ShareReact } from "./pages/Recipient/ShareReact"
import { Compiled } from "./pages/Compiled/Compiled"
import { ShareCompiled } from "./pages/Compiled/ShareCompiled"

const router = createBrowserRouter([
  {
    path: "/",
    element: <FromWho/>,
    // errorElement: <div>error</div>
  }, {
    path: "/para-quem",
    element: <ForWhom/>,
    errorElement: <FromWho/>,
  }, {
    path: "/escolher-arquivo",
    element: <PsiwUpload/>,
    errorElement: <FromWho/>,
  }, {
    path: "/compartilhar",
    element: <Share/>,
    errorElement: <FromWho/>,
  }, {
    path: "/ver-psiw/:id",
    element: <SeePsiw/>,
    errorElement: <FromWho/>,
  }, {
    path: "/reagir/:id",
    element: <React/>,
    // errorElement: <FromWho/>,
  }, {
    path: "/enviando/:id",
    element: <Loading/>,
    // errorElement: <FromWho/>,
  }, {
    path: "/compartilhar-react/:id",
    element: <ShareReact/>,
    // errorElement: <FromWho/>,
  }, {
    path: "/reacao/:id",
    element: <Compiled/>,
    // errorElement: <FromWho/>,
  }, {
    path: "/compartilhar-compilado/:id",
    element: <ShareCompiled/>,
    // errorElement: <FromWho/>,
  }
])


export function App() {
  return <RouterProvider router={router} />
}
