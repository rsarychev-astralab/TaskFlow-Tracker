import { Col, Row } from 'antd';
import { STATUSES } from '../constants/statuses';
import StatusColumn from './StatusColumn';

export default function KanbanBoard({ tasks, onEdit, onDelete, onMove, onAdd }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
      <Row gutter={[12, 12]} style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
        {STATUSES.map((status) => (
          <Col key={status.key} style={{ width: '280px', flexShrink: 0 }}>
            <StatusColumn
              status={status}
              tasks={tasks[status.key] || []}
              onEdit={onEdit}
              onDelete={(taskId) => onDelete(status.key, taskId)}
              onMove={onMove}
              onAdd={onAdd}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
