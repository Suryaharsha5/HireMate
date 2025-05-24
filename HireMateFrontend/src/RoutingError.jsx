import React from 'react'
import { useRouteError } from 'react-router-dom'
function RoutingError() {
    let err=useRouteError();
  return (
    <div>
        <h1 className='display-1 text-danger text-center mt-5'>{err.data}</h1>
        <h1 className='display-1 text-warning text-center mt-5'>{err.status}-{err.statusText}</h1>
    </div>
  )
}

export default RoutingError;