import React from 'react'
import { Modal, Radio, Button } from 'antd'

function CodeTypeDialog({ open, onClose, onConfirm }) {
  const [codeType, setCodeType] = React.useState('js')

  return (
    <Modal
      title="代码类型"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Radio.Group value={codeType} onChange={(e) => setCodeType(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio value="js">JavaScript</Radio>
        <Radio value="html">HTML</Radio>
        <Radio value="css">CSS</Radio>
      </Radio.Group>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>取消</Button>
        <Button type="primary" onClick={() => onConfirm?.(codeType)}>确定</Button>
      </div>
    </Modal>
  )
}

export default CodeTypeDialog
