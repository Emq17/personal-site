import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";

type TravelStop = {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  note: string;
  photoUrl?: string;
  tripType?: "City" | "Nature" | "Coastal" | "Mountain" | "Island" | "Airport";
};

type RegionFilter = "All" | "North America" | "Europe" | "Asia" | "Caribbean";

const travelStops: TravelStop[] = [
  {
    id: "ann-arbor",
    city: "Ann Arbor, Michigan",
    country: "United States",
    lat: 42.2808,
    lng: -83.743,
    note: "University city visit in Michigan.",
  },
  {
    id: "antelope-canyon",
    city: "Antelope Canyon, Arizona",
    country: "United States",
    lat: 36.8619,
    lng: -111.3743,
    note: "Slot canyon landscapes in northern Arizona.",
  },
  {
    id: "arches",
    city: "Arches National Park, Utah",
    country: "United States",
    lat: 38.7331,
    lng: -109.5925,
    note: "Red rock arches and desert views.",
  },
  {
    id: "atlanta",
    city: "Atlanta, Georgia",
    country: "United States",
    lat: 33.749,
    lng: -84.388,
    note: "Major city stop in Georgia.",
  },
  {
    id: "augusta",
    city: "Augusta, Georgia",
    country: "United States",
    lat: 33.4735,
    lng: -82.0105,
    note: "Visited eastern Georgia.",
  },
  {
    id: "blue-ridge",
    city: "Blue Ridge, Georgia",
    country: "United States",
    lat: 34.8637,
    lng: -84.3241,
    note: "North Georgia mountain town visit.",
  },
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Thailand",
    lat: 13.7563,
    lng: 100.5018,
    note: "City markets, temples, and nightlife.",
  },
  {
    id: "banff",
    city: "Banff, Alberta",
    country: "Canada",
    lat: 51.1784,
    lng: -115.5708,
    note: "Mountain views and alpine trails.",
  },
  {
    id: "belize",
    city: "Belize",
    country: "Central America",
    lat: 17.1899,
    lng: -88.4976,
    note: "Coastal waters, reefs, and tropical travel.",
  },
  {
    id: "boca-raton",
    city: "Boca Raton, Florida",
    country: "United States",
    lat: 26.3683,
    lng: -80.1289,
    note: "South Florida coastal stop.",
  },
  {
    id: "bonneville",
    city: "Bonneville Salt Flats, Utah",
    country: "United States",
    lat: 40.7608,
    lng: -113.891,
    note: "Salt flats and open desert landscape.",
  },
  {
    id: "bryce",
    city: "Bryce Canyon, Utah",
    country: "United States",
    lat: 37.593,
    lng: -112.1871,
    note: "Hoodoo formations and canyon overlooks.",
  },
  {
    id: "calgary",
    city: "Calgary, Alberta",
    country: "Canada",
    lat: 51.0447,
    lng: -114.0719,
    note: "City stop in Alberta.",
  },
  {
    id: "chicago",
    city: "Chicago, Illinois",
    country: "United States",
    lat: 41.8781,
    lng: -87.6298,
    note: "City architecture and lakefront energy.",
  },
  {
    id: "costa-maya",
    city: "Costa Maya",
    country: "Mexico",
    lat: 18.715,
    lng: -87.7081,
    note: "Caribbean coast travel near Mahahual.",
  },
  {
    id: "dallas",
    city: "Dallas, Texas",
    country: "United States",
    lat: 32.7767,
    lng: -96.797,
    note: "North Texas city visit.",
  },
  {
    id: "dalat",
    city: "Da Lat",
    country: "Vietnam",
    lat: 11.9404,
    lng: 108.4583,
    note: "Highlands city in Vietnam.",
  },
  {
    id: "great-smoky",
    city: "Great Smoky Mountains",
    country: "United States",
    lat: 35.6118,
    lng: -83.4895,
    note: "Mountain national park region.",
  },
  {
    id: "grindelwald",
    city: "Grindelwald",
    country: "Switzerland",
    lat: 46.6242,
    lng: 8.0414,
    note: "Alpine village in the Bernese Oberland.",
  },
  {
    id: "ho-chi-minh",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    lat: 10.8231,
    lng: 106.6297,
    note: "Street food, city energy, and local culture.",
  },
  {
    id: "hoover-dam",
    city: "Hoover Dam, Nevada",
    country: "United States",
    lat: 36.0156,
    lng: -114.7378,
    note: "Dam and Colorado River viewpoints.",
  },
  {
    id: "houston",
    city: "Houston, Texas",
    country: "United States",
    lat: 29.7604,
    lng: -95.3698,
    note: "Gulf Coast city stop in Texas.",
  },
  {
    id: "indiana",
    city: "Indiana",
    country: "United States",
    lat: 39.7684,
    lng: -86.1581,
    note: "Statewide travel stop.",
  },
  {
    id: "jacksonville",
    city: "Jacksonville, Florida",
    country: "United States",
    lat: 30.3322,
    lng: -81.6557,
    note: "Northeast Florida city visit.",
  },
  {
    id: "japan",
    city: "Japan",
    country: "Asia",
    lat: 36.2048,
    lng: 138.2529,
    note: "Culture, precision, and city contrast.",
  },
  {
    id: "kentucky",
    city: "Kentucky",
    country: "United States",
    lat: 37.8393,
    lng: -84.27,
    note: "Statewide travel stop.",
  },
  {
    id: "key-west",
    city: "Key West, Florida",
    country: "United States",
    lat: 24.5551,
    lng: -81.78,
    note: "Southernmost Florida island city.",
  },
  {
    id: "lake-louise",
    city: "Lake Louise, Alberta",
    country: "Canada",
    lat: 51.4254,
    lng: -116.1773,
    note: "Lake and mountain viewpoints.",
  },
  {
    id: "lake-tahoe",
    city: "Lake Tahoe, Nevada",
    country: "United States",
    lat: 39.0968,
    lng: -120.0324,
    note: "Lake and mountain outdoor trips.",
  },
  {
    id: "las-vegas",
    city: "Las Vegas, Nevada",
    country: "United States",
    lat: 36.1699,
    lng: -115.1398,
    note: "City stop in southern Nevada.",
  },
  {
    id: "lauterbrunnen",
    city: "Lauterbrunnen",
    country: "Switzerland",
    lat: 46.5935,
    lng: 7.9091,
    note: "Valley village in the Bernese Alps.",
  },
  {
    id: "los-angeles",
    city: "Los Angeles, California",
    country: "United States",
    lat: 34.0522,
    lng: -118.2437,
    note: "Major Southern California city stop.",
  },
  {
    id: "malibu",
    city: "Malibu, California",
    country: "United States",
    lat: 34.0259,
    lng: -118.7798,
    note: "Coastal drives and ocean views.",
  },
  {
    id: "manila",
    city: "Manila",
    country: "Philippines",
    lat: 14.5995,
    lng: 120.9842,
    note: "International operations and finance experience.",
  },
  {
    id: "pasay",
    city: "Manila Bay",
    country: "Philippines",
    lat: 14.5378,
    lng: 120.9992,
    note: "Pasay area visit at SM Mall of Asia.",
  },
  {
    id: "matterhorn",
    city: "Matterhorn",
    country: "Switzerland",
    lat: 45.9763,
    lng: 7.6586,
    note: "Iconic alpine peak and surrounding routes.",
  },
  {
    id: "miami",
    city: "Miami, Florida",
    country: "United States",
    lat: 25.7617,
    lng: -80.1918,
    note: "South Florida city and coastal stop.",
  },
  {
    id: "mall-of-america",
    city: "Mall of America, Minnesota",
    country: "United States",
    lat: 44.8549,
    lng: -93.2422,
    note: "Visited Mall of America in Bloomington.",
  },
  {
    id: "milan",
    city: "Milan",
    country: "Italy",
    lat: 45.4642,
    lng: 9.19,
    note: "Northern Italy city visit.",
  },
  {
    id: "nassau",
    city: "Nassau",
    country: "Bahamas",
    lat: 25.0443,
    lng: -77.3504,
    note: "Capital city stop in the Bahamas.",
  },
  {
    id: "new-orleans",
    city: "New Orleans, Louisiana",
    country: "United States",
    lat: 29.9511,
    lng: -90.0715,
    note: "Historic neighborhoods and food culture.",
  },
  {
    id: "new-york",
    city: "New York",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    note: "Urban pace, landmarks, and culture.",
  },
  {
    id: "niagara-falls",
    city: "Niagara Falls",
    country: "Canada",
    lat: 43.0962,
    lng: -79.0377,
    note: "Waterfall viewpoints and nearby towns.",
  },
  {
    id: "ohio",
    city: "Ohio",
    country: "United States",
    lat: 40.4173,
    lng: -82.9071,
    note: "Midwest travel and regional stops.",
  },
  {
    id: "orlando",
    city: "Orlando, Florida",
    country: "United States",
    lat: 28.5383,
    lng: -81.3792,
    note: "Central Florida city stop.",
  },
  {
    id: "bgc",
    city: "Bonifacio Global City",
    country: "Philippines",
    lat: 14.5547,
    lng: 121.0487,
    note: "Bonifacio Global City area visit.",
  },
  {
    id: "palawan",
    city: "Palawan",
    country: "Philippines",
    lat: 9.8349,
    lng: 118.7384,
    note: "Island waters and tropical coastlines.",
  },
  {
    id: "pattaya",
    city: "Pattaya",
    country: "Thailand",
    lat: 12.9236,
    lng: 100.8825,
    note: "Beach city trips and coastal views.",
  },
  {
    id: "salt-lake-city",
    city: "Salt Lake City, Utah",
    country: "United States",
    lat: 40.7608,
    lng: -111.891,
    note: "City base for Utah travel.",
  },
  {
    id: "san-francisco",
    city: "San Francisco, California",
    country: "United States",
    lat: 37.7749,
    lng: -122.4194,
    note: "Bay Area city visit.",
  },
  {
    id: "santa-monica",
    city: "Santa Monica, California",
    country: "United States",
    lat: 34.0195,
    lng: -118.4912,
    note: "Beach city in greater Los Angeles.",
  },
  {
    id: "silicon-valley",
    city: "Silicon Valley, California",
    country: "United States",
    lat: 37.3875,
    lng: -122.0575,
    note: "Tech hub region in the Bay Area.",
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    note: "Dense city design and clean transit.",
  },
  {
    id: "st-augustine",
    city: "St. Augustine, Florida",
    country: "United States",
    lat: 29.9012,
    lng: -81.3124,
    note: "Historic coastal city in Florida.",
  },
  {
    id: "tallahassee",
    city: "Tallahassee, Florida",
    country: "United States",
    lat: 30.4383,
    lng: -84.2807,
    note: "Florida capital city visit.",
  },
  {
    id: "tampa",
    city: "Tampa, Florida",
    country: "United States",
    lat: 27.9506,
    lng: -82.4572,
    note: "Gulf Coast Florida city stop.",
  },
  {
    id: "tennessee-aquarium",
    city: "Tennessee Aquarium, Tennessee",
    country: "United States",
    lat: 35.0559,
    lng: -85.3109,
    note: "Visited the Tennessee Aquarium in Chattanooga.",
  },
  {
    id: "toronto",
    city: "Toronto, Ontario",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832,
    note: "Visited downtown neighborhoods and waterfront areas.",
  },
  {
    id: "quebec",
    city: "Quebec, Canada",
    country: "Canada",
    lat: 46.8139,
    lng: -71.208,
    note: "Visited Quebec and surrounding areas.",
  },
  {
    id: "washington",
    city: "Washington",
    country: "United States",
    lat: 38.9072,
    lng: -77.0369,
    note: "Dulles-area airport travel stop.",
    tripType: "Airport",
  },
  {
    id: "zion",
    city: "Zion National Park, Utah",
    country: "United States",
    lat: 37.2982,
    lng: -113.0263,
    note: "Canyon trails and cliffs in southwestern Utah.",
  },
  {
    id: "zurich",
    city: "Zurich",
    country: "Switzerland",
    lat: 47.3769,
    lng: 8.5417,
    note: "Major Swiss city stop.",
  },
];

