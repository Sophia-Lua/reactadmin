import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Card, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { getJob } from '@/api/monitor/job'
import { parseTime } from '@/utils/ruoyi'

function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [jobInfo, setJobInfo] = useState({})

  useEffect(() => {
    if (jobId) {
      getJob(jobId).then(res => setJobInfo(res.data))
    }
  }, [jobId])

  return (
    <div style={{ padding: 20 }}>
      <h3>定时任务详情</h3>
      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="任务编号">{jobInfo.jobId}</Descriptions.Item>
          <Descriptions.Item label="任务名称">{jobInfo.jobName}</Descriptions.Item>
          <Descriptions.Item label="任务组名">{jobInfo.jobGroup}</Descriptions.Item>
          <Descriptions.Item label="调用方法">{jobInfo.invokeTarget}</Descriptions.Item>
          <Descriptions.Item label="cron表达式">{jobInfo.cronExpression}</Descriptions.Item>
          <Descriptions.Item label="执行策略">
            {jobInfo.misfirePolicy === '1' ? '立即执行' : jobInfo.misfirePolicy === '2' ? '执行一次' : '放弃执行'}
          </Descriptions.Item>
          <Descriptions.Item label="是否并发">{jobInfo.concurrent === '0' ? '允许' : '禁止'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={jobInfo.status === '0' ? 'green' : 'red'}>
              {jobInfo.status === '0' ? '运行中' : '暂停'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{parseTime(jobInfo.createTime)}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{jobInfo.remark}</Descriptions.Item>
        </Descriptions>
      </Card>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default JobDetail
