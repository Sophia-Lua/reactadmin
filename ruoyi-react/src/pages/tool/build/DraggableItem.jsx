import React from 'react'
import { Card, Tag } from 'antd'
import Draggable from 'react-draggable'

function DraggableItem({ item, onDrag, onRemove }) {
  return (
    <Draggable
      onStop={(e, data) => onDrag?.(item.id, { x: data.x, y: data.y })}
    >
      <Card
        size="small"
        style={{ marginBottom: 8, cursor: 'move' }}
        extra={<a onClick={() => onRemove?.(item.id)}>删除</a>}
      >
        <Tag color="blue">{item.type}</Tag>
        <span>{item.label}</span>
      </Card>
    </Draggable>
  )
}

export default DraggableItem
