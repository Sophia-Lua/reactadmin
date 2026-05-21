import React from 'react'
import { Upload, Button, Modal, message, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

function ImageUpload({ value, onChange, limit = 5, fileSize = 5, action = import.meta.env.VITE_APP_BASE_API + '/common/upload' }) {
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState('')

  const fileList = React.useMemo(() => {
    if (!value) return []
    return value.split(',').filter(Boolean).map((url, index) => ({
      uid: `-${index}`,
      name: url,
      status: 'done',
      url: url.startsWith('http') ? url : action.replace('/common/upload', '') + url,
    }))
  }, [value, action])

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }

  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Bearer ' + localStorage.getItem('Admin-Token') },
      })
      const data = await res.json()
      if (data.code === 200) {
        message.success('上传成功')
        const urls = value ? value + ',' + data.fileName : data.fileName
        onChange?.(urls)
      } else {
        message.error(data.msg || '上传失败')
      }
    } catch {
      message.error('上传失败')
    }
    return false
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={handleUpload}
        maxCount={limit}
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>
      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default ImageUpload
