"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Clock3,
  Globe2,
  Linkedin,
  Mail,
  MessageSquare,
  ArrowRight,
  UserPlus,
  X,
} from "lucide-react";
import { createContactMessage } from "@/lib/contactApi";
import { createMeetingRequest } from "@/lib/meetingApi";
import styles from "./page.module.css";

const DURATION_MINUTES = 30;
const CONTACT_TOPICS = [
  "Project inquiry",
  "Partnership",
  "Support",
  "General question",
  "Other",
];

function buildSlots(startHour = 11, endHour = 20) {
  const generated = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    generated.push(`${String(hour).padStart(2, "0")}:00`);
    if (hour !== endHour) {
      generated.push(`${String(hour).padStart(2, "0")}:30`);
    }
  }

  return generated;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
}

function formatTimeLabel(slot, timeFormat) {
  if (timeFormat === "24h") {
    return slot;
  }

  const [hourPart, minutePart] = slot.split(":");
  const hour = Number(hourPart);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutePart} ${period}`;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const slots = buildSlots();

export default function ContactPageClient({ mode = "call" }) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);
  const minBookDate = useMemo(() => {
    const min = new Date(today);
    min.setDate(min.getDate() + 3);
    return min;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [step, setStep] = useState("schedule");
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(minBookDate.getFullYear(), minBookDate.getMonth(), 1)
  );
  const [guestInputs, setGuestInputs] = useState([""]);
  const [guests, setGuests] = useState([]);
  const [guestsExpanded, setGuestsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageForm, setMessageForm] = useState({
    clientName: "",
    clientEmail: "",
    topic: "",
    message: "",
  });
  const [messageConsent, setMessageConsent] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    companyName: "",
    message: "",
  });

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata", []);
  const meetingDate = useMemo(() => (selectedDate ? formatDateForApi(selectedDate) : ""), [selectedDate]);
  const monthLabel = useMemo(
    () =>
      visibleMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [visibleMonth]
  );
  const canGoPrevMonth =
    visibleMonth.getFullYear() > minBookDate.getFullYear() ||
    (visibleMonth.getFullYear() === minBookDate.getFullYear() &&
      visibleMonth.getMonth() > minBookDate.getMonth());
  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const cells = Array.from({ length: totalCells }, (_, idx) => {
      const dayNumber = idx - firstWeekday + 1;

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return null;
      }

      return new Date(year, month, dayNumber);
    });

    return cells;
  }, [visibleMonth]);
  const meetingDateDisplay = useMemo(
    () => {
      if (!selectedDate) {
        return "Select a date";
      }

      return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    },
    [selectedDate]
  );
  const selectedTimeRange = useMemo(
    () =>
      selectedSlot
        ? `${formatTimeLabel(selectedSlot, timeFormat)} - ${formatTimeLabel(
            getEndTime(selectedSlot, DURATION_MINUTES),
            timeFormat
          )}`
        : "Select a time",
    [selectedSlot, timeFormat]
  );
  const slotsHeaderLabel = useMemo(() => {
    const baseDate = selectedDate || minBookDate;
    const weekday = baseDate.toLocaleDateString("en-US", { weekday: "short" });
    const day = String(baseDate.getDate()).padStart(2, "0");
    return `${weekday} ${day}`;
  }, [selectedDate, minBookDate]);
  const isCallMode = mode !== "message";

  function addGuestEmail(candidateIndex) {
    const candidate = String(guestInputs[candidateIndex] || "").trim().toLowerCase();

    if (!candidate) {
      return;
    }

    if (!isValidEmail(candidate)) {
      setError("Please enter a valid guest email.");
      return;
    }

    setGuests((prev) => {
      if (prev.includes(candidate)) {
        return prev;
      }

      return [...prev, candidate];
    });
    setError("");
    clearGuestInput(candidateIndex);
  }

  function clearGuestInput(index) {
    const newInputs = [...guestInputs];
    newInputs[index] = "";
    setGuestInputs(newInputs);
  }

  function updateGuestInput(index, value) {
    const newInputs = [...guestInputs];
    newInputs[index] = value;
    setGuestInputs(newInputs);
  }

  function addAnotherGuestField() {
    setGuestInputs([...guestInputs, ""]);
  }

  function removeGuestField(index) {
    setGuestInputs(guestInputs.filter((_, i) => i !== index));
  }

  function removeGuestEmail(email) {
    setGuests((prev) => prev.filter((item) => item !== email));
  }

  function collectSubmittedGuests() {
    const merged = [...guests];

    for (const rawInput of guestInputs) {
      const email = String(rawInput || "").trim().toLowerCase();

      if (!email) {
        continue;
      }

      if (!isValidEmail(email)) {
        return { error: "Please enter valid guest email addresses before submitting.", guests: [] };
      }

      if (!merged.includes(email)) {
        merged.push(email);
      }
    }

    return { error: "", guests: merged };
  }

  async function submitMeetingRequest(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDate || !selectedSlot) {
      setError("Please select a valid date and time first.");
      return;
    }

    if (!form.clientName.trim() || !form.clientEmail.trim()) {
      setError("Please add your name and email to continue.");
      return;
    }

    const guestSubmission = collectSubmittedGuests();

    if (guestSubmission.error) {
      setError(guestSubmission.error);
      return;
    }

    setLoading(true);

    try {
      await createMeetingRequest({
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim(),
        companyName: form.companyName.trim(),
        timezone,
        meetingDate,
        meetingTime: selectedSlot,
        durationMinutes: DURATION_MINUTES,
        message: form.message.trim(),
        guestEmails: guestSubmission.guests,
      });

      setSuccessMessage("Meeting request submitted successfully");
      setShowSuccessState(true);
      
      setTimeout(() => {
        setShowSuccessState(false);
        setLoading(false);
        setForm({
          clientName: "",
          clientEmail: "",
          companyName: "",
          message: "",
        });
        setGuests([]);
        setGuestInputs([""]);
        setGuestsExpanded(false);
        setSelectedDate(null);
        setSelectedSlot("");
        setStep("schedule");
      }, 3000);
    } catch (err) {
      setError(err.message || "Could not submit the request. Please try again.");
      setLoading(false);
    }
  }

  async function submitContactMessage(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!messageForm.clientName.trim() || !messageForm.clientEmail.trim() || !messageForm.topic.trim()) {
      setError("Please add your name, email, and topic to continue.");
      return;
    }

    if (!isValidEmail(messageForm.clientEmail.trim())) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!messageForm.message.trim()) {
      setError("Please write a short message before sending.");
      return;
    }

    if (!messageConsent) {
      setError("Please agree to the data collection notice before sending.");
      return;
    }

    setMessageLoading(true);

    try {
      await createContactMessage({
        clientName: messageForm.clientName.trim(),
        clientEmail: messageForm.clientEmail.trim(),
        topic: messageForm.topic.trim(),
        message: messageForm.message.trim(),
      });

      setSuccessMessage("Message sent successfully");
      setShowSuccessState(true);
      
      setTimeout(() => {
        setShowSuccessState(false);
        setMessageLoading(false);
        setMessageForm({
          clientName: "",
          clientEmail: "",
          topic: "",
          message: "",
        });
        setMessageConsent(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "Could not send the message. Please try again.");
      setMessageLoading(false);
    }
  }

  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Contact</p>
        <h1>
          Project, Role or <span>Just a Hey?</span>
        </h1>

        <div className={styles.actionRail}>
          <Link
            href="/contact/book-call"
            className={`${styles.actionBtn} ${isCallMode ? styles.actionBtnActive : ""}`}
          >
            <CalendarDays size={15} />
            Book a Call
          </Link>
          <Link
            href="/contact/send-message"
            className={`${styles.actionBtn} ${!isCallMode ? styles.actionBtnActive : ""}`}
          >
            <MessageSquare size={15} />
            Send Message
          </Link>

          <div className={styles.socialRail}>
            <a href="mailto:hello@indevdigital.com" aria-label="Email">
              <Mail size={14} />
            </a>
            <a href="https://www.linkedin.com" aria-label="LinkedIn">
              <Linkedin size={14} />
            </a>
          </div>
        </div>
      </section>

      {isCallMode ? (
        <section className={`${styles.schedulerWrap} ${step === "details" ? styles.schedulerWrapDetails : ""}`}>
          {showSuccessState ? (
            <div className={`${styles.scheduler} ${styles.successState}`}>
              <div className={styles.successContent}>
                <div className={styles.successCheckmark}>✓</div>
                <h2 className={styles.successTitle}>{successMessage}</h2>
                <p className={styles.successSubtitle}>We've received your request and will be in touch shortly.</p>
              </div>
            </div>
          ) : (
            <div className={`${styles.scheduler} ${step === "details" ? styles.schedulerDetails : ""}`}>
          <aside className={styles.infoPanel}>
            <div className={styles.logoBadge}>
              <img src="/assets/logo-square.png" alt="Indev logo" />
            </div>
            <p className={styles.hostName}>Indev Digital</p>
            <h2>30 Min Meeting</h2>

            {selectedDate && selectedSlot ? (
              <div className={styles.inlineSelectionMeta}>
                <p>
                  <CalendarDays size={15} />
                  {meetingDateDisplay}
                </p>
                <p>
                  <Clock3 size={15} />
                  {selectedTimeRange}
                </p>
              </div>
            ) : null}

            <ul className={styles.infoList}>
              <li>
                <CheckSquare size={16} />
                Requires confirmation
              </li>
              <li>
                <Clock3 size={16} />
                {DURATION_MINUTES}m
              </li>
              <li>
                <img src="/assets/google-meet.svg" alt="Google Meet" className={styles.meetIcon} />
                Google Meet
              </li>
              <li>
                <Globe2 size={16} />
                {timezone}
              </li>
            </ul>
          </aside>

          {step === "schedule" ? (
            <>
              <div className={`${styles.calendarPanel} ${styles.fadeIn}`}>
                <header className={styles.calendarHead}>
                  <h3>{monthLabel}</h3>
                  <div className={styles.calendarArrows}>
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() => {
                        if (canGoPrevMonth) {
                          setVisibleMonth(
                            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                          );
                        }
                      }}
                      disabled={!canGoPrevMonth}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                      }
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </header>

                <div className={styles.weekdays}>
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className={styles.daysGrid}>
                  {calendarCells.map((date, index) => {
                    const isSelected = Boolean(selectedDate && date && sameDay(selectedDate, date));
                    const isBeforeMin = Boolean(date && date < minBookDate);
                    const isAvailable = Boolean(date && !isBeforeMin);

                    return (
                      <button
                        key={date ? `${date.toISOString()}-${index}` : `empty-${index}`}
                        type="button"
                        disabled={!date || isBeforeMin}
                        className={`${styles.dayCell} ${isSelected ? styles.daySelected : ""} ${
                          isAvailable ? styles.dayAvailable : ""
                        }`}
                        onClick={() => {
                          if (date && !isBeforeMin) {
                            setSelectedDate(date);

                            if (selectedSlot) {
                              setStep("details");
                            }
                          }
                        }}
                      >
                        {date ? date.getDate() : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className={`${styles.slotsPanel} ${styles.fadeIn}`}>
                <header className={styles.slotsHead}>
                  <h3 className={styles.slotsTitle}>{slotsHeaderLabel}</h3>
                  <div className={styles.durationToggle}>
                    <button
                      type="button"
                      className={timeFormat === "12h" ? styles.durationActive : ""}
                      onClick={() => setTimeFormat("12h")}
                    >
                      12h
                    </button>
                    <button
                      type="button"
                      className={timeFormat === "24h" ? styles.durationActive : ""}
                      onClick={() => setTimeFormat("24h")}
                    >
                      24h
                    </button>
                  </div>
                </header>

                <div className={styles.slotsList}>
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotBtnActive : ""}`}
                      onClick={() => {
                        setSelectedSlot(slot);

                        if (selectedDate) {
                          setStep("details");
                        }
                      }}
                    >
                      {formatTimeLabel(slot, timeFormat)}
                    </button>
                  ))}
                </div>
              </aside>
            </>
          ) : (
            <section className={`${styles.detailsPanel} ${styles.fadeIn}`}>
              <form className={`${styles.requestForm} ${loading ? styles.loadingForm : ""}`} onSubmit={submitMeetingRequest} aria-busy={loading}>
                <div className={styles.formField}>
                  <label htmlFor="clientName">Your name *</label>
                  <input
                    id="clientName"
                    type="text"
                    value={form.clientName}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        clientName: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="clientEmail">Email address *</label>
                  <input
                    id="clientEmail"
                    type="email"
                    value={form.clientEmail}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        clientEmail: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="meetingTopic">What is this meeting about? *</label>
                  <input
                    id="meetingTopic"
                    type="text"
                    value={form.companyName}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        companyName: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="additionalNotes">Additional notes</label>
                  <textarea
                    id="additionalNotes"
                    placeholder="Please share anything that will help prepare for our meeting."
                    value={form.message}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

{!guestsExpanded ? (
                  <button
                    type="button"
                    className={styles.addGuestsBtn}
                    onClick={() => setGuestsExpanded(true)}
                  >
                    <UserPlus size={16} />
                    Add guests
                  </button>
                ) : (
                  <div className={styles.formField}>
                    <label htmlFor="guestEmail">Add guests</label>
                    {guestInputs.map((input, index) => (
                      <div key={index} className={styles.guestInputWrap}>
                        <input
                          id={index === 0 ? "guestEmail" : undefined}
                          type="email"
                          placeholder="Email"
                          value={input}
                          onChange={(event) => updateGuestInput(index, event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addGuestEmail(index);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className={styles.removeFieldBtn}
                          onClick={() => removeGuestField(index)}
                          aria-label="Remove email field"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    {guests.length > 0 ? (
                      <div className={styles.guestChips}>
                        {guests.map((guest) => (
                          <span key={guest} className={styles.guestChip}>
                            {guest}
                            <button
                              type="button"
                              aria-label={`Remove ${guest}`}
                              onClick={() => removeGuestEmail(guest)}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      className={styles.addAnotherBtn}
                      onClick={addAnotherGuestField}
                    >
                      <UserPlus size={14} />
                      Add another
                    </button>
                  </div>
                )}

                <p className={styles.termsLine}>
                  By proceeding, you agree to Indev Digital's <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
                </p>

                <div className={styles.detailsActions}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => {
                      setStep("schedule");
                      setSelectedDate(null);
                      setSelectedSlot("");
                      if (guests.length === 0 && guestInputs.every(input => input.trim() === "")) {
                        setGuestsExpanded(false);
                      }
                    }}
                    disabled={loading}
                  >
                    Back
                  </button>

                  <button type="submit" className={styles.confirmBtn} disabled={loading}>
                    {loading ? "Submitting..." : "Confirm"}
                  </button>
                </div>

                {loading ? (
                  <div className={styles.loadingOverlay} aria-hidden="true">
                    <div className={styles.loadingCard}>
                      <div className={styles.loadingSpinner} />
                      <span>Submitting...</span>
                    </div>
                  </div>
                ) : null}

                {error ? <p className={styles.formError}>{error}</p> : null}
                {success ? <p className={styles.formSuccess}>{success}</p> : null}
              </form>
            </section>
          )}
            </div>
          )}
        </section>
      ) : (
        <section className={styles.messageWrap}>
          {showSuccessState ? (
            <div className={`${styles.messageCard} ${styles.successState}`}>
              <div className={styles.successContent}>
                <div className={styles.successCheckmark}>✓</div>
                <h2 className={styles.successTitle}>{successMessage}</h2>
                <p className={styles.successSubtitle}>We've received your message and will reply soon.</p>
              </div>
            </div>
          ) : (
            <div className={`${styles.messageCard} ${styles.messageCardReveal}`}>
            <div className={styles.messageIntro}>
              <p className={styles.messageKicker}>Send Message</p>
              <p>Drop a note with the essentials and I’ll route it to the right inbox.</p>
            </div>

            <form className={`${styles.messageForm} ${messageLoading ? styles.loadingForm : ""}`} onSubmit={submitContactMessage} aria-busy={messageLoading}>
              <div className={styles.messageTopRow}>
                <div className={styles.formField}>
                  <label htmlFor="messageName">Name</label>
                  <input
                    id="messageName"
                    type="text"
                    placeholder="Jane Doe"
                    value={messageForm.clientName}
                    onChange={(event) =>
                      setMessageForm((prev) => ({
                        ...prev,
                        clientName: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="messageEmail">Email</label>
                  <input
                    id="messageEmail"
                    type="email"
                    placeholder="jane@example.com"
                    value={messageForm.clientEmail}
                    onChange={(event) =>
                      setMessageForm((prev) => ({
                        ...prev,
                        clientEmail: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="messageTopic">Topic</label>
                <select
                  id="messageTopic"
                  value={messageForm.topic}
                  onChange={(event) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      topic: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {CONTACT_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <label htmlFor="messageBody">Message</label>
                <textarea
                  id="messageBody"
                  placeholder="Tell me about your project, idea, or just say hi..."
                  value={messageForm.message}
                  onChange={(event) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  rows={6}
                  required
                />
              </div>

              <label className={styles.consentRow}>
                <input
                  type="checkbox"
                  checked={messageConsent}
                  onChange={(event) => setMessageConsent(event.target.checked)}
                />
                <span>
                  I agree that my submitted data is collected and stored to respond to my inquiry.
                </span>
              </label>

              <button type="submit" className={styles.confirmBtn} disabled={messageLoading}>
                {messageLoading ? "Sending..." : "Send Message"}
                <ArrowRight size={16} />
              </button>

              {messageLoading ? (
                <div className={styles.loadingOverlay} aria-hidden="true">
                  <div className={styles.loadingCard}>
                    <div className={styles.loadingSpinner} />
                    <span>Sending...</span>
                  </div>
                </div>
              ) : null}

              {error ? <p className={styles.formError}>{error}</p> : null}
              {success ? <p className={styles.formSuccess}>{success}</p> : null}
            </form>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
