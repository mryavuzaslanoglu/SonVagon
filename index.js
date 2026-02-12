// Import unistyles config BEFORE expo-router loads any route modules.
// This prevents the "no theme has been selected yet" crash in release builds.
import './src/config/unistyles';

import 'expo-router/entry';
