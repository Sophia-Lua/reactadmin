import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

function RadarChart({ width = '100%', height = '400px' }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return
    
    chartInstance.current = echarts.init(chartRef.current)
    
    const option = {
      tooltip: {},
      legend: { data: ['预算分配', '实际开销'], bottom: 0 },
      radar: {
        indicator: [
          { name: '销售', max: 6500 },
          { name: '管理', max: 16000 },
          { name: '信息技术', max: 30000 },
          { name: '客服', max: 38000 },
          { name: '研发', max: 52000 },
          { name: '市场', max: 25000 },
        ],
      },
      series: [{
        name: '预算 vs 开销',
        type: 'radar',
        data: [
          { value: [4300, 10000, 28000, 35000, 50000, 19000], name: '预算分配' },
          { value: [5000, 14000, 28000, 31000, 42000, 21000], name: '实际开销' },
        ],
      }],
    }

    chartInstance.current.setOption(option)

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width, height }} />
}

export default RadarChart