const regionFilters: RegionFilter[] = [
  "All",
  "North America",
  "Europe",
  "Asia",
  "Caribbean",
];

const regionByCountry: Record<string, Exclude<RegionFilter, "All">> = {
  "United States": "North America",
  Canada: "North America",
  Mexico: "North America",
  "Central America": "North America",
  Switzerland: "Europe",
  Italy: "Europe",
  Thailand: "Asia",
  Vietnam: "Asia",
  Philippines: "Asia",
  Singapore: "Asia",
  Asia: "Asia",
  Bahamas: "Caribbean",
  Caribbean: "Caribbean",
};

function getRegion(stop: TravelStop): Exclude<RegionFilter, "All"> {
  return regionByCountry[stop.country] ?? "North America";
}

export default function TravelMap() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const globeContainerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [countryBorders, setCountryBorders] = useState<object[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(2.2);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("All");
  const [globeReady, setGlobeReady] = useState(false);
  const [globeSize, setGlobeSize] = useState({ width: 760, height: 390 });
  const [webglSupported] = useState(() => {
    if (typeof document === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  });

  const sortedTravelStops = useMemo(
    () => [...travelStops].sort((a, b) => a.city.localeCompare(b.city)),
    []
  );
  const initialStop = sortedTravelStops[0];

  const filteredStops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedTravelStops.filter((stop) => {
      // If the user is actively searching, don't constrain by region chip.
      const regionMatch = q ? true : regionFilter === "All" || getRegion(stop) === regionFilter;
      if (!regionMatch) return false;
      if (!q) return true;
      const haystack = `${stop.city} ${stop.country} ${getRegion(stop)}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, sortedTravelStops, regionFilter]);

  const activeStop = sortedTravelStops.find((stop) => stop.id === activeStopId) ?? null;
  const totalPlaces = travelStops.length;
  const totalCountries = useMemo(
    () => new Set(travelStops.map((stop) => stop.country)).size,
    []
  );
  const globePoints = useMemo(() => {
    return filteredStops.map((stop) => {
      const isActive = stop.id === activeStopId;
      const coreDot = {
        ...stop,
        size: isActive ? 0.5 : 0.38,
        altitude: 0.004,
        color: isActive ? "#22c55e" : "#ffd33d",
      };
      return coreDot;
    });
  }, [filteredStops, activeStopId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const win = window;
    const node = globeContainerRef.current;
    if (!node) return;

    const updateSize = () => {
      const width = Math.max(280, Math.floor(node.clientWidth));
      const height = win.innerWidth < 640 ? 300 : 390;
      setGlobeSize({ width, height });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      win.addEventListener("resize", updateSize);
      return () => win.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    win.addEventListener("resize", updateSize);
    return () => {
      observer.disconnect();
      win.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("https://unpkg.com/geojson-world-map@1.0.2/countries.geo.json")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setCountryBorders(Array.isArray(data?.features) ? data.features : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setCountryBorders([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!globeReady) return;
    const globe = globeRef.current;
    if (!globe) return;
    try {
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enablePan = false;
      controls.minDistance = 150;
      controls.maxDistance = 280;

      globe.pointOfView(
        {
          lat: initialStop?.lat ?? 20,
          lng: initialStop?.lng ?? 0,
          altitude: 2.2,
        },
        0
      );
    } catch {
      // Keep UI alive even if 3D engine hiccups on some browsers/GPUs.
    }
  }, [globeReady, initialStop?.lat, initialStop?.lng]);

  useEffect(() => {
    if (!activeStop || !globeRef.current) return;
    globeRef.current.pointOfView(
      { lat: activeStop.lat, lng: activeStop.lng, altitude: 1.3 },
      1100
    );
  }, [activeStop]);

  const adjustZoom = (delta: number) => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();
    const nextAltitude = Math.min(2.4, Math.max(0.9, (pov.altitude ?? zoomLevel) + delta));
    globeRef.current.pointOfView(
      { lat: pov.lat ?? 39.5, lng: pov.lng ?? -98.35, altitude: nextAltitude },
      450
    );
    setZoomLevel(nextAltitude);
  };

  return (
    <div className="relative rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-[#0f1722] via-[#111a2a] to-[#0f1d2c] p-4 sm:p-6 shadow-[0_16px_40px_rgba(2,6,23,0.45)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-14 right-8 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <p className="text-white/60 mt-1">Search, click, and spin through places I have visited.</p>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-wider text-cyan-100">
          Live Map
        </div>
      </div>

      <div className="mt-4 relative">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-200/70"
        >
          <path
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search places (e.g., Toronto, Japan, Texas)..."
          className="w-full rounded-xl border border-cyan-300/20 bg-[#0b1422]/90 pl-10 pr-4 py-3 text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/55"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {regionFilters.map((region) => {
          const isActive = regionFilter === region;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setRegionFilter(region)}
              className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border transition ${
                isActive
                  ? "border-cyan-300/70 bg-cyan-300/20 text-cyan-100"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-cyan-300/40 hover:text-cyan-100"
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 sm:gap-6">
        <div className="rounded-2xl border border-cyan-300/20 bg-[#0a1220] p-2 sm:p-3 min-h-[300px] sm:min-h-[390px] shadow-[0_10px_30px_rgba(8,145,178,0.15)]">
          <div
            ref={globeContainerRef}
            className="relative h-[300px] sm:h-[390px] w-full rounded-xl overflow-hidden ring-1 ring-cyan-300/10"
          >
            {webglSupported ? (
              <Globe
                ref={globeRef}
                onGlobeReady={() => setGlobeReady(true)}
                width={globeSize.width}
                height={globeSize.height}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="/globe/earth-blue-marble.jpg"
                bumpImageUrl="/globe/earth-topology.png"
                backgroundImageUrl="/globe/night-sky.png"
                showAtmosphere
                atmosphereColor="#6fa2d0"
                atmosphereAltitude={0.05}
                polygonsData={countryBorders}
                polygonAltitude={0.002}
                polygonCapColor={() => "rgba(140, 170, 120, 0.18)"}
                polygonSideColor={() => "rgba(85, 105, 85, 0.15)"}
                polygonStrokeColor={() => "rgba(205, 215, 220, 0.55)"}
                polygonsTransitionDuration={0}
                pointsData={globePoints}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude="altitude"
                pointRadius="size"
                pointResolution={16}
                pointLabel={(d) => {
                  const stop = d as TravelStop;
                  return `${stop.city}, ${stop.country}`;
                }}
                onPointClick={(d) => {
                  const stop = d as TravelStop;
                  setActiveStopId(stop.id);
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-center px-6">
                <p className="text-white/70">
                  3D globe is unavailable in this browser/device, but your visited places list is
                  still fully available on the right.
                </p>
              </div>
            )}

            <div className="absolute right-2 sm:right-3 top-2 sm:top-3 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => adjustZoom(-0.15)}
                disabled={!webglSupported}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-cyan-300/30 bg-[#0b1422]/90 text-cyan-100 text-lg leading-none hover:bg-cyan-300/15 transition"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => adjustZoom(0.15)}
                disabled={!webglSupported}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-cyan-300/30 bg-[#0b1422]/90 text-cyan-100 text-lg leading-none hover:bg-cyan-300/15 transition"
                aria-label="Zoom out"
              >
                -
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-300/15 bg-[#0b1422]/95 p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-2">
              <p className="text-[11px] uppercase tracking-wider text-cyan-100/60">Places</p>
              <p className="text-white font-semibold text-lg">{totalPlaces}</p>
            </div>
            <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-2">
              <p className="text-[11px] uppercase tracking-wider text-cyan-100/60">Countries</p>
              <p className="text-white font-semibold text-lg">{totalCountries}</p>
            </div>
          </div>
          <p className="text-cyan-100/85 text-sm uppercase tracking-[0.16em]">Visited Places</p>
          <div className="mt-3 max-h-[360px] overflow-y-auto pr-1 flex flex-col gap-2">
            {filteredStops.length > 0 ? (
              filteredStops.map((stop) => {
                const isActive = stop.id === activeStop?.id;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => setActiveStopId(stop.id)}
                    className={`text-left px-3 py-3 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? "border-cyan-300/60 bg-cyan-300/15 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-cyan-300/10 hover:border-cyan-300/35"
                    }`}
                  >
                    <div>
                      <p className="font-medium tracking-wide">{stop.city}</p>
                      <p className="text-xs text-cyan-100/60 mt-0.5">{stop.country}</p>
                    </div>
                    {stop.photoUrl ? (
                      <div className="mt-2 overflow-hidden rounded-md border border-white/15">
                        <img
                          src={stop.photoUrl}
                          alt={`Travel memory from ${stop.city}`}
                          className="h-24 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-sm text-white/60">
                No places found. Try a different search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
