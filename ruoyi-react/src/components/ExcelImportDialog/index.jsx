import React, { useState, useRef } from 'react'
import { Modal, Upload, Checkbox, Button, message } from 'antd'
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

const { Dragger } = Upload

function ExcelImportDialog({
  title = '数据导入',
  width = 400,
  action,
  templateAction = '',
  templateFileName = 'template',
  updateSupportLabel = '是否更新已经存在的数据',
  onSuccess,
  visible,
  onCancel,
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)
  const [fileList, setFileList] = useState([])
  const uploadRef = useRef(null)

  const uploadUrl = `${import.meta.env.VITE_APP_BASE_API}${action}?updateSupport=${updateSupport ? 1 : 0}`

  const handleDownloadTemplate = () => {
    request({ url: templateAction, method: 'get', responseType: 'blob' }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${templateFileName}_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const handleSubmit = () => {
    if (fileList.length === 0) {
      message.error('请选择要上传的文件。')
      return
    }
    const file = fileList[0].originFileObj || fileList[0]
    const name = file.name.toLowerCase()
    if (!name.endsWith('.xls') && !name.endsWith('.xlsx')) {
      message.error('请选择后缀为 "xls" 或 "xlsx" 的文件。')
      return
    }
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    request({
      url: uploadUrl,
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + getToken() },
    }).then(res => {
      setIsUploading(false)
      message.success(res.msg || '导入成功')
      onCancel && onCancel()
      onSuccess && onSuccess()
    }).catch(() => {
      setIsUploading(false)
    })
  }

  const handleCancel = () => {
    setFileList([])
    setIsUploading(false)
    onCancel && onCancel()
  }

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={width}
    >
      <Dragger
        name="file"
        action={action}
        headers={{ Authorization: 'Bearer ' + getToken() }}
        accept=".xlsx,.xls"
        maxCount={1}
        beforeUpload={() => false}
        fileList={fileList}
        onChange={info => setFileList(info.fileList)}
        customRequest={handleSubmit}
      >
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p>将文件拖到此处，或<em>点击上传</em></p>
      </Dragger>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Checkbox checked={updateSupport} onChange={e => setUpdateSupport(e.target.checked)}>{updateSupportLabel}</Checkbox>
        <br />
        <span>仅允许导入xls、xlsx格式文件。</span>
        {templateAction && (
          <span>
            <a onClick={handleDownloadTemplate} style={{ marginLeft: 5, fontSize: 12 }}>
              下载模板
            </a>
          </span>
        )}
      </div>
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <Button type="primary" onClick={() => uploadRef.current?.upload?.submit()} loading={isUploading} style={{ marginRight: 8 }}>
          确 定
        </Button>
        <Button onClick={handleCancel} disabled={isUploading}>取 消</Button>
      </div>
    </Modal>
  )
}

export default ExcelImportDialog
