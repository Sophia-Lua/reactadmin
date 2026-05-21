import React from 'react'
import { Pagination as AntPagination } from 'antd'

function Pagination({ total, page, pageSize, onPageChange, onSizeChange, layout = 'total, sizes, prev, pager, next, jumper' }) {
  return (
    <div className="pagination-container" style={{ marginTop: 16, textAlign: 'right' }}>
      <AntPagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger={layout.includes('sizes')}
        showQuickJumper={layout.includes('jumper')}
        showTotal={layout.includes('total') ? (total) => `共 ${total} 条` : undefined}
        onChange={(page, pageSize) => onPageChange && onPageChange({ page, pageSize })}
        onShowSizeChange={(current, size) => onSizeChange && onSizeChange({ page: 1, pageSize: size })}
      />
    </div>
  )
}

export default Pagination
