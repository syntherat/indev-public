"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function ProductFaqAccordion({ items = [] }) {
  const [openItems, setOpenItems] = useState({});
  const contentRefs = useRef([]);

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="pdp-faq-list">
      {items.map((item, index) => {
        const isOpen = Boolean(openItems[index]);
        const contentHeight = contentRefs.current[index]?.scrollHeight || 0;

        return (
          <article
            key={`${item.question}-${index}`}
            className={`pdp-faq-item${isOpen ? " is-open" : ""}`}
          >
            <button
              type="button"
              className="pdp-faq-trigger"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={`pdp-faq-answer-${index}`}
            >
              <span className="pdp-faq-icon" aria-hidden="true">
                <Plus size={18} className="pdp-faq-icon-plus" />
                <Minus size={18} className="pdp-faq-icon-minus" />
              </span>
              <span className="pdp-faq-question">{item.question}</span>
            </button>

            <div
              id={`pdp-faq-answer-${index}`}
              className="pdp-faq-answer-wrap"
              style={{
                maxHeight: isOpen ? `${contentHeight + 24}px` : "0px",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p
                className="pdp-faq-answer"
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
              >
                {item.answer}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
