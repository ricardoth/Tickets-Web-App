import React from 'react';
import { Nav } from 'react-bootstrap';

export const TabsStepsTickets = ({activeTab, setActiveTab}) => {
  return (
    <>
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="cliente">Datos Cliente</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tickets">Tickets</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pago">Confirmación</Nav.Link>
            </Nav.Item>
        </Nav>
    </>
  )
}
