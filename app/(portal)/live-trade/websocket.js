import { useEffect, useState } from 'react';

const useWebSocket = () => {
    const [messages, setMessages] = useState([]);

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