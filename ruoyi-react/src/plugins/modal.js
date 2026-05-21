import { Modal, message } from 'antd'

const modalPlugin = {
  confirm(options) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: options.title || '系统提示',
        content: options.content,
        okText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        onOk: () => resolve(),
        onCancel: () => reject(),
      })
    })
  },
  alert(content, title, options = {}) {
    Modal.info({
      title: title || '系统提示',
      content,
      okText: options.confirmText || '确定',
    })
  },
  msgSuccess(content) {
    message.success(content)
  },
  msgError(content) {
    message.error(content)
  },
  msgWarning(content) {
    message.warning(content)
  },
  msgInfo(content) {
    message.info(content)
  },
}

export default modalPlugin
