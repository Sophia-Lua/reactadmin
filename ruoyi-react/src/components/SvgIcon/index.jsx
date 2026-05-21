import React from 'react'

function SvgIcon({ name, className = '', style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
    >
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  )
}

export default SvgIcon
