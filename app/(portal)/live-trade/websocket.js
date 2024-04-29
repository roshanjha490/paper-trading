import { useEffect, useState } from 'react';

const useWebSocket = () => {
    const [messages, setMessages] = useState([{
        id: 1,
        trading_symbol: "BANKEX",
        exchange: "BSE",
        instrument_token: 274441,
        current_price: 0,
        opening_price: 0,
        exchange_timestamp: "2024-04-02T04:43:17.000Z"
    },
    {
        id: 2,
        trading_symbol: "BANKNIFTY1",
        exchange: "NSE",
        instrument_token: 1497857,
        current_price: 0,
        opening_price: 0,
        exchange_timestamp: "2024-04-02T04:43:17.000Z"
    },
    {
        id: 3,
        trading_symbol: "SENSEX",
        exchange: "BSE",
        instrument_token: 265,
        current_price: 0,
        opening_price: 0,
        exchange_timestamp: "2024-04-02T04:43:17.000Z"
    }
    ]);

    useEffect(() => {

        const fetchData = async () => {

            const socket = new WebSocket('ws://localhost:3001')

            socket.onopen = () => {

                const jsonData = messages.map(message => message.instrument_token);

                socket.send(JSON.stringify(jsonData));

                console.log('Websocket Connection is Established')
            }

            socket.onmessage = (event) => {

                const tick_messages = JSON.parse(event.data)

                setMessages(prevMessages => {
                    const updatedMessages = prevMessages.map((message) => {
                        const correspondingTickData = tick_messages.find(
                            (tick) => tick.instrument_token === message.instrument_token
                        );
                        if (correspondingTickData) {
                            return {
                                ...message,
                                current_price: correspondingTickData.last_price,
                                opening_price: correspondingTickData.ohlc.open
                            };
                        }
                        return message;
                    });
                    return updatedMessages;
                });

            };

            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };

        }

        fetchData()


    }, []);

    return messages;
};

export default useWebSocket;