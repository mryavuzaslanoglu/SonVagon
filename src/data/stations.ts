import { Station } from '../types';

// Full line interval: 15 min (Halkalı-Gebze)
// Short line interval: 8 min (Ataköy-Pendik)
const F = 15; // full line
const S = 15; // short line (individual interval; combined with full line gives ~7-8 min)

// All 43 Marmaray stations from Halkalı (west) to Gebze (east)
// Data from official TCDD timetable (indir_small.jpg)
// weekendLastTrain: Hafta Sonu son sefer (full line = weekday + 150 min, short line = weekday lastTrain)
export const stations: Station[] = [
  // ═══ HALKALI ZONE (full line only, 15 min) ═══
  {
    id: 'halkali',
    name: 'Halkalı',
    latitude: 41.0194, longitude: 28.7758,
    district: 'Küçükçekmece', side: 'avrupa', order: 0,
    transfers: ['İstanbul Havalimanı Metro (yapım aşamasında)'],
    schedule: {
      toHalkali: null, // Terminus
      toGebze: { firstTrain: '05:58', lastTrain: '22:58', weekendLastTrain: '01:28', intervalMinutes: F },
    },
  },
  {
    id: 'mustafa-kemal',
    name: 'Mustafa Kemal',
    latitude: 41.0174, longitude: 28.7876,
    district: 'Küçükçekmece', side: 'avrupa', order: 1,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:22', lastTrain: '00:35', weekendLastTrain: '03:05', intervalMinutes: F },
      toGebze: { firstTrain: '06:01', lastTrain: '23:01', weekendLastTrain: '01:31', intervalMinutes: F },
    },
  },
  {
    id: 'kucukcekmece',
    name: 'Küçükçekmece',
    latitude: 41.0042, longitude: 28.7796,
    district: 'Küçükçekmece', side: 'avrupa', order: 2,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:19', lastTrain: '00:32', weekendLastTrain: '03:02', intervalMinutes: F },
      toGebze: { firstTrain: '06:03', lastTrain: '23:03', weekendLastTrain: '01:33', intervalMinutes: F },
    },
  },
  {
    id: 'florya',
    name: 'Florya',
    latitude: 40.9830, longitude: 28.7880,
    district: 'Bakırköy', side: 'avrupa', order: 3,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:16', lastTrain: '00:29', weekendLastTrain: '02:59', intervalMinutes: F },
      toGebze: { firstTrain: '06:06', lastTrain: '23:06', weekendLastTrain: '01:36', intervalMinutes: F },
    },
  },
  {
    id: 'florya-akvaryum',
    name: 'Florya Akvaryum',
    latitude: 40.9893, longitude: 28.7860,
    district: 'Bakırköy', side: 'avrupa', order: 4,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:14', lastTrain: '00:27', weekendLastTrain: '02:57', intervalMinutes: F },
      toGebze: { firstTrain: '06:08', lastTrain: '23:08', weekendLastTrain: '01:38', intervalMinutes: F },
    },
  },
  {
    id: 'yesilkoy',
    name: 'Yeşilköy',
    latitude: 40.9796, longitude: 28.8137,
    district: 'Bakırköy', side: 'avrupa', order: 5,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:11', lastTrain: '00:24', weekendLastTrain: '02:54', intervalMinutes: F },
      toGebze: { firstTrain: '06:11', lastTrain: '23:11', weekendLastTrain: '01:41', intervalMinutes: F },
    },
  },
  {
    id: 'yesilyurt',
    name: 'Yeşilyurt',
    latitude: 40.9778, longitude: 28.8290,
    district: 'Bakırköy', side: 'avrupa', order: 6,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:09', lastTrain: '00:22', weekendLastTrain: '02:52', intervalMinutes: F },
      toGebze: { firstTrain: '06:13', lastTrain: '23:13', weekendLastTrain: '01:43', intervalMinutes: F },
    },
  },

  // ═══ SHORT LINE ZONE (full 15 min + short 8 min) ═══
  {
    id: 'atakoy',
    name: 'Ataköy',
    latitude: 40.9780, longitude: 28.8460,
    district: 'Bakırköy', side: 'avrupa', order: 7,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:06', lastTrain: '00:19', weekendLastTrain: '02:49', intervalMinutes: F },
      toGebze: { firstTrain: '06:02', lastTrain: '23:16', weekendLastTrain: '01:46', intervalMinutes: F },
      shortToHalkali: null, // Short line terminus towards Ataköy
      shortToGebze: { firstTrain: '06:09', lastTrain: '21:54', weekendLastTrain: '21:54', intervalMinutes: S },
    },
  },
  {
    id: 'bakirkoy',
    name: 'Bakırköy',
    latitude: 40.9804, longitude: 28.8623,
    district: 'Bakırköy', side: 'avrupa', order: 8,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:04', lastTrain: '00:17', weekendLastTrain: '02:47', intervalMinutes: F },
      toGebze: { firstTrain: '06:05', lastTrain: '23:19', weekendLastTrain: '01:49', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:10', lastTrain: '21:40', weekendLastTrain: '21:40', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:12', lastTrain: '21:57', weekendLastTrain: '21:57', intervalMinutes: S },
    },
  },
  {
    id: 'yenimahalle',
    name: 'Yenimahalle',
    latitude: 40.9850, longitude: 28.8770,
    district: 'Bayrampaşa', side: 'avrupa', order: 9,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:02', lastTrain: '00:15', weekendLastTrain: '02:45', intervalMinutes: F },
      toGebze: { firstTrain: '06:07', lastTrain: '23:21', weekendLastTrain: '01:51', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:08', lastTrain: '21:38', weekendLastTrain: '21:38', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:14', lastTrain: '21:59', weekendLastTrain: '21:59', intervalMinutes: S },
    },
  },
  {
    id: 'zeytinburnu',
    name: 'Zeytinburnu',
    latitude: 40.9917, longitude: 28.8980,
    district: 'Zeytinburnu', side: 'avrupa', order: 10,
    transfers: ['T1 Tramvay', 'M1A/M1B Metro'],
    schedule: {
      toHalkali: { firstTrain: '06:12', lastTrain: '00:12', weekendLastTrain: '02:42', intervalMinutes: F },
      toGebze: { firstTrain: '06:10', lastTrain: '23:24', weekendLastTrain: '01:54', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:05', lastTrain: '21:35', weekendLastTrain: '21:35', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:01', lastTrain: '22:02', weekendLastTrain: '22:02', intervalMinutes: S },
    },
  },
  {
    id: 'kazlicesme',
    name: 'Kazlıçeşme',
    latitude: 40.9917, longitude: 28.9210,
    district: 'Zeytinburnu', side: 'avrupa', order: 11,
    transfers: ['Metrobüs'],
    schedule: {
      toHalkali: { firstTrain: '06:10', lastTrain: '00:10', weekendLastTrain: '02:40', intervalMinutes: F },
      toGebze: { firstTrain: '06:12', lastTrain: '23:26', weekendLastTrain: '01:56', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:03', lastTrain: '23:33', weekendLastTrain: '23:33', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:03', lastTrain: '22:04', weekendLastTrain: '22:04', intervalMinutes: S },
    },
  },
  {
    id: 'yenikapi',
    name: 'Yenikapı',
    latitude: 41.0053, longitude: 28.9530,
    district: 'Fatih', side: 'avrupa', order: 12,
    transfers: ['M1A Metro', 'M2 Metro', 'İDO/BUDO Feribot'],
    schedule: {
      toHalkali: { firstTrain: '06:06', lastTrain: '00:06', weekendLastTrain: '02:36', intervalMinutes: F },
      toGebze: { firstTrain: '06:00', lastTrain: '23:30', weekendLastTrain: '02:00', intervalMinutes: F },
      shortToHalkali: { firstTrain: '05:59', lastTrain: '23:29', weekendLastTrain: '23:29', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:07', lastTrain: '22:08', weekendLastTrain: '22:08', intervalMinutes: S },
    },
  },
  {
    id: 'sirkeci',
    name: 'Sirkeci',
    latitude: 41.0117, longitude: 28.9767,
    district: 'Fatih', side: 'avrupa', order: 13,
    transfers: ['T1 Tramvay'],
    schedule: {
      toHalkali: { firstTrain: '06:03', lastTrain: '00:03', weekendLastTrain: '02:33', intervalMinutes: F },
      toGebze: { firstTrain: '06:03', lastTrain: '23:33', weekendLastTrain: '02:03', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:11', lastTrain: '23:26', weekendLastTrain: '23:26', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:10', lastTrain: '22:11', weekendLastTrain: '22:11', intervalMinutes: S },
    },
  },
  {
    id: 'uskudar',
    name: 'Üsküdar',
    latitude: 41.0267, longitude: 29.0150,
    district: 'Üsküdar', side: 'asya', order: 14,
    transfers: ['M5 Metro', 'İDO/Şehir Hatları Vapur'],
    schedule: {
      toHalkali: { firstTrain: '05:59', lastTrain: '23:59', weekendLastTrain: '02:29', intervalMinutes: F },
      toGebze: { firstTrain: '06:07', lastTrain: '23:37', weekendLastTrain: '02:07', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:07', lastTrain: '23:22', weekendLastTrain: '23:22', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:00', lastTrain: '22:15', weekendLastTrain: '22:15', intervalMinutes: S },
    },
  },
  {
    id: 'ayrilik-cesmesi',
    name: 'Ayrılıkçeşmesi',
    latitude: 41.0220, longitude: 29.0190,
    district: 'Üsküdar', side: 'asya', order: 15,
    transfers: ['M4 Metro'],
    schedule: {
      toHalkali: { firstTrain: '06:10', lastTrain: '23:55', weekendLastTrain: '02:25', intervalMinutes: F },
      toGebze: { firstTrain: '06:11', lastTrain: '23:41', weekendLastTrain: '02:11', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:03', lastTrain: '23:18', weekendLastTrain: '23:18', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:04', lastTrain: '22:19', weekendLastTrain: '22:19', intervalMinutes: S },
    },
  },
  {
    id: 'sogutlucesme',
    name: 'Söğütlüçeşme',
    latitude: 40.9960, longitude: 29.0282,
    district: 'Kadıköy', side: 'asya', order: 16,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:07', lastTrain: '23:52', weekendLastTrain: '02:22', intervalMinutes: F },
      toGebze: { firstTrain: '06:00', lastTrain: '23:44', weekendLastTrain: '02:14', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:00', lastTrain: '23:15', weekendLastTrain: '23:15', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:07', lastTrain: '22:22', weekendLastTrain: '22:22', intervalMinutes: S },
    },
  },
  {
    id: 'feneryolu',
    name: 'Feneryolu',
    latitude: 40.9890, longitude: 29.0400,
    district: 'Kadıköy', side: 'asya', order: 17,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:04', lastTrain: '23:49', weekendLastTrain: '02:19', intervalMinutes: F },
      toGebze: { firstTrain: '06:02', lastTrain: '23:46', weekendLastTrain: '02:16', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:12', lastTrain: '23:12', weekendLastTrain: '23:12', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:09', lastTrain: '22:24', weekendLastTrain: '22:24', intervalMinutes: S },
    },
  },
  {
    id: 'goztepe',
    name: 'Göztepe',
    latitude: 40.9810, longitude: 29.0530,
    district: 'Kadıköy', side: 'asya', order: 18,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:02', lastTrain: '23:47', weekendLastTrain: '02:17', intervalMinutes: F },
      toGebze: { firstTrain: '06:04', lastTrain: '23:48', weekendLastTrain: '02:18', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:10', lastTrain: '23:10', weekendLastTrain: '23:10', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:11', lastTrain: '22:26', weekendLastTrain: '22:26', intervalMinutes: S },
    },
  },
  {
    id: 'erenkoy',
    name: 'Erenköy',
    latitude: 40.9720, longitude: 29.0650,
    district: 'Kadıköy', side: 'asya', order: 19,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:00', lastTrain: '23:45', weekendLastTrain: '02:15', intervalMinutes: F },
      toGebze: { firstTrain: '06:06', lastTrain: '23:50', weekendLastTrain: '02:20', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:08', lastTrain: '23:08', weekendLastTrain: '23:08', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:13', lastTrain: '22:28', weekendLastTrain: '22:28', intervalMinutes: S },
    },
  },
  {
    id: 'suadiye',
    name: 'Suadiye',
    latitude: 40.9630, longitude: 29.0762,
    district: 'Kadıköy', side: 'asya', order: 20,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:13', lastTrain: '23:42', weekendLastTrain: '02:12', intervalMinutes: F },
      toGebze: { firstTrain: '06:09', lastTrain: '23:53', weekendLastTrain: '02:23', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:05', lastTrain: '23:05', weekendLastTrain: '23:05', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:01', lastTrain: '22:31', weekendLastTrain: '22:31', intervalMinutes: S },
    },
  },
  {
    id: 'bostanci',
    name: 'Bostancı',
    latitude: 40.9612, longitude: 29.0882,
    district: 'Kadıköy', side: 'asya', order: 21,
    transfers: ['İDO Feribot'],
    schedule: {
      toHalkali: { firstTrain: '06:11', lastTrain: '23:40', weekendLastTrain: '02:10', intervalMinutes: F },
      toGebze: { firstTrain: '06:11', lastTrain: '23:55', weekendLastTrain: '02:25', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:03', lastTrain: '23:03', weekendLastTrain: '23:03', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:03', lastTrain: '22:33', weekendLastTrain: '22:33', intervalMinutes: S },
    },
  },
  {
    id: 'kucukyali',
    name: 'Küçükyalı',
    latitude: 40.9520, longitude: 29.0990,
    district: 'Maltepe', side: 'asya', order: 22,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:08', lastTrain: '23:37', weekendLastTrain: '02:07', intervalMinutes: F },
      toGebze: { firstTrain: '06:14', lastTrain: '23:58', weekendLastTrain: '02:28', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:00', lastTrain: '23:00', weekendLastTrain: '23:00', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:06', lastTrain: '22:36', weekendLastTrain: '22:36', intervalMinutes: S },
    },
  },
  {
    id: 'idealtepe',
    name: 'İdealtepe',
    latitude: 40.9440, longitude: 29.1100,
    district: 'Maltepe', side: 'asya', order: 23,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:06', lastTrain: '23:35', weekendLastTrain: '02:05', intervalMinutes: F },
      toGebze: { firstTrain: '06:00', lastTrain: '00:00', weekendLastTrain: '02:30', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:13', lastTrain: '22:58', weekendLastTrain: '22:58', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:08', lastTrain: '22:38', weekendLastTrain: '22:38', intervalMinutes: S },
    },
  },
  {
    id: 'sureyya-plaji',
    name: 'Süreyya Plajı',
    latitude: 40.9380, longitude: 29.1210,
    district: 'Maltepe', side: 'asya', order: 24,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:04', lastTrain: '23:33', weekendLastTrain: '02:03', intervalMinutes: F },
      toGebze: { firstTrain: '06:02', lastTrain: '00:02', weekendLastTrain: '02:32', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:11', lastTrain: '22:56', weekendLastTrain: '22:56', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:10', lastTrain: '22:40', weekendLastTrain: '22:40', intervalMinutes: S },
    },
  },
  {
    id: 'maltepe',
    name: 'Maltepe',
    latitude: 40.9354, longitude: 29.1318,
    district: 'Maltepe', side: 'asya', order: 25,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:02', lastTrain: '23:31', weekendLastTrain: '02:01', intervalMinutes: F },
      toGebze: { firstTrain: '06:04', lastTrain: '00:04', weekendLastTrain: '02:34', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:09', lastTrain: '22:54', weekendLastTrain: '22:54', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:12', lastTrain: '22:42', weekendLastTrain: '22:42', intervalMinutes: S },
    },
  },
  {
    id: 'cevizli',
    name: 'Cevizli',
    latitude: 40.9270, longitude: 29.1450,
    district: 'Maltepe', side: 'asya', order: 26,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:14', lastTrain: '23:28', weekendLastTrain: '01:58', intervalMinutes: F },
      toGebze: { firstTrain: '06:07', lastTrain: '00:07', weekendLastTrain: '02:37', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:06', lastTrain: '22:51', weekendLastTrain: '22:51', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:00', lastTrain: '22:45', weekendLastTrain: '22:45', intervalMinutes: S },
    },
  },
  {
    id: 'atalar',
    name: 'Atalar',
    latitude: 40.9180, longitude: 29.1570,
    district: 'Kartal', side: 'asya', order: 27,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:12', lastTrain: '23:26', weekendLastTrain: '01:56', intervalMinutes: F },
      toGebze: { firstTrain: '06:09', lastTrain: '00:09', weekendLastTrain: '02:39', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:04', lastTrain: '22:49', weekendLastTrain: '22:49', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:02', lastTrain: '22:47', weekendLastTrain: '22:47', intervalMinutes: S },
    },
  },
  {
    id: 'basak',
    name: 'Başak',
    latitude: 40.9100, longitude: 29.1680,
    district: 'Kartal', side: 'asya', order: 28,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:10', lastTrain: '23:24', weekendLastTrain: '01:54', intervalMinutes: F },
      toGebze: { firstTrain: '06:11', lastTrain: '00:11', weekendLastTrain: '02:41', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:02', lastTrain: '22:47', weekendLastTrain: '22:47', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:04', lastTrain: '22:49', weekendLastTrain: '22:49', intervalMinutes: S },
    },
  },
  {
    id: 'kartal',
    name: 'Kartal',
    latitude: 40.8953, longitude: 29.1882,
    district: 'Kartal', side: 'asya', order: 29,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:08', lastTrain: '23:22', weekendLastTrain: '01:52', intervalMinutes: F },
      toGebze: { firstTrain: '06:13', lastTrain: '00:13', weekendLastTrain: '02:43', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:00', lastTrain: '22:45', weekendLastTrain: '22:45', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:06', lastTrain: '22:51', weekendLastTrain: '22:51', intervalMinutes: S },
    },
  },
  {
    id: 'yunus',
    name: 'Yunus',
    latitude: 40.8900, longitude: 29.2020,
    district: 'Kartal', side: 'asya', order: 30,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:05', lastTrain: '23:19', weekendLastTrain: '01:49', intervalMinutes: F },
      toGebze: { firstTrain: '06:02', lastTrain: '00:16', weekendLastTrain: '02:46', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:12', lastTrain: '22:42', weekendLastTrain: '22:42', intervalMinutes: S },
      shortToGebze: { firstTrain: '06:09', lastTrain: '22:54', weekendLastTrain: '22:54', intervalMinutes: S },
    },
  },
  {
    id: 'pendik',
    name: 'Pendik',
    latitude: 40.8800, longitude: 29.2330,
    district: 'Pendik', side: 'asya', order: 31,
    transfers: ['Pendik YHT Garı'],
    schedule: {
      toHalkali: { firstTrain: '06:02', lastTrain: '23:16', weekendLastTrain: '01:46', intervalMinutes: F },
      toGebze: { firstTrain: '06:05', lastTrain: '00:19', weekendLastTrain: '02:49', intervalMinutes: F },
      shortToHalkali: { firstTrain: '06:09', lastTrain: '22:39', weekendLastTrain: '22:39', intervalMinutes: S },
      shortToGebze: null, // Short line terminus towards Pendik
    },
  },

  // ═══ GEBZE ZONE (full line only, 15 min) ═══
  {
    id: 'kaynarca',
    name: 'Kaynarca',
    latitude: 40.8730, longitude: 29.2500,
    district: 'Pendik', side: 'asya', order: 32,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:14', lastTrain: '23:13', weekendLastTrain: '01:43', intervalMinutes: F },
      toGebze: { firstTrain: '06:08', lastTrain: '00:22', weekendLastTrain: '02:52', intervalMinutes: F },
    },
  },
  {
    id: 'tersane',
    name: 'Tersane',
    latitude: 40.8650, longitude: 29.2650,
    district: 'Pendik', side: 'asya', order: 33,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:12', lastTrain: '23:11', weekendLastTrain: '01:41', intervalMinutes: F },
      toGebze: { firstTrain: '06:10', lastTrain: '00:24', weekendLastTrain: '02:54', intervalMinutes: F },
    },
  },
  {
    id: 'guzelyali',
    name: 'Güzelyalı',
    latitude: 40.8570, longitude: 29.2770,
    district: 'Pendik', side: 'asya', order: 34,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:10', lastTrain: '23:09', weekendLastTrain: '01:39', intervalMinutes: F },
      toGebze: { firstTrain: '06:12', lastTrain: '00:26', weekendLastTrain: '02:56', intervalMinutes: F },
    },
  },
  {
    id: 'aydintepe',
    name: 'Aydıntepe',
    latitude: 40.8500, longitude: 29.2900,
    district: 'Tuzla', side: 'asya', order: 35,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:08', lastTrain: '23:07', weekendLastTrain: '01:37', intervalMinutes: F },
      toGebze: { firstTrain: '06:14', lastTrain: '00:28', weekendLastTrain: '02:58', intervalMinutes: F },
    },
  },
  {
    id: 'icmeler',
    name: 'İçmeler',
    latitude: 40.8450, longitude: 29.3030,
    district: 'Tuzla', side: 'asya', order: 36,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:06', lastTrain: '23:05', weekendLastTrain: '01:35', intervalMinutes: F },
      toGebze: { firstTrain: '06:16', lastTrain: '00:30', weekendLastTrain: '03:00', intervalMinutes: F },
    },
  },
  {
    id: 'tuzla',
    name: 'Tuzla',
    latitude: 40.8410, longitude: 29.3010,
    district: 'Tuzla', side: 'asya', order: 37,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:03', lastTrain: '23:02', weekendLastTrain: '01:32', intervalMinutes: F },
      toGebze: { firstTrain: '06:19', lastTrain: '00:33', weekendLastTrain: '03:03', intervalMinutes: F },
    },
  },
  {
    id: 'cayirova',
    name: 'Çayırova',
    latitude: 40.8280, longitude: 29.3600,
    district: 'Çayırova', side: 'asya', order: 38,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:13', lastTrain: '22:58', weekendLastTrain: '01:28', intervalMinutes: F },
      toGebze: { firstTrain: '06:22', lastTrain: '00:36', weekendLastTrain: '03:06', intervalMinutes: F },
    },
  },
  {
    id: 'fatih',
    name: 'Fatih',
    latitude: 40.8180, longitude: 29.3800,
    district: 'Çayırova', side: 'asya', order: 39,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:11', lastTrain: '22:56', weekendLastTrain: '01:26', intervalMinutes: F },
      toGebze: { firstTrain: '06:25', lastTrain: '00:39', weekendLastTrain: '03:09', intervalMinutes: F },
    },
  },
  {
    id: 'osmangazi',
    name: 'Osmangazi',
    latitude: 40.8100, longitude: 29.4000,
    district: 'Gebze', side: 'asya', order: 40,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:09', lastTrain: '22:54', weekendLastTrain: '01:24', intervalMinutes: F },
      toGebze: { firstTrain: '06:27', lastTrain: '00:41', weekendLastTrain: '03:11', intervalMinutes: F },
    },
  },
  {
    id: 'darica',
    name: 'Darıca',
    latitude: 40.8060, longitude: 29.4150,
    district: 'Darıca', side: 'asya', order: 41,
    transfers: [],
    schedule: {
      toHalkali: { firstTrain: '06:07', lastTrain: '22:52', weekendLastTrain: '01:22', intervalMinutes: F },
      toGebze: { firstTrain: '06:29', lastTrain: '00:43', weekendLastTrain: '03:13', intervalMinutes: F },
    },
  },
  {
    id: 'gebze',
    name: 'Gebze',
    latitude: 40.8027, longitude: 29.4307,
    district: 'Gebze', side: 'asya', order: 42,
    transfers: ['TCDD Banliyö', 'TCDD YHT'],
    schedule: {
      toHalkali: { firstTrain: '06:05', lastTrain: '22:50', weekendLastTrain: '01:20', intervalMinutes: F },
      toGebze: null, // Terminus
    },
  },
];

// Quick lookup by ID
export const stationMap = new Map<string, Station>(
  stations.map((s) => [s.id, s])
);

// Polyline coordinates for the Marmaray line on the map
export const marmarayPolyline = stations.map((s) => ({
  latitude: s.latitude,
  longitude: s.longitude,
}));
