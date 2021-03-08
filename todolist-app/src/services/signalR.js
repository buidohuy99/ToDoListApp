import { createContext, useContext, useRef, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { setLoadingPrompt, setIsConnecting } from '../redux/loading/loadingSlice';

export const signalR = require("@microsoft/signalr");

const SignalRContext = createContext();

export function useSignalR(){
    return useContext(SignalRContext);
}

export function SignalRProvider({children}){
    const connection = useRef(new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_API_URL + "/signalR")
    .build());
    const dispatch = useDispatch();

    const tryConnectToServer = async () => {
        if(connection.current.state === signalR.HubConnectionState.Disconnected){
            try{
                dispatch(setIsConnecting(true));
                dispatch(setLoadingPrompt("Establishing connection to server...."));
                await connection.current.start();
                dispatch(setIsConnecting(false));
                dispatch(setLoadingPrompt(null));
            } catch (e) {
                dispatch(setLoadingPrompt("No connection, please refresh..."));
            }
        }
    };

    useEffect(() => {
        connection.current.onreconnecting((err) => {
            dispatch(setIsConnecting(true));
            dispatch(setLoadingPrompt("Establishing connection to server...."));
        });

        connection.current.onreconnected((err) => {
            dispatch(setIsConnecting(false));
            dispatch(setLoadingPrompt(null));
        });

        tryConnectToServer();
    }, []);

    const value = {
        signalR: connection.current,
        tryConnectToServer
    };

    return (<SignalRContext.Provider value={value}>
        {children}
    </SignalRContext.Provider>);
}