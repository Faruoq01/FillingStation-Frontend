import { io } from 'socket.io-client';
import config from '../constants';

export const socket = io(config.BASE_URL);