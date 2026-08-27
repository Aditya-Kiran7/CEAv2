// ============================================================
// EDIT ME — the 3 flagship events shown on the Home page,
// plus the full list shown on the Events page.
// IMAGES: drop files in  public/assets/events/  named by id:
//   aakaar.jpg, bridge-it.jpg, concreto.jpg, site-visit.jpg,
//   staad-workshop.jpg, guest-lecture.jpg
// Until a file exists, it falls back to `imageFallback` automatically.
// ============================================================
export const MAJOR_EVENTS = [
  {
    id: "Freshie Night",
    title: "Freshie Night 2026",
    date: "October 2026",
    blurb: "An energetic event with lots of fun and activities for freshers only ;)",
    image: "/assets/events/FreshieNight.jpg",
    
    link: "#", // EDIT: event link / registration URL
  },
  {
    id: "convocation",
    title: "Convocation of Civil Engineering Batch",
    date: "August 2026",
    blurb: "Fairwell to the Civil Engg Branch students of 2026",
    image: "/assets/events/convo.jpg",
    
    link: "#",
  },
  {
    id: "Summer of Core",
    title: "Summer of Core 2026",
    date: "July 2026",
    blurb: "An informative summer camp which has a detailed study of AutoCad, MS Excel and QGIS sowftares",
    image: "/assets/events/soc.jpg",
    link: "#",
  },
];

export const EVENTS = [
  ...MAJOR_EVENTS,
  {
    id: "esports",
    title: "Esports Inter IIT for Civil branch",
    date: "July 2026",
    blurb: "A thunderous tournament consisting of top teams across different IITs",
    image: "/assets/events/esports.jpg",
    link: "#",
  },
  {
    id: "Freshie Orientation",
    title: "Freshers' Orientation",
    date: "July 2026",
    blurb: "A fun and informative orientation for the students who joined the institute this year!",
    image: "/assets/events/oreo.jpg",
    link: "#",
  },
  {
    id: "Treasure Hunt",
    title: "Treasure Hunt 2026",
    date: "Oct 2026",
    blurb: "A mystery based game accross the institute map in which different teams run all out.. until they find the final treasure!",
    image: "/assets/events/THunt.jpg",
    link: "#",
  },
];
