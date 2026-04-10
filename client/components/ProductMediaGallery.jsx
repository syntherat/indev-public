"use client";

import { useMemo, useRef, useState } from "react";

const PRODUCT_FALLBACK_IMAGE = "/assets/product-fallback.svg";

function getYouTubeVideoId(value) {
  const rawValue = String(value || "").trim();

  if (!rawValue) {
    return "";
  }

  try {
    const url = new URL(/^https?:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`);
    const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v") || "";
      }

      const segments = url.pathname.split("/").filter(Boolean);

      if (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live") {
        return segments[1] || "";
      }
    }
  } catch (_error) {
    return "";
  }

  return "";
}

function getYouTubeMedia(value) {
  const videoId = getYouTubeVideoId(value);

  if (!videoId) {
    return null;
  }

  return {
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

function toMediaItem(item, fallbackType = "image") {
  if (typeof item === "string") {
    const src = item.trim();
    if (!src) {
      return null;
    }

    if (fallbackType === "video") {
      const youtubeMedia = getYouTubeMedia(src);

      if (!youtubeMedia) {
        return null;
      }

      return {
        type: "video",
        src,
        videoKind: "youtube",
        embedUrl: youtubeMedia.embedUrl,
        poster: youtubeMedia.thumbnailUrl,
      };
    }

    return { type: fallbackType, src };
  }

  if (item && typeof item === "object") {
    const type = String(item.type || fallbackType).trim().toLowerCase() === "video" ? "video" : "image";
    const src = String(item.src || item.url || item.image || item.video || "").trim();
    const poster = String(item.poster || item.thumbnail || item.thumb || "").trim();

    if (!src) {
      return null;
    }

    if (type === "video") {
      const youtubeMedia = getYouTubeMedia(src);

      if (!youtubeMedia) {
        return null;
      }

      return {
        type,
        src,
        poster: poster || youtubeMedia.thumbnailUrl,
        videoKind: "youtube",
        embedUrl: youtubeMedia.embedUrl,
      };
    }

    return { type, src, poster };
  }

  return null;
}

function MediaPreview({ item, alt, index, isActive, onSelect }) {
  return (
    <button
      key={`${item.src}-${index}`}
      type="button"
      className={`pdp-thumb ${isActive ? "pdp-thumb-active" : ""}`}
      onClick={onSelect}
      role="tab"
      aria-selected={isActive}
      aria-label={`Preview ${index + 1}`}
    >
      {item.type === "video" ? (
        <>
          <img
            src={item.poster || PRODUCT_FALLBACK_IMAGE}
            alt={`${alt} ${index + 1}`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
            }}
          />
          <span className="pdp-thumb-video-label">Video</span>
        </>
      ) : (
        <img
          src={item.src || PRODUCT_FALLBACK_IMAGE}
          alt={`${alt} ${index + 1}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
          }}
        />
      )}
    </button>
  );
}

export default function ProductMediaGallery({ images = [], videos = [], alt = "Product image" }) {
  const gallery = useMemo(() => {
    const normalizedImages = Array.isArray(images)
      ? images.map((item) => toMediaItem(item, "image")).filter(Boolean).slice(0, 6)
      : [];
    const normalizedVideos = Array.isArray(videos)
      ? videos.map((item) => toMediaItem(item, "video")).filter(Boolean).slice(0, 6)
      : [];
    const normalized = [...normalizedImages, ...normalizedVideos];

    return normalized.length > 0 ? normalized : [{ type: "image", src: PRODUCT_FALLBACK_IMAGE }];
  }, [images, videos]);

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

  const safeIndex = Math.min(activeIndex, gallery.length - 1);
  const activeMedia = gallery[safeIndex];
  const isVideoMedia = activeMedia?.type === "video";

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

  return (
    <>
      <div className={`pdp-gallery-layout ${gallery.length > 1 ? "" : "pdp-gallery-layout-single"}`}>
        {gallery.length > 1 ? (
          <div className="pdp-gallery-strip" role="tablist" aria-label="Product previews">
            {gallery.map((item, index) => (
              <MediaPreview
                key={`${item.src}-${index}`}
                item={item}
                alt={alt}
                index={index}
                isActive={safeIndex === index}
                onSelect={() => setActiveIndex(index)}
              />
            ))}
          </div>
        ) : null}

      <div
        className={`pdp-gallery-main ${isZooming && !isVideoMedia ? "pdp-gallery-main-zooming" : ""} ${isVideoMedia ? "pdp-gallery-main-video" : ""}`}
        ref={mainRef}
        onMouseEnter={() => {
          if (!isVideoMedia) {
            setIsZooming(true);
          }
        }}
        onMouseMove={isVideoMedia ? undefined : handleMouseMove}
        onMouseLeave={() => setIsZooming(false)}
      >
        {isVideoMedia ? (
          <div className="pdp-video-stage">
            <iframe
              className="pdp-video-embed pdp-video-embed-direct"
              src={`${activeMedia.embedUrl}?rel=0&modestbranding=1&playsinline=1`}
              title={alt}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <img
            src={activeMedia?.src || PRODUCT_FALLBACK_IMAGE}
            alt={alt}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
            }}
          />
        )}

        {isZooming && !isVideoMedia ? (
          <div
            className="pdp-gallery-lens"
            aria-hidden="true"
            style={{
              width: `${lensSize}px`,
              height: `${lensSize}px`,
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
              backgroundImage: `url(${activeMedia?.src})`,
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
