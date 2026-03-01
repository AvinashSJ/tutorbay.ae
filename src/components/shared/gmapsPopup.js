"use client";

import { useEffect, useRef, useState } from "react";

const GoogleMapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (isOpen && window.google && !map) {
      const initialPosition = { lat: 23.4241, lng: 53.8478 }; // Dubai

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 10,
      });

      const marker = new window.google.maps.Marker({
        position: initialPosition,
        map: newMap,
        draggable: true,
      });

      markerRef.current = marker;

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        const lat = position.lat();
        const lng = position.lng();
        const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
        onLocationSelect({ lat, lng, mapUrl });
      });

      newMap.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition({ lat, lng });
        const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
        onLocationSelect({ lat, lng, mapUrl });
      });

      setMap(newMap);
    }
  }, [isOpen, map, onLocationSelect]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;

        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        }

        if (map) {
          map.setCenter({ lat, lng });
        }

        onLocationSelect({ lat, lng, mapUrl });
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-3xl h-[550px] relative">
        <div className="absolute right-4 top-2">
          <button onClick={onClose} className="text-xl font-bold">
            ×
          </button>
        </div>

        <div className="w-full h-[450px] rounded" ref={mapRef} />

        <div className="text-center mt-4">
          <button
            onClick={handleUseCurrentLocation}
            className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 transition duration-200"
          >
            📍 Use My Current Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapModal;
