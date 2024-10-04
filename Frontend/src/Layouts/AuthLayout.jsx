import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default AuthLayout