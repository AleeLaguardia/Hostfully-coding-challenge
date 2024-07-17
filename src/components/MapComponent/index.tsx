import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Container } from "./style";
import 'leaflet/dist/leaflet.css';
import '../../fixLeafletIcon';

interface Props {
  position: LatLngExpression | any;
};

const MapMarker: React.FC<{ position: LatLngExpression }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} />;
};

const MapComponent: React.FC<Props> = ({ position }) => {
  const formatPositionCorrectly: LatLngExpression = [position[1], position[0]];

  return (
    <Container>
      <MapContainer dragging={false} center={formatPositionCorrectly} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapMarker position={formatPositionCorrectly} />
      </MapContainer>
    </Container>
  );
};

export default MapComponent;