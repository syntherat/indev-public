"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createProductReview, fetchProductReviews } from "@/lib/reviewsApi";

function renderStars(count, filledCount, classNamePrefix) {
  return Array.from({ length: count }, (_, index) => (
    <span
      key={index}
      className={index < filledCount ? `${classNamePrefix}-filled` : `${classNamePrefix}-empty`}
    >
      ★
    </span>
  ));
}

function getDateLabel(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProductReviewsSection({ productName, rating, product }) {
  const { status, user } = useAuth();
  const formRef = useRef(null);
  const isAuthenticated = status === "authenticated";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewDisplayName, setReviewDisplayName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submitState, setSubmitState] = useState({ loading: false, message: "", error: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      setReviewDisplayName("");
      setReviewEmail("");
      return;
    }

    if (!reviewDisplayName) {
      setReviewDisplayName(String(user?.name || "").trim());
    }

    if (!reviewEmail) {
      setReviewEmail(String(user?.email || "").trim());
    }
  }, [isAuthenticated, reviewDisplayName, reviewEmail, user?.name, user?.email]);

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      setLoadingReviews(true);
      setLoadingError("");

      try {
        const payload = await fetchProductReviews(product?.slug || "");

        if (!isActive) {
          return;
        }

        setReviews(Array.isArray(payload?.data) ? payload.data : []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadingError(error?.message || "Unable to load reviews right now.");
        setReviews([]);
      } finally {
        if (isActive) {
          setLoadingReviews(false);
        }
      }
    };

    if (product?.slug) {
      loadReviews();
    } else {
      setLoadingReviews(false);
      setReviews([]);
    }

    return () => {
      isActive = false;
    };
  }, [product?.slug]);

  useEffect(() => {
    if (!isFormOpen || !formRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isFormOpen]);

  const reviewCount = reviews.length;
  const averageRating = useMemo(() => {
    if (reviewCount === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return Number((total / reviewCount).toFixed(1));
  }, [reviewCount, reviews]);

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const review of reviews) {
      const score = Math.min(5, Math.max(1, Math.round(Number(review.rating || 0))));
      counts[score] += 1;
    }

    return counts;
  }, [reviews]);

  const displayRating = hoveredRating || selectedRating;
  const hasReviews = reviewCount > 0;
  const canReview = Boolean(product?.slug);

  async function handleOpenReviewForm() {
    setIsFormOpen(true);
  }

  async function handleSubmitReview(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      if (!String(reviewDisplayName || "").trim()) {
        setSubmitState({ loading: false, message: "", error: "Please enter your name." });
        return;
      }

      if (!String(reviewEmail || "").trim()) {
        setSubmitState({ loading: false, message: "", error: "Please enter your email." });
        return;
      }
    }

    setSubmitState({ loading: true, message: "", error: "" });

    try {
      const payload = await createProductReview({
        slug: product?.slug,
        rating: selectedRating,
        title: reviewTitle,
        body: reviewBody,
        displayName: reviewDisplayName,
        email: reviewEmail,
      });

      setSubmitState({ loading: false, message: payload?.message || "Review submitted for approval.", error: "" });
      setIsFormOpen(false);
      setReviewTitle("");
      setReviewBody("");
      setReviewDisplayName(String(user?.name || "").trim());
      setReviewEmail(String(user?.email || "").trim());
      setSelectedRating(5);
      setHoveredRating(0);
    } catch (error) {
      setSubmitState({ loading: false, message: "", error: error?.message || "Unable to submit review right now." });
    }
  }

  return (
    <article className={`pdp-reviews-card ${isFormOpen ? "pdp-reviews-card-open" : ""}`.trim()}>
      <h2>Read {productName} - Reviews</h2>
      <div className="pdp-reviews-head">
        <div className="pdp-reviews-summary">
          <div className="pdp-reviews-rating">
            <div className="pdp-rating-stars">{renderStars(5, Math.floor(averageRating || 0), "star")}</div>
            <strong>{averageRating ? `${averageRating.toFixed(1)} out of 5` : "No reviews yet"}</strong>
            <p>
              {hasReviews ? `Based on ${reviewCount} customer review${reviewCount > 1 ? "s" : ""}` : "No approved reviews yet"}
            </p>
          </div>

          <div className="pdp-rating-distribution">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingBreakdown[stars] || 0;
              const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

              return (
                <div key={stars} className="pdp-rating-bar-row">
                  <span className="pdp-rating-bar-label">{renderStars(stars, stars, "star")}</span>
                  <div className="pdp-rating-bar-track">
                    <div className="pdp-rating-bar-fill" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="pdp-rating-bar-count">{count}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="pdp-write-review-btn"
            onClick={handleOpenReviewForm}
            aria-expanded={isFormOpen}
            aria-controls="pdp-review-form"
            disabled={!canReview}
          >
            POST A REVIEW
          </button>
        </div>
      </div>

      {submitState.message ? <p className="pdp-review-form-note">{submitState.message}</p> : null}
      {submitState.error ? <p className="pdp-review-form-note pdp-review-form-error">{submitState.error}</p> : null}
      {loadingError ? <p className="pdp-review-form-note pdp-review-form-error">{loadingError}</p> : null}

      <div
        ref={formRef}
        id="pdp-review-form"
        className={`pdp-review-expand-shell ${isFormOpen ? "pdp-review-expand-shell-open" : ""}`.trim()}
        aria-hidden={!isFormOpen}
      >
        <div className="pdp-review-expand-inner">
          <div className="pdp-review-form-topbar">
            <div>
              <p className="pdp-review-form-kicker">Post a review</p>
              <h3>Tell us what you think about {productName}</h3>
            </div>
            <button type="button" className="pdp-review-form-close" onClick={() => setIsFormOpen(false)}>
              Cancel review
            </button>
          </div>

          <form className="pdp-review-form-card" onSubmit={handleSubmitReview}>
            <div className="pdp-review-form-rating-block">
              <span className="pdp-review-form-label">Rating</span>
              <div className="pdp-review-form-stars" role="radiogroup" aria-label="Review rating">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  const isActive = value <= displayRating;

                  return (
                    <button
                      key={value}
                      type="button"
                      className={`pdp-review-star ${isActive ? "pdp-review-star-active" : ""}`.trim()}
                      aria-pressed={selectedRating === value}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      onClick={() => setSelectedRating(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pdp-review-form-grid">
              <label className="pdp-review-form-field">
                <span>Review Title</span>
                <input
                  type="text"
                  placeholder="Give your review a title"
                  value={reviewTitle}
                  onChange={(event) => setReviewTitle(event.target.value)}
                />
              </label>

              <label className="pdp-review-form-field pdp-review-form-field-full">
                <span>Review content</span>
                <textarea
                  rows={5}
                  placeholder="Please tell us your experience. You can talk about its design, comfort & sound performance :)"
                  value={reviewBody}
                  onChange={(event) => setReviewBody(event.target.value)}
                />
              </label>

              <label className="pdp-review-form-field">
                <span>Display name for this review</span>
                <input
                  type="text"
                  placeholder="Display name"
                  value={reviewDisplayName}
                  onChange={(event) => setReviewDisplayName(event.target.value)}
                />
              </label>

              {!isAuthenticated ? (
                <label className="pdp-review-form-field">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={reviewEmail}
                    onChange={(event) => setReviewEmail(event.target.value)}
                  />
                </label>
              ) : null}

              <p className="pdp-review-form-note pdp-review-form-field-full">
                {isAuthenticated ? (
                  <>
                    Posted as <strong>{user?.name || "your account"}</strong>. Reviews are checked by the admin team before they appear publicly.
                  </>
                ) : (
                  <>
                    Reviews are checked by the admin team before they appear publicly.
                  </>
                )}
              </p>
            </div>

            <div className="pdp-review-form-actions">
              <button type="button" className="pdp-review-form-close" onClick={() => setIsFormOpen(false)}>
                Cancel review
              </button>
              <button type="submit" className="pdp-review-form-submit" disabled={submitState.loading}>
                {submitState.loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {loadingReviews ? (
        <div className="pdp-individual-reviews">
          <div className="pdp-review-single">Loading reviews...</div>
        </div>
      ) : hasReviews ? (
        <div className="pdp-individual-reviews">
          {reviews.map((review) => (
            <div key={review.id} className="pdp-review-single">
              <div className="pdp-review-header">
                <div className="pdp-review-rating">{renderStars(5, Math.round(review.rating || 0), "star")}</div>
                <span className="pdp-review-date">{getDateLabel(review.createdAt)}</span>
              </div>

              <div className="pdp-review-author">
                <strong>{review.authorName}</strong>
                {review.purchaseVerified ? <span className="pdp-review-verified">Verified Purchase</span> : null}
              </div>

              {review.title ? <p className="pdp-review-title">{review.title}</p> : null}
              <p className="pdp-review-text">{review.body}</p>

              {review.adminReply ? (
                <div className="pdp-seller-reply">
                    <p className="pdp-reply-label">{`>> Indev Digital replied:`}</p>
                  <p className="pdp-reply-text">{review.adminReply}</p>
                </div>
              ) : null}

              <div className="pdp-review-actions">
                <button type="button" className="pdp-review-like">
                  <ThumbsUp size={16} />
                  Helpful
                </button>
                <button type="button" className="pdp-review-dislike">
                  <ThumbsDown size={16} />
                  Not helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pdp-review-empty-state">
          <h3>No reviews yet</h3>
          <p>Be the first to post one.</p>
        </div>
      )}
    </article>
  );
}
