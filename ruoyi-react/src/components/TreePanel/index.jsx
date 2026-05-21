import React from 'react'
import { Tree } from 'antd'

function TreePanel({ data, onSelect, ...rest }) {
  return <Tree treeData={data} onSelect={onSelect} {...rest} />
}

export default TreePanel
