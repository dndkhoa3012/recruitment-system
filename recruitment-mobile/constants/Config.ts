import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? '10.0.2.2' : '192.168.2.167'; // Use local IP for iOS device/simulator connectivity

export const API_URL = `http://${LOCALHOST}:3000/api`;
