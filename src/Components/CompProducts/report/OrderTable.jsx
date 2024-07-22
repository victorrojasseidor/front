import React, { useState } from 'react';

const OrderTable = () => {
  const [data, setData] = useState([
    {
      key: 'id',
      title: 'Id',
    },
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'apellido',
      title: 'Apellido',
    },
  ]);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleColumnDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleColumnDragOver = (event, index) => {
    event.preventDefault();
    const draggedOverIndex = index;

    if (draggedIndex === null || draggedIndex === draggedOverIndex) {
      return;
    }

    const newOrder = [...data];
    const draggedColumn = newOrder[draggedIndex];

    // Remove the dragged column from its current position
    newOrder.splice(draggedIndex, 1);

    // Insert the dragged column at the new position
    newOrder.splice(draggedOverIndex, 0, draggedColumn);

    setDraggedIndex(draggedOverIndex);
    setData(newOrder);
  };

  const handleColumnDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="orderTable">
      <table>
        <thead>
          <tr>
            {data.map((column, index) => (
              <th key={column.key} data-key={column.key} draggable="true" style={{ cursor: 'move' }} onDragStart={() => handleColumnDragStart(index)} onDragOver={(e) => handleColumnDragOver(e, index)} onDragEnd={handleColumnDragEnd}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              {data.map((column) => (
                <td key={`${user.id}-${column.key}`}>{user[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
