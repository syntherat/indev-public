"use client";

import { useMemo, useRef, useState } from "react";

export default function ProductMediaGallery({ images = [], alt = "Product image" }) {
  const gallery = useMemo(() => {
    return Array.isArray(images) ? images.filter(Boolean).slice(0, 6) : [];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [lensPosition, setLensPosition] = useState({
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
    bgW: 0,
    bgH: 0,
  });
  const mainRef = useRef(null);

  const lensSize = 160;
  const zoomFactor = 2.1;

  const handleMouseMove = (event) => {
    const element = mainRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    const x = Math.max(0, Math.min(pointerX, rect.width));
    const y = Math.max(0, Math.min(pointerY, rect.height));

    const bgW = rect.width * zoomFactor;
    const bgH = rect.height * zoomFactor;

    const rawBgX = -(x * zoomFactor - lensSize / 2);
    const rawBgY = -(y * zoomFactor - lensSize / 2);

    const minBgX = -(bgW - lensSize);
    const minBgY = -(bgH - lensSize);

    setLensPosition({
      x,
      y,
      bgX: Math.max(minBgX, Math.min(0, rawBgX)),
      bgY: Math.max(minBgY, Math.min(0, rawBgY)),
      bgW,
      bgH,
    });
  };

  if (gallery.length === 0) {
    return <div className="pdp-gallery-empty">No preview image yet.</div>;
  }

  const safeIndex = Math.min(activeIndex, gallery.length - 1);
  const activeImage = gallery[safeIndex];

  return (
    <>
      <div className={`pdp-gallery-layout ${gallery.length > 1 ? "" : "pdp-gallery-layout-single"}`}>
        {gallery.length > 1 ? (
          <div className="pdp-gallery-strip" role="tablist" aria-label="Product previews">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`pdp-thumb ${safeIndex === index ? "pdp-thumb-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                role="tab"
                aria-selected={safeIndex === index}
                aria-label={`Preview ${index + 1}`}
              >
                <img src={image} alt={`${alt} ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}

      <div
        className={`pdp-gallery-main ${isZooming ? "pdp-gallery-main-zooming" : ""}`}
        ref={mainRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZooming(false)}
      >
        <img src={activeImage} alt={alt} />

        {isZooming ? (
          <div
            className="pdp-gallery-lens"
            aria-hidden="true"
            style={{
              width: `${lensSize}px`,
              height: `${lensSize}px`,
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: `${lensPosition.bgX}px ${lensPosition.bgY}px`,
              backgroundSize: `${lensPosition.bgW}px ${lensPosition.bgH}px`,
            }}
          />
        ) : null}
      </div>
      </div>
    </>
  );
}
