import { ChevronRight, HelpCircle, Info, Lock, Share2, Text } from "lucide-react";
import { Brand } from "../components/Brand.jsx";
import { PageHeader } from "./PageHeader.jsx";

const rows = [
  ["How it Works", Info, "RoadSOS is an emergency services finder designed to work reliably. It uses your location to discover the nearest hospitals, mechanics, and police stations using Google Maps live data."],
  ["Help & Support", HelpCircle, "If you are experiencing a medical emergency, please call your local emergency number immediately. For app issues, ensure location services are enabled."],
  ["Share App", Share2, null],
  ["Privacy Policy", Lock, "Your location data never leaves your device. All routing and nearby searches are performed directly with Google Maps APIs without tracking."],
  ["Terms & Conditions", Text, "By using RoadSOS, you agree that mapping data is crowdsourced and provided 'as is'. Always verify routes and services independently in critical situations."]
];

export function HelpPage() {
  const [expanded, setExpanded] = useState(null);

  const handleShare = async () => {
    const shareData = { title: "RoadSOS", text: "Check out RoadSOS - The offline emergency map!", url: window.location.origin };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* ignored */ }
    } else {
      navigator.clipboard?.writeText(shareData.url);
      window.alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-full p-5 pt-0">
      <PageHeader title="About / Help" />
      <div className="mt-6 flex justify-center"><Brand /></div>
      <p className="mt-6 text-center text-sm text-muted">Version 1.0.0</p>
      <section className="mt-8 divide-y divide-line border-y border-line">
        {rows.map(([label, Icon, content]) => (
          <div key={label}>
            <button
              onClick={() => content ? setExpanded(expanded === label ? null : label) : handleShare()}
              className="flex w-full items-center gap-3 py-4 text-sm"
            >
              <Icon size={18} />
              <span className="flex-1 text-left font-medium">{label}</span>
              {content ? (
                <ChevronRight size={18} className={`text-muted transition-transform ${expanded === label ? "rotate-90" : ""}`} />
              ) : (
                <Share2 size={16} className="text-muted" />
              )}
            </button>
            {content && expanded === label && (
              <div className="pb-4 pr-4 text-sm leading-relaxed text-muted animate-in slide-in-from-top-2">
                {content}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
