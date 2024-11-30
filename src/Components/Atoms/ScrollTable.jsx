import React, { useRef, useState, useEffect } from "react";

const ScrollableTable = () => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Usuario ${i + 1}`,
      email: `usuario${i + 1}@ejemplo.com`,
      role: i % 2 === 0 ? "Admin" : "Editor",
    }));
  
    return (
      <div className="scrollWrapper">
        <div className="scrollButton left" onClick={() => scrollTable("left")}>
          ⬅
        </div>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="scrollButton right" onClick={() => scrollTable("right")}>
          ➡
        </div>
      </div>
    );
  };
  
  // Simular el desplazamiento
  const scrollTable = (direction) => {
    const tableContainer = document.querySelector(".tableContainer");
    if (tableContainer) {
      const scrollAmount = 100;
      tableContainer.scrollLeft += direction === "right" ? scrollAmount : -scrollAmount;
    }
  };
  
  export default ScrollableTable;
  