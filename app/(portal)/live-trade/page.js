"use client"
import React from 'react';
import SignOut from '../components/ProfileBtn';
import { useEffect } from 'react';
import useWebSocket from './websocket';
import { LuRefreshCcwDot } from "react-icons/lu";
import { get_positions } from '@/app/actions';

const Notes = () => {

  const messages = useWebSocket()


  return (
    <></>
  )
}

export default Notes