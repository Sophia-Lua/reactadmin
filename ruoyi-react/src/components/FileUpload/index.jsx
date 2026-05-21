import React from 'react'
import { Upload, Button, Progress, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

function FileUpload({ value, onChange, limit = 5, action = import.meta.env.VITE_APP_BASE_API + '/common/upload' }) {
  const [fileList, setFileList] = React.useState([])
  const [uploading, setUploading] = React.useState(false)

  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Bearer ' + localStorage.getItem('Admin-Token') },
      })
      const data = await res.json()
      if (data.code === 200) {
        message.success('上传成功')
        const urls = [...fileList, data.fileName]
        setFileList(urls)
        onChange?.(urls.join(','))
      } else {
        message.error(data.msg || '上传失败')
      }
    } catch {
      message.error('上传失败')
    } finally {
      setUploading(false)
    }
    return false
  }

  return (
    <div className="upload-container">
      <Upload
        accept="*"
        multiple
        maxCount={limit}
        beforeUpload={handleUpload}
        showUploadList={true}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>上传文件</Button>
      </Upload>
      {fileList.length > 0 && (
        <div className="file-list" style={{ marginTop: 8 }}>
          {fileList.map((file, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <a href={file} target="_blank" rel="noopener noreferrer">{file}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
