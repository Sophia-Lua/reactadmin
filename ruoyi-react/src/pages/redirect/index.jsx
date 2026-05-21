import React, { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

function Redirect() {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()

  useEffect(() => {
    if (params['*']) {
      navigate('/' + params['*'], { replace: true })
    }
  }, [params, navigate, location])

  return <div />
}

export default Redirect
