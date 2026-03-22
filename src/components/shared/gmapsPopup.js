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
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const marker = new window.google.maps.Marker({
        position: initialPosition,
        map: newMap,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[600px] relative overflow-hidden">
        {/* Header */}
        <div className="bg-primaryColor text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Location</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="w-full h-[450px] rounded-b-lg" ref={mapRef} />

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              Click on the map or drag the marker to select your location
            </p>
            <button
              onClick={handleUseCurrentLocation}
              className="bg-primaryColor text-white py-2 px-4 rounded-md shadow-sm hover:bg-primaryColor/90 transition duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Use My Current Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapModal;
