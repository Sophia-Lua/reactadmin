import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Tabs, Table, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { getTableInfo, updateTableInfo } from '@/api/tool/gen'

function GenEditPage() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [tableInfo, setTableInfo] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => { getInfo() }, [tableId])

  const getInfo = async () => {
    const res = await getTableInfo(tableId)
    setTableInfo(res.data?.info || {})
    setColumns(res.data?.rows || [])
    form.setFieldsValue(res.data?.info || {})
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await updateTableInfo({ ...values, tableId })
      message.success('修改成功')
      navigate(-1)
    } catch {}
  }

  return (
    <div>
      <Form form={form} layout="vertical">
        <Tabs>
          <Tabs.TabPane tab="基本信息" key="1">
            <Form.Item name="tableName" label="表名称"><Input /></Form.Item>
            <Form.Item name="tableComment" label="表描述"><Input /></Form.Item>
            <Form.Item name="className" label="实体类名称"><Input /></Form.Item>
            <Form.Item name="functionAuthor" label="功能作者"><Input /></Form.Item>
            <Form.Item name="remark" label="备注"><Input.TextArea /></Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="字段信息" key="2">
            <Table
              dataSource={columns}
              columns={[
                { title: '字段列名', dataIndex: 'columnName' },
                { title: '字段描述', dataIndex: 'columnComment' },
                { title: '物理类型', dataIndex: 'columnType' },
                { title: 'Java类型', dataIndex: 'javaType' },
                { title: '插入', dataIndex: 'isInsert', render: (v) => v === '1' ? '是' : '否' },
                { title: '编辑', dataIndex: 'isEdit', render: (v) => v === '1' ? '是' : '否' },
                { title: '列表', dataIndex: 'isList', render: (v) => v === '1' ? '是' : '否' },
                { title: '查询', dataIndex: 'isQuery', render: (v) => v === '1' ? '是' : '否' },
              ]}
              rowKey="columnId"
              pagination={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="生成信息" key="3">
            <Form.Item name="tplCategory" label="生成模板">
              <Input />
            </Form.Item>
            <Form.Item name="tplWebType" label="前端类型">
              <Input />
            </Form.Item>
            <Form.Item name="packageName" label="生成包路径"><Input /></Form.Item>
            <Form.Item name="moduleName" label="生成模块名"><Input /></Form.Item>
            <Form.Item name="businessName" label="生成业务名"><Input /></Form.Item>
            <Form.Item name="genType" label="生成代码方式">
              <Input />
            </Form.Item>
          </Tabs.TabPane>
        </Tabs>
      </Form>
      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleSubmit}>保存</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default GenEditPage
