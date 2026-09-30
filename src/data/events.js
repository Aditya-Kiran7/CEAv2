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
    // id: "Freshie Night",
    // title: "Freshie Night 2026",
    // date: "12 October 2026",
    // blurb: "An energetic event with a theme and lots of fun and activities for freshers only ;)",
    // image: "/cea/logo.png",
    
    // link: "#", // EDIT: event link / registration URL
  },
  {
    // id: "TBD",
    // title: "TBD Insti Game 2026",
    // date: "5 Oct 2026",
    // blurb: "A mystery based game accross the institute map in which different teams run all out.. until they find the final treasure!",
    // image: "/cea/logo.png",
    // link: "#",
  },
  
  {
    id: "convocation",
    title: "Convocation of Civil Engineering Batch",
    date: "23 August 2026",
    blurb: "Fairwell to the Civil Engg Branch students of 2026",
    image: "/cea/pics/convo26.jpeg",
    
    link: "https://www.instagram.com/p/DcUSSeXoeNs/?hl=en",
  },
  
];

export const EVENTS = [
  ...MAJOR_EVENTS,
  {
    id: "Freshie Orientation",
    title: "Freshers' Orientation",
    date: "27 July 2026",
    blurb: "A fun and informative orientation for the students who joined the institute this year!",
    image: "/cea/pics/oreo26.jpeg",
    link: "https://www.instagram.com/p/DbSteMiiGA4/?hl=en&img_index=1",
  },
  {
    id: "esports",
    title: "Esports Inter IIT for Civil branch",
    date: "2 July 2026",
    blurb: "A thunderous tournament consisting of top teams across different IITs",
    image: "/cea/pics/esports26.jpeg",
    link: "https://www.instagram.com/p/DaS3QX2kuID/?hl=en&img_index=1",
  },
  {
    id: "Summer of Core",
    title: "Summer of Core 2026",
    date: "July - Aug 2026",
    blurb: "An informative summer camp which has a detailed study of AutoCad, MS Excel and QGIS sowftares",
    image: "/cea/pics/SOC26.jpeg",
    link: "https://www.instagram.com/p/DaArGDLEnl1/?hl=en&img_index=1",
  },
  
  
];
