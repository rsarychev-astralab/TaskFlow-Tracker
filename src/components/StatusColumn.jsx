import { Badge, Card, Empty, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import TaskCard from './TaskCard';

const { Title } = Typography;

export default function StatusColumn({ status, tasks = [], onEdit, onDelete, onMove, onAdd, projects = [] }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.taskId) {
        onMove(data.taskId, data.sourceStatus, status.key);
      }
    } catch (err) {
      console.error('Ошибка при перемещении задачи', err);
    }
  };

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        backgroundColor: isDragOver ? '#f6ffed' : '#fafafa',
        border: isDragOver ? '1px dashed #52c41a' : '1px solid #d9d9d9',
        borderRadius: '6px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        header: { padding: '8px 12px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff' },
        body: { padding: '8px', flex: 1, overflowY: 'auto', minHeight: '400px' }
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {status.label}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge count={tasks.length} showZero color="#1890ff" />
            <Button 
              type="text" 
              size="small" 
              icon={<PlusOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(status.key);
              }} 
            />
          </div>
        </div>
      }
    >
      <div>
        {tasks.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет задач" style={{ margin: '32px 0' }} />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              statusKey={status.key}
              onEdit={onEdit}
              onDelete={onDelete}
              projects={projects}
            />
          ))
        )}
      </div>
    </Card>
  );
}
