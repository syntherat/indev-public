import { useId } from "react";

function WebsiteGraphic() {
  const uid = useId().replace(/:/g, "");
  const websiteGlowId = `websiteGlow-${uid}`;
  const websitePanelId = `websitePanel-${uid}`;

  return (
    <svg viewBox="0 0 640 420" className="service-graphic" role="img" aria-label="Website illustration">
      <defs>
        <linearGradient id={websiteGlowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3d7ff" />
          <stop offset="45%" stopColor="#9d7bff" />
          <stop offset="100%" stopColor="#65d4ff" />
        </linearGradient>
        <linearGradient id={websitePanelId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1b1b1f" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>
      <rect x="38" y="40" width="564" height="340" rx="28" fill={`url(#${websitePanelId})`} stroke="rgba(255,255,255,0.14)" />
      <rect x="60" y="64" width="520" height="32" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <circle cx="84" cy="80" r="5" fill="#f7f7f7" opacity="0.7" />
      <circle cx="108" cy="80" r="5" fill="#f7f7f7" opacity="0.45" />
      <circle cx="132" cy="80" r="5" fill="#f7f7f7" opacity="0.28" />
      <rect x="76" y="116" width="232" height="172" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <rect x="328" y="116" width="252" height="74" rx="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
      <rect x="328" y="208" width="252" height="80" rx="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
      <rect x="88" y="132" width="72" height="72" rx="18" fill={`url(#${websiteGlowId})`} opacity="0.92" />
      <rect x="176" y="132" width="104" height="12" rx="6" fill="#ffffff" opacity="0.9" />
      <rect x="176" y="156" width="128" height="10" rx="5" fill="#ffffff" opacity="0.42" />
      <rect x="176" y="178" width="96" height="10" rx="5" fill="#ffffff" opacity="0.25" />
      <rect x="88" y="232" width="198" height="12" rx="6" fill="#ffffff" opacity="0.18" />
      <rect x="88" y="252" width="142" height="12" rx="6" fill="#ffffff" opacity="0.12" />
      <rect x="350" y="136" width="108" height="12" rx="6" fill="#ffffff" opacity="0.8" />
      <rect x="350" y="156" width="154" height="10" rx="5" fill="#ffffff" opacity="0.18" />
      <rect x="350" y="230" width="178" height="12" rx="6" fill="#ffffff" opacity="0.75" />
      <rect x="350" y="250" width="132" height="10" rx="5" fill="#ffffff" opacity="0.18" />
      <path
        d="M110 338C156 288 210 272 278 284C354 297 398 282 514 226"
        fill="none"
        stroke={`url(#${websiteGlowId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="278" cy="284" r="7" fill="#ffffff" opacity="0.8" />
      <circle cx="514" cy="226" r="7" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

function MobileGraphic() {
  const uid = useId().replace(/:/g, "");
  const mobileGlowId = `mobileGlow-${uid}`;
  const mobileScreenId = `mobileScreen-${uid}`;

  return (
    <svg viewBox="0 0 640 420" className="service-graphic" role="img" aria-label="Mobile app illustration">
      <defs>
        <linearGradient id={mobileGlowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe6a3" />
          <stop offset="48%" stopColor="#ff8bd1" />
          <stop offset="100%" stopColor="#7f7cff" />
        </linearGradient>
        <linearGradient id={mobileScreenId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#18181c" />
          <stop offset="100%" stopColor="#060607" />
        </linearGradient>
      </defs>
      <rect x="168" y="34" width="176" height="352" rx="38" fill={`url(#${mobileScreenId})`} stroke="rgba(255,255,255,0.16)" />
      <rect x="204" y="58" width="104" height="300" rx="22" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" />
      <circle cx="256" cy="364" r="10" fill="rgba(255,255,255,0.2)" />
      <rect x="392" y="70" width="138" height="286" rx="34" fill={`url(#${mobileScreenId})`} stroke="rgba(255,255,255,0.12)" transform="rotate(8 461 213)" />
      <rect x="410" y="98" width="106" height="220" rx="22" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" transform="rotate(8 461 213)" />
      <rect x="222" y="92" width="68" height="68" rx="20" fill={`url(#${mobileGlowId})`} opacity="0.92" />
      <rect x="222" y="182" width="68" height="10" rx="5" fill="#ffffff" opacity="0.8" />
      <rect x="222" y="202" width="88" height="10" rx="5" fill="#ffffff" opacity="0.22" />
      <rect x="222" y="226" width="78" height="10" rx="5" fill="#ffffff" opacity="0.14" />
      <rect x="426" y="124" width="72" height="72" rx="18" fill={`url(#${mobileGlowId})`} opacity="0.9" transform="rotate(8 462 160)" />
      <rect x="426" y="220" width="72" height="10" rx="5" fill="#ffffff" opacity="0.82" transform="rotate(8 462 160)" />
      <rect x="426" y="240" width="92" height="10" rx="5" fill="#ffffff" opacity="0.22" transform="rotate(8 462 160)" />
      <path
        d="M118 332C172 300 218 290 266 300C328 313 386 305 510 244"
        fill="none"
        stroke={`url(#${mobileGlowId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="266" cy="300" r="7" fill="#ffffff" opacity="0.8" />
      <circle cx="510" cy="244" r="7" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

function WebAppGraphic() {
  const uid = useId().replace(/:/g, "");
  const webAppGlowId = `webAppGlow-${uid}`;
  const webAppPanelId = `webAppPanel-${uid}`;

  return (
    <svg viewBox="0 0 640 420" className="service-graphic" role="img" aria-label="Web app illustration">
      <defs>
        <linearGradient id={webAppGlowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#89f7c0" />
          <stop offset="50%" stopColor="#67b7ff" />
          <stop offset="100%" stopColor="#b084ff" />
        </linearGradient>
        <linearGradient id={webAppPanelId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#17181c" />
          <stop offset="100%" stopColor="#080809" />
        </linearGradient>
      </defs>
      <rect x="42" y="46" width="556" height="328" rx="26" fill={`url(#${webAppPanelId})`} stroke="rgba(255,255,255,0.14)" />
      <rect x="64" y="68" width="512" height="26" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <rect x="64" y="112" width="176" height="238" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x="258" y="112" width="318" height="106" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x="258" y="236" width="150" height="114" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x="424" y="236" width="152" height="114" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x="86" y="136" width="112" height="12" rx="6" fill="#ffffff" opacity="0.86" />
      <rect x="86" y="160" width="126" height="10" rx="5" fill="#ffffff" opacity="0.2" />
      <rect x="86" y="182" width="96" height="10" rx="5" fill="#ffffff" opacity="0.14" />
      <rect x="86" y="220" width="120" height="12" rx="6" fill="#ffffff" opacity="0.22" />
      <rect x="86" y="242" width="92" height="12" rx="6" fill="#ffffff" opacity="0.16" />
      <rect x="86" y="266" width="138" height="12" rx="6" fill="#ffffff" opacity="0.12" />
      <rect x="282" y="136" width="224" height="10" rx="5" fill="#ffffff" opacity="0.18" />
      <rect x="282" y="158" width="180" height="10" rx="5" fill="#ffffff" opacity="0.12" />
      <path d="M286 190H536" stroke={`url(#${webAppGlowId})`} strokeWidth="4" strokeLinecap="round" />
      <path d="M286 308V268C286 252 300 240 316 240H342C358 240 372 252 372 268V308" fill="none" stroke={`url(#${webAppGlowId})`} strokeWidth="4" strokeLinecap="round" />
      <path d="M318 308V286C318 274 328 264 340 264H470C482 264 492 274 492 286V308" fill="none" stroke={`url(#${webAppGlowId})`} strokeWidth="4" strokeLinecap="round" opacity="0.92" />
      <circle cx="340" cy="280" r="8" fill="#ffffff" opacity="0.78" />
      <circle cx="470" cy="286" r="8" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

function CustomGraphic() {
  const uid = useId().replace(/:/g, "");
  const customGlowId = `customGlow-${uid}`;
  const customPanelId = `customPanel-${uid}`;

  return (
    <svg viewBox="0 0 640 420" className="service-graphic" role="img" aria-label="Custom project illustration">
      <defs>
        <linearGradient id={customGlowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd089" />
          <stop offset="50%" stopColor="#ff8d8d" />
          <stop offset="100%" stopColor="#8b7bff" />
        </linearGradient>
        <linearGradient id={customPanelId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#17171a" />
          <stop offset="100%" stopColor="#080809" />
        </linearGradient>
      </defs>
      <rect x="44" y="46" width="552" height="328" rx="30" fill={`url(#${customPanelId})`} stroke="rgba(255,255,255,0.14)" />
      <path d="M164 136C198 104 246 90 302 90C372 90 420 122 470 176" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
      <path d="M174 276C210 308 256 324 314 324C386 324 444 292 494 238" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
      <rect x="130" y="150" width="112" height="72" rx="18" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" />
      <rect x="274" y="114" width="120" height="92" rx="18" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" />
      <rect x="438" y="150" width="72" height="72" rx="18" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" />
      <rect x="250" y="246" width="140" height="78" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <circle cx="186" cy="186" r="26" fill={`url(#${customGlowId})`} opacity="0.95" />
      <circle cx="334" cy="160" r="30" fill={`url(#${customGlowId})`} opacity="0.82" />
      <circle cx="474" cy="186" r="22" fill={`url(#${customGlowId})`} opacity="0.76" />
      <circle cx="320" cy="284" r="24" fill={`url(#${customGlowId})`} opacity="0.86" />
      <path d="M210 186H274" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.72" />
      <path d="M364 160H438" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.66" />
      <path d="M388 284H456" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      <path d="M118 328C182 260 250 232 320 236C388 240 454 218 520 160" fill="none" stroke={`url(#${customGlowId})`} strokeWidth="4" strokeLinecap="round" />
      <circle cx="320" cy="236" r="7" fill="#ffffff" opacity="0.82" />
      <circle cx="520" cy="160" r="7" fill="#ffffff" opacity="0.58" />
    </svg>
  );
}

export default function ServiceGraphic({ kind }) {
  switch (kind) {
    case "website":
      return <WebsiteGraphic />;
    case "mobile":
      return <MobileGraphic />;
    case "webapp":
      return <WebAppGraphic />;
    case "custom":
    default:
      return <CustomGraphic />;
  }
}