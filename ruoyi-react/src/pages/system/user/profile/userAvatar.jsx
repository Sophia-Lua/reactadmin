import React, { useState } from 'react'
import { Upload, Button, message, Modal } from 'antd'
import { UserOutlined, UploadOutlined } from '@ant-design/icons'
import { updateUserAvatar } from '@/api/system/user'

function UserAvatar({ avatar, onChange }) {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('avatarfile', file)

    try {
      const res = await updateUserAvatar(formData)
      message.success('修改成功')
      onChange?.(res.imgUrl)
    } catch {
      message.error('上传失败')
    }
    return false
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 16 }}>
        <img
          src={avatar || undefined}
          alt="avatar"
          style={{
            width: 120, height: 120, borderRadius: '50%',
            objectFit: 'cover', cursor: 'pointer',
          }}
          onClick={() => { setPreviewImage(avatar); setPreviewVisible(true) }}
        />
      </div>
      <Upload
        accept="image/*"
        beforeUpload={handleUpload}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>上传头像</Button>
      </Upload>
      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default UserAvatar
