/**
 * Real photographs of Abbottabad and the Galyat ranges, from Wikimedia Commons.
 * All are CC BY-SA or CC0; each is credited on the site (footer → Photo credits).
 * Changes made: resized, and colour-graded where used inside the 3D scene.
 */
export type Place = {
  slug: string;
  src: string;
  place: string;
  caption: string;
  author: string;
  license: 'CC BY-SA 4.0' | 'CC BY-SA 3.0' | 'CC0 1.0';
  file: string;
};

const L = {
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC0 1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
} as const;

export const licenseUrl = (l: Place['license']) => L[l];
export const sourceUrl = (p: Place) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.file)}`;

export const places: Place[] = [
  { slug: 'abbottabad-view', src: '/img/abbottabad/abbottabad-view.jpg', place: 'Abbottabad', caption: 'The city in its bowl of pine hills — where the commits start.', author: 'Fraz.khalid1', license: 'CC0 1.0', file: 'Abbottabad_View.JPG' },
  { slug: 'shimla-hill', src: '/img/abbottabad/shimla-hill.jpg', place: 'Shimla Hill', caption: 'Golden hour over the town, seen from the ridge.', author: 'Arrain1996', license: 'CC BY-SA 4.0', file: 'Shimla_Hill_Abbottabad.jpg' },
  { slug: 'thandiani-evening', src: '/img/abbottabad/thandiani-evening.jpg', place: 'Thandiani', caption: 'The snow range on the horizon, an evening above the haze.', author: 'Farhaj124', license: 'CC BY-SA 4.0', file: 'Thandiani_evening.jpg' },
  { slug: 'thandiani-winter', src: '/img/abbottabad/thandiani-winter.jpg', place: 'Thandiani', caption: 'Winter — fir forest under fresh snow.', author: 'Tanveer Maalik', license: 'CC BY-SA 3.0', file: 'THANDIANI_IN_WINTER.jpg' },
  { slug: 'thandiani-road-winter', src: '/img/abbottabad/thandiani-road-winter.jpg', place: 'Thandiani road', caption: 'Village terraces on the climb, wood smoke in the cold.', author: 'Photoman AHK', license: 'CC BY-SA 3.0', file: 'En_route_Thandiani_in_winter.jpg' },
  { slug: 'mukshpuri', src: '/img/abbottabad/mukshpuri-from-miranjani.jpg', place: 'Mukshpuri', caption: 'Mukshpuri top from Miranjani, a storm building.', author: 'Jawwad Zaki', license: 'CC BY-SA 4.0', file: 'Mukshpuri_top_as_viewed_from_Miranjani.jpg' },
  { slug: 'miranjani-kpk', src: '/img/abbottabad/miranjani-kpk.jpg', place: 'Miranjani', caption: 'Pines and late snow on the Galyat ridges.', author: 'Fiaz3300', license: 'CC BY-SA 4.0', file: 'Miranjani,_KPK,_Pakistan.jpg' },
  { slug: 'miranjani-sunset', src: '/img/abbottabad/miranjani-sunset.jpg', place: 'Miranjani', caption: 'Sunset through the forest on the trail.', author: 'Haris Bin Saqib', license: 'CC BY-SA 4.0', file: 'Sunset_at_Miranjani_(Miranjani,_Nathiagali).jpg' },
  { slug: 'miranjani-top', src: '/img/abbottabad/miranjani-top.jpg', place: 'Miranjani top', caption: 'One tree, wildflowers, and the whole valley below.', author: 'MuhammadAwaisKing', license: 'CC BY-SA 4.0', file: 'Miranjani_Top_Altitude_2950m.jpg' },
  { slug: 'thandiani-meadow', src: '/img/abbottabad/thandiani-1.jpg', place: 'Thandiani', caption: 'Summer meadows, the hill station at its greenest.', author: 'Scifikid', license: 'CC BY-SA 4.0', file: 'Thandiani_1.jpg' },
];

/** Photos used inside the Three.js scene as the real horizon. */
export const horizon = {
  desktop: ['/img/abbottabad/thandiani-evening.jpg', '/img/abbottabad/mukshpuri-from-miranjani.jpg'],
  mobile: ['/img/abbottabad/thandiani-evening-1024.jpg', '/img/abbottabad/mukshpuri-from-miranjani-1024.jpg'],
};
