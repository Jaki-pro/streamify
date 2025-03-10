import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Videos from './pages/Videos.jsx'
import SingleVideoPage from './pages/SingleVideoPage.jsx'
import UploadVideoPage from './pages/UploadVideoPage.jsx'
import ChannelProfilePage from './pages/ChannelProfilePage.jsx'
const clientId = "533388546852-j694mp7ko7b87isk8vk13c241ce6228j.apps.googleusercontent.com";
const router = createBrowserRouter([
  {
    path:'/',
    element: <App />,
    children:[
      {
        path:'/',
        element: <Videos/>
      },
      {
        path:'/single-video/1',
        element: <SingleVideoPage/>
      },
      {
        path:'/upload-video',
        element: <UploadVideoPage/>
      },
      {
        path:'/go-live',
        element: <h2 className='text-center mx-auto my-auto'>Feature Coming Soon..!</h2>
      },
      // {
      //   path:'/profile',
      //   element: <ChannelProfilePage/>
      // },
    ]
  },
  {
    path:'/single-video',
    element: <h1>HI</h1>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
